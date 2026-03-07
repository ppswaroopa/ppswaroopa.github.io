#!/usr/bin/env node
// =============================================================
// ci/generate.js
// Generates Dockerfile + docker-compose.yml for a given config.
// Used by CI to produce files that are then built + tested.
//
// Usage:
//   node ci/generate.js --distro humble --variant ros-base --out /tmp/test-humble-base
//   node ci/generate.js --distro jazzy  --variant desktop  --out /tmp/test-jazzy-desktop
//
// All flags:
//   --distro    humble | jazzy | iron
//   --variant   ros-base | desktop | desktop-full
//   --packages  comma-separated: nav2,slam_toolbox,turtlebot3,...
//   --tools     comma-separated: colcon,rosdep,python3,git,x11,...
//   --username  default: ros-dev
//   --uid       default: 1000
//   --workspace default: /home/<username>/ros2_ws
//   --out       output directory (created if missing)
// =============================================================

const fs   = require('fs');
const path = require('path');

// ── Parse args ────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, fallback = '') {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
}

const distro    = getArg('distro',    'humble');
const variant   = getArg('variant',   'ros-base');
const pkgArg    = getArg('packages',  '');
const toolArg   = getArg('tools',     'colcon,rosdep,python3,git,bashrc,locale,sudo');
const username  = getArg('username',  'ros-dev');
const uid       = getArg('uid',       '1000');
const outDir    = getArg('out',       './ci-output');
const cname     = getArg('container', 'ros2_dev');

const packages  = new Set(pkgArg ? pkgArg.split(',').map(s => s.trim()) : []);
const tools     = new Set(toolArg.split(',').map(s => s.trim()));
const userType  = getArg('usertype',  'custom');
const isRoot    = userType === 'root';

// Workspace default depends on user type — must be resolved AFTER isRoot is known.
// Bug fix: previously defaulted to /home/<username>/ros2_ws even for root builds.
const workspaceDefault = isRoot ? '/root/ros2_ws' : `/home/${username}/ros2_ws`;
const workspace = getArg('workspace', workspaceDefault);

// ── Validate inputs ───────────────────────────────────────────
const validDistros  = ['humble', 'jazzy', 'iron'];
const validVariants = ['ros-base', 'desktop', 'desktop-full'];

if (!validDistros.includes(distro)) {
  console.error(`ERROR: --distro must be one of: ${validDistros.join(', ')}`);
  process.exit(1);
}
if (!validVariants.includes(variant)) {
  console.error(`ERROR: --variant must be one of: ${validVariants.join(', ')}`);
  process.exit(1);
}

// ── Image tag logic ───────────────────────────────────────────
// ros-base and ros-core → official "ros" library image
// desktop and desktop-full → osrf/ros image
function getBaseImage(distro, variant) {
  if (variant === 'ros-base' || variant === 'ros-core') {
    return `ros:${distro}-${variant}`;
  }
  return `osrf/ros:${distro}-${variant}`;
}

// ── ROS2 package map ──────────────────────────────────────────
// Maps internal package keys → actual apt package names per distro.
// Jazzy differences are handled explicitly.
function getRosPackages(distro, packages) {
  const map = {
    nav2:        [`ros-${distro}-navigation2`, `ros-${distro}-nav2-bringup`],
    slam_toolbox:[`ros-${distro}-slam-toolbox`],
    cartographer:[`ros-${distro}-cartographer`, `ros-${distro}-cartographer-ros`],
    // Gazebo Classic not available on Jazzy — blocked at generator level too
    gazebo:      distro === 'jazzy'
                   ? [] // Gazebo Classic is EOL on Jazzy
                   : [`ros-${distro}-gazebo-ros-pkgs`, `ros-${distro}-gazebo-ros2-control`],
    gz_sim:      [`ros-${distro}-ros-gz`],
    rviz2:       [`ros-${distro}-rviz2`, `ros-${distro}-rviz-common`],
    turtlebot3:  distro === 'jazzy'
                   ? [`ros-${distro}-turtlebot3`, `ros-${distro}-turtlebot3-msgs`]
                   : [`ros-${distro}-turtlebot3`, `ros-${distro}-turtlebot3-msgs`,
                      `ros-${distro}-turtlebot3-simulations`],
    moveit2:     [`ros-${distro}-moveit`],
    ros2_control:[`ros-${distro}-ros2-control`, `ros-${distro}-ros2-controllers`],
    pcl:         [`ros-${distro}-perception-pcl`, `ros-${distro}-pcl-ros`],
    cv_bridge:   [`ros-${distro}-cv-bridge`, `ros-${distro}-image-transport`, `python3-opencv`],
    tf2:         [`ros-${distro}-tf2-tools`, `ros-${distro}-tf-transformations`],
    cyclone_dds: [`ros-${distro}-rmw-cyclonedds-cpp`],
    rosbridge:   [`ros-${distro}-rosbridge-suite`],
  };

  const result = [];
  packages.forEach(pkg => {
    if (map[pkg]) result.push(...map[pkg]);
  });
  return result.filter(Boolean);
}

// ── Dockerfile builder ────────────────────────────────────────
function buildDockerfile() {
  const hasCuda = packages.has('cuda') || packages.has('tensorrt');
  const baseImage = hasCuda
    ? `nvidia/cuda:12.3.1-devel-ubuntu22.04`
    : getBaseImage(distro, variant);

  const lines = [];

  lines.push(`# ============================================================`);
  lines.push(`# ROS2 ${distro} / ${variant}`);
  lines.push(`# Generated by ci/generate.js`);
  lines.push(`# ============================================================`);
  lines.push('');
  lines.push(`FROM ${baseImage}`);
  lines.push('');
  lines.push(`ENV DEBIAN_FRONTEND=noninteractive`);
  lines.push(`SHELL ["/bin/bash", "-c"]`);
  lines.push('');

  // Locale
  if (tools.has('locale')) {
    lines.push(`# ── Locale ────────────────────────────────────────────────`);
    lines.push(`RUN apt-get update && apt-get install -y locales && \\`);
    lines.push(`    locale-gen en_US en_US.UTF-8 && \\`);
    lines.push(`    update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8 && \\`);
    lines.push(`    rm -rf /var/lib/apt/lists/*`);
    lines.push(`ENV LANG=en_US.UTF-8`);
    lines.push('');
  }

  // System apt packages
  const aptPkgs = [
    'software-properties-common',
    'apt-transport-https',
    'ca-certificates',
  ];
  if (tools.has('python3'))   aptPkgs.push('python3', 'python3-pip', 'python3-venv', 'python3-setuptools');
  if (tools.has('git'))       aptPkgs.push('git');
  if (tools.has('cmake'))     aptPkgs.push('cmake', 'build-essential', 'gcc', 'g++');
  if (tools.has('nano'))      aptPkgs.push('nano', 'vim');
  if (tools.has('tmux'))      aptPkgs.push('tmux');
  if (tools.has('gdb'))       aptPkgs.push('gdb', 'gdbserver');
  if (tools.has('net_tools')) aptPkgs.push('net-tools', 'iproute2', 'iputils-ping', 'curl', 'wget');
  if (tools.has('vcstool'))   aptPkgs.push('python3-vcstool');
  if (tools.has('ssh'))       aptPkgs.push('openssh-server');
  if (tools.has('x11'))       aptPkgs.push('x11-apps', 'libx11-dev');
  if (!isRoot)                aptPkgs.push('sudo');

  lines.push(`# ── System packages ───────────────────────────────────────`);
  lines.push(`RUN apt-get update && apt-get install -y \\`);
  aptPkgs.forEach(p => lines.push(`    ${p} \\`));
  lines.push(`    && rm -rf /var/lib/apt/lists/*`);
  lines.push('');

  // ROS2 build tools
  const buildTools = [];
  if (tools.has('colcon'))  buildTools.push('python3-colcon-common-extensions', 'python3-colcon-mixin');
  if (tools.has('rosdep'))  buildTools.push('python3-rosdep');
  buildTools.push('python3-rosinstall-generator');

  if (buildTools.length > 0) {
    lines.push(`# ── ROS2 build tools ──────────────────────────────────────`);
    lines.push(`RUN apt-get update && apt-get install -y \\`);
    buildTools.forEach(p => lines.push(`    ${p} \\`));
    lines.push(`    && rm -rf /var/lib/apt/lists/*`);
    lines.push('');
  }

  // rosdep init — guard with || true because base images may have run it already
  if (tools.has('rosdep')) {
    lines.push(`# ── rosdep init ───────────────────────────────────────────`);
    lines.push(`# '|| true' guards against base images that already ran rosdep init`);
    lines.push(`RUN rosdep init || true && rosdep update --rosdistro ${distro}`);
    lines.push('');
  }

  // zsh
  if (tools.has('zsh')) {
    lines.push(`# ── Zsh + Oh-My-Zsh ───────────────────────────────────────`);
    lines.push(`RUN apt-get update && apt-get install -y zsh && \\`);
    lines.push(`    rm -rf /var/lib/apt/lists/*`);
    lines.push(`RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended`);
    lines.push('');
  }

  // ROS2 packages
  const rosPkgs = getRosPackages(distro, packages);
  if (rosPkgs.length > 0) {
    lines.push(`# ── ROS2 packages ─────────────────────────────────────────`);
    lines.push(`RUN apt-get update && apt-get install -y \\`);
    rosPkgs.forEach(p => lines.push(`    ${p} \\`));
    lines.push(`    && rm -rf /var/lib/apt/lists/*`);
    lines.push('');
  }

  // CycloneDDS
  if (packages.has('cyclone_dds')) {
    lines.push(`ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp`);
    lines.push('');
  }

  // TurtleBot3
  if (packages.has('turtlebot3')) {
    lines.push(`ENV TURTLEBOT3_MODEL=waffle_pi`);
    lines.push('');
  }

  // SSH
  if (tools.has('ssh')) {
    lines.push(`# ── SSH server ────────────────────────────────────────────`);
    lines.push(`RUN mkdir /var/run/sshd && \\`);
    lines.push(`    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config`);
    lines.push(`EXPOSE 22`);
    lines.push('');
  }

  // User
  if (!isRoot) {
    lines.push(`# ── Non-root user ─────────────────────────────────────────`);
    lines.push(`ARG UID=${uid}`);
    lines.push(`ARG GID=${uid}`);
    lines.push(`RUN groupadd -g \${GID} ${username} && \\`);
    lines.push(`    useradd -m -u \${UID} -g \${GID} -s /bin/bash ${username}`);
    if (tools.has('sudo')) {
      lines.push(`RUN echo "${username} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers`);
    }
    lines.push('');
    lines.push(`RUN mkdir -p ${workspace}/src && \\`);
    lines.push(`    chown -R ${username}:${username} ${workspace}`);
    lines.push('');
    lines.push(`USER ${username}`);
    lines.push(`WORKDIR ${workspace}`);
    lines.push('');
  } else {
    lines.push(`RUN mkdir -p ${workspace}/src`);
    lines.push(`WORKDIR ${workspace}`);
    lines.push('');
  }

  // Bashrc — write exactly once
  if (tools.has('bashrc')) {
    const homeDir = isRoot ? '/root' : `/home/${username}`;
    lines.push(`# ── Shell setup ───────────────────────────────────────────`);
    lines.push(`RUN echo "source /opt/ros/${distro}/setup.bash" >> ${homeDir}/.bashrc`);
    if (packages.has('cyclone_dds')) {
      lines.push(`RUN echo "export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp" >> ${homeDir}/.bashrc`);
    }
    if (packages.has('turtlebot3')) {
      lines.push(`RUN echo "export TURTLEBOT3_MODEL=waffle_pi" >> ${homeDir}/.bashrc`);
    }
    lines.push('');
  }

  // X11 — only if tool was explicitly selected
  if (tools.has('x11')) {
    lines.push(`# ── X11 display forwarding ────────────────────────────────`);
    lines.push(`ENV DISPLAY=\${DISPLAY:-:0}`);
    lines.push(`ENV QT_X11_NO_MITSHM=1`);
    lines.push('');
  }

  // NVIDIA
  if (hasCuda) {
    lines.push(`ENV NVIDIA_VISIBLE_DEVICES=all`);
    lines.push(`ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility,graphics`);
    lines.push('');
  }

  lines.push(`CMD ["/bin/bash"]`);
  return lines.join('\n');
}

// ── docker-compose builder ─────────────────────────────────────
function buildCompose() {
  const hasCuda  = packages.has('cuda') || packages.has('tensorrt');
  const hasX11   = tools.has('x11');
  const hasSSH   = tools.has('ssh');

  const lines = [];
  lines.push(`# docker-compose.yml — generated by ci/generate.js`);
  lines.push(`services:`);
  lines.push(`  ${cname}:`);
  lines.push(`    build:`);
  lines.push(`      context: .`);
  lines.push(`      dockerfile: Dockerfile`);
  if (!isRoot) {
    lines.push(`      args:`);
    lines.push(`        UID: \${UID:-1000}`);
    lines.push(`        GID: \${GID:-1000}`);
  }
  lines.push(`    image: ros2-${distro}-${cname}:latest`);
  lines.push(`    container_name: ${cname}`);
  lines.push(`    hostname: ${cname}`);
  lines.push(`    stdin_open: true`);
  lines.push(`    tty: true`);
  lines.push(`    restart: unless-stopped`);
  lines.push(`    network_mode: host`);
  lines.push(`    environment:`);
  lines.push(`      - ROS_DISTRO=${distro}`);
  if (hasX11) {
    lines.push(`      - DISPLAY=\${DISPLAY:-:0}`);
    lines.push(`      - QT_X11_NO_MITSHM=1`);
  }
  if (packages.has('cyclone_dds')) lines.push(`      - RMW_IMPLEMENTATION=rmw_cyclonedds_cpp`);
  if (packages.has('turtlebot3'))  lines.push(`      - TURTLEBOT3_MODEL=waffle_pi`);
  lines.push(`    volumes:`);
  lines.push(`      - ./ros2_ws:${workspace}:rw`);
  if (hasX11) {
    lines.push(`      - /tmp/.X11-unix:/tmp/.X11-unix:rw`);
  }
  if (hasCuda) {
    lines.push(`    deploy:`);
    lines.push(`      resources:`);
    lines.push(`        reservations:`);
    lines.push(`          devices:`);
    lines.push(`            - driver: nvidia`);
    lines.push(`              count: all`);
    lines.push(`              capabilities: [gpu, compute, utility]`);
  }
  if (hasSSH) {
    lines.push(`    ports:`);
    lines.push(`      - "2222:22"`);
  }
  return lines.join('\n');
}

// ── Write output files ────────────────────────────────────────
fs.mkdirSync(outDir, { recursive: true });

const dockerfilePath = path.join(outDir, 'Dockerfile');
const composePath    = path.join(outDir, 'docker-compose.yml');

fs.writeFileSync(dockerfilePath, buildDockerfile());
fs.writeFileSync(composePath,    buildCompose());

console.log(`✓ Dockerfile    → ${dockerfilePath}`);
console.log(`✓ compose       → ${composePath}`);
console.log(`  distro=${distro}  variant=${variant}  user=${isRoot ? 'root' : username}`);

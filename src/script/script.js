function on(a) {
  if (a == 1) {
    document.getElementById("sev-wea-det").style.display = "flex";
  }
  if (a == 2) {
    document.getElementById("autobot-det").style.display = "flex";
  }
  if (a == 3) {
    document.getElementById("astar-det").style.display = "flex";
  }
  if (a == 4) {
    document.getElementById("agrawal-lab-det").style.display = "flex";
  }
  if (a == 5) {
    document.getElementById("off-road-det").style.display = "flex";
  }
  if (a == 6) {
    document.getElementById("sysmon-det").style.display = "flex";
  }
  if (a == 7) {
    document.getElementById("snakegame-det").style.display = "flex";
  }
  document.querySelector('body').style.overflow = "hidden";
}

function off(b) {
  if (b == 1) {
    document.getElementById("sev-wea-det").style.display = "none";
  }
  if (b == 2) {
    document.getElementById("autobot-det").style.display = "none";
  }
  if (b == 3) {
    document.getElementById("astar-det").style.display = "none";
  }
  if (b == 4) {
    document.getElementById("agrawal-lab-det").style.display = "none";
  }
  if (b == 5) {
    document.getElementById("off-road-det").style.display = "none";
  }
  if (b == 6) {
    document.getElementById("sysmon-det").style.display = "none";
  }
  if (b == 7) {
    document.getElementById("snakegame-det").style.display = "none";
  }
  document.querySelector('body').style.overflow = "auto";
}

const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior
        const targetSectionId = link.getAttribute('href');
        const targetSection = document.querySelector(targetSectionId);
        
        if (targetSection) {
            // Calculate the scroll position of the target section
            const targetOffset = targetSection.offsetTop;
            
            // Scroll to the target section with smooth behavior
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        }
    });
});

const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.getElementsByClassName('navbar');
// const burger = document.querySelector('.menu-toggle i');

menuToggle.addEventListener('click', () => {
    if (navbar.style.display == 'none'){
      navbar.style.display == 'block';
    } else {
      navbar.style.display = 'none';
    }
});
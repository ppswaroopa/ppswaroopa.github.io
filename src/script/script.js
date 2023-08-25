function goup() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function on(a) {
  switch (a) {
    case 1:
      document.getElementById("sev-wea-det").style.display = "flex";
      break;
    case 2:
      document.getElementById("autobot-det").style.display = "flex";
      break;
    case 3:
      document.getElementById("astar-det").style.display = "flex";
      break;
    case 4:
      document.getElementById("agrawal-lab-det").style.display = "flex";
      break;
    case 5:
      document.getElementById("off-road-det").style.display = "flex";
      break;
    case 6:
      document.getElementById("sysmon-det").style.display = "flex";
      break;
    case 7:
      document.getElementById("snakegame-det").style.display = "flex";
      break;
    default:
      break;
  }
  document.querySelector('body').style.overflow = "hidden";
  if (screen.availWidth>481) {
    document.getElementById('navbar').style.display = "none";
  }
}

function off(b) {
  switch (b) {
    case 1:
      document.getElementById("sev-wea-det").style.display = "none";
      break;
    case 2:
      document.getElementById("autobot-det").style.display = "none";
      break;
    case 3:
      document.getElementById("astar-det").style.display = "none";
      break;
    case 4:
      document.getElementById("agrawal-lab-det").style.display = "none";
      break;
    case 5:
      document.getElementById("off-road-det").style.display = "none";
      break;
    case 6:
      document.getElementById("sysmon-det").style.display = "none";
      break;
    case 7:
      document.getElementById("snakegame-det").style.display = "none";
      break;
    default:
      break;
  }
  document.querySelector('body').style.overflow = "auto";
  if (screen.availWidth>481) {
    document.getElementById('navbar').style.display = "block";
  }
  // document.getElementById('navbar').style.display = "block";
}

const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior
        const targetSectionId = link.getAttribute('href');
        const targetSection = document.querySelector(targetSectionId);
        if (targetSection) {
            // navbar.classList.toggle("active");
            // Calculate the scroll position of the target section
            targetOffset = targetSection.offsetTop;
            // Scroll to the target section with smooth behavior
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });

        }
    });
});

document.addEventListener("DOMContentLoaded", function(event){
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById('navbar');
  const burger = document.querySelectorAll('.nav-links a');
  const go_up = document.getElementById('go_up_button');

  // console.log(burger);
  menuToggle.addEventListener("click", () => {
    // console.log("we good till here");
      navbar.classList.toggle("active");
  });

  burger.forEach(link => {
    link.addEventListener('click', event => {
        navbar.classList.toggle("active");
    })
  })

  window.addEventListener("scroll" , () => {
    if (window.scrollY > (screen.availHeight)) {
      go_up.style.display = 'block';
    }else {
      go_up.style.display = 'none';
    }
  })
});

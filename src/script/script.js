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
  if (screen.availWidth > 481) {
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
  if (screen.availWidth > 481) {
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

document.addEventListener("DOMContentLoaded", function (event) {
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

  // Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.timeline-content, .project, .info');
  revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    observer.observe(el);
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      go_up.style.display = 'flex';
      go_up.style.opacity = '1';
    } else {
      go_up.style.display = 'none';
      go_up.style.opacity = '0';
    }
  });
});



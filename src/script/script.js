function goup() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(project => `
        <div class="project" data-id="${project.id}">
            <img src="${project.cardImage || project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
        </div>
    `).join('');

  // Add click listeners
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.getAttribute('data-id'));
    });
  });
}

function openModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  document.getElementById('modal-title').innerText = project.title;
  document.getElementById('modal-image').src = project.image;

  const highlightsList = document.getElementById('modal-highlights');
  highlightsList.innerHTML = project.highlights.map(h => `<li>${h}</li>`).join('');

  const linksContainer = document.getElementById('modal-links');
  if (project.links && project.links.length > 0) {
    linksContainer.innerHTML = project.links.map(link => `
            <a href="${link.url}" target="_blank" class="logo">
                <i class="fa-brands fa-${link.type} fa-3x" style="color: #ffffff; padding-right: 20px;"></i>
            </a>
        `).join('');
    linksContainer.style.display = 'block';
  } else {
    linksContainer.style.display = 'none';
  }

  document.getElementById('modal-tools').innerHTML = `<b>Tools</b>: ${project.tools}`;

  const descEl = document.getElementById('modal-description');
  if (project.description) {
    descEl.innerText = project.description;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (window.innerWidth > 481) {
    document.getElementById('navbar').style.display = 'none';
  }
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.body.style.overflow = 'auto';
  if (window.innerWidth > 481) {
    document.getElementById('navbar').style.display = 'block';
  }
}

// Support closing by clicking outside or close button already handled by onclick in HTML
window.onclick = function (event) {
  const modal = document.getElementById('project-modal');
  if (event.target == modal) {
    closeModal();
  }
}


document.addEventListener("DOMContentLoaded", function (event) {
  renderProjects();

  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetSectionId = link.getAttribute('href');
      const targetSection = document.querySelector(targetSectionId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById('navbar');
  const go_up = document.getElementById('go_up_button');

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

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

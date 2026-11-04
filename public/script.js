window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop < windowHeight - 100) {
      section.classList.add('animate__animated', 'animate__fadeIn');
    }
  });
});

document.querySelectorAll('.main-menu a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = this.getAttribute('href');

    if (target.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

document.querySelectorAll('.skill-card').forEach((card) => {
  const bar = card.querySelector('.bar');
  const percent = card.querySelector('.percent').textContent;
  bar.style.width = '0%';
  card.addEventListener('mouseenter', () => {
    bar.style.width = percent;
  });
  card.addEventListener('mouseleave', () => {
    bar.style.width = '0%';
  });
});

document.querySelectorAll('.project-card').forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
  const logo = card.querySelector('.project-logo img');
  const links = card.querySelectorAll('.project-link');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  card.addEventListener('mouseenter', () => {
    logo.classList.add('animate__animated', 'animate__pulse');
    links.forEach(link => {
      link.classList.add('animate__animated', 'animate__headShake');
    });
  });

  card.addEventListener('mouseleave', () => {
    logo.classList.remove('animate__animated', 'animate__pulse');
    links.forEach(link => {
      link.classList.remove('animate__animated', 'animate__headShake');
    });
  });
});

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const inputs = contactForm.querySelectorAll('input, textarea');
  const button = contactForm.querySelector('button');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    button.querySelector('.btn-text').textContent = 'Envoi...';
    button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        button.querySelector('.btn-text').textContent = 'Envoyé !';
        button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('animate__animated', 'animate__tada');

        setTimeout(() => {
          button.querySelector('.btn-text').textContent = 'Envoyer';
          button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-paper-plane"></i>';
          button.classList.remove('animate__animated', 'animate__tada');
          contactForm.reset();
        }, 2000);

      } else {
        throw new Error('Erreur lors de l\'envoi.');
      }

    } catch (error) {
      button.querySelector('.btn-text').textContent = 'Erreur';
      button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

      setTimeout(() => {
        button.querySelector('.btn-text').textContent = 'Envoyer';
        button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-paper-plane"></i>';
      }, 2000);
    }
  });
}

document.querySelectorAll('.contact-info i').forEach((icon, index) => {
  icon.style.animationDelay = `${index * 0.1}s`;
  icon.addEventListener('mouseenter', () => {
    icon.classList.add('animate__animated', 'animate__rubberBand');
    setTimeout(() => {
      icon.classList.remove('animate__animated', 'animate__rubberBand');
    }, 1000);
  });
});

document.querySelectorAll('.project-tags .tag').forEach(tag => {
  tag.style.cursor = 'pointer';
  tag.style.animationDelay = `${Math.random() * 0.5}s`;
  tag.addEventListener('mouseenter', () => {
    tag.classList.add('animate__animated', 'animate__flip');
    setTimeout(() => {
      tag.classList.remove('animate__animated', 'animate__flip');
    }, 1000);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  particlesJS('particles-js', {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 800 } },
      color: { value: ['#6C63FF', '#FF6584', '#4CAF50'] },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
      size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
      line_linked: { enable: true, distance: 120, color: '#ffffff', opacity: 0.4, width: 1 },
      move: { enable: true, speed: 1.5, direction: 'none', random: false, straight: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' }
      }
    }
  });
});

const scrollDown = document.querySelector('.scroll-down');
if (scrollDown) {
  scrollDown.addEventListener('click', () => {
    scrollDown.classList.add('animate__animated', 'animate__bounceOut');
    setTimeout(() => {
      scrollDown.classList.remove('animate__animated', 'animate__bounceOut');
      const competences = document.querySelector('#competences');
      if (competences) competences.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const burgerIcon = document.querySelector('.burger-icon');
  const mainMenu = document.querySelector('.main-menu');
  const nav = document.querySelector('nav');

  if (burgerIcon && mainMenu) {
    burgerIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      burgerIcon.classList.toggle('active');
      mainMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target)) {
        burgerIcon.classList.remove('active');
        mainMenu.classList.remove('active');
      }
    });

    mainMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            burgerIcon.classList.remove('active');
            mainMenu.classList.remove('active');
          } else {
          }
        } else {
          setTimeout(() => {
            burgerIcon.classList.remove('active');
            mainMenu.classList.remove('active');
          }, 50);
        }
      });
    });
  }
});

function adjustProjectCardHeights() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const content = card.querySelector('.project-content');
    const tags = card.querySelector('.project-tags');
    content.style.minHeight = 'auto';
    tags.style.marginTop = '12px';
    card.classList.add('adjust-height');
  });
}

window.addEventListener('load', adjustProjectCardHeights);
window.addEventListener('resize', adjustProjectCardHeights);

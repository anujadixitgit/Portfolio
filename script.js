/*
   ==========================================================================
   PORTFOLIO INTERACTION LOGIC
   Client: Anuja Dixit
   Script Functionality: Dark Mode, Sticky Header, Scroll Spy, Reveal Anims, Form Submission
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item');
  const revealElements = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // --- Theme Toggling Logic ---
  // Check localStorage or OS preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
  } else if (savedTheme === 'dark') {
    htmlElement.removeAttribute('data-theme'); // default is dark
  } else if (!systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // --- Sticky Header Logic ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Hamburger Menu Toggle ---
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // --- Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };

  const navObserver = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => navObserver.observe(section));

  // --- Scroll Reveal Animation Observer ---
  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Start animating when 15% of the element is visible
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger animation only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  revealElements.forEach(element => revealObserver.observe(element));

  // --- Form Submission Handling ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Visual transition to sending status
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="width: 20px; height: 20px; animation: spin 1s linear infinite; fill: currentColor;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" style="opacity: 0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending...`;
      
      // Gather Form Data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        // We will use Formspree or a mockup server call.
        // For local demo, we simulate a network request.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success state
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${data.name || 'there'}! Your message has been sent successfully. I will get back to you shortly.`;
        contactForm.reset();
        
      } catch (error) {
        // Show error state
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Oops! There was a problem submitting your form. Please try again or email me directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Auto scroll to feedback message
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});

// Inline styling rule for form submit button spinner
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin {
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
`;
document.head.appendChild(style);

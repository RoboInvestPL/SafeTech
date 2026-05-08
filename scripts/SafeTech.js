document.addEventListener('DOMContentLoaded', function () {

  /* =========================
     LOGIKA: ANIMACJE WEJŚCIA SEKCJI
  ========================= */

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  /* =========================
     LOGIKA: PŁYWAJĄCY / RUCHOMY NAVBAR
  ========================= */

  const navbar = document.getElementById('siteNavbar');

  function updateNavbarState() {
    if (!navbar) return;

    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

   /* =========================
     LOGIKA: SLIDER "CO NAS WYRÓŻNIA?"
  ========================= */

  const aboutSlides = Array.from(document.querySelectorAll('.about-premium-slide'));
  const aboutDotsContainer = document.getElementById('aboutDots');
  const aboutPrevButton = document.getElementById('aboutPrev');
  const aboutNextButton = document.getElementById('aboutNext');
  const aboutSlider = document.getElementById('aboutPremiumSlider');
  const aboutProgressBar = document.getElementById('aboutProgressBar');

  if (aboutSlides.length && aboutDotsContainer) {
    let currentAboutIndex = 0;
    let aboutIntervalId = null;

    const aboutDots = aboutSlides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'about-premium-dot';
      dot.setAttribute('aria-label', `Przejdź do wyróżnika ${index + 1}`);
      dot.dataset.index = String(index);

      if (index === 0) {
        dot.classList.add('is-active');
      }

      aboutDotsContainer.appendChild(dot);
      return dot;
    });

    function updateAboutProgress(index) {
      if (!aboutProgressBar) return;
      const progress = ((index + 1) / aboutSlides.length) * 100;
      aboutProgressBar.style.width = `${progress}%`;
    }

    function updateAboutSlider(nextIndex) {
      const safeIndex = ((nextIndex % aboutSlides.length) + aboutSlides.length) % aboutSlides.length;

      aboutSlides[currentAboutIndex].classList.remove('is-active');
      aboutDots[currentAboutIndex].classList.remove('is-active');

      currentAboutIndex = safeIndex;

      aboutSlides[currentAboutIndex].classList.add('is-active');
      aboutDots[currentAboutIndex].classList.add('is-active');
      updateAboutProgress(currentAboutIndex);
    }

    function startAboutAutoPlay() {
      if (aboutIntervalId || aboutSlides.length < 2) return;
      aboutIntervalId = window.setInterval(() => {
        updateAboutSlider(currentAboutIndex + 1);
      }, 4000);
    }

    function stopAboutAutoPlay() {
      if (!aboutIntervalId) return;
      window.clearInterval(aboutIntervalId);
      aboutIntervalId = null;
    }

    if (aboutPrevButton) {
      aboutPrevButton.addEventListener('click', function () {
        stopAboutAutoPlay();
        updateAboutSlider(currentAboutIndex - 1);
        startAboutAutoPlay();
      });
    }

    if (aboutNextButton) {
      aboutNextButton.addEventListener('click', function () {
        stopAboutAutoPlay();
        updateAboutSlider(currentAboutIndex + 1);
        startAboutAutoPlay();
      });
    }

    aboutDots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const targetIndex = parseInt(dot.dataset.index || '0', 10);
        stopAboutAutoPlay();
        updateAboutSlider(targetIndex);
        startAboutAutoPlay();
      });
    });

    if (aboutSlider) {
      aboutSlider.addEventListener('mouseenter', stopAboutAutoPlay);
      aboutSlider.addEventListener('mouseleave', startAboutAutoPlay);
    }

    updateAboutProgress(0);
    startAboutAutoPlay();
  }

  /* =========================
     LOGIKA: ROK W STOPCE
  ========================= */

  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = startYear === currentYear ? String(currentYear) : `${startYear}–${currentYear}`;
  const yearElement = document.getElementById('copyright-year');

  if (yearElement) {
    yearElement.textContent = yearText;
  }

  /* =========================
     LOGIKA: HAMBURGER
  ========================= */

  const toggle = document.getElementById('menuToggle');
  const panel = document.getElementById('navLinks');

  if (toggle && panel) {
    const closeMenu = () => {
      toggle.classList.remove('active');
      panel.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      toggle.classList.add('active');
      panel.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    };

    const toggleMenu = (event) => {
      event?.stopPropagation?.();

      if (panel.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      toggleMenu(event);
    });

    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu(event);
      }
    });

    document.addEventListener('click', (event) => {
      if (!panel.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

/* =========================
   LOGIKA: FORMULARZ KONTAKTOWY
   Wysyłka przez Formspark
========================= */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Wklej tutaj endpoint wygenerowany w Formspark
const CONTACT_FORM_ENDPOINT = 'https://submit-form.com/TWOJ_FORM_ID';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFormStatus(message, type = '') {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = 'form-status';

  if (type) {
    formStatus.classList.add(type);
  }
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    setFormStatus('');

    const submitButton = contactForm.querySelector('button[type="submit"]');

    const nameField = document.getElementById('name');
    const companyField = document.getElementById('company');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');
    const websiteField = document.getElementById('website');

    const name = nameField ? nameField.value.trim() : '';
    const company = companyField ? companyField.value.trim() : '';
    const email = emailField ? emailField.value.trim() : '';
    const phone = phoneField ? phoneField.value.trim() : '';
    const message = messageField ? messageField.value.trim() : '';
    const website = websiteField ? websiteField.value.trim() : '';

    // Honeypot antyspamowy
    if (website) {
      return;
    }

    if (!name || !company || !email || !message) {
      setFormStatus('Uzupełnij wszystkie wymagane pola formularza.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      setFormStatus('Podaj poprawny adres e-mail.', 'error');
      return;
    }

    const payload = {
      name: name,
      company: company,
      email: email,
      phone: phone || 'nie podano',
      message: message,

      _email: {
        subject: `Zapytanie ze strony SafeTech – ${company}`,
        replyTo: email
      }
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'Wysyłanie...';
      }

      setFormStatus('Wysyłam wiadomość...');

      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Błąd wysyłki formularza.');
      }

      contactForm.reset();

      setFormStatus(
        'Dziękujemy. Wiadomość została wysłana. Skontaktujemy się tak szybko, jak to możliwe.',
        'success'
      );
    } catch (error) {
      console.error(error);

      setFormStatus(
        'Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na: biuro@audytyce.pl',
        'error'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Wyślij wiadomość';
      }
    }
  });
}

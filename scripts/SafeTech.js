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
   Walidacja HTML5 + wysyłka natywna do Formspark w ukrytym iframe.
========================= */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formsparkFrame = document.getElementById('formsparkFrame');

let isContactFormSubmitting = false;
let contactFormSubmitTimeout = null;

function setFormStatus(message, type = '') {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = 'form-status';

  if (type) {
    formStatus.classList.add(type);
  }
}

function setSubmitButtonState(isLoading) {
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (!submitButton) return;

  if (isLoading) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.textContent;
    submitButton.textContent = 'Wysyłanie...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.originalText || 'Wyślij wiadomość';
  }
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (isContactFormSubmitting) {
      setFormStatus('Wiadomość jest już wysyłana. Proszę chwilę poczekać.', 'success');
      return;
    }

    if (!contactForm.checkValidity()) {
      setFormStatus('Uzupełnij poprawnie wszystkie wymagane pola formularza.', 'error');
      contactForm.reportValidity();
      return;
    }

    isContactFormSubmitting = true;
    setSubmitButtonState(true);
    setFormStatus('Wysyłam wiadomość...', 'success');

    if (contactFormSubmitTimeout) {
      clearTimeout(contactFormSubmitTimeout);
    }

    contactFormSubmitTimeout = window.setTimeout(function () {
      isContactFormSubmitting = false;
      setSubmitButtonState(false);

      setFormStatus(
        'Wiadomość prawdopodobnie została wysłana. Jeżeli nie otrzymasz odpowiedzi, skontaktuj się bezpośrednio: biuro@safetech.pl',
        'success'
      );
    }, 8000);

    // Krótkie opóźnienie pozwala przeglądarce pokazać komunikat "Wysyłam..."
    // i dopiero potem wysłać formularz do ukrytego iframe.
    window.setTimeout(function () {
      HTMLFormElement.prototype.submit.call(contactForm);
    }, 100);
  });

  contactForm.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      if (!isContactFormSubmitting && formStatus.classList.contains('error')) {
        setFormStatus('');
      }
    });
  });
}

if (formsparkFrame && contactForm && formStatus) {
  formsparkFrame.addEventListener('load', function () {
    if (!isContactFormSubmitting) return;

    if (contactFormSubmitTimeout) {
      clearTimeout(contactFormSubmitTimeout);
      contactFormSubmitTimeout = null;
    }

    contactForm.reset();

    isContactFormSubmitting = false;
    setSubmitButtonState(false);

    setFormStatus(
      'Dziękujemy. Wiadomość została wysłana. Skontaktujemy się tak szybko, jak to możliwe.',
      'success'
    );
  });
}

});

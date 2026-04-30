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
     Ten blok zostawiamy wydzielony pod dalszy rozwój.
  ========================= */

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      formStatus.textContent = '';
      formStatus.className = 'form-status';

      const name = document.getElementById('name')?.value.trim() || '';
      const company = document.getElementById('company')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const topic = document.getElementById('topic')?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';

      if (!name || !company || !email || !topic || !message) {
        formStatus.textContent = 'Uzupełnij wszystkie wymagane pola formularza.';
        return;
      }

      if (!validateEmail(email)) {
        formStatus.textContent = 'Podaj poprawny adres e-mail.';
        return;
      }

      const subject = `Zapytanie ze strony SafeTech – ${topic}`;
      const body = [
        'Dzień dobry,',
        '',
        'przesyłam zapytanie ze strony internetowej SafeTech.',
        '',
        `Imię i nazwisko: ${name}`,
        `Firma: ${company}`,
        `E-mail: ${email}`,
        `Telefon: ${phone || 'nie podano'}`,
        `Temat: ${topic}`,
        '',
        'Treść wiadomości:',
        message,
        '',
        '---',
        'Wiadomość przygotowana przez formularz kontaktowy strony SafeTech.'
      ].join('\n');

      const mailto = `mailto:biuro@audytce.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      formStatus.textContent = 'Gotowe. Otwieram domyślny program pocztowy z przygotowaną wiadomością.';
      formStatus.classList.add('success');
    });
  }

});

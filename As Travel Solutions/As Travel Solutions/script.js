const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const tabs = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.booking-form');
const slides = document.querySelectorAll('.slide');
const fleetCarousels = document.querySelectorAll('[data-fleet-carousel]');
const bookingShortcuts = document.querySelectorAll('[data-booking-target]');
const whatsappFormButtons = document.querySelectorAll('[data-whatsapp-form]');
const citySelectionButtons = document.querySelectorAll('[data-city-select]');
const bookingCityFields = document.querySelectorAll('[data-city-field="booking"]');
const corporateFormButtons = document.querySelectorAll('[data-corporate-form]');
const contactRedirectButtons = document.querySelectorAll('[data-contact-redirect]');
const mobileBottomNavLinks = document.querySelectorAll('[data-mobile-nav]');
const yearEl = document.getElementById('year');
const whatsappNumber = '919764642991';
const corporateEmail = 'astravelsolutions@example.com';
const revealSelectors = [
  '.hero-content',
  '.hero-panel',
  '.booking-card',
  '.section-heading',
  '.service-card',
  '.offer-card',
  '.fleet-card',
  '.destination-card',
  '.specialization-list span',
  '.testimonial-card',
  '.stats-grid > div',
  '.coverage-list span',
  '.city-list span',
  '.intro-card',
  '.highlight-card',
  '.step-card',
  '.route-card',
  '.info-card',
  '.form-card',
  '.map-card',
  '.city-option',
];

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (mobileBottomNavLinks.length) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const mobileNavMap = {
    '': 'home',
    'index.html': 'home',
    'about.html': 'home',
    'services.html': 'services',
    'destinations.html': 'explore',
    'contact.html': 'contact',
  };
  const activeNav = mobileNavMap[currentPage];

  mobileBottomNavLinks.forEach((link) => {
    const isActive = activeNav && link.dataset.mobileNav === activeNav;
    link.classList.toggle('is-active', Boolean(isActive));
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

const setActiveBookingTab = (target) => {
  if (!target) return;

  tabs.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.tab === target);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
  });
};

const buildWhatsAppUrl = (message) => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const buildMailtoUrl = (email, subject, body) => {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const getFieldLabel = (field) => {
  const inlineLabel = field.closest('.form-row')?.querySelector('label')?.textContent?.trim();
  if (inlineLabel) return inlineLabel;

  if (!field.id) return '';
  return field.form?.querySelector(`label[for="${field.id}"]`)?.textContent?.trim() || '';
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    setActiveBookingTab(tab.dataset.tab);
  });
});

bookingShortcuts.forEach((shortcut) => {
  shortcut.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveBookingTab(shortcut.dataset.bookingTarget);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

whatsappFormButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    if (!form) {
      window.open(buildWhatsAppUrl('Hello, I want to book a cab with A S Travel Solution.'), '_blank', 'noopener');
      return;
    }

    const bookingType = {
      oneway: 'one-way cab',
      outstation: 'outstation cab',
      rental: 'rental cab',
    }[button.dataset.whatsappForm] || 'cab';

    const details = Array.from(form.querySelectorAll('input, select, textarea'))
      .map((field) => {
        const label = getFieldLabel(field);
        const value =
          field.value.trim() ||
          ('placeholder' in field ? field.placeholder.trim() : '') ||
          (field.tagName === 'SELECT' ? field.options[field.selectedIndex]?.text.trim() : '');

        return label && value ? `${label}: ${value}` : '';
      })
      .filter(Boolean);

    const message = [`Hello, I want to book a ${bookingType} with A S Travel Solution.`]
      .concat(details.length ? ['', 'Trip details:', ...details] : [])
      .join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener');
  });
});

citySelectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const city = button.dataset.citySelect?.trim();
    if (!city) return;

    bookingCityFields.forEach((field) => {
      field.value = city;
    });

    button.closest('.city-grid')?.querySelectorAll('.city-option').forEach((option) => {
      option.classList.toggle('is-active', option === button);
    });

    const activeForm = document.querySelector('.booking-form.is-active');
    const nextField = activeForm?.querySelector('input:not([data-city-field]), textarea, select');
    if (nextField instanceof HTMLElement) {
      requestAnimationFrame(() => nextField.focus());
    }
  });
});

corporateFormButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    if (!form || !form.reportValidity()) return;

    const details = Array.from(form.querySelectorAll('input, select, textarea'))
      .map((field) => {
        const label = getFieldLabel(field);
        const value =
          field.value.trim() ||
          (field.tagName === 'SELECT' ? field.options[field.selectedIndex]?.text.trim() : '');

        return label && value ? `${label}: ${value}` : '';
      })
      .filter(Boolean);

    const companyName = form.querySelector('#company-name')?.value.trim();
    const contactPerson = form.querySelector('#contact-person')?.value.trim();
    const subject = companyName
      ? `Corporate enquiry from ${companyName}`
      : `Corporate enquiry from ${contactPerson || 'A S Travel Solution website visitor'}`;

    const body = ['Hello A S Travel Solution,', '', 'I would like to discuss a corporate travel requirement.', '']
      .concat(details.length ? ['Details:', ...details] : [])
      .join('\n');

    window.location.href = buildMailtoUrl(corporateEmail, subject, body);
  });
});

contactRedirectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetUrl = button.getAttribute('href');
    if (!targetUrl) return;
    window.location.href = targetUrl;
  });
});

let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('is-active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('is-active');
  }, 5000);
}

fleetCarousels.forEach((carousel) => {
  const carouselSlides = Array.from(carousel.querySelectorAll('.fleet-carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.fleet-carousel-dot'));
  const prevBtn = carousel.querySelector('.fleet-carousel-prev');
  const nextBtn = carousel.querySelector('.fleet-carousel-next');

  if (!carouselSlides.length) return;

  let activeIndex = carouselSlides.findIndex((slide) => slide.classList.contains('is-active'));
  let autoSlideTimer = null;
  if (activeIndex < 0) activeIndex = 0;

  const setActiveSlide = (nextIndex) => {
    activeIndex = (nextIndex + carouselSlides.length) % carouselSlides.length;

    carouselSlides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer) {
      window.clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  };

  const startAutoSlide = () => {
    if (carouselSlides.length <= 1 || autoSlideTimer) return;
    autoSlideTimer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 3500);
  };

  const restartAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  prevBtn?.addEventListener('click', () => {
    setActiveSlide(activeIndex - 1);
    restartAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    setActiveSlide(activeIndex + 1);
    restartAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveSlide(index);
      restartAutoSlide();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);
  carousel.addEventListener('focusin', stopAutoSlide);
  carousel.addEventListener('focusout', () => {
    const focusedInsideCarousel = carousel.contains(document.activeElement);
    if (!focusedInsideCarousel) startAutoSlide();
  });

  startAutoSlide();
});

const revealElements = document.querySelectorAll(revealSelectors.join(','));
if (revealElements.length) {
  revealElements.forEach((element, index) => {
    element.classList.add('reveal');
    const delay = Math.min(index * 70, 280);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observerInstance.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    requestAnimationFrame(() => {
      revealElements.forEach((element) => observer.observe(element));
    });
  } else {
    requestAnimationFrame(() => {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    });
  }
}

const counters = document.querySelectorAll('[data-counter]');
const formatCounterValue = (counter, value) => {
  const suffix = counter.dataset.counterSuffix || '';
  return `${value.toLocaleString('en-US')}${suffix}`;
};

const animateCounters = () => {
  counters.forEach((counter) => {
    if (counter.dataset.animated) return;
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      counter.dataset.animated = 'true';
      const target = Number(counter.dataset.counter) || 0;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 80));
      const tick = () => {
        current = Math.min(target, current + step);
        counter.textContent = formatCounterValue(counter, current);
        if (current < target) {
          requestAnimationFrame(tick);
        }
      };
      tick();
    }
  });
};

window.addEventListener('scroll', animateCounters);
animateCounters();

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


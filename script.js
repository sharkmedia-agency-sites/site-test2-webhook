document.addEventListener('DOMContentLoaded', () => {
  fetch('content.json')
    .then(res => res.json())
    .then(data => {
      const sections = data.sections.sort((a, b) => a.order - b.order);
      sections.forEach(section => renderSection(section, data));

      if (window.lucide) lucide.createIcons();

      initNavbar();
      initMobileMenu();
      initSmoothScroll();
      initScrollTop();
      initTestimonialSlider();
      initContactForm();

      // Remove loader then start animations
      setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 500);
        }
        // Start animations after a brief delay so DOM is ready
        setTimeout(initAnimations, 100);
      }, 300);
    });
});

/* ===== Simple Scroll Animations (IntersectionObserver) ===== */
function initAnimations() {
  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.anim').forEach(el => el.classList.add('visible'));
    return;
  }

  // Hero entrance — just fade in immediately
  const heroEls = document.querySelectorAll('.hero-anim');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 200);
  });

  // Scroll-triggered elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // If it's a stagger parent, animate children one by one
        if (el.classList.contains('stagger')) {
          const children = el.querySelectorAll('.stagger-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
        }

        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.anim').forEach(el => observer.observe(el));

  // Counter animations
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const duration = 1500;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, stepTime);
}

/* ===== Render Sections ===== */
function renderSection(section, data) {
  const { type, id, fields } = section;

  switch (type) {
    case 'navigation': renderNavigation(fields); break;
    case 'hero': renderHero(id, fields); break;
    case 'about': renderAbout(id, fields); break;
    case 'services_list': renderServicesList(id, fields); break;
    case 'features': renderFeatures(id, fields); break;
    case 'cta_banner': renderCTA(id, fields); break;
    case 'testimonials': renderTestimonials(id, fields); break;
    case 'process': renderProcess(id, fields); break;
    case 'contact': renderContact(id, fields); break;
    case 'footer': renderFooter(id, fields); break;
  }
}

/* ===== Navigation ===== */
function renderNavigation(fields) {
  const logo = document.getElementById('nav-logo');
  if (logo) logo.textContent = fields.logo_text;

  const linksContainer = document.getElementById('nav-links');
  const mobileContainer = document.getElementById('mobile-links');

  if (fields.links && linksContainer) {
    fields.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      a.className = 'nav-link';
      linksContainer.appendChild(a);

      const mobileA = document.createElement('a');
      mobileA.href = link.url;
      mobileA.textContent = link.label;
      mobileA.className = 'mobile-link';
      mobileContainer.appendChild(mobileA);
    });
  }

  const cta = document.getElementById('nav-cta');
  if (cta && fields.cta_text) {
    cta.textContent = fields.cta_text;
    cta.href = fields.cta_url;
  }
}

/* ===== Hero ===== */
function renderHero(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  const bg = document.getElementById('hero-bg');
  if (bg && fields.background_image) {
    bg.style.backgroundImage = `url(${fields.background_image})`;
  }

  const badge = document.getElementById('hero-badge');
  if (badge && fields.badge_text) {
    badge.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${fields.badge_text}`;
  }

  setField(section, 'headline', fields.headline);
  setField(section, 'subheadline', fields.subheadline);

  const ctaEl = section.querySelector('[data-field="cta_text"]');
  if (ctaEl && fields.cta_text) {
    ctaEl.innerHTML = `${fields.cta_text}<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
    ctaEl.href = fields.cta_url;
  }

  const ctaSecondary = section.querySelector('[data-field="cta_secondary_text"]');
  if (ctaSecondary && fields.cta_secondary_text) {
    ctaSecondary.innerHTML = `${fields.cta_secondary_text}<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
    ctaSecondary.href = fields.cta_secondary_url;
  }
}

/* ===== About ===== */
function renderAbout(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);
  setField(section, 'text', fields.text);
  setField(section, 'text_2', fields.text_2);

  const img = section.querySelector('[data-field="image"]');
  if (img && fields.image) {
    img.src = fields.image;
    img.alt = fields.headline || 'O nas';
  }

  const statsContainer = document.getElementById('about-stats');
  if (statsContainer && fields.stats) {
    fields.stats.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = `
        <div class="stat-value" data-count="${stat.value}" data-suffix="${stat.suffix || ''}">${stat.value}${stat.suffix || ''}</div>
        <div class="stat-label">${stat.label}</div>
      `;
      statsContainer.appendChild(card);
    });
  }
}

/* ===== Services List (Zigzag) ===== */
function renderServicesList(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);
  setField(section, 'subheadline', fields.subheadline);

  const container = document.getElementById('services-list');
  if (!container || !fields.items) return;

  fields.items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'service-row anim';
    row.setAttribute('data-section', id);
    row.setAttribute('data-field', 'items');
    row.setAttribute('data-item', item.id);

    row.innerHTML = `
      <div>
        <div class="service-number">${item.number}</div>
        <h3 class="font-heading font-bold text-2xl text-secondary mb-4">${item.title}</h3>
        <p class="text-muted text-lg leading-relaxed">${item.description}</p>
      </div>
      <div class="service-image-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
    `;
    container.appendChild(row);
  });
}

/* ===== Features ===== */
function renderFeatures(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);
  setField(section, 'subheadline', fields.subheadline);

  const grid = document.getElementById('features-grid');
  if (!grid || !fields.items) return;

  fields.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'feature-card stagger-child';
    card.innerHTML = `
      <div class="feature-icon">
        <i data-lucide="${item.icon}"></i>
      </div>
      <h3 class="font-heading font-bold text-lg text-white mb-3">${item.title}</h3>
      <p class="text-white/50 leading-relaxed">${item.description}</p>
    `;
    grid.appendChild(card);
  });
}

/* ===== CTA Banner ===== */
function renderCTA(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  const bg = document.getElementById('cta-bg');
  if (bg && fields.background_image) {
    bg.style.backgroundImage = `url(${fields.background_image})`;
  }

  setField(section, 'headline', fields.headline);
  setField(section, 'text', fields.text);

  const ctaEl = section.querySelector('[data-field="cta_text"]');
  if (ctaEl && fields.cta_text) {
    ctaEl.innerHTML = `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>${fields.cta_text}`;
    ctaEl.href = fields.cta_url;
  }
}

/* ===== Testimonials ===== */
function renderTestimonials(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);

  const slider = document.getElementById('testimonial-slider');
  const dotsContainer = document.getElementById('testimonial-dots');
  if (!slider || !fields.items) return;

  fields.items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `testimonial-card ${i === 0 ? '' : 'hidden'}`;
    card.setAttribute('data-index', i);

    let stars = '';
    for (let s = 0; s < (item.rating || 5); s++) {
      stars += '<svg width="18" height="18" fill="#c8702a" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }

    card.innerHTML = `
      <div class="testimonial-stars">${stars}</div>
      <div class="testimonial-quote">${item.text}</div>
      <div class="testimonial-name">${item.name}</div>
      <div class="testimonial-role">${item.role}</div>
    `;
    slider.appendChild(card);

    const dot = document.createElement('button');
    dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('data-index', i);
    dot.setAttribute('aria-label', `Recenzia ${i + 1}`);
    dotsContainer.appendChild(dot);
  });
}

/* ===== Process ===== */
function renderProcess(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);

  const container = document.getElementById('process-steps');
  if (!container || !fields.items) return;

  fields.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'process-card stagger-child';
    card.innerHTML = `
      <div class="process-step-number">${item.step}</div>
      <div class="process-icon">
        <i data-lucide="${item.icon}"></i>
      </div>
      <h3 class="font-heading font-bold text-lg text-secondary mb-2">${item.title}</h3>
      <p class="text-muted text-sm leading-relaxed">${item.description}</p>
    `;
    container.appendChild(card);
  });
}

/* ===== Contact ===== */
function renderContact(id, fields) {
  const section = document.getElementById(id);
  if (!section) return;

  setField(section, 'label', fields.label);
  setField(section, 'headline', fields.headline);
  setField(section, 'text', fields.text);

  const infoContainer = document.getElementById('contact-info');
  if (infoContainer) {
    const items = [
      { icon: 'phone', label: 'Telefon', value: fields.phone, href: fields.phone_url },
      { icon: 'mail', label: 'Email', value: fields.email, href: `mailto:${fields.email}` },
      { icon: 'map-pin', label: 'Oblast posobnosti', value: fields.address },
      { icon: 'clock', label: 'Pracovna doba', value: fields.working_hours }
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'contact-info-item';
      const valueHTML = item.href
        ? `<a href="${item.href}" class="text-secondary hover:text-primary transition-colors font-semibold">${item.value}</a>`
        : `<span class="text-secondary font-semibold">${item.value}</span>`;

      div.innerHTML = `
        <div class="contact-info-icon">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div>
          <div class="text-muted text-sm mb-1">${item.label}</div>
          ${valueHTML}
        </div>
      `;
      infoContainer.appendChild(div);
    });
  }

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('form-submit');

  if (nameInput) nameInput.placeholder = fields.form_name_placeholder;
  if (emailInput) emailInput.placeholder = fields.form_email_placeholder;
  if (phoneInput) phoneInput.placeholder = fields.form_phone_placeholder;
  if (messageInput) messageInput.placeholder = fields.form_message_placeholder;
  if (submitBtn) submitBtn.textContent = fields.form_submit_text;
}

/* ===== Footer ===== */
function renderFooter(id, fields) {
  const logo = document.getElementById('footer-logo');
  if (logo) logo.textContent = fields.logo_text;

  const desc = document.getElementById('footer-desc');
  if (desc) desc.textContent = fields.description;

  const linksContainer = document.getElementById('footer-links');
  if (linksContainer && fields.links) {
    fields.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      a.className = 'text-white/50 hover:text-primary transition-colors text-sm';
      linksContainer.appendChild(a);
    });
  }

  const contactContainer = document.getElementById('footer-contact');
  if (contactContainer) {
    contactContainer.innerHTML = `
      <p><a href="tel:+421917955469" class="hover:text-primary transition-colors">${fields.phone}</a></p>
      <p><a href="mailto:${fields.email}" class="hover:text-primary transition-colors">${fields.email}</a></p>
      <p>${fields.address}</p>
    `;
  }

  const copyright = document.getElementById('footer-copyright');
  if (copyright) copyright.textContent = fields.copyright_text;
}

/* ===== Helper ===== */
function setField(container, fieldName, value) {
  const el = container.querySelector(`[data-field="${fieldName}"]`);
  if (el && value) el.textContent = value;
}

/* ===== Navbar Scroll ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    const isOpen = !menu.classList.contains('hidden');
    toggle.innerHTML = isOpen
      ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
      : '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  });

  // Close on link click (use event delegation since links are dynamic)
  menu.addEventListener('click', (e) => {
    if (e.target.classList.contains('mobile-link')) {
      menu.classList.add('hidden');
      toggle.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
    }
  });
}

/* ===== Smooth Scroll ===== */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar').offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
}

/* ===== Scroll to Top ===== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Testimonial Slider ===== */
function initTestimonialSlider() {
  const cards = document.querySelectorAll('#testimonial-slider .testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (cards.length === 0) return;

  let current = 0;
  let interval;

  function showSlide(index) {
    cards.forEach(c => c.classList.add('hidden'));
    dots.forEach(d => d.classList.remove('active'));
    cards[index].classList.remove('hidden');
    dots[index].classList.add('active');
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % cards.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showSlide(parseInt(dot.dataset.index));
      interval = setInterval(nextSlide, 5000);
    });
  });

  interval = setInterval(nextSlide, 5000);
}

/* ===== Contact Form ===== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) return;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      document.getElementById('form-email').focus();
      return;
    }

    form.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h3 class="font-heading font-bold text-xl text-secondary mb-2">Sprava odoslana</h3>
        <p class="text-muted">Dakujeme za vasu spravu. Ozveme sa vam co najskor.</p>
      </div>
    `;
  });
}
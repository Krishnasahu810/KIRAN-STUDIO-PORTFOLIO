document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================
  // CUSTOM CURSOR DOT LOGIC
  // ==========================================
  const cursorDot = document.querySelector('.custom-cursor-dot');

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });




  // ==========================================
  // FLOATING HEADER STYLE & ACTIVE NAV
  // ==========================================
  const header = document.querySelector('.header');
  const checkScrollHeader = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScrollHeader);
  checkScrollHeader();

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const menuIcon = mobileToggle.querySelector('.menu-icon');
  const closeIcon = mobileToggle.querySelector('.close-icon');

  const toggleMenu = () => {
    const isOpened = navMenu.classList.toggle('active');
    if (isOpened) {
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  mobileToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });



  // ==========================================
  // SERVICES INTERACTIVE HOVER REVEALS
  // ==========================================
  const serviceItems = document.querySelectorAll('.service-item');
  const hoverPreview = document.getElementById('hover-preview');
  const hoverPreviewImg = document.getElementById('hover-preview-img');

  serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const imgPath = item.getAttribute('data-hover-img');
      hoverPreviewImg.src = imgPath;
      hoverPreview.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      hoverPreview.classList.remove('active');
    });

    item.addEventListener('mousemove', (e) => {
      // Dynamic positioning offsets preview below cursor
      const offset = 25;
      hoverPreview.style.left = `${e.clientX + offset}px`;
      hoverPreview.style.top = `${e.clientY + offset}px`;
    });
  });

  // ==========================================
  // STATS COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-val');
    const duration = 2000;
    const increment = target > 50 ? Math.ceil(target / 70) : 1;
    const intervalTime = target > 50 ? 25 : Math.floor(duration / target);
    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= target) {
        counter.textContent = target + '+';
        clearInterval(timer);
      } else {
        counter.textContent = currentCount + '+';
      }
    }, intervalTime);
  };

  // Entrance reveals observer
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .scale-up');
  let statsAnimated = false;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.classList.contains('about-info') && !statsAnimated) {
          statsAnimated = true;
          counters.forEach(counter => animateCounter(counter));
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(element => revealObserver.observe(element));

  // ==========================================
  // REVIEWS SLIDER
  // ==========================================
  const sliderSlides = document.querySelectorAll('.reviews-slide');
  const sliderDots = document.querySelectorAll('.slider-dots .dot');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlide = 0;
  let sliderTimer = null;

  const showSlide = (index) => {
    sliderSlides.forEach(s => s.classList.remove('active'));
    sliderDots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + sliderSlides.length) % sliderSlides.length;
    sliderSlides[currentSlide].classList.add('active');
    sliderDots[currentSlide].classList.add('active');
  };

  const startAutoPlay = () => {
    sliderTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (sliderTimer) clearInterval(sliderTimer);
  };

  btnPrev.addEventListener('click', () => {
    stopAutoPlay();
    showSlide(currentSlide - 1);
    startAutoPlay();
  });

  btnNext.addEventListener('click', () => {
    stopAutoPlay();
    showSlide(currentSlide + 1);
    startAutoPlay();
  });

  sliderDots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      showSlide(+dot.getAttribute('data-index'));
      startAutoPlay();
    });
  });

  const reviewsSection = document.querySelector('.reviews-section');
  reviewsSection.addEventListener('mouseenter', stopAutoPlay);
  reviewsSection.addEventListener('mouseleave', startAutoPlay);
  startAutoPlay();

  // ==========================================
  // LIGHTBOX MODAL (Integrated with horizontal slide cards)
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  const lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  let activeLightboxIdx = 0;

  const loadLightboxItem = (idx) => {
    if (idx < 0 || idx >= lightboxTriggers.length) return;
    activeLightboxIdx = idx;
    
    const trigger = lightboxTriggers[activeLightboxIdx];
    const src = trigger.getAttribute('data-img-src');
    const title = trigger.getAttribute('data-title');
    const desc = trigger.getAttribute('data-desc');
    
    lightboxImg.style.transform = 'scale(0.95)';
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      
      lightboxImg.onload = () => {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.opacity = '1';
      };
    }, 150);
  };

  const openLightbox = (triggerBtn) => {
    const idx = lightboxTriggers.indexOf(triggerBtn);
    loadLightboxItem(idx);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(trigger);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    let prev = activeLightboxIdx - 1;
    if (prev < 0) prev = lightboxTriggers.length - 1;
    loadLightboxItem(prev);
  });
  
  lightboxNext.addEventListener('click', () => {
    let next = activeLightboxIdx + 1;
    if (next >= lightboxTriggers.length) next = 0;
    loadLightboxItem(next);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      let prev = activeLightboxIdx - 1;
      if (prev < 0) prev = lightboxTriggers.length - 1;
      loadLightboxItem(prev);
    }
    if (e.key === 'ArrowRight') {
      let next = activeLightboxIdx + 1;
      if (next >= lightboxTriggers.length) next = 0;
      loadLightboxItem(next);
    }
  });

  // ==========================================
  // BOOKING CONSULTATION FORM HANDLING
  // ==========================================
  const bookingForm = document.getElementById('booking-form');
  const successOverlay = document.getElementById('form-success');
  const successClose = document.getElementById('success-close');
  const submitBtn = bookingForm.querySelector('.submit-btn');
  const submitBtnText = submitBtn.querySelector('span');
  const formStatus = document.getElementById('form-status');

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Lodging Outline...';
    formStatus.textContent = '';
    formStatus.classList.remove('error', 'success');

    try {
      const formData = new FormData(bookingForm);
      const payload = Object.fromEntries(formData);
      const response = await fetch(bookingForm.action, {
        method: bookingForm.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? await response.json()
        : { success: false, message: await response.text() };

      if (!response.ok || !result.success) {
        throw new Error(result.message || result?.body?.message || 'Unable to submit the form.');
      }

      formStatus.textContent = 'Message sent successfully.';
      formStatus.classList.add('success');
      successOverlay.classList.remove('hidden');
      bookingForm.reset();
    } catch (error) {
      formStatus.textContent = `Message could not be sent: ${error.message}`;
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Submit Concept';
    }
  });

  successClose.addEventListener('click', () => {
    successOverlay.classList.add('hidden');
  });

  // Re-run cursor event setups to cover elements generated/updated dynamically
  setupCursorHoverListeners();
});

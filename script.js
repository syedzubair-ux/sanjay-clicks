/* ================================================
   SANJAY STUDIO – JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Preloader ---- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1500);
  });

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .filter-btn, .portfolio-zoom, .slider-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'rgba(201,168,76,0.5)';
      follower.style.width = '60px';
      follower.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.background = '#c9a84c';
      follower.style.width = '36px';
      follower.style.height = '36px';
    });
  });

  /* ---- Hero Particles ---- */
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --dur: ${Math.random() * 6 + 4}s;
        --delay: ${Math.random() * 6}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ---- Navbar Scroll ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Back to top
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Back to Top ---- */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Intersection Observer (AOS-like) ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
          // Animate skill bars
          entry.target.querySelectorAll && entry.target.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.style.width; // trigger reflow
          });
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  /* ---- Counter Animation ---- */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.count);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current).toLocaleString();
            if (current >= target) clearInterval(timer);
          }, 16);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  /* ---- Portfolio Filter ---- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = match ? '1' : '0.2';
        item.style.transform = match ? 'scale(1)' : 'scale(0.95)';
        item.style.pointerEvents = match ? 'auto' : 'none';
      });
    });
  });

  /* ---- Lightbox ---- */
  window.openLightbox = (src, caption) => {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    img.src = src;
    img.alt = caption;
    cap.textContent = caption;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---- Testimonials Slider ---- */
  const track = document.getElementById('testimonialsTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let visibleCards = 3;
  let autoSlideTimer;

  function updateVisibleCards() {
    visibleCards = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }
  updateVisibleCards();

  if (cards.length) {
    // Create dots
    const totalSlides = Math.max(1, cards.length - visibleCards + 1);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      const total = Math.max(1, cards.length - visibleCards + 1);
      currentSlide = Math.max(0, Math.min(index, total - 1));
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    document.getElementById('testimonialNext').addEventListener('click', () => {
      const total = Math.max(1, cards.length - visibleCards + 1);
      goToSlide((currentSlide + 1) % total);
      resetAutoSlide();
    });

    document.getElementById('testimonialPrev').addEventListener('click', () => {
      const total = Math.max(1, cards.length - visibleCards + 1);
      goToSlide((currentSlide - 1 + total) % total);
      resetAutoSlide();
    });

    function startAutoSlide() {
      autoSlideTimer = setInterval(() => {
        const total = Math.max(1, cards.length - visibleCards + 1);
        goToSlide((currentSlide + 1) % total);
      }, 4500);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    startAutoSlide();
    window.addEventListener('resize', () => {
      updateVisibleCards();
      goToSlide(0);
    });
  }

  /* ---- Pricing Toggle ---- */
  const toggle = document.getElementById('pricingToggle');
  const prices = [
    { portrait: '4,999', wedding: '29,999' },
    { portrait: '9,999', wedding: '64,999' },
    { portrait: '18,999', wedding: '1,29,999' }
  ];
  const labelMonthly = document.getElementById('toggle-label-monthly');
  const labelAnnual = document.getElementById('toggle-label-annual');

  toggle && toggle.addEventListener('change', () => {
    const isWedding = toggle.checked;
    labelMonthly.style.color = isWedding ? '#888' : '#c9a84c';
    labelAnnual.style.color = isWedding ? '#c9a84c' : '#888';
    const type = isWedding ? 'wedding' : 'portrait';
    document.getElementById('price1').textContent = prices[0][type];
    document.getElementById('price2').textContent = prices[1][type];
    document.getElementById('price3').textContent = prices[2][type];
    // Animate price change
    ['price1','price2','price3'].forEach(id => {
      const el = document.getElementById(id);
      el.style.transform = 'scale(1.2)';
      el.style.color = '#c9a84c';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.color = '';
        el.style.transition = 'all 0.3s ease';
      }, 300);
    });
  });

  /* ---- Reviews Modal ---- */
  const reviewsData = [
    {
      name: 'Ali & Sana',
      meta: 'Wedding Clients – Mirwah Gorchani, Sindh',
      avatar: 'A',
      avatarStyle: 'background: linear-gradient(135deg, #c9a84c, #a07830);',
      tag: '💍 Wedding Photography',
      text: '"Sanjay Clicks ne hmari shaadi ki photography bohat khoobsurti se ki. Har moment itni khubsoorti se capture kiya ke zindagi bhar yaad rahega. Mirwah Gorchani mein best photographer hain Sanjay bhai! Unki mehnat, dedication aur kaam ki quality ne sab ko hairan kar diya. Shaadi ki tasveerein dekhke ghar walon ki aankhein bhar aayi. Allah unhein aur tarakki de — truly the best in Sindh!"'
    },
    {
      name: 'Fatima Shaikh',
      meta: 'Portrait Client – Mirwah Gorchani, Sindh',
      avatar: 'F',
      avatarStyle: 'background: linear-gradient(135deg, #c084fc, #818cf8);',
      tag: '👤 Portrait Session',
      text: '"Portrait session bohat acha raha. Sanjay bhai ne mujhe bilkul comfortable feel karaya aur photos itni stunning nikli ke dekh kar khushi ho gai. Sindh mein professional photography chahiye toh Sanjay Clicks best choice hai! Unki professional approach, lighting ka andaaz aur editing ka kaam sach mein lajawaab hai. Har photo ek masterpiece lagti hai. Main apni family ko bhi recommend karungi!"'
    },
    {
      name: 'Rafiq Chandio',
      meta: 'Corporate Client – Nawabshah, Sindh',
      avatar: 'R',
      avatarStyle: 'background: linear-gradient(135deg, #34d399, #059669);',
      tag: '🎉 Event Photography',
      text: '"Hamari company event ki photography ke liye Sanjay Clicks ko hire kiya. Kaam itna professional tha ke sab log tarif karte rahe. Poore Sindh mein inse behtar photographer nahi milega. Highly recommended! Event ke doran unho ne har lamha capture kiya — group photos, candid moments, aur speeches sab kuch. Delivery bhi time par mili aur quality exceptional thi. Aindah bhi Sanjay bhai ka hi option hai hamara!"'
    },
    {
      name: 'Sohail & Rukhsana',
      meta: 'Newborn Clients – Mirwah Gorchani, Sindh',
      avatar: 'S',
      avatarStyle: 'background: linear-gradient(135deg, #fb923c, #ef4444);',
      tag: '👶 Newborn Photography',
      text: '"Apne naye bachche ki photos Sanjay bhai se karwai. Unhon ne itni care aur patience se kaam kiya ke baby bhi comfortable tha. Photos dekhke aankhon mein aansu aa gaye khushi ke. Allah Sanjay bhai ko khush rakhe! Nanha bachcha tha lekin Sanjay bhai ne bohat pyaar se sab kuch manage kiya. Studio ka setting beautiful tha, props lovely the. Ye photos humare liye zindagi bhar ki yaadgaar hain!"'
    },
    {
      name: 'Muhammad Saleem',
      meta: 'Business Client – Mirwah Gorchani, Sindh',
      avatar: 'M',
      avatarStyle: 'background: linear-gradient(135deg, #38bdf8, #0ea5e9);',
      tag: '📦 Product Photography',
      text: '"Meri dukan ki product photography Sanjay Clicks ne ki. Online sales mein bohat izafa hua photos ke baad. Quality aur detail mein koi compromise nahi. Mirwah aur aas paas ke sab business owners ko recommend karta hun! Products ekdum professional lagte hain — white background, detailed shots, aur lifestyle photography sab zabardast thi. Ek baar try karo aur phir wapis nahi jaoge kisi aur ke paas!"'
    },
    {
      name: 'Zubair Ahmed',
      meta: 'Landscape Client – Hyderabad, Sindh',
      avatar: 'Z',
      avatarStyle: 'background: linear-gradient(135deg, #f9a8d4, #ec4899);',
      tag: '🌄 Landscape Photography',
      text: '"Sanjay bhai ne hamare safar ki bohat khoobsurat photography ki. Photos dekhke dil khush ho gaya — aise laga jaise wo lamha phir se ji raha hun. Har jagah ki beauty ko unhon ne bakhoobi capture kiya. Sindh ki dharti, sooraj ka roshan aur wadiyon ka drishya — sab kuch itni khubsurti se liya ke tasveerein painting lagti hain. Future mein bhi zaroor unke sath kaam karein ge!"'
    }
  ];

  window.openReview = (index) => {
    const data = reviewsData[index];
    if (!data) return;
    const modal = document.getElementById('reviewModal');
    document.getElementById('reviewModalAvatar').textContent = data.avatar;
    document.getElementById('reviewModalAvatar').style = data.avatarStyle;
    document.getElementById('reviewModalName').textContent = data.name;
    document.getElementById('reviewModalMeta').textContent = data.meta;
    document.getElementById('reviewModalTag').textContent = data.tag;
    document.getElementById('reviewModalText').textContent = data.text;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeReview = () => {
    document.getElementById('reviewModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  // Keyboard support for review cards
  document.querySelectorAll('.review-card').forEach((card, i) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openReview(i);
      }
    });
  });

  // Close review modal on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeReview();
      closeLightbox();
    }
  });

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-form');
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<span>Send Enquiry</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
      btn.disabled = false;
      document.getElementById('formSuccess').classList.add('visible');
      contactForm.reset();
      setTimeout(() => document.getElementById('formSuccess').classList.remove('visible'), 6000);
    }, 2000);
  });

  /* ---- Newsletter Form ---- */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm && newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('btn-newsletter');
    const input = document.getElementById('newsletterEmail');
    if (input.value) {
      btn.textContent = '✓ Done!';
      btn.style.background = '#4ade80';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        input.value = '';
      }, 3000);
    }
  });

  /* ---- Smooth Scroll for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Skill Bars Animation ---- */
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          requestAnimationFrame(() => {
            setTimeout(() => { bar.style.width = width; }, 100);
          });
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.querySelector('.about');
  if (aboutSection) skillObserver.observe(aboutSection);

  /* ---- Navbar logo glow effect ---- */
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.textShadow = '0 0 20px rgba(201,168,76,0.5)';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.textShadow = '';
    });
  });

  /* ---- Parallax effect on hero ---- */
  const heroImg = document.querySelector('.hero-img');
  window.addEventListener('scroll', () => {
    if (heroImg && window.scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
    }
  });

  console.log('🎯 Sanjay Studio – Loaded Successfully!');
});

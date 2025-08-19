(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');
  const yearEl = document.getElementById('year');

  // Dynamic year
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Mobile nav toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close nav on link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Make Home scroll to absolute top (avoid header offset gap)
  const homeLink = Array.from(navLinks).find((a) => (a.getAttribute('href') || '') === '#home');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try { history.replaceState(null, '', '#home'); } catch {}
      setTimeout(setActiveLink, 50);
    });
  }

  // Active link highlighting
  function buildSections() {
    const homeTop = document.getElementById('home')?.offsetTop || 0;
    const sectionEls = Array.from(document.querySelectorAll('main .section'));
    const rest = sectionEls.map((s) => ({ id: s.id, top: s.offsetTop }));
    const list = [{ id: 'home', top: homeTop }, ...rest];
    return list.sort((a, b) => a.top - b.top);
  }

  let sections = buildSections();

  function setActiveLink() {
    const y = window.scrollY;
    const headerOffset = 120; // sticky header height allowance

    const aboutTop = document.getElementById('about')?.offsetTop ?? Number.POSITIVE_INFINITY;

    let current = 'home';

    // Keep Home active until scroll position (plus header) reaches About top
    if (y + headerOffset < aboutTop) {
      current = 'home';
    } else {
      for (const s of sections) {
        if (s.id === 'home') continue;
        if (y + headerOffset >= s.top) current = s.id;
      }
    }

    navLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        const id = href.slice(1);
        a.classList.toggle('active', id === current);
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('resize', () => {
    sections = buildSections();
    setActiveLink();
  });
  window.addEventListener('hashchange', setActiveLink);

  sections = buildSections();
  setActiveLink();
})(); 
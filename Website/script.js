// site script (single clean file)
// Provides: header fallback links, mobile nav, open-pages panel, reveal on scroll,
// contact form, lazy services loader, theme toggle, footer year.

(function(){
  'use strict';

  // Helper: safe query
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  function ensureHeaderLinks() {
    try {
      const mainNav = $('#main-nav');
      if (!mainNav) return;
      const ul = mainNav.querySelector('ul'); if (!ul) return;

      const has = (href) => !!ul.querySelector(`a[href="${href}"]`);
      const insertBeforeCtas = (node) => { const navCtas = ul.querySelector('li.nav-ctas'); if(navCtas) ul.insertBefore(node, navCtas); else ul.appendChild(node); };

      function makeLi(href, text, svg) {
        const li = document.createElement('li');
        const a = document.createElement('a'); a.className = 'nav-link'; a.href = href; a.innerHTML = (svg || '') + ' ' + text; li.appendChild(a);
        return li;
      }

      if (!has('jobs.html')) {
        const svg = '<svg class="nav-svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" fill="#dbeafe"/></svg>';
        insertBeforeCtas(makeLi('jobs.html', 'Jobs', svg));
      }
      if (!has('achievements.html')) {
        const svg = '<svg class="nav-svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 5.2L20 8l-4 3.2L17 18l-5-2.8L7 18l1-6.8L4 8l5.6-.8L12 2z" fill="#dbeafe"/></svg>';
        insertBeforeCtas(makeLi('achievements.html', 'Achievements', svg));
      }

      const headerCtas = document.querySelector('.header-ctas');
      if (headerCtas) {
        if (!headerCtas.querySelector('a[href="jobs.html"]')) {
          const a = document.createElement('a'); a.href = 'jobs.html'; a.className = 'btn header-cta'; a.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor"/></svg> Jobs'; headerCtas.appendChild(a);
        }
        if (!headerCtas.querySelector('a[href="achievements.html"]')) {
          const a = document.createElement('a'); a.href = 'achievements.html'; a.className = 'btn header-cta'; a.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 5.2L20 8l-4 3.2L17 18l-5-2.8L7 18l1-6.8L4 8l5.6-.8L12 2z" fill="currentColor"/></svg> Achievements'; headerCtas.appendChild(a);
        }
      }

      const openPanel = document.getElementById('open-pages-panel');
      if (openPanel) {
        if (!openPanel.querySelector('button[data-open="jobs.html"]')) {
          const row = document.createElement('div'); row.className = 'open-row'; row.innerHTML = '<button class="btn" data-open="jobs.html">Jobs</button><button class="btn small copy-btn" data-copy="jobs.html" aria-label="Copy Jobs link">Copy</button>';
          openPanel.appendChild(row);
        }
        if (!openPanel.querySelector('button[data-open="achievements.html"]')) {
          const row = document.createElement('div'); row.className = 'open-row'; row.innerHTML = '<button class="btn" data-open="achievements.html">Achievements</button><button class="btn small copy-btn" data-copy="achievements.html" aria-label="Copy Achievements link">Copy</button>';
          openPanel.appendChild(row);
        }
      }
    } catch (err) {
      // non-fatal
    }
  }

  function initNav() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (!navToggle || !mainNav) return null;

    const setNavOpen = (isOpen) => {
      mainNav.classList.toggle('open', !!isOpen);
      mainNav.setAttribute('aria-hidden', String(!isOpen));
      navToggle.setAttribute('aria-expanded', String(!!isOpen));
      navToggle.classList.toggle('open', !!isOpen);
    };

    if (navToggle.getAttribute('aria-expanded') === null) navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => { const cur = navToggle.getAttribute('aria-expanded') === 'true'; setNavOpen(!cur); });
    navToggle.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); const cur = navToggle.getAttribute('aria-expanded') === 'true'; setNavOpen(!cur); } });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') setNavOpen(false); });
    document.addEventListener('click', (e) => { if (navToggle.getAttribute('aria-expanded') !== 'true') return; if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) setNavOpen(false); });

    const focusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
    document.addEventListener('focusin', (e) => { if (navToggle.getAttribute('aria-expanded') !== 'true') return; if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) { const first = mainNav.querySelector(focusableSelector); if (first) first.focus(); } });

    $$('.nav-link', mainNav).forEach(a => a.addEventListener('click', () => { if (navToggle.getAttribute('aria-expanded') === 'true') setNavOpen(false); }));

    return setNavOpen;
  }

  function initHashLinks(setNavOpen) {
    $$('.nav-link').forEach(link => link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return; e.preventDefault(); const target = document.getElementById(href.slice(1)); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (typeof setNavOpen === 'function') setNavOpen(false);
    }));
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault(); status.textContent = '';
      const name = (form.name && form.name.value || '').trim(); const email = (form.email && form.email.value || '').trim(); const message = (form.message && form.message.value || '').trim();
      if (!name || !email || !message) { status.textContent = 'Please complete required fields: name, email and message.'; status.style.color = 'crimson'; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = 'Please enter a valid email address.'; status.style.color = 'crimson'; return; }

      const submitBtn = form.querySelector('button[type="submit"]'); if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      setTimeout(() => { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; } form.reset(); status.textContent = 'Message sent. We will get back to you within 1-2 business days.'; status.style.color = 'green'; }, 900);
    });
  }

  function initReveal() {
    const reveals = $$('.reveal');
    if (!('IntersectionObserver' in window) || reveals.length === 0) { reveals.forEach(r => r.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries, obs) => { entries.forEach(entry => { if (entry.isIntersecting) { const el = entry.target; const idx = reveals.indexOf(el); const delay = Math.min(300, idx * 80); setTimeout(() => el.classList.add('is-visible'), delay); obs.unobserve(el); } }); }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  }

  function initOpenPages() {
    const openPagesToggle = document.getElementById('open-pages-toggle');
    const openPagesPanel = document.getElementById('open-pages-panel');
    const openPagesWrapper = openPagesToggle ? openPagesToggle.closest('.open-pages') : null;
    if (!openPagesToggle || !openPagesPanel) return;
    const setOpen = (isOpen) => { openPagesToggle.setAttribute('aria-expanded', String(!!isOpen)); openPagesPanel.setAttribute('aria-hidden', String(!isOpen)); openPagesWrapper && openPagesWrapper.classList.toggle('open', !!isOpen); };
    openPagesToggle.addEventListener('click', () => setOpen(!(openPagesToggle.getAttribute('aria-expanded') === 'true')));
    const feedbackEl = document.getElementById('open-pages-feedback');

    openPagesPanel.querySelectorAll('button[data-open]').forEach(btn => btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-open'); const mode = (document.getElementById('open-pages-mode') || {}).value || 'new'; if (mode === 'same') window.location.href = url; else window.open(url, '_blank', 'noopener'); setOpen(false);
    }));

    openPagesPanel.querySelectorAll('button[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
      const path = btn.getAttribute('data-copy'); const origin = window.location.origin; const full = origin + '/' + path; try { if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(full); else { const ta = document.createElement('textarea'); ta.value = full; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } if (feedbackEl) feedbackEl.textContent = 'Copied: ' + full; } catch (err) { if (feedbackEl) feedbackEl.textContent = 'Copy failed'; } setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, 2200);
    }));

    document.addEventListener('click', (e) => { if (!openPagesWrapper) return; if (openPagesWrapper.classList.contains('open') && !openPagesWrapper.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Mobile side menu behavior: open via Other button, close, and collapse to only Other after nav click
  function initMobileSide() {
    const otherBtn = document.getElementById('mobile-other-btn');
    const side = document.getElementById('mobile-side');
    const sideClose = document.getElementById('mobile-side-close');
    if (!otherBtn || !side) return;

    const setOpen = (isOpen) => {
      otherBtn.setAttribute('aria-expanded', String(!!isOpen));
      side.setAttribute('aria-hidden', String(!isOpen));
      side.classList.toggle('open', !!isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    otherBtn.addEventListener('click', () => setOpen(true));
    if (sideClose) sideClose.addEventListener('click', () => setOpen(false));

    // When a nav link inside side is clicked on mobile, close side and show only Other button
    side.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
  // Close the side
  setOpen(false);
  // Collapse: keep only the Menu button visible by hiding mobile-side permanently until page reload
  side.style.display = 'none';
  otherBtn.textContent = 'Menu';
      // Optionally you could toggle otherBtn to a different state; leaving it visible per request
    });
  }

  function initPageToggle() {
    const toggle = document.getElementById('page-toggle'); if (!toggle) return;
    const contactPanel = document.getElementById('contact-panel'); const servicesPanel = document.getElementById('services-panel');
    const buttons = $$('.seg-btn', toggle);
    if (!buttons.length) return;

    async function loadServices() {
      if (!servicesPanel || servicesPanel.getAttribute('data-loaded') === 'true') return;
      try {
        const res = await fetch('services.html'); if (!res.ok) throw new Error('Network'); const txt = await res.text(); const tmp = document.createElement('div'); tmp.innerHTML = txt; const srv = tmp.querySelector('.services'); if (srv) { servicesPanel.innerHTML = srv.outerHTML; servicesPanel.setAttribute('data-loaded', 'true'); } else { servicesPanel.innerHTML = '<p>Unable to load services.</p>'; }
      } catch (err) { if (servicesPanel) servicesPanel.innerHTML = '<p>Unable to load services.</p>'; }
    }

    function showPanel(name) {
      buttons.forEach(b => { const target = b.getAttribute('data-target'); const active = target === name; b.classList.toggle('active', active); b.setAttribute('aria-selected', String(active)); });
      if (name === 'services') { loadServices().then(() => { if (contactPanel) contactPanel.style.display = 'none'; if (servicesPanel) { servicesPanel.style.display = ''; servicesPanel.setAttribute('aria-hidden', 'false'); } }); }
      else { if (servicesPanel) servicesPanel.style.display = 'none'; if (servicesPanel) servicesPanel.setAttribute('aria-hidden', 'true'); if (contactPanel) { contactPanel.style.display = ''; contactPanel.setAttribute('aria-hidden', 'false'); } }
    }

    buttons.forEach(b => b.addEventListener('click', () => showPanel(b.getAttribute('data-target'))));
    const active = buttons.find(b => b.classList.contains('active')) || buttons[0]; if (active) showPanel(active.getAttribute('data-target'));
  }

  // Theme
  function setTheme(name) {
    if (name === 'light') { document.documentElement.classList.add('theme-light'); document.documentElement.classList.remove('theme-dark'); localStorage.setItem('novatech-theme', 'light'); const btn = document.getElementById('theme-toggle-btn'); if (btn) { btn.textContent = '☀️'; btn.setAttribute('aria-pressed', 'true'); } }
    else { document.documentElement.classList.remove('theme-light'); document.documentElement.classList.add('theme-dark'); localStorage.setItem('novatech-theme', 'dark'); const btn = document.getElementById('theme-toggle-btn'); if (btn) { btn.textContent = '🌙'; btn.setAttribute('aria-pressed', 'false'); } }
  }

  // Toggle helper used by direct listeners and delegated handler
  function toggleTheme() {
    const cur = document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    const stored = localStorage.getItem('novatech-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);

    // Attach direct listener if the button is present
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      // ensure a single listener
      btn.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggleTheme(); } });
      return;
    }

    // If button isn't present yet for any reason, use a delegated click handler so the toggle still works once added
    const delegated = (e) => {
      const t = e.target && e.target.closest ? e.target.closest('#theme-toggle-btn') : null;
      if (!t) return;
      e.preventDefault();
      toggleTheme();
    };
    document.addEventListener('click', delegated);
  }

  function setFooterYear() { const yearSpan = document.getElementById('year'); if (yearSpan) yearSpan.textContent = new Date().getFullYear(); }

  function initAll() {
    ensureHeaderLinks();
    const setNavOpen = initNav();
    initHashLinks(setNavOpen);
    initContactForm();
    initReveal();
    initOpenPages();
    initMobileSide();
    initPageToggle();
    initModal();
    initTheme();
    setFooterYear();
    window.setNovatechTheme = setTheme;
  }

  /* Modal: lightweight accessible modal */
  function initModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const panel = modal.querySelector('.site-modal-panel');
    const titleEl = modal.querySelector('#modal-title');
    const bodyEl = modal.querySelector('#modal-body');
    const applyLink = modal.querySelector('#modal-apply');
    const closeBtn = modal.querySelector('.modal-close');

    let lastActive = null;

    function openModal({ title, body, mailto }) {
      lastActive = document.activeElement;
      if (titleEl) titleEl.textContent = title || '';
      // allow HTML in body (trusted content coming from developer-controlled attributes)
      if (bodyEl) bodyEl.innerHTML = body || '';
      if (applyLink) { applyLink.href = mailto || '#'; }
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
      if (panel) { panel.tabIndex = -1; panel.focus(); }
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      if (lastActive && lastActive.focus) lastActive.focus();
    }

    // click outside or on backdrop closes
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute('data-close') === 'true') closeModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
      if (e.key === 'Tab' && modal.getAttribute('aria-hidden') === 'false') {
        const focusable = panel.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('[data-modal-title]');
      if (!btn) return;
      e.preventDefault();
      openModal({ title: btn.getAttribute('data-modal-title'), body: btn.getAttribute('data-modal-body'), mailto: btn.getAttribute('data-modal-mailto') });
    });
  }

  // initialize after includes (if present)
  if (window.loadIncludes) {
    window.loadIncludes().then(() => { initAll(); }).catch(() => initAll());
  } else {
    initAll();
  }

  // expose init functions for manual re-run if needed
  window.initScripts = initAll;
  window.initTheme = initTheme;

})();

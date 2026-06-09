// ============================================================
// NAVBAR LOADER
// Fetches navbar.html and injects it into every page
// ============================================================

async function loadNavbar() {
  try {
    const response = await fetch('/components/navbar.html');
    const html = await response.text();

    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
      placeholder.innerHTML = html;
      initNavbar();
    }
  } catch (error) {
    console.error('Could not load navbar:', error);
  }
}

// ============================================================
// NAVBAR TOGGLE LOGIC
// The hamburger button opens AND closes the menu.
// It animates from two lines → X on open, X → two lines on close.
// ============================================================

function initNavbar() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const menuOverlay  = document.getElementById('menuOverlay');

  function openMenu() {
    menuOverlay.classList.add('is-open');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    menuOverlay.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open menu');
  }

  // Single button toggles open/close
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ============================================================
// RUN ON PAGE LOAD
// ============================================================

document.addEventListener('DOMContentLoaded', loadNavbar);

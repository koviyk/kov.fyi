// ============================================================
// BOTTOM BAR — DATE
// Updates the date display to today's date dynamically
// ============================================================

function updateDate() {
  const el = document.getElementById('current-date');
  if (!el) return;

  const now = new Date();
  const day   = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year  = String(now.getFullYear()).slice(2); // last 2 digits

  el.textContent = `${day} ${month} ${year}`;
}

// ============================================================
// HOME ILLUSTRATION — block right-click save (image only)
// Scoped to .home-image img specifically — right-click stays
// enabled everywhere else on the site (text, nav, bottom bar,
// other pages). Weak deterrent only (devtools/direct URL access
// still bypass it), but stops the casual "save image as" path.
// ============================================================

function guardHomeImage() {
  const img = document.querySelector('.home-image img');
  if (!img) return;

  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

// ============================================================
// RUN ON PAGE LOAD
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  guardHomeImage();
});

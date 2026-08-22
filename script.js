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
// MOBILE — open all Gear/Projects accordion sections by default
// Matches the Figma mobile mockups, where every section (PC
// Info, Music, Peripherals, Youtube, Animal Wifi) starts open.
// Desktop keeps its own defaults (Music/Youtube/Animal Wifi
// closed by default, set via the `open` attribute in HTML) —
// this only runs once on load, only while the mobile CSS media
// query is active, and only ADDS the open attribute (never
// removes it), so it never fights a user who manually collapses
// a section afterward.
//
// The query string below MUST stay identical to the mobile
// breakpoint in style.css: `(max-width: 768px), (orientation:
// landscape) and (max-height: 768px)`. The second half exists
// because a phone rotated to landscape is routinely 800-930px
// wide — over the 768px width threshold — so a plain
// `max-width: 768px` check here would silently stop opening
// accordions the moment the phone rotates, even though the CSS
// mobile layout (and its side-by-side Gear/Projects variant)
// stays active. Both files must be kept in sync if this
// breakpoint ever changes.
// ============================================================

function openAccordionsOnMobile() {
  const isMobile = window.matchMedia(
    '(max-width: 768px), (orientation: landscape) and (max-height: 768px)'
  ).matches;
  if (!isMobile) return;

  document.querySelectorAll('.gear-section').forEach((section) => {
    section.setAttribute('open', '');
  });
}

// ============================================================
// MOBILE — stop scrollable content exactly at the top edge of
// the "version" text in the bottom bar
//
// The mobile CSS reserves space at the bottom of `.stage` (its
// scrolling container) so content never disappears behind the
// fixed `.bottom-bar`. That reserve was a flat 100px guess. The
// actual boundary the user wants is precise and font-dependent
// (the top of the version-label's own line box), which can't be
// hardcoded as a px number without risking being off by a few
// pixels on a different device/browser font-rendering — so this
// measures it live instead.
//
// `.bottom-bar` is `position: fixed` and NOT inside `.stage`
// (it's a sibling at the body level in every page's markup), so
// its position relative to the viewport never changes when
// `.stage` scrolls internally — meaning a single measurement
// per load/resize/rotation stays valid and doesn't need to
// re-run on every scroll event.
//
// The measured value is written to a CSS custom property
// (`--mobile-bottom-clearance`) that style.css's mobile
// `.stage { height: calc(100vh - var(--mobile-bottom-clearance,
// 100px)) }` reads, with 100px as the fallback for the brief
// moment before this script runs (or if JS is disabled).
// ============================================================

function syncMobileBottomClearance() {
  const isMobile = window.matchMedia(
    '(max-width: 768px), (orientation: landscape) and (max-height: 768px)'
  ).matches;
  if (!isMobile) return;

  const versionLabel = document.querySelector('.version-label');
  if (!versionLabel) return;

  const top = versionLabel.getBoundingClientRect().top;
  const clearance = Math.max(0, Math.round(window.innerHeight - top));

  document.documentElement.style.setProperty(
    '--mobile-bottom-clearance',
    `${clearance}px`
  );
}

// ============================================================
// MOBILE — "keep scrolling" fade indicator
// `.scroll-fade` (styled in style.css: 75px tall, transparent-
// to-page-background gradient, sitting right above the bottom
// bar) hints that a page has more content below the fold. This
// function drives its opacity from `.stage`'s own scroll
// position — full strength at the top, fading down to fully
// transparent by the time the user reaches the bottom of the
// scrollable content, so the hint disappears exactly when it's
// no longer true (there's nothing further to reveal).
//
// If a page's content doesn't overflow `.stage` at all (nothing
// to scroll), the fade is hidden outright rather than showing a
// static, meaningless gradient — `maxScroll <= 0` covers that.
// ============================================================

function syncScrollFade() {
  const isMobile = window.matchMedia(
    '(max-width: 768px), (orientation: landscape) and (max-height: 768px)'
  ).matches;

  const fade = document.querySelector('.scroll-fade');
  if (!fade) return;

  if (!isMobile) {
    fade.style.opacity = '';
    return;
  }

  const stage = document.querySelector('.stage');
  if (!stage) return;

  const maxScroll = stage.scrollHeight - stage.clientHeight;

  if (maxScroll <= 0) {
    // Nothing to scroll — no need to hint at more content.
    fade.style.opacity = '0';
    return;
  }

  const progress = Math.min(1, Math.max(0, stage.scrollTop / maxScroll));
  fade.style.opacity = String(1 - progress);
}

// ============================================================
// RUN ON PAGE LOAD
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  guardHomeImage();
  openAccordionsOnMobile();
  syncMobileBottomClearance();
  syncScrollFade();

  const stage = document.querySelector('.stage');
  if (stage) {
    stage.addEventListener('scroll', syncScrollFade);
  }
});

// Re-measure on resize/orientation change so rotating the phone
// (or resizing a desktop browser window into the mobile range)
// keeps the boundary pixel-accurate instead of using a stale
// measurement taken at the previous size/orientation. The fade
// is re-synced too, since rotating changes both the mobile
// clearance boundary and how much content overflows/scrolls.
window.addEventListener('resize', () => {
  syncMobileBottomClearance();
  syncScrollFade();
});
window.addEventListener('orientationchange', () => {
  syncMobileBottomClearance();
  syncScrollFade();
});

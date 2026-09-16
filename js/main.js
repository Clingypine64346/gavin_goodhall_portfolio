/* Shared enhancements only. All page text, cards, and navigation live in HTML.
   No framework, network requests, tracking, or build tools are required. */
'use strict';
document.documentElement.classList.add('js');

// Keep the footer current on every page.
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// Mobile navigation: accessible state, Escape to close, and no stale desktop state.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  navigation.classList.toggle('is-open', opening);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header') && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

// Project index: scroll within the current document without changing its URL.
// Keep real fragment hrefs as a fallback when JavaScript is unavailable.
document.querySelectorAll('.project-aside a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    // Preserve the browser's usual behavior for modified clicks.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(link.getAttribute('href').slice(1));
    if (!section) return;
    event.preventDefault();
    // Move keyboard focus along with the viewport, without adding a Tab stop.
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    // CSS supplies smooth scrolling, sticky-header spacing, and reduced-motion support.
    section.scrollIntoView({ behavior: 'auto', block: 'start' });
  });
});

// Native dialog provides keyboard focus containment and Escape handling.
// Project data and 3-image galleries are directly editable in blender.html.
let lastOpener = null;
function openDialog(dialog, opener) {
  lastOpener = opener;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.modal), button));
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    // Only close on a real backdrop click, never blank space inside the dialog.
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastOpener && lastOpener.isConnected) lastOpener.focus();
  });
});

// PLACEHOLDER CONTACTS: replace each href in HTML, then remove data-placeholder
// and the '(placeholder)' aria-label. The notice prevents sending to a fake address.
document.querySelectorAll('[data-placeholder]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const channel = link.dataset.placeholder;
    document.querySelector('#notice-copy').textContent = `${channel} is a placeholder. Gavin’s contact information has not been added yet.`;
    openDialog(document.querySelector('#placeholder-dialog'), link);
  });
});

// Three-image project sliders: manual navigation, seamless loops, no autoplay.
document.querySelectorAll('.project-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.project-carousel-track');
  const slides = Array.from(track.children);
  const count = slides.length;
  if (count < 2) return;
  const controls = carousel.querySelector('.project-carousel-controls');
  const status = carousel.querySelector('.carousel-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Bookend copies let last → first and first → last move one slide smoothly.
  const firstCopy = slides[0].cloneNode(true);
  const lastCopy = slides[count - 1].cloneNode(true);
  [firstCopy, lastCopy].forEach((copy) => {
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelector('img').loading = 'eager';
  });
  track.prepend(lastCopy);
  track.append(firstCopy);
  let position = 1;
  let moving = false;
  let fallbackTimer;
  const render = () => { track.style.transform = `translateX(${-100 * position}%)`; };
  const announce = () => {
    const current = (position - 1 + count) % count;
    slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== current)));
    status.textContent = `Image ${current + 1} of ${count}`;
  };
  const finish = () => {
    if (!moving) return;
    clearTimeout(fallbackTimer);
    // Jump from the identical copy to its original with no visible movement.
    track.style.transition = 'none';
    if (position === 0) position = count;
    if (position === count + 1) position = 1;
    render();
    moving = false;
  };
  const move = (direction) => {
    if (moving) return;
    moving = true;
    // Commit a previous loop reset before starting another transition.
    void track.offsetWidth;
    track.style.transition = reducedMotion.matches ? 'none' : 'transform 420ms ease-in-out';
    position += direction;
    render();
    announce();
    if (reducedMotion.matches) finish();
    else fallbackTimer = window.setTimeout(finish, 500);
  };
  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') finish();
  });
  controls.querySelectorAll('[data-direction]').forEach((button) => {
    button.addEventListener('click', () => move(Number(button.dataset.direction)));
  });
  controls.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  render();
  announce();
  carousel.classList.add('is-ready');
  controls.hidden = false;
});

// Engineering gallery lightbox. Reuse the existing native-dialog close/Escape
// handling and focus restoration. The original image file is always displayed.
document.querySelectorAll('[data-gallery-image]').forEach((link) => {
  const dialog = document.getElementById('engineering-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const original = link.querySelector('img');
    const enlarged = dialog.querySelector('.engineering-lightbox-image');
    enlarged.src = link.href;
    enlarged.alt = original.alt;
    const caption = link.closest('figure').querySelector('figcaption');
    const enlargedCaption = dialog.querySelector('figcaption');
    enlargedCaption.replaceChildren(...Array.from(caption.childNodes, (node) => node.cloneNode(true)));
    openDialog(dialog, link);
  });
});

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

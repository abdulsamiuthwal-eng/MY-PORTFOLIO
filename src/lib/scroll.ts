// Universal scroll-to-top helper.
// Uses the 2-argument form (window.scrollTo(x, y)) which is supported in every
// browser, unlike `behavior: 'instant'` which throws on older mobile browsers.
export function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/* ================================
   MAIN.JS - Vanilla JavaScript
   ================================ */

(function() {
  // Only run scroll effects on home page
  if (!document.body.classList.contains('home')) {
    console.log('RNK site loaded successfully.');
    return;
  }

  // Get elements
  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');
  const overlay = hero ? hero.querySelector('.overlay') : null;
  const nav = document.querySelector('.nav');

  // Exit if elements don't exist
  if (!header || !hero || !nav) {
    console.log('RNK site loaded successfully.');
    return;
  }

  // Scroll handler
  const handleScroll = () => {
    const heroHeight = header.offsetHeight;
    const yPosition = window.scrollY || window.pageYOffset;

    if (yPosition <= heroHeight) {
      // Calculate effect
      const effectFactor = yPosition / heroHeight;
      const rotation = effectFactor * (Math.PI / 2 - Math.asin((heroHeight - yPosition) / heroHeight));
      
      // Apply 3D rotation to hero
      hero.style.webkitTransform = 'rotateX(' + rotation + 'rad)';
      hero.style.transform = 'rotateX(' + rotation + 'rad)';
      
      // Fade in overlay
      if (overlay) {
        overlay.style.opacity = effectFactor;
      }
    }

    // Sticky nav
    if (yPosition <= heroHeight) {
      nav.classList.remove('fixed');
    } else {
      nav.classList.add('fixed');
    }
  };

  // Add scroll listener with passive flag for performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Run once on load in case page is already scrolled
  handleScroll();

  console.log('RNK site loaded successfully.');
})();
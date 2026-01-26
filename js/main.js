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
})();/* ================================
   BENTO GRID FILTER SYSTEM
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const bentoTiles = document.querySelectorAll('.bento-tile');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');

      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter tiles
      bentoTiles.forEach(tile => {
        const tileCategory = tile.getAttribute('data-category');

        if (filterValue === 'all' || tileCategory === filterValue) {
          // Show tile
          tile.classList.remove('hidden');
        } else {
          // Hide tile
          tile.classList.add('hidden');
        }
      });
    });
  });

  // Optional: Add entrance animations on page load
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50); // Stagger animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Initially hide tiles for entrance animation
  bentoTiles.forEach(tile => {
    tile.style.opacity = '0';
    tile.style.transform = 'translateY(20px)';
    tile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(tile);
  });
});
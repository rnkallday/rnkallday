/* ================================
   HAUNTING PORTRAIT
   Mysterious materialization effect
   ================================ */

(function() {
  const portrait = document.querySelector('.haunting-portrait');
  if (!portrait) return;

  // === CONFIGURATION ===
  const config = {
    // Opacity range (how visible it gets)
    minOpacity: 0.03,
    maxOpacity: 0.15,
    
    // Size range (percentage of viewport)
    minSize: 8,
    maxSize: 90,
    
    // Timing (milliseconds)
    minVisibleTime: 800,
    maxVisibleTime: 4000,
    minHiddenTime: 2000,
    maxHiddenTime: 8000,
    
    // Trigger sensitivity
    scrollThreshold: 50,    // pixels of scroll to potentially trigger
    mouseThreshold: 100,    // pixels of mouse movement to potentially trigger
    triggerChance: 0.3,     // 30% chance to trigger on action
    
    // Behavior
    canInterrupt: true,     // Can new triggers interrupt current animation
  };

  // === STATE ===
  let isVisible = false;
  let isAnimating = false;
  let hideTimeout = null;
  let showTimeout = null;
  let lastScrollY = window.scrollY;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let accumulatedScroll = 0;
  let accumulatedMouse = 0;

  // === HELPERS ===
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomInt = (min, max) => Math.floor(random(min, max + 1));
  const chance = (probability) => Math.random() < probability;

  // === POSITIONS ===
  const getRandomPosition = () => {
    const positions = [
      // Corners
      { top: '5%', left: '5%', transform: 'translate(0, 0)' },
      { top: '5%', right: '5%', transform: 'translate(0, 0)' },
      { bottom: '5%', left: '5%', transform: 'translate(0, 0)' },
      { bottom: '5%', right: '5%', transform: 'translate(0, 0)' },
      // Edges
      { top: '50%', left: '3%', transform: 'translateY(-50%)' },
      { top: '50%', right: '3%', transform: 'translateY(-50%)' },
      { top: '5%', left: '50%', transform: 'translateX(-50%)' },
      { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
      // Center (rare, dramatic)
      { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Random spots
      { top: '20%', left: '15%', transform: 'translate(0, 0)' },
      { top: '30%', right: '10%', transform: 'translate(0, 0)' },
      { bottom: '25%', left: '20%', transform: 'translate(0, 0)' },
      { top: '15%', right: '25%', transform: 'translate(0, 0)' },
    ];
    return positions[randomInt(0, positions.length - 1)];
  };

  // === APPEARANCE STYLES ===
  const getRandomAppearance = () => {
    const size = random(config.minSize, config.maxSize);
    const opacity = random(config.minOpacity, config.maxOpacity);
    
    // Larger = more transparent (ghostly), smaller = can be slightly more visible
    const adjustedOpacity = size > 50 
      ? opacity * 0.5  // Large appearances are more subtle
      : opacity;
    
    // Random fade speed
    const speeds = ['', 'fade-fast', 'fade-slow'];
    const speed = speeds[randomInt(0, speeds.length - 1)];
    
    return { size, opacity: adjustedOpacity, speed };
  };

  // === CLEAR POSITION ===
  const clearPosition = () => {
    portrait.style.top = '';
    portrait.style.bottom = '';
    portrait.style.left = '';
    portrait.style.right = '';
    portrait.style.transform = '';
  };

  // === SHOW PORTRAIT ===
  const show = () => {
    if (isAnimating && !config.canInterrupt) return;
    
    // Clear any pending timeouts
    clearTimeout(hideTimeout);
    clearTimeout(showTimeout);
    
    isAnimating = true;
    
    // Get random position and appearance
    const position = getRandomPosition();
    const appearance = getRandomAppearance();
    
    // Clear previous positioning
    clearPosition();
    
    // Apply new position
    Object.keys(position).forEach(key => {
      if (key !== 'transform') {
        portrait.style[key] = position[key];
      }
    });
    
    // Apply size
    const dimension = appearance.size + 'vw';
    portrait.style.width = dimension;
    portrait.style.height = 'auto';
    
    // Apply fade speed class
    portrait.classList.remove('fade-fast', 'fade-slow');
    if (appearance.speed) {
      portrait.classList.add(appearance.speed);
    }
    
    // Set opacity as CSS variable and show
    portrait.style.setProperty('--haunt-opacity', appearance.opacity);
    portrait.style.transform = position.transform;
    
    // Small delay then show
    requestAnimationFrame(() => {
      portrait.classList.add('is-visible');
      isVisible = true;
    });
    
    // Schedule hide
    const visibleDuration = random(config.minVisibleTime, config.maxVisibleTime);
    hideTimeout = setTimeout(hide, visibleDuration);
  };

  // === HIDE PORTRAIT ===
  const hide = () => {
    portrait.classList.remove('is-visible');
    isVisible = false;
    
    // Wait for transition to complete
    const transitionTime = portrait.classList.contains('fade-slow') ? 4000 
      : portrait.classList.contains('fade-fast') ? 500 
      : 2000;
    
    setTimeout(() => {
      isAnimating = false;
    }, transitionTime);
    
    // Maybe schedule next appearance automatically
    if (chance(0.3)) {
      const hiddenDuration = random(config.minHiddenTime, config.maxHiddenTime);
      showTimeout = setTimeout(show, hiddenDuration);
    }
  };

  // === TRIGGER CHECK ===
  const maybeTrigger = () => {
    if (isVisible && !config.canInterrupt) return;
    
    if (chance(config.triggerChance)) {
      // Random delay so it doesn't feel directly connected
      const delay = random(100, 1500);
      setTimeout(show, delay);
    }
  };

  // === EVENT HANDLERS ===
  const handleScroll = () => {
    const scrollDelta = Math.abs(window.scrollY - lastScrollY);
    accumulatedScroll += scrollDelta;
    lastScrollY = window.scrollY;
    
    if (accumulatedScroll > config.scrollThreshold) {
      accumulatedScroll = 0;
      maybeTrigger();
    }
  };

  const handleMouseMove = (e) => {
    const mouseDelta = Math.sqrt(
      Math.pow(e.clientX - lastMouseX, 2) + 
      Math.pow(e.clientY - lastMouseY, 2)
    );
    accumulatedMouse += mouseDelta;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    if (accumulatedMouse > config.mouseThreshold) {
      accumulatedMouse = 0;
      maybeTrigger();
    }
  };

  // === INITIALIZE ===
  const init = () => {
    // Set up event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initial appearance after landing on page
    setTimeout(() => {
      // First appearance: full page, very subtle
      clearPosition();
      portrait.style.top = '50%';
      portrait.style.left = '50%';
      portrait.style.transform = 'translate(-50%, -50%)';
      portrait.style.width = '80vw';
      portrait.style.setProperty('--haunt-opacity', '0.04');
      portrait.classList.add('fade-slow');
      portrait.classList.add('is-visible');
      isVisible = true;
      isAnimating = true;
      
      // Fade out after a few seconds
      hideTimeout = setTimeout(hide, 3000);
    }, 1500);
  };

  // === START ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
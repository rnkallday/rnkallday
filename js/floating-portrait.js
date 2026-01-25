/* ================================
   HAUNTING PORTRAIT
   Slow, dreamy materialization
   ================================ */

(function() {
  const portrait = document.querySelector('.haunting-portrait');
  if (!portrait) return;

  // === CONFIGURATION (CALMER) ===
  const config = {
    // Opacity range
    minOpacity: 0.03,
    maxOpacity: 0.12,
    
    // Size range (percentage of viewport)
    minSize: 15,
    maxSize: 85,
    
    // Timing - MUCH slower
    minVisibleTime: 3000,    // 3 seconds minimum
    maxVisibleTime: 10000,   // 10 seconds maximum
    minHiddenTime: 6000,     // 6 seconds minimum between appearances
    maxHiddenTime: 20000,    // 20 seconds maximum
    
    // Trigger sensitivity - LESS reactive
    scrollThreshold: 200,    // Need more scroll to trigger
    mouseThreshold: 400,     // Need more mouse movement
    triggerChance: 0.15,     // Only 15% chance on action
    
    // Behavior
    canInterrupt: false,     // Let animations complete
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
      // Corners - subtle
      { top: '10%', left: '5%', transform: 'translate(0, 0)' },
      { top: '10%', right: '5%', transform: 'translate(0, 0)' },
      { bottom: '10%', left: '5%', transform: 'translate(0, 0)' },
      { bottom: '10%', right: '5%', transform: 'translate(0, 0)' },
      // Edges
      { top: '50%', left: '0%', transform: 'translateY(-50%)' },
      { top: '50%', right: '0%', transform: 'translateY(-50%)' },
      // Center - rare and dramatic
      { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      // Off-center
      { top: '30%', left: '20%', transform: 'translate(0, 0)' },
      { top: '40%', right: '15%', transform: 'translate(0, 0)' },
      { bottom: '30%', left: '10%', transform: 'translate(0, 0)' },
    ];
    return positions[randomInt(0, positions.length - 1)];
  };

  // === APPEARANCE STYLES ===
  const getRandomAppearance = () => {
    const size = random(config.minSize, config.maxSize);
    const opacity = random(config.minOpacity, config.maxOpacity);
    
    // Larger = more transparent
    const adjustedOpacity = size > 50 
      ? opacity * 0.4
      : opacity;
    
    // Favor slow fades (no more fast)
    const speed = chance(0.7) ? 'fade-slow' : '';
    
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
    if (isAnimating) return;
    
    clearTimeout(hideTimeout);
    clearTimeout(showTimeout);
    
    isAnimating = true;
    
    const position = getRandomPosition();
    const appearance = getRandomAppearance();
    
    clearPosition();
    
    // Apply position
    Object.keys(position).forEach(key => {
      if (key !== 'transform') {
        portrait.style[key] = position[key];
      }
    });
    
    // Apply size
    portrait.style.width = appearance.size + 'vw';
    portrait.style.height = 'auto';
    
    // Apply fade speed
    portrait.classList.remove('fade-fast', 'fade-slow');
    if (appearance.speed) {
      portrait.classList.add(appearance.speed);
    }
    
    portrait.style.setProperty('--haunt-opacity', appearance.opacity);
    portrait.style.transform = position.transform;
    
    // Gentle fade in
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
    
    // Wait for fade out to complete
    const transitionTime = portrait.classList.contains('fade-slow') ? 5000 : 3000;
    
    setTimeout(() => {
      isAnimating = false;
      
      // Schedule next appearance (always, but with long delay)
      const hiddenDuration = random(config.minHiddenTime, config.maxHiddenTime);
      showTimeout = setTimeout(show, hiddenDuration);
    }, transitionTime);
  };

  // === TRIGGER CHECK ===
  const maybeTrigger = () => {
    if (isAnimating) return;
    
    if (chance(config.triggerChance)) {
      // Long random delay - disconnects action from result
      const delay = random(2000, 5000);
      showTimeout = setTimeout(show, delay);
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Opening: slow, full-page presence
    setTimeout(() => {
      clearPosition();
      portrait.style.top = '50%';
      portrait.style.left = '50%';
      portrait.style.transform = 'translate(-50%, -50%)';
      portrait.style.width = '70vw';
      portrait.style.setProperty('--haunt-opacity', '0.035');
      portrait.classList.add('fade-slow');
      portrait.classList.add('is-visible');
      isVisible = true;
      isAnimating = true;
      
      // Slow fade out
      hideTimeout = setTimeout(hide, 6000);
    }, 2500);
  };

  // === START ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
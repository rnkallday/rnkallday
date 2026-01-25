/* ================================
   HAUNTING PORTRAIT
   Autonomous deep sighs
   ================================ */

(function() {
  const portrait = document.querySelector('.haunting-portrait');
  if (!portrait) return;

  // === CONFIGURATION ===
  const config = {
    // Opacity range
    minOpacity: 0.025,
    maxOpacity: 0.09,
    
    // Size range (percentage of viewport)
    minSize: 20,
    maxSize: 80,
    
    // Breathing rhythm (milliseconds)
    minVisibleTime: 8000,     // 8 seconds minimum visible
    maxVisibleTime: 18000,    // 18 seconds maximum visible
    minRestTime: 12000,       // 12 seconds minimum rest
    maxRestTime: 30000,       // 30 seconds maximum rest
  };

  // === HELPERS ===
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomInt = (min, max) => Math.floor(random(min, max + 1));

  // === POSITIONS ===
  const positions = [
    { top: '10%', left: '5%' },
    { top: '10%', right: '5%' },
    { bottom: '15%', left: '5%' },
    { bottom: '15%', right: '5%' },
    { top: '50%', left: '0%', transform: 'translateY(-50%)' },
    { top: '50%', right: '0%', transform: 'translateY(-50%)' },
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '25%', left: '15%' },
    { top: '35%', right: '10%' },
    { bottom: '25%', left: '10%' },
    { bottom: '30%', right: '15%' },
  ];

  let lastPositionIndex = -1;

  // === GET RANDOM POSITION (avoid repeating) ===
  const getRandomPosition = () => {
    let index;
    do {
      index = randomInt(0, positions.length - 1);
    } while (index === lastPositionIndex && positions.length > 1);
    lastPositionIndex = index;
    return positions[index];
  };

  // === CLEAR STYLES ===
  const clearPosition = () => {
    portrait.style.top = '';
    portrait.style.bottom = '';
    portrait.style.left = '';
    portrait.style.right = '';
    portrait.style.transform = '';
  };

  // === THE BREATHING CYCLE ===
  const breathe = () => {
    // Pick random appearance
    const position = getRandomPosition();
    const size = random(config.minSize, config.maxSize);
    const opacity = random(config.minOpacity, config.maxOpacity);
    
    // Larger appearances are more ghostly
    const adjustedOpacity = size > 50 ? opacity * 0.5 : opacity;
    
    // Clear and apply new position
    clearPosition();
    Object.keys(position).forEach(key => {
      portrait.style[key] = position[key];
    });
    
    // Apply size
    portrait.style.width = size + 'vw';
    portrait.style.height = 'auto';
    
    // Set opacity
    portrait.style.setProperty('--haunt-opacity', adjustedOpacity);
    
    // Inhale (fade in)
    requestAnimationFrame(() => {
      portrait.classList.add('is-visible');
    });
    
    // Hold breath, then exhale
    const visibleDuration = random(config.minVisibleTime, config.maxVisibleTime);
    
    setTimeout(() => {
      // Exhale (fade out)
      portrait.classList.remove('is-visible');
      
      // Rest, then breathe again
      const restDuration = random(config.minRestTime, config.maxRestTime);
      setTimeout(breathe, restDuration);
      
    }, visibleDuration);
  };

  // === INITIALIZE ===
  const init = () => {
    // First breath after a gentle pause
    setTimeout(breathe, 3000);
  };

  // === START ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
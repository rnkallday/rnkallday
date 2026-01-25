/* ================================
   FLOATING PORTRAIT - Mouse Interaction
   ================================ */

(function() {
  const portrait = document.querySelector('.floating-portrait');
  
  if (!portrait) return;
  
  // Configuration
  const config = {
    moveStrength: 60,      // How much it moves with mouse (pixels)
    scaleRange: 1,      // Scale variation (0.08 = 8%)
    smoothing: 0.5,        // Movement smoothing (lower = smoother)
    baseOpacity: 0.01,
    hoverOpacity: 0.1
  };
  
  // State
  let targetX = 0;
  let targetY = 0;
  let targetScale = 1;
  let currentX = 0;
  let currentY = 0;
  let currentScale = 1;
  let animationId = null;
  
  // Get center of viewport
  const getCenter = () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  
  // Mouse move handler
  const handleMouseMove = (e) => {
    const center = getCenter();
    
    // Calculate distance from center (normalized -1 to 1)
    const normalizedX = (e.clientX - center.x) / center.x;
    const normalizedY = (e.clientY - center.y) / center.y;
    
    // Set targets (portrait moves OPPOSITE to mouse for parallax feel)
    targetX = -normalizedX * config.moveStrength;
    targetY = -normalizedY * config.moveStrength;
    
    // Scale based on mouse distance from center
    const distance = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
    targetScale = 1 + (distance * config.scaleRange);
  };
  
  // Animation loop for smooth movement
  const animate = () => {
    // Lerp (linear interpolation) for smooth movement
    currentX += (targetX - currentX) * config.smoothing;
    currentY += (targetY - currentY) * config.smoothing;
    currentScale += (targetScale - currentScale) * config.smoothing;
    
    // Apply transform (combine with existing float animation)
    portrait.style.transform = `
      translateY(-50%) 
      translate(${currentX}px, ${currentY}px) 
      scale(${currentScale})
    `;
    
    animationId = requestAnimationFrame(animate);
  };
  
  // Reset when mouse leaves window
  const handleMouseLeave = () => {
    targetX = 0;
    targetY = 0;
    targetScale = 1;
  };
  
  // Start everything
  const init = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animate();
  };
  
  // Clean up
  const destroy = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    if (animationId) cancelAnimationFrame(animationId);
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Cleanup on page unload
  window.addEventListener('unload', destroy);
})();
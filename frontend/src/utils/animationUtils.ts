/**
 * Triggers a flying animation from a starting mouse event or element
 * to the floating cart button in the UI.
 */
export function triggerFlyToCart(
  startInput: React.MouseEvent | HTMLElement | { x: number; y: number },
  imageUrl?: string
) {
  // 1. Find the target element (floating cart button)
  // We look for the active .floating-cart-target (with width > 0)
  const targetEl = Array.from(document.querySelectorAll('.floating-cart-target'))
    .find(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) as HTMLElement | undefined;

  if (!targetEl) {
    return; // Cart isn't visible yet or not in DOM
  }

  const targetRect = targetEl.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // 2. Determine start coordinates
  let startX = 0;
  let startY = 0;

  if (startInput instanceof HTMLElement) {
    const startRect = startInput.getBoundingClientRect();
    startX = startRect.left + startRect.width / 2;
    startY = startRect.top + startRect.height / 2;
  } else if (startInput && typeof startInput === 'object' && 'clientX' in startInput) {
    const ev = startInput as any;
    startX = ev.clientX;
    startY = ev.clientY;
  } else if (startInput && typeof startInput === 'object' && 'x' in startInput && 'y' in startInput) {
    const coords = startInput as any;
    startX = coords.x;
    startY = coords.y;
  }

  // 3. Create the flying particle
  const particle = document.createElement('div');
  particle.className = 'fixed z-[9999] pointer-events-none rounded-full overflow-hidden border-2 border-gold shadow-lg w-10 h-10 bg-paper animate-fly';
  
  // Set position exactly at starting point centered (shift left/top by half width/height)
  particle.style.left = `${startX - 20}px`;
  particle.style.top = `${startY - 20}px`;

  // Calculate translation delta
  const tx = targetX - startX;
  const ty = targetY - startY;

  // Apply CSS variables for the keyframe animation
  particle.style.setProperty('--tx', `${tx}px`);
  particle.style.setProperty('--ty', `${ty}px`);

  // Insert image or fallback icon
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'w-full h-full object-cover';
    particle.appendChild(img);
  } else {
    const dot = document.createElement('div');
    dot.className = 'w-full h-full bg-wine flex items-center justify-center text-paper font-bold text-xs';
    dot.innerText = '🍽️';
    particle.appendChild(dot);
  }

  // 4. Append to body and remove on animation finish
  document.body.appendChild(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
    
    // Add a quick pulse effect to the target element
    targetEl.classList.remove('animate-pop');
    void targetEl.offsetWidth; // Trigger reflow to restart animation
    targetEl.classList.add('animate-pop');
  });
}

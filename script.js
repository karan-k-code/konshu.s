document.getElementById("year").textContent = new Date().getFullYear();

// Carousel Scroll Handlers with Premium Cumulative Inertia & Custom Easing
const carousel = document.getElementById("projects-carousel");
const leftBtn = document.getElementById("scroll-left-btn");
const rightBtn = document.getElementById("scroll-right-btn");

if (carousel && leftBtn && rightBtn) {
  const scrollAmount = 342; // Card width (310) + Gap (32)
  let scrollTarget = carousel.scrollLeft;
  let animationFrameId = null;

  // Custom cubic-bezier EaseOutQuart curve (starts fast, decelerates beautifully)
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const performScroll = (target, duration = 700) => {
    const start = carousel.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      carousel.scrollLeft = start + change * easedProgress;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    };

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
  };

  // Keep target synced if user manually swipes on trackpad or mobile
  carousel.addEventListener(
    "scroll",
    () => {
      if (!animationFrameId) {
        scrollTarget = carousel.scrollLeft;
      }
    },
    { passive: true },
  );

  leftBtn.addEventListener("click", () => {
    // Calculate max scroll space dynamically
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    scrollTarget = Math.max(0, scrollTarget - scrollAmount);
    performScroll(scrollTarget);
  });

  rightBtn.addEventListener("click", () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    scrollTarget = Math.min(maxScroll, scrollTarget + scrollAmount);
    performScroll(scrollTarget);
  });
}

// Mouse Spotlight Hover Effect with Premium LERP (Linear Interpolation)
document.querySelectorAll(".card_web").forEach((card) => {
  let rect = card.getBoundingClientRect();
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;
  let animationFrameId = null;

  // Cache rect on scroll and resize to avoid layout thrashing during hover animations
  const updateRect = () => {
    rect = card.getBoundingClientRect();
  };
  window.addEventListener("resize", updateRect);
  window.addEventListener("scroll", updateRect, { passive: true });

  const updateSpotlight = () => {
    if (!isHovering) return;

    // 0.08 interpolation factor creates a super smooth, organic trailing glow
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    card.style.setProperty("--mouse-x", `${currentX}px`);
    card.style.setProperty("--mouse-y", `${currentY}px`);

    animationFrameId = requestAnimationFrame(updateSpotlight);
  };

  card.addEventListener("mouseenter", (e) => {
    isHovering = true;
    rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Initialize current position to entry point immediately so glow doesn't slide from origin (0,0)
    currentX = x;
    currentY = y;
    targetX = x;
    targetY = y;

    card.style.setProperty("--mouse-x", `${currentX}px`);
    card.style.setProperty("--mouse-y", `${currentY}px`);

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updateSpotlight);
  });

  card.addEventListener("mousemove", (e) => {
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  card.addEventListener("mouseleave", () => {
    isHovering = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });
});

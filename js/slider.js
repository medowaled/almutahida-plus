/**
 * المتحدة بلس - Al-Mutahida Plus
 * محرك السلايدر التفاعلي التلقائي وحركات التمرير
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
});

function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.arrow-btn.prev');
  const nextBtn = document.querySelector('.arrow-btn.next');
  const progressBar = document.querySelector('.slider-progress');

  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval = null;
  const slideDuration = 3000; // 3 ثوانٍ لكل شريحة لتنقل أسرع وأكثر حيوية
  let progressInterval = null;
  let progress = 0;

  // إنشاء مؤشرات النقاط (Dots)
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', idx);
      dot.setAttribute('aria-label', `الانتقال إلى الشريحة ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  function updateSlider(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = index;
    resetProgress();
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function goToSlide(index) {
    updateSlider(index);
  }

  function resetProgress() {
    progress = 0;
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  function startProgress() {
    clearInterval(progressInterval);
    const stepTime = 50;
    const totalSteps = slideDuration / stepTime;

    progressInterval = setInterval(() => {
      progress += 100 / totalSteps;
      if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, stepTime);
  }

  function startAutoSlide() {
    clearInterval(slideInterval);
    startProgress();
    slideInterval = setInterval(() => {
      nextSlide();
      startProgress();
    }, slideDuration);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
    clearInterval(progressInterval);
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // أحداث أزرار التنقل
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // إيقاف التشغيل التلقائي عند مرور الماوس
  slider.addEventListener('mouseenter', () => {
    stopAutoSlide();
  });

  slider.addEventListener('mouseleave', () => {
    startAutoSlide();
  });

  // دعم السحب والإيماءات للموبايل (Touch Gestures)
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // سحب لليسار
        nextSlide();
      } else {
        // سحب لليمين
        prevSlide();
      }
    }
  }

  // بدء تشغيل السلايدر
  updateSlider(0);
  startAutoSlide();
}

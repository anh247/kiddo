 document.addEventListener("DOMContentLoaded", function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    if (slides.length === 0) {
      console.error("No slides found");
      return;
    }

    // Function to change slide
    function changeSlide(direction) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + direction + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Initialize the first slide as active
    slides[currentSlide].classList.add('active');

    // Add event listeners for next/prev buttons
    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));
  });
let currentSlide = 0;
let startX = 0; // Vị trí bắt đầu chạm
let isSwiping = false; // Trạng thái khi đang lướt

function changeSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  // Tính toán slide hiện tại
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

  // Di chuyển slider-wrapper để hiển thị slide hiện tại
  const sliderWrapper = document.querySelector('.slider-wrapper');
  sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function autoSlide() {
  changeSlide(1); // Chuyển sang slide tiếp theo
}

// Tự động chuyển ảnh mỗi 5 giây (5000ms)
setInterval(autoSlide, 5000);

// Thêm sự kiện để hỗ trợ lướt ảnh (swipe)
const sliderWrapper = document.querySelector('.slider-wrapper');
sliderWrapper.addEventListener('touchstart', function(e) {
  startX = e.touches[0].clientX; // Lưu vị trí khi bắt đầu chạm
  isSwiping = true;
});

sliderWrapper.addEventListener('touchmove', function(e) {
  if (!isSwiping) return;
  const currentX = e.touches[0].clientX;
  const difference = startX - currentX;

  if (Math.abs(difference) > 50) { // Độ dài tối thiểu để lướt
    if (difference > 0) {
      changeSlide(1); // Lướt sang phải
    } else {
      changeSlide(-1); // Lướt sang trái
    }
    isSwiping = false; // Ngừng lướt sau khi chuyển slide
  }
});

sliderWrapper.addEventListener('touchend', function() {
  isSwiping = false; // Kết thúc lướt
});

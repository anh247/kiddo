
    let slides = document.querySelectorAll('.slide-show_text');
    let badges = document.querySelectorAll('.badge');

    function showSlide(index) {
        // In ra chỉ số slide đang được hiển thị
        console.log('Showing slide index:', index);
        
        // Ẩn tất cả các slide và loại bỏ màu cam của tất cả các chấm
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        badges.forEach(badge => {
            badge.classList.remove('active');
        });

        // Hiển thị slide tương ứng và thêm màu cam vào chấm tương ứng
        slides[index].classList.add('active');
        badges[index].classList.add('active');
    }

    // Thêm sự kiện lắng nghe cho mỗi badge
    badges.forEach((badge, index) => {
        badge.addEventListener('click', () => {
            console.log('Badge clicked:', index);
            showSlide(index);
        });
    });

    // Hiển thị slide đầu tiên khi tải trang
    showSlide(0);
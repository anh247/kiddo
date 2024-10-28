document.addEventListener('DOMContentLoaded', function() {
    const countdownElements = document.querySelectorAll('.js-text-countdown');

    countdownElements.forEach(countdown => {
        // Lấy giá trị từ data-attributes
        let days = parseInt(countdown.dataset.days) || 0;
        let hrs = parseInt(countdown.dataset.hrs) || 0;
        let mins = parseInt(countdown.dataset.mins) || 0;
        let secs = parseInt(countdown.dataset.secs) || 0;

        // Chuyển đổi tất cả thời gian về giây
        let totalSeconds = (days * 24 * 60 * 60) + (hrs * 60 * 60) + (mins * 60) + secs;

        const updateCountdown = () => {
            if (totalSeconds > 0) {
                // Tính toán thời gian còn lại
                days = Math.floor(totalSeconds / (24 * 60 * 60));
                hrs = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
                mins = Math.floor((totalSeconds % (60 * 60)) / 60);
                secs = totalSeconds % 60;

                // Cập nhật hiển thị
                countdown.querySelector('[data-js-text-countdown-counter]').innerText = `${days} ${countdown.dataset.daysText}, ${hrs} ${countdown.dataset.hrsText}, ${mins} ${countdown.dataset.minsText}, ${secs} ${countdown.dataset.secsText}`;
                
                totalSeconds--; // Giảm tổng số giây
            } else {
                // Khi thời gian kết thúc
                countdown.querySelector('[data-js-text-countdown-counter]').innerText = countdown.dataset.timeoutText || "Time's up!";
                clearInterval(countdownInterval); // Dừng bộ đếm
            }
        };

        // Gọi hàm updateCountdown lần đầu để hiển thị giá trị ngay lập tức
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000); // Cập nhật mỗi giây
    });
});
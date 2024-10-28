
  // Đặt ngày chúng ta đang đếm ngược
  var countDownDate = new Date("Dec 31, 2024 23:59:59").getTime();

  // Cập nhật đếm ngược cứ sau 1 giây
  var countdownFunction = setInterval(function () {

    // Nhận ngày và giờ hôm nay
    var now = new Date().getTime();

    // Tìm khoảng cách từ bây giờ đến ngày đếm ngược
    var distance = countDownDate - now;

    // Tính thời gian theo ngày, giờ, phút, giây
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));//1000 * 60 * 60 * 24 bằng 86,400,000 (số mili giây trong một ngày).
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Xuất kết quả trong các phần tử HTML tương ứng
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

    // Nếu đếm ngược kết thúc, hiển thị thông báo
    if (distance < 0) {
      clearInterval(countdownFunction);
      document.querySelector(".countdown").innerHTML = "EXPIRED";
    }// 1s có 1000ms,1p có 60s , 1h có 60p , 1 ngày có 24h
  }, 1000);

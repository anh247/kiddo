
  let available = 18; // Số sản phẩm còn lại
  let sold = 20;      // Số sản phẩm đã bán
  let total = available + sold;

  document.getElementById('available').innerText = available;
  document.getElementById('sold').innerText = sold;

  function updateProgressBar() {
    let progressBar = document.getElementById('progressBar');
    let soldPercentage = (sold / total) * 100;
    progressBar.style.width = soldPercentage + "%";
  }

  // Gọi hàm để cập nhật thanh tiến trình
  updateProgressBar();
  // Giả lập bán thêm sản phẩm sau 3 giây
  setTimeout(() => {
    sold += 5; // Bán thêm 5 sản phẩm
    available -= 5; // Số lượng còn lại giảm
    document.getElementById('available').innerText = available;
    document.getElementById('sold').innerText = sold;
    updateProgressBar(); // Cập nhật lại thanh tiến trình
  }, 3000); // Sau 3 giây

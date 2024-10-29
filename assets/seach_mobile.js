document.addEventListener("DOMContentLoaded", function() {
  // Chọn nút đóng bằng aria-label
  const closeButton = document.querySelector('button[aria-label="Close"]');

  closeButton.addEventListener("click", function() {
    // Tìm các phần tử modal có class `search-modal__content` hoặc các class khác được chỉ định
    const modals = document.querySelectorAll(".search-modal__content, .search-modal.modal__content.gradient");

    // Ẩn từng modal bằng cách thêm class hoặc thay đổi style
    modals.forEach(modal => {
      modal.classList.add("hidden"); // Hoặc dùng modal.style.display = "none";
    });
  });
});

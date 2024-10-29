document.addEventListener("DOMContentLoaded", function() {
  // Chọn nút đóng bằng aria-label
  const closeButton = document.querySelector('button[aria-label="Close"]');

  closeButton.addEventListener("click", function() {
    // Tìm tất cả các phần tử modals có class `search-modal`, `modal__content`, và `gradient`
    const modals = document.querySelectorAll(".search-modal.modal__content.gradient");
    modals.forEach(modal => {
      modal.style.display = "none"; // Ẩn các modals
    });
  });
});

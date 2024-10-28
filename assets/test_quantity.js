document.addEventListener('DOMContentLoaded', function () {
  // Lấy các phần tử
  const minusButton = document.querySelector('.quantity__button[name="minus"]');
  const plusButton = document.querySelector('.quantity__button[name="plus"]');
  const quantityInput = document.querySelector('.quantity__input');

  // Lấy giá trị tối thiểu và bước từ thuộc tính của input
  const minQuantity = parseInt(quantityInput.getAttribute('data-min')) || 1;
  const step = parseInt(quantityInput.getAttribute('step')) || 1;

  // Hàm cập nhật số lượng
  function updateQuantity(amount) {
    let currentQuantity = parseInt(quantityInput.value) || 0;
    let newQuantity = currentQuantity + amount;

    // Đảm bảo số lượng không nhỏ hơn giá trị tối thiểu
    if (newQuantity < minQuantity) {
      newQuantity = minQuantity;
    }

    quantityInput.value = newQuantity;
  }

  // Gắn sự kiện cho nút giảm
  minusButton.addEventListener('click', function (e) {
    e.preventDefault();
    updateQuantity(-step); // Giảm số lượng
  });

  // Gắn sự kiện cho nút tăng
  plusButton.addEventListener('click', function (e) {
    e.preventDefault();
    updateQuantity(step); // Tăng số lượng
  });
});


     document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử cần sử dụng
    const decreaseBtn = document.querySelector(".quantity-btn.decrease");
    const increaseBtn = document.querySelector(".quantity-btn.increase");
    const quantityElement = document.getElementById("quantity");
    const cartCountElement = document.querySelector(".cart-count-bubble span");
    const addToCartBtn = document.querySelector(".btn-add");

    let quantity = parseInt(quantityElement.textContent); // Lấy số lượng hiện tại
    let cartCount = parseInt(cartCountElement.textContent); // Lấy số lượng giỏ hàng hiện tại

    // Hàm cập nhật số lượng
    function updateQuantity(newQuantity) {
        if (newQuantity > 0) {
            quantity = newQuantity;
            quantityElement.textContent = quantity;
        }
    }

    // Giảm số lượng khi bấm nút decrease
    decreaseBtn.addEventListener("click", function () {
        if (quantity > 1) {
            updateQuantity(quantity - 1);
        }
    });

    // Tăng số lượng khi bấm nút increase
    increaseBtn.addEventListener("click", function () {
        updateQuantity(quantity + 1);
    });

    // Tạo thông báo
    function showNotification(message) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;

        // Thêm thông báo vào body
        document.body.appendChild(notification);

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(function () {
            notification.remove();
        }, 3000);
    }

    // Thêm sản phẩm vào giỏ hàng khi nhấn nút Add To Cart
    addToCartBtn.addEventListener("click", function () {
        // Tăng số lượng sản phẩm trong giỏ hàng
        cartCount += quantity;
        cartCountElement.textContent = cartCount;
        // Cập nhật nội dung "visually-hidden" cho người dùng màn hình đọc
        cartCountElement.nextElementSibling.textContent = `${cartCount} items`;

        // Hiển thị thông báo thêm thành công
        showNotification("Thêm sản phẩm vào giỏ hàng thành công!");
    });
});



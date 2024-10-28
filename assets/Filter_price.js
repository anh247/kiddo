
  function updatePrice(value) {
    // Cập nhật hiển thị giá trị của priceValue
    document.getElementById('priceValue').innerText = value;

    // Lấy tất cả các sản phẩm từ danh sách
    let products = document.querySelectorAll('.card_items-products');

    products.forEach(function (product) {
        // Lấy giá discounted-price của sản phẩm
        let discountedPriceElement = product.querySelector('.discounted-price');
        if (discountedPriceElement) {
            // Chuyển giá trị của giá thành số
            let discountedPrice = parseFloat(discountedPriceElement.innerText.replace('$', ''));

            // So sánh với giá trị priceValue
            if (discountedPrice <= parseFloat(value)) {
                // Hiển thị sản phẩm nếu giá phù hợp
                product.style.display = 'block';
            } else {
                // Ẩn sản phẩm nếu giá không phù hợp
                product.style.display = 'none';
            }
        }
    });
}

// Gọi hàm updatePrice khi kéo thanh trượt
document.getElementById('priceRange').addEventListener('input', function () {
    updatePrice(this.value);
});


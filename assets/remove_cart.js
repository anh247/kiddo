document.addEventListener('DOMContentLoaded', function () {
    // Tìm nút Remove theo ID
    const removeButton = document.getElementById('Remove-1');
    
    // Kiểm tra nếu nút tồn tại
    if (removeButton) {
        removeButton.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của nút
            
            // Tìm phần tử tbody chứa cart-item
            const cartItem = document.getElementById('CartItem-1');
            const tbody = cartItem.closest('tbody'); // Lấy tbody cha
            
            if (tbody) {
                tbody.remove(); // Xóa tbody
            }
        });
    }
});

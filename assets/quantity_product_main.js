// Lấy các phần tử cần thiết
        const decreaseBtn = document.querySelector('.decrease');
        const increaseBtn = document.querySelector('.increase');
        const quantityDisplay = document.getElementById('quantity');

        let quantity = 1; // Giá trị ban đầu

        // Xử lý khi nhấn nút giảm
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) { // Đảm bảo không giảm dưới 1
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

        // Xử lý khi nhấn nút tăng
        increaseBtn.addEventListener('click', () => {
            quantity++;
            quantityDisplay.textContent = quantity;
        });

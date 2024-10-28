

    const range = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    function updatePrice(value) {
      priceValue.textContent = value;

      // Cập nhật màu của thanh trượt
      const min = range.min;
      const max = range.max;
      const percentage = ((value - min) / (max - min)) * 100;
      range.style.background = `linear-gradient(to right, blueviolet ${percentage}%, #e4e4e4 ${percentage}%)`;
    }

    // Gọi hàm để áp dụng màu cho giá trị mặc định ban đầu
    updatePrice(range.value);

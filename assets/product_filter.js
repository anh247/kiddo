
// Lấy các sản phẩm
const productsContainer = document.querySelector('.items-products');
const products = Array.from(productsContainer.getElementsByClassName('card_items-products'));

// Hàm sắp xếp theo tên sản phẩm
function sortByTitle(order) {
  const sortedProducts = products.sort((a, b) => {
    const titleA = a.querySelector('.infor-card_items-products h2').textContent.trim().toLowerCase();
    const titleB = b.querySelector('.infor-card_items-products h2').textContent.trim().toLowerCase();
    
    if (order === 'A-Z') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
  
  updateProductList(sortedProducts);
}

// Hàm sắp xếp theo giá
function sortByPrice(order) {
  const sortedProducts = products.sort((a, b) => {
    const priceA = parseFloat(a.querySelector('.discounted-price').textContent.replace('$', ''));
    const priceB = parseFloat(b.querySelector('.discounted-price').textContent.replace('$', ''));
    
    if (order === 'low-to-high') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
  
  updateProductList(sortedProducts);
}

// Hàm cập nhật danh sách sản phẩm sau khi sắp xếp
function updateProductList(sortedProducts) {
  // Xóa hết các sản phẩm hiện tại
  productsContainer.innerHTML = '';
  
  // Thêm lại các sản phẩm đã sắp xếp
  sortedProducts.forEach(product => productsContainer.appendChild(product));
}

// Thêm sự kiện lắng nghe cho ô chọn lọc
const sortBySelect = document.getElementById('SortBy');
sortBySelect.addEventListener('change', function() {
  const selectedOption = this.value;
  
  switch (selectedOption) {
    case 'title-ascending':
      sortByTitle('A-Z');
      break;
    case 'title-descending':
      sortByTitle('Z-A');
      break;
    case 'price-ascending':
      sortByPrice('low-to-high');
      break;
    case 'price-descending':
      sortByPrice('high-to-low');
      break;
    default:
      break;
  }
});

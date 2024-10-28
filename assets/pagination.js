
    // Hiển thị trang đầu tiên khi trang được tải
    document.addEventListener('DOMContentLoaded', function () {
      // Kiểm tra xem phần tử trang đầu tiên có tồn tại không
      const firstPage = document.getElementById('items-page-1');
      const firstPagination = document.querySelector('.pagination[data-page="1"]');

      if (firstPage) {
        firstPage.style.display = 'grid'; // Hiển thị trang đầu tiên
        console.log('Trang đầu tiên được hiển thị.');
      } else {
        console.error('Trang đầu tiên không tồn tại.');
      }

      if (firstPagination) {
        firstPagination.classList.add('active'); // Kích hoạt nút phân trang đầu tiên
        console.log('Nút trang đầu tiên được kích hoạt.');
      } else {
        console.error('Nút trang đầu tiên không tồn tại.');
      }
    });

    // Xử lý sự kiện khi nhấn vào nút phân trang
    document.querySelectorAll('.pagination').forEach(button => {
      button.addEventListener('click', function () {
        // Lấy số trang hiện tại
        const page = this.getAttribute('data-page');

        // Ẩn tất cả các trang sản phẩm
        document.querySelectorAll('.items-products').forEach(itemsPage => {
          itemsPage.style.display = 'none'; // Ẩn toàn bộ các phần tử có class 'items-products'
        });

        // Hiển thị trang tương ứng
        const currentPage = document.getElementById(`items-page-${page}`);
        if (currentPage) {
          currentPage.style.display = 'grid'; // Hiển thị trang mới
          console.log(`Trang ${page} được hiển thị.`);
        } else {
          console.error(`Trang ${page} không tồn tại.`);
        }

        // Bỏ class 'active' ở tất cả các nút phân trang
        document.querySelectorAll('.pagination').forEach(paginationButton => {
          paginationButton.classList.remove('active');
        });

        // Thêm class 'active' cho nút phân trang hiện tại
        this.classList.add('active');
      });
    });

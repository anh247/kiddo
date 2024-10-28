  // Lấy tất cả các thẻ li
  const listItems = document.querySelectorAll('.list_infor li');

  // Thêm sự kiện click cho mỗi li
  listItems.forEach(item => {
    item.addEventListener('click', function () {
      // Xóa class 'selected' khỏi tất cả các li khác
      listItems.forEach(li => li.classList.remove('selected'));

      // Thêm class 'selected' cho li được click
      this.classList.add('selected');
    });
  });
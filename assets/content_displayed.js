
 $('.shop-dropdown').on('click', '.shop-dropdown__btn-toggle', function () {
   if ($(this).hasClass('shop-dropdown--opened')) {
     $(this).removeClass('shop-dropdown--opened');
     $(this).find('i').removeClass('bx-minus').addClass('bx-plus'); // Thay đổi icon
     $(this).closest('.shop-dropdown').find('.shop-dropdown__content').hide(300); // Ẩn nội dung
   } else {
     $(this).addClass('shop-dropdown--opened');
     $(this).find('i').removeClass('bx-plus').addClass('bx-minus'); // Thay đổi icon
     $(this).closest('.shop-dropdown').find('.shop-dropdown__content').show(300); // Hiện nội dung
   }
});



        //zoom soi ảnh ở trang products 
        $('.products-img-thumb img').each(function () {
            $(this).on('click', function () {
            })
        });

        $('.products-img-thumb').on('click', 'img', function () {
            if ($(this).data('thumnail')) {
                let img = $(this).closest('.products-img').find('.products-image img');
                if (img.length) {
                    img.attr('src', $(this).data('thumnail'));
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    let parent = $(this).closest('.products-img').find('.products-image__inner');
                    parent.trigger('zoom.destroy'); // remove zoom
                    setTimeout(() => {
                        parent.zoom();
                    }, 100);
                }
            }
        })

        if ($('.products-image__inner').length) {
            $('.products-image__inner').zoom();
        }

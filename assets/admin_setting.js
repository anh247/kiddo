var shopifySelector = '#shopify-section-';

$(document).on('shopify:section:load', function(event){
    var sectionId       = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);
    $shopifySection.find(".grid-slider").not('.exception').each(function() {
        $(this).gridSlider();
    });
});

$(document).on('shopify:section:unload', function(event){
    var sectionId       = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);
    $shopifySection.find(".grid-slider").not('.exception').each(function() {
        $(this).gridSlider();
    });
});


$(document).on('shopify:section:select', function(event) {
    var sectionId       = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);
    if ($shopifySection.hasClass('section-header')) {
        $('.box-header-vertical').addClass('open');
    }
    if ($shopifySection.hasClass('section-mobile-menu-bottom')){
        $('.mobile-menu-bottom').addClass('show');
    }
    if ( $shopifySection.hasClass('type_promotion_popup') ) {
        alzShopify.PromotionPopup(true);
    }
});

$(document).on('shopify:section:deselect', function(event) {
    var sectionId  = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);
    if ($shopifySection.hasClass('section-header')) {
        $('.box-header-vertical').removeClass('open');
    }
    if ($shopifySection.hasClass('section-mobile-menu-bottom')){
        $('.mobile-menu-bottom').removeClass('show');
    }
});

$(document).on('shopify:block:select', function(event){
    var sectionId = event.detail.sectionId,
        blockId   = event.detail.blockId,
        $shopifySection = $(shopifySelector + sectionId);

    if ($shopifySection.hasClass('section-slideshow')) {
        var slideIndex = $('#b_' + blockId).closest('.js_image_slide').attr("data-slick-index");
        $shopifySection.find('.js_carousel').slick("slickGoTo", parseInt(slideIndex));
    }
    if ($shopifySection.hasClass('section-header')) {
        var bkjs = $('#bkjs_'+blockId);
        var li = bkjs.length ? $('.menu-item-has-children#item_' + bkjs.attr("data-id")) : $('.menu-item-has-children#item_' + blockId);
        $('.section-header .menu-item').removeClass('menu_item_hover');
        li.addClass('menu_item_hover');

        $('.lazy_menu_mega').one('lazyincluded', function(e) {

        });
    }
});

$(document).on('shopify:block:deselect', function(event){
    var sectionId = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);

    if ($shopifySection.hasClass('section-header')) {
        $('.section-header .menu-item').removeClass('menu_item_hover');
    }
});

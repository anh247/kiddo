
"use strict";
var Shopify   = window.Shopify || {},
    alzShopify= window.alzShopify || {},
    alzThemes = window.alzThemes || {},
    theme     = window.theme || {},
    $html     = $('html'),
    $body     = $html.find('body'),
    cms_js    = $html.find('#cms_js'),
    mobileScreen = 768,
    fetchConfig = window.fetchConfig || function(type = 'json') {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
        };
    };

alzThemes.apply = function () {
};
alzThemes.xLoader = function (classes='start loading') {
    $(document).on('startLoading', function(){
        $('html').addClass(classes);
    });
    $(document).on('endLoading', function(){
        $('html').addClass('end');
        setTimeout(function(){
            $('html').removeClass(classes + ' end');
        }, 1000)
    });
}();
$(window).on('load resize', function () {
    if($(window).width() < mobileScreen){
        $html.removeClass('contentDesktopMode').addClass('contentMobileMode');
        $('body').trigger('contentMobileMode');
    } else {
        $html.removeClass('contentMobileMode').addClass('contentDesktopMode');
        $('body').trigger('contentDesktopMode');
    }
});
/**
 * Init components inside of dynamically updated elements
 */
$('body').on('contentUpdated', function () {
    if (alzThemes) {
        alzThemes.apply();
    }
});
alzThemes.getProductLazy = function (handle, style, ratio, order) {
    if(!style) style = '1';
    if(!ratio) ratio = '0';
    if(!order) order = '0';
    return '<div data-lazy-product-load class="productLazyload lazyload" data-include="' + Shopify.routes.root + 'products/' + handle + '/?view=pr_lazy_load&product_style=' + style + '&aspect_ratio=' + ratio + '&animation_order=' + order + '"></div>'
};
alzThemes.ProductReview = function ($product=false) {
    if(!window.SPR) return false;
    if($product){
        if(!window.alzShopify.badges){
              window.alzShopify.badges = {};
        }
        var review = $product.find('.shopify-product-reviews-badge');
        if(review.length && review.data('id')){
            var productId = review.data('id');
            if(window.alzShopify.badges[productId]){
                  review.parent().html(window.alzShopify.badges[productId]);
                  return false;
            }
            $.ajax({
                url: '//productreviews.shopifycdn.com/proxy/v4/reviews/badges',
                type: 'GET',
                data: {
                    shop : Shopify.shop,
                    product_ids : [productId]
                },
                dataType: 'jsonp',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    window.alzShopify.badges = $.extend({}, window.alzShopify.badges, data.badges);
                    review.parent().html(data.badges[productId]);
                }
            });
        }
    } else {
        SPR.registerCallbacks();
        SPR.initRatingHandler();
        SPR.initDomEls();
     /* SPR.loadProducts(); */
        SPR.loadBadges();
    }
};
alzThemes.SwitchRTL = function () {
    $('.switch-rtl').click(function() {
        if($body.hasClass('rtl')){
            $('link[href*="//demo-tranning.myshopify.com/cdn/shop/t/1/assets/global-rtl.css?v=76336006171756670211729496612"]').attr('href', '//demo-tranning.myshopify.com/cdn/shop/t/1/assets/global.css?v=129679492762349366561729732529');
            $body.removeClass('rtl');
        } else {
            $('link[href*="//demo-tranning.myshopify.com/cdn/shop/t/1/assets/global.css?v=129679492762349366561729732529"]').attr('href', '//demo-tranning.myshopify.com/cdn/shop/t/1/assets/global-rtl.css?v=76336006171756670211729496612');
            $body.addClass('rtl');
        }
        $('body').trigger('alzThemes:SwitchRTL:reload');
    });
}();
alzThemes.translateXY = function () {
    var scriptSelector = 'script[type="text/translatexy"]',
        dataAttr = 'data-translatexy',
        translateXY = (function fn() {
            var $translatexyScript =  $(scriptSelector);
            document.querySelectorAll('[data-translatexy]').forEach((el) => {
                if(el.classList.contains('translatexy-init')) {
                    return;
                }
                var translatexy       = JSON.parse(el.dataset.translatexy) || {},
                    translatexyDelay  = el.dataset.translatexyDelay ? parseInt(el.dataset.translatexyDelay) : 0,
                    translatexySort   = Object.keys(translatexy).sort().reverse().reduce((r, k) => (r[k] = translatexy[k], r), {});
                setTimeout(function(){
                    Object.entries(translatexySort).forEach(entry => {
                        const [originalStr, translateStr] = entry;
                        let regex     = new RegExp(originalStr, 'g');
                        var elements = el.getElementsByTagName('*');
                        for (var i = 0; i < elements.length; i++) {
                            var element = elements[i];
                            for (var j = 0; j < element.childNodes.length; j++) {
                                var node = element.childNodes[j];
                                if (node.nodeType === 3) {
                                    var text = node.nodeValue;
                                    var replacedText = text.replace(regex,translateStr);
                                    if (replacedText !== text) {
                                        element.replaceChild(document.createTextNode(replacedText), node);
                                    }
                                }
                            }
                        }
                    });
                }, translatexyDelay);
            });
        return fn;
    }());
    $(document).on('contentUpdated', function(){
        translateXY();
    });
}();
alzThemes.maskOverlay = function () {
    $(document).on('click', '.mask_opened', function(){
        $(this).removeClass('mask_opened');
        $('html').trigger('maskOverlayOff');
    });
}();
alzThemes.popupControl = function () {
    $('html').on('popupOn', function(){
    });
    $('html').on('popupOff', function(){
    });
}();
alzThemes.Header = function () {
  $(document).ready(function ($) {
    "use strict";
      function cms_get_scrollbar_width() {
        var $inner = $('<div style="width: 100%; height:200px;">test</div>'),
            $outer = $('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
            inner = $inner[0],
            outer = $outer[0];
        $('body').append(outer);
        var width1 = parseFloat(inner.offsetWidth);
        $outer.css('overflow', 'scroll');
        var width2 = parseFloat(outer.clientWidth);
        $outer.remove();
        return (width1 - width2);
      }
      var better_equal_elems = (function fn() {
          if($(window).width() + cms_get_scrollbar_width() > 0){
              $('.equal-container').each(function () {
                  var $this = $(this);
                  if ($this.find('.equal-elem').length) {
                      $this.find('.equal-elem').css({
                          'height': 'auto'
                      });
                      var elem_height = 0;
                      $this.find('.equal-elem').each(function () {
                          var this_elem_h = 0;
                          this_elem_h = parseFloat($(this).height());
                          if (elem_height < this_elem_h) {
                              elem_height = this_elem_h;
                          }
                      });
                      $this.find('.equal-elem').height(elem_height);
                  }
              });
              if($(window).width() > 991 ) {
                  $('.equal-container2').each(function () {
                      var $this = $(this);
                      if ($this.find('.equal-elem2').length) {
                          $this.find('.equal-elem2').css({
                              'height': 'auto'
                          });
                          var elem_height = 0;
                          $this.find('.equal-elem2').each(function () {
                              var this_elem_h = 0;
                              this_elem_h = parseFloat($(this).height());
                              if (elem_height < this_elem_h) {
                                  elem_height = this_elem_h;
                              }
                          });
                          $this.find('.equal-elem2').height(elem_height);
                      }
                  });
              }
          }
          return fn;
      })();

      $(document).on('click',' .toggle-submenu',function(){
         var layer = $(this).closest('.item-list').toggleClass('active');
         layer.siblings().removeClass('active');
         $(this).closest('.menu-item-has-children').toggleClass('show-submenu');
         return false;
      });
      $body.on('click', function (e) {
          var target = e.target;
          if (!$(target).is('.menu-language .item-list') && !$(target).parents().is('.menu-language .item-list')) {
              $('.item-list.active').removeClass('active');
          }
      });





     $(window).on('load resize', function () {
          better_equal_elems()
     });

    /*Load content of login form when hover login button*/
    $('a[data-id="#login-popup"]').on('mouseover',function(){
      $('#login-popup').addClass('lazyload').one('lazyincluded', function(e) {

      });
    });
    /*Load content of search form when hover search button*/
    $('a[data-id="#nt_search_canvass"]').on('mouseover',function(){
      $('#nt_search_canvass').addClass('lazyload').one('lazyincluded', function(e) {

      });
    });

    function addReplaceLangCode(langPrimary, langCode) {
        var a = document.location;
        var paths = document.location.pathname.split('/');
        paths.shift();
        if(paths[0].length == 2) {
            if(langCode == langPrimary){
            paths.shift();
        } else {
            paths[0] = langCode;
        }
        }else{
            paths.unshift(langCode);
        }

        return a.protocol + '//' + a.host + '/' + paths.join('/') + (a.search != '' ?  a.search : '') + (a.hash != '' ?  a.hash : '');
    };
    var shopLanguage = $('.shop-language'),
        languages = [],
        langPrimary = 'en',
        languageFlag = {'ar': 'sa', 'en' : 'us', 'vi' : 'vn'},
        languageFlagMap = shopLanguage.data('language-flag-map');
        languageFlagMap = (languageFlagMap !== undefined) ?  $.extend(languageFlag, languageFlagMap) : languageFlag;
    shopLanguage.find('.dropdown > li').each(function() {
        var code = $(this).data('code');
        languages.push(code);
        if($(this).hasClass('primary')) langPrimary = code;
    });
    shopLanguage.find('img.flag').each(function() {
        var code = $(this).parent().data('code'),
            flag = languageFlagMap.hasOwnProperty(code) ? languageFlagMap[code] : code;
        $(this).attr("src", $(this).data('src'));
        $(this).attr("onerror", "this.onerror=null; this.src='//cdn.shopify.com/static/images/flags/" + flag + ".svg';");
    });
    $(document).on('click', '.shop-language .dropdown > li' ,function(){
        if($(this).hasClass('active')) return;
        var url = addReplaceLangCode(langPrimary, $(this).data('code'));
        document.location.href = url;
    });
  });
}();
alzThemes.SortingCollections = function () {

    function SortingCollections(container) {
        this.$container = $(container);
        this.namespace = '.sorting-collections';
        this.onLoad();
    };

    SortingCollections.prototype = $.extend({}, SortingCollections.prototype, {
        onLoad: function () {
            var $control = this.$container.find('[data-sorting-collections-control]'),
                $products = this.$container.find('[data-sorting-items]'),
                xhr = null;

            this.$control = $control;
            function loadProducts($button, loader) {
                if (xhr) {
                    xhr.abort();
                }
                var $productTabs = $button.closest('.tab_product, .tab-product');
                if(!$productTabs.length) return;
                var $control     = $productTabs.find('[data-sorting-collections-control]'),
                    target       = $button.data('target'),
                    products     = $button.data('products'),
                    collection   = $button.data('collection'),
                    limit        = $button.data('limit'),
                    style        = $button.data('style'),
                    ratio        = $button.data('ratio'),
                    $products    = $productTabs.find('div[data-sorting-collections-ajax] .grid-slider, .sorting-collections__products');
                if(!$products.length) return;
                if( limit == undefined ) limit  = 6;
                if( ratio == undefined ) ratio  = 0;
                var $ajaxLoad = $productTabs.find("div[data-sorting-collections-ajax]");
                $ajaxLoad.addClass('openloading');
                $ajaxLoad.find(".section-content").css('opacity', '0');

                var htmlProducts = (data) => {
                    if($products.hasClass('slick-initialized')){
                        var rows = $products.data('rows');
                        if (rows > 1){
                            $products.slick('unslick');
                            $products.removeClass('grid-init');
                            $products.removeClass('slick-initialized');
                            $products.removeData('gridSlider');
                        } else {
                            $products.slick('slickRemove', null, null, true);
                        }
                    }
                    $products.html(data);
                    var $childern = $products.children();
                    $childern.addClass('alz-item');
                    $products.find('lazyload').each(function(){
                        lazySizes.loader.unveil(this);
                    });
                    $control.find('a').removeClass('active');
                    $button.addClass('active');
                    if($products.hasClass('slick-initialized')){
                        $products.slick('refresh');
                    }else {
                        $products.gridSlider();
                    }

                    setTimeout(function () {
                        $ajaxLoad.removeClass('openloading');
                        $ajaxLoad.find(".section-content").css('opacity', '1');
                    }, 100);
                    $products.find("div[data-lazy-product-load]").on('lazyloaded', function () {
                        var self = this;
                        setTimeout(function () {
                            alzThemes.ProductReview($(self));
                        }, 100);
                        alzThemes.ProductCurrency.update();
                        alzShopify.countdownProduct();
                    });
                }

                if (target == 'products'){
                    var productHtml = '';
                    var productList = products.split(",");
                    $.each(productList, function (index, handle){
                        if (handle != ''){
                            productHtml += alzThemes.getProductLazy(handle, style, ratio, index);
                        }
                    });
                    htmlProducts(productHtml);
                } else {
                    xhr = $.ajax({
                        type: 'GET',
                        url: Shopify.routes.root + 'collections/' + collection,
                        cache: false,
                        data: {
                            view: 'sorting',
                            product_style: style,
                            aspect_ratio: ratio,
                            limit: limit
                        },
                        dataType: 'html',
                        success: function (data) {
                            htmlProducts(data)
                            xhr = null;
                        }
                    });
                }
            };
            $control.each(function () {
                var $this = $(this);
                $(this).find('.js_sr_txt').html($(this).find('a.active').html());
                $(this).find('.js_sr_txt').click(function () {
                    $this.toggleClass('active');
                });
            });
            $control.on('click', 'a', function (e) {
                var $this = $(this);
                $control.removeClass('active');
                $this.closest('.tab-products').find('.js_sr_txt').html($this.html());
                if (!$this.hasClass('active')) {
                    loadProducts($this, true);
                }
                e.preventDefault();
                return false;
            });
        },
        onUnload: function () {
            this.$container.off(this.namespace);
            this.$control.off();
        }
    });

    theme.SortingCollections = new SortingCollections('.type_tab_collection');
}();
alzThemes.ProductCurrency = function () {

    function ProductCurrency() {
        this.load();
    };

    ProductCurrency.prototype = $.extend({}, ProductCurrency.prototype, {
        load: function () {
            var _ = this;
            $('body').on('contentUpdated', function () {
                _.update();
            });
        },
        setPrice: function ($price, price, compare_at_price) {
            price = +price;
            compare_at_price = +compare_at_price;
            var html = '',
                sale = compare_at_price && compare_at_price > price;
            $price[sale ? 'addClass' : 'removeClass']('price--sale');
            html += Shopify.formatMoney(price, theme.moneyFormat);
            if (sale) {
                html += '<span class="compare">';
                html += Shopify.formatMoney(compare_at_price, theme.moneyFormat);
                html += '</span>';
            }
            if ($price.closest(".price").find("span:last-child").hasClass("compare")) {
                $price.closest(".price").find("span:last-child").hide();
            }
            $price.html(html);
        },
        update: function () {
            var cookieCurrency;
            try {
                cookieCurrency = Currency.cookie.read();
            } catch (err) { }
            if (cookieCurrency != null) {
                Currency.convertAll(Currency.currentCurrency, cookieCurrency);
            }
        }
    });

    return new ProductCurrency();
}();
alzThemes.ProductImagesHover = function () {

    function ProductImagesHover() {
        this.selectors = {
            images: '.js-product-images-navigation',
            images_hover: '.js-product-images-hover',
            images_hovered_end: '.js-product-images-hovered-end'
        };
        this.load();
    };

    ProductImagesHover.prototype = $.extend({}, ProductImagesHover.prototype, {
        load: function () {
            function changeImage($wrap, $image, url, id) {
                $wrap.attr('data-js-product-image-hover-id', $image.attr('data-image-id'));
                theme.ProductImagesNavigation.changeSrc($image, url, id);
            };
            $body.on('mouseenter', this.selectors.images_hover, function (e) {
                var $this = $(this),
                    $image = $this.find('[data-image-lazy]'),
                    url = $this.attr('data-js-product-image-hover'),
                    id = $this.attr('data-js-product-image-hover-id');
                if (url) {
                    changeImage($this, $image, url, id);
                    $this.one('mouseleave', function () {
                        var url = $image.attr('data-url-img'),
                            id = $this.attr('data-js-product-image-hover-id');
                        changeImage($this, $image, url, id);
                    });
                }
            });
            $(this.selectors.images).each(function () {
                var $this = $(this),
                    $image = $this.find('[data-image-lazy]'),
                    url = $this.attr('data-js-product-image-hover'),
                    id = $this.attr('data-js-product-image-hover-id');
                if (url) {
                    changeImage($this, $image, url, id);
                }
            });
        },
        disable: function ($image) {
            $image.parents(this.selectors.images_hover).removeClass('js-product-images-hover').unbind('mouseleave');
        }
    });

    theme.ProductImagesHover = new ProductImagesHover();
}();
alzThemes.ProductImagesNavigation = function () {

    function ProductImagesNavigation() {
        this.selectors = {
            images_nav: '.js-product-images-navigation'
        };
        this.load();
    };

    ProductImagesNavigation.prototype = $.extend({}, ProductImagesNavigation.prototype, {
        load: function () {
            var _ = this;
            $body.on('click', '[data-js-product-images-navigation]:not([data-disabled])', function () {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    direction = $this.attr('data-js-product-images-navigation');
                theme.ProductImagesHover.disable($product.find('[data-image-lazy]'));
                var data = theme.ProductOptions.switchByImage($product, direction, null, function (data) {
                    _._updateButtons($product, data.is_first, data.is_last);
                });
            });
        },
        switch: function ($product, data) {
            var $image_container = $product.find('[data-js-product-image]'),
                $image,
                image,
                $image_hover,
                src,
                master_src;
            if ($image_container.length) {
                $image = $image_container.find('[data-image-lazy], .default_media');
                $image_hover = $image_container.find('[data-image-effect], .secondary_image');
                image = data.update_variant.featured_image;
                theme.ProductImagesHover.disable($image);
                if (!image || !image.src) {
                    if (data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }
                if (image && image.src && +image.id !== +$image.attr('data-image-id')) {
                    src = Shopify.resizeImage(image.src, Math.ceil($image_container.width()) + 'x') + ' 1x, ' + Shopify.resizeImage(image.src, Math.ceil($image_container.width()) * 2 + 'x') + ' 2x';
                    /*src = Shopify.resizeImage(image.src, Math.ceil($image_container.width()) + 'x');*/
                    master_src = Shopify.resizeImage(image.src, 'grande');
                    this.changeSrc($image, $image_hover, src, image.id, master_src);
                    if ($image.parents(this.selectors.images_nav).length) {
                        this._updateButtons($product, +data.json.images[0].id === +image.id, +data.json.images[data.json.images.length - 1].id === +image.id);
                    }
                }
            }
        },
        changeSrc: function ($image, $image_hover, srcset, id, master_src) {
            var id = id || 'null';
            $image_hover.fadeOut(function () {
                if($image_hover.is('img')){
                    $image_hover.attr('src', master_src);
                }else{
                    $image_hover.css('background-image', 'url(' + master_src + ')').fadeIn();
                }
            });
            $image.attr('srcset', srcset).attr('data-image-id', id);
            if (master_src) {
                if($image_hover.is('img')){
                    $image.attr('src', master_src);
                }else{
                    $image_hover.css('background-image', 'url(' + master_src + ')').fadeIn();
                }
            }
        },
        _updateButtons: function ($product, is_first, is_last) {
            $product.find('[data-js-product-images-navigation="prev"]')[is_first ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
            $product.find('[data-js-product-images-navigation="next"]')[is_last ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
        }
    });

    theme.ProductImagesNavigation = new ProductImagesNavigation();
}();

alzThemes.getProductVariantByOptions = function (jsonProduct, options) {
    var $variant = {};
    if (jsonProduct.hasOwnProperty('variants')) {
        $.each(jsonProduct.variants, function(index, variant){
            if(variant.hasOwnProperty('options')){
                if( variant.options.toString() === options.toString() ){
                    $variant = variant;
                    return false;
                }
            }
        })
    }
    return $variant;
};

alzThemes.getProductVariantById = function (jsonProduct, id) {
    var $variant = {};
    if (jsonProduct.hasOwnProperty('variants')) {
        $.each(jsonProduct.variants, function(index, variant){
            if(variant.hasOwnProperty('id') &&  variant.id == id){
                $variant = variant;
                return false;
            }
        })
    }
    return $variant;
};

alzThemes.getFeatureImageByOptions = function (jsonProduct, options) {
    var $variant = {};
    if (jsonProduct.hasOwnProperty('variants')) {
        $.each(jsonProduct.variants, function(index, variant){
            if(variant.hasOwnProperty('featured_image') && variant.featured_image){
                if( variant.options.toString() === options.toString() || variant.options.toString().indexOf(options.toString()) > -1){
                    $variant = variant;
                    return false;
                }
            }
        })
    }
    return $variant;
};

alzThemes.ProductOptions = function () {

    function ProductOptions() {
        this.selectors = {
            options: '.js-product-options',
            options_attr: '[data-js-product-options]'
        };
        this.load();
    };

    ProductOptions.prototype = $.extend({}, ProductOptions.prototype, {
        load: function () {
            var _ = this,
                timeout,
                xhr,
                initSwatch = true;
            window.$body = $('body');
            function onProcess(e) {
                e.preventDefault();
                $('body').trigger('beforeVariantUpdated');
                var $this = $(this),
                    $element = $(e.target),
                    $options = $this.parents(_.selectors.options),
                    $section = $this.parents('[data-property]');
                if ($this.hasClass('disabled') || ($this.hasClass('active') && !$section[0].hasAttribute('data-disable-auto-select'))) {
                    return;
                }
                var $values = $section.find('[data-js-option-value]'),
                    $product = $this.parents('[data-js-product]'),
                    dataJson = $product.find('.data-json-product'),
                    dataOptions = $product.find('.data-json-options'),
                    json = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                    dataOptions = dataOptions.length ? JSON.parse(dataOptions.html()) : [],
                    current_values = [],
                    update_variant = null;
                $values.removeClass('active');
                $values.parent().removeClass('active');
                $this.addClass('active');
                $this.siblings().removeClass('active');
                $this.parent().addClass('active');
                var label = $element.is('select') ? $element.find('option:selected').text() : $element.text();
                $this.closest('.option-item').find('.label-selected').html(label);
                $section.removeAttr('data-disable-auto-select');
                _._loadJSON($product, json, function (json) {
                    var $active_values = $options.find('[data-js-option-value].active').add($options.find('option[data-value]:selected'));
                    $.each($active_values, function () {
                        current_values.push($(this).attr('data-value'));
                    });
                    $options.find('[data-js-option-value]').removeClass('active');
                    $.each(json.variants, function () {
                        if (current_values.join(' / ') === Shopify.handleizeArray(this.options).join(' / ')) {
                            if (!this.available) {
                                return false;
                            }
                            update_variant = this;
                            return false;
                        }
                    });
                    if (!update_variant && current_values.length > 1) {
                        $.each(json.variants, function () {
                            if (current_values[0] === Shopify.handleize(this.options[0]) && current_values[1] === Shopify.handleize(this.options[1])) {
                                if (!this.available && update_variant) {
                                    return;
                                }
                                update_variant = this;
                                if (this.available) {
                                    return false;
                                }
                            }
                        });
                    }
                    if (!update_variant) {
                        $.each(json.variants, function () {
                            if (current_values[0] === Shopify.handleize(this.options[0])) {
                                if (!this.available && update_variant) {
                                    return;
                                }
                                update_variant = this;
                                if (this.available) {
                                    return false;
                                }
                            }
                        });
                    }
                    if (!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                    }
                    _._updatePossibleVariants($product, {
                        update_variant: update_variant,
                        json: json
                    });
                    $.each(update_variant.options, function (i, k) {
                        var $prop = $options.find('[data-property]').eq(i);
                        $prop.find('[data-js-option-value][data-value="' + Shopify.handleize(k) + '"]').addClass('active');
                        $prop.filter('[data-js-option-select]').val(Shopify.handleize(k)).trigger('change', [true]);
                    });
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        has_unselected_options: $product.find('[data-property][data-disable-auto-select]').length ? true : false
                    });
                    var  variantId = update_variant.id;
                    $product.find('[data-js-product-variants] option').each(function() {
                        if($(this).attr('value')  == variantId){
                            $(this).attr('selected', true);
                            $(this).addClass('selected');
                        } else {
                            $(this).attr('selected', false);
                            $(this).removeClass('selected');
                        }
                    });
                });
                if(initSwatch){
                    if($this.closest('.sticky_variant_content').length){
                        initSwatch = false;
                        $this.addClass('active').siblings().removeClass('active');
                        var property = $this.closest('[data-property]').data('property');
                        if(property){
                            $('.js_product_single .option-item [data-property="' + property + '"] [data-value="' + $this.data('value') + '"]').trigger('click');
                        }
                    } else if($this.closest('.js_product_single').length){
                        initSwatch = false;
                        $this.addClass('active').siblings().removeClass('active');
                        var property = $this.closest('[data-property]').data('property');
                        if(property){
                            $('.sticky_variant_content .option-item [data-property="' + property + '"] [data-value="' + $this.data('value') + '"]').trigger('click');
                        }
                    }
                }
                initSwatch = true;
                $('body').trigger('afterVariantUpdated', [update_variant]);
            };
            /* Switch option event support click touchstart mouseenter */
            $body.on('click touchstart', this.selectors.options + ' [data-js-option-value]', onProcess);
            $body.on('change', '[data-js-product] [data-js-option-select]', function (e, onupdate) {
                e.preventDefault();
                if (onupdate) {
                    return;
                }
                var $this = $(this).find('option[data-value]:selected');
                $(this).parents('').find('[data-js-select-dropdown]').removeAttr('data-dropdown-unselected');
                onProcess.call($this, e);
            });

            $body.on('change', '[data-js-product-variants="control"]', function () {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    id = $this.find('option:selected').attr('value'),
                    dataJson = $product.find('.data-json-product'),
                    json = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                    update_variant = null;
                _._loadJSON($product, json, function (json) {
                    $.each(json.variants, function () {
                        if (+this.id === +id) {
                            update_variant = this;
                            return false;
                        }
                    });
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        dontUpdateVariantsSelect: true
                    });
                });
            });
            /*$(".swatch .swatch-element").first().trigger("click");*/
            var $product = $('.js_product_single');
            if($product.length){
                $('.js_product_single .product-options__value, .sticky_variant_content .product-options__value').each(function () {
                    if ($(this).hasClass('active')) {
                        $(this).closest(".option-item").find('.label-selected').html($(this).text());
                    }
                });
                var urlParams = new URLSearchParams(window.location.search),
                    variantId   = urlParams.get('variant');
                if(!variantId){
                    $("div[data-slide-nav] .thumb_img").first().trigger("click");
                } else {
                    $('body').on('slideMain-init', function(){
                        var dataJson = $product.find('.data-json-product'),
                            json = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product');
                        if(json){
                            var variant = alzThemes.getProductVariantById(json, variantId);
                            $('body').trigger('afterVariantUpdated', variant);
                        }
                    });
                }
            }
        },
        _loadJSON: function ($product, json, callback, animate=true) {
            if ($product[0].hasAttribute('data-js-process-ajax-loading-json')) {
                $product.one('json-loaded', function () {
                    if (callback) {
                        var dataJson = $product.find('.data-json-product'),
                        json = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product');
                        callback(json);
                    }
                });
                return;
            }
            if (json) {
                if (callback) {
                    callback(typeof json == 'object' ? json : JSON.parse(json));
                }
            } else {
                $product.data('js-process-ajax-loading-json', true);
                if (animate) {
                    theme.Loader.set($product);
                }
                var handle = $product.data('product-handle');
                if(!handle){
                    var dataJson = $product.find('.data-json-product'),
                        jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product');
                    handle = jsonProduct.handle
                }
                var xhr = $.ajax({
                    type: 'GET',
                    url: Shopify.routes.root + 'products/' + handle,
                    data: {
                        view: 'get_json'
                    },
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        json = JSON.parse(data);
                        $product.data('json-product', JSON.stringify(json));
                        if (animate) {
                            theme.Loader.unset($product);
                        }
                        if (callback) {
                            callback(json);
                        }
                        $product.trigger('json-loaded');
                    },
                    complete: function () {
                        $product.removeAttr('data-js-process-ajax-loading-json');
                    }
                });

                return xhr;
            }
        },
        switchByImage: function ($product, get_image, id, callback) {
            var _ = this,
                $image = $product.find('[data-js-product-image] [data-image-lazy]'),
                dataJson = $product.find('.data-json-product'),
                json = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                data = false;
            this._loadJSON($product, json, function (json) {
                var json_images = json.images,
                    current_image_id = (get_image === 'by_id') ? +id : +$image.attr('data-image-id'),
                    image_index,
                    update_variant;
                $.each(json_images, function (i) {
                    if (+this.id === current_image_id) {
                        image_index = i;
                        return false;
                    }
                });
                if (image_index || image_index === 0) {
                    if (get_image === 'prev' && image_index !== 0) {
                        image_index--;
                    } else if (get_image === 'next' && image_index !== json_images.length - 1) {
                        image_index++;
                    }
                    $.each(json.variants, function () {
                        if (this.featured_image && +this.featured_image.id === +json_images[image_index].id) {
                            update_variant = this;
                            return false;
                        }
                    });
                    if (!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        update_variant.featured_image = json_images[image_index];
                    }
                    _._updateOptions($product, {
                        update_variant: update_variant,
                        json: json
                    });
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json
                    });
                    data = {
                        index: image_index,
                        image: json_images[image_index],
                        is_first: image_index === 0,
                        is_last: image_index === json_images.length - 1
                    };
                }

                callback(data);
            });
        },
        _updatePossibleVariants: function ($product, data) {
            var $options = $product.find(this.selectors.options_attr),
                $section_eq_values,
                $section_eq_select_options,
                possible_variants = [];
            if (data.update_variant.options.length > 1) {
                $.each(data.json.variants, function () {
                    if (Shopify.handleize(this.options[0]) !== Shopify.handleize(data.update_variant.options[0])) {
                        return;
                    } else if (!this.available && this.id !== data.update_variant.id) {
                        return;
                    }
                    possible_variants.push(this);
                });
                $section_eq_values = $options.find('[data-property]').eq(1).find('[data-js-option-value]');
                $section_eq_select_options = $options.find('[data-property]').eq(1).filter('[data-js-option-select]').parents('.select').find('[data-value]');
                $section_eq_values.addClass('disabled');
                $section_eq_select_options.attr('disabled', 'disabled');
                $.each(possible_variants, function () {
                    $section_eq_values.filter('[data-js-option-value][data-value="' + Shopify.handleize(this.options[1]) + '"]').removeClass('disabled');
                    $section_eq_select_options.filter('[data-value="' + Shopify.handleize(this.options[1]) + '"]').removeAttr('disabled');
                });
                if (data.update_variant.options.length > 2) {
                    possible_variants = [];
                    $.each(data.json.variants, function () {
                        if (Shopify.handleize(this.options[0]) !== Shopify.handleize(data.update_variant.options[0]) || Shopify.handleize(this.options[1]) !== Shopify.handleize(data.update_variant.options[1])) {
                            return;
                        } else if (!this.available && this.id !== data.update_variant.id) {
                            return;
                        }
                        possible_variants.push(this);
                    });
                    $section_eq_values = $options.find('[data-property]').eq(2).find('[data-js-option-value]');
                    $section_eq_select_options = $options.find('[data-property]').eq(2).filter('[data-js-option-select]').parents('.select').find('[data-value]');

                    $section_eq_values.addClass('disabled');
                    $section_eq_select_options.attr('disabled', 'disabled');

                    $.each(possible_variants, function () {
                        $section_eq_values.filter('[data-js-option-value][data-value="' + Shopify.handleize(this.options[2]) + '"]').removeClass('disabled');
                        $section_eq_select_options.filter('[data-value="' + Shopify.handleize(this.options[2]) + '"]').removeAttr('disabled');
                    });
                }
            }
        },
        _switchVariant: function ($product, data) {
            data.update_variant.metafields = $.extend({}, data.json.metafields);
            $.each(data.json.variants_metafields, function () {
                if (+this.variant_id === +data.update_variant.id) {
                    data.update_variant.metafields = $.extend(true, data.update_variant.metafields, this.metafields);
                }
            });
            this._updateContent($product, data);
        },
        _getDefaultVariant: function (json) {
            var default_variant = {};
            $.each(json.variants, function () {
                if (+this.id === +json.default_variant_id) {
                    Object.assign(default_variant, this);
                    return false;
                }
            });
            return default_variant;
        },
        _updateContent: function ($product, data) {
            var clone_id = $product.attr('data-js-product-clone-id'),
                $clone_product = $('[data-js-product-clone="' + clone_id + '"]');
            $product.attr('data-product-variant-id', data.update_variant.id);
            $product.add($clone_product).find('[data-js-product-options]').attr('data-variant-was-chanched', true);
            this._updateFormVariantInput($product, data);
            this._updatePrice($product, $clone_product, data);
            this._updateLabelSale($product, data);
            this._updateLabelInStock($product, data);
            this._updateLabelOutStock($product, data);
            this._updateLabelHot($product, data);
            this._updateLabelNew($product, data);
            this._updateCountdown($product, data);
            this._updateAddToCart($product, $clone_product, data);
            this._updateDynamicCheckout($product, data);
            this._updateSKU($product, data);
            this._updateBarcode($product, data);
            this._updateAvailability($product, data);
            this._updateStockCountdown($product, data);
            this._updateGallery($product, data);
            this._updateLinks($product, data);
            this._updateHistory($product, data);
            theme.ProductImagesNavigation.switch($product, data);
            if (!data.dontUpdateVariantsSelect) {
                this._updateVariantsSelect($product, data);
            }
            if ($clone_product.length) {
                this._updateOptions($clone_product, data, $product);
                theme.ProductImagesNavigation.switch($clone_product, data);
            }
        },
        _updateOptions: function ($product, data, $product_origin) {
            var _ = this;
            $product.each(function () {
                var $this = $(this),
                    $options = $this.find(_.selectors.options_attr),
                    $sections;
                if ($options.length) {
                    $options.find('[data-js-option-value]').removeClass('active');
                    _._updatePossibleVariants($this, data);
                    $.each(data.update_variant.options, function (i, k) {
                        var $prop = $options.find('[data-property]').eq(i);
                        $prop.find('[data-js-option-value][data-value="' + Shopify.handleize(k) + '"]').addClass('active');
                        $prop.filter('[data-js-option-select]').val(Shopify.handleize(k)).trigger('change', [true]);
                    });
                }
                if ($product_origin && theme.product.variant_auto_select !== 'enable') {
                    $sections = $product.find('[data-property]');
                    $sections.attr('data-disable-auto-select');
                    $product_origin.find('[data-property]').each(function (i, v) {
                        if (!this.hasAttribute('data-disable-auto-select')) {
                            $sections.eq(i).removeAttr('data-disable-auto-select');
                        }
                    });
                }
            });
        },
        _updateFormVariantInput: function ($product, data) {
            var $input = $product.find('[data-js-product-variant-input]');
            $input.val(data.update_variant.id).trigger('input');
        },
        _updateVariantsSelect: function ($product, data) {
            var $select = $product.find('[data-js-product-variants]');
            if ($select.length) {
                $select.val(data.update_variant.id).change();
            }
        },
        _updateAddToCart: function ($product, $clone_product, data) {
            var $buyitnow = $product.find('[data-buyitnow-button]'),
                $quantity = $product.find('[data-product-quantity]'),
                $buttonsoldout = $product.find('[data-js-product-button-sold-out]'),
                $button = $product.add($clone_product).find('[data-js-product-button-add-to-cart]');
            $button.data('pid', data.update_variant.id);
            if ($button.length && !data.has_unselected_options) {
                data.update_variant.available ? $button.removeAttr('disabled data-button-status') : $button.attr('disabled', 'disabled').attr('data-button-status', 'sold-out');
                data.update_variant.available ? $button.removeClass('d-none') : $button.addClass('d-none');
                data.update_variant.available ? $buttonsoldout.addClass('d-none') : $buttonsoldout.removeClass('d-none');
                data.update_variant.available ? $buyitnow.removeClass('d-none') : $buyitnow.addClass('d-none');
                data.update_variant.available ? $quantity.removeClass('d-none') : $quantity.addClass('d-none');
            }
        },
        _updateDynamicCheckout: function ($product, data) {
            var $button = $product.find('[data-js-product-button-dynamic-checkout]');
            if ($button.length && !data.has_unselected_options) {
                data.update_variant.available ? $button.removeClass('d-none') : $button.addClass('d-none');
            }
        },
        _updatePrice: function ($product, $clone_product, data) {
            var $price = $product.add($clone_product).find('[data-js-product-price]'),
                $details = $product.find('[data-js-product-price-sale-details]'),
                details;
            if ($price.length) {
                alzThemes.ProductCurrency.setPrice($price, data.update_variant.price, data.update_variant.compare_at_price);
            }
            if ($details.length) {
                $.each(data.json.variants_price_sale_details, function () {
                    if (+this.id === +data.update_variant.id) {
                        details = this.details;
                    }
                });

                $details.html(details ? details : '')[details ? 'removeClass' : 'addClass']('d-none-important');
            }
            if ($price.length || $details.length) {
                alzThemes.ProductCurrency.update();
            }
        },
        _updateLabelSale: function ($product, data) {
            var $label = $product.find('[data-js-product-label-sale]');
            if ($label.length) {
                var html = '',
                    sale = (data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price);
                $label[!sale ? 'addClass' : 'removeClass']('d-none-important');
                if (sale) {
                    var percent = Math.ceil(100 - data.update_variant.price * 100 / data.update_variant.compare_at_price);
                    html += "-{{ percent }}%";
                    html = Shopify.addValueToString(html, {
                        'percent': percent
                    });
                }
                $label.html(html);
            }
        },
        _updateLabelInStock: function ($product, data) {
            var $label = $product.find('#js-pr-available');
            if ($label.length) {
                $label[!data.update_variant.available ? 'addClass' : 'removeClass']('d-none');
            }
        },
        _updateLabelOutStock: function ($product, data) {
            var $label = $product.find('#js-pr-unavailable');
            if ($label.length) {
                $label[data.update_variant.available ? 'addClass' : 'removeClass']('d-none');
            }
        },
        _updateLabelHot: function ($product, data) {
            var $label = $product.find('[data-js-product-label-hot]');
            if ($label.length) {
                $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.hot ? 'removeClass' : 'addClass']('d-none-important');
            }
        },
        _updateLabelNew: function ($product, data) {
            var $label = $product.find('[data-js-product-label-new]');
            if ($label.length) {
                $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.new ? 'removeClass' : 'addClass']('d-none-important');
            }
        },
        _updateCountdown: function ($product, data) {
            var $countdown = $product.find('[data-js-product-countdown]'),
                date = data.update_variant.metafields.countdown && data.update_variant.metafields.countdown.date ? data.update_variant.metafields.countdown.date : false,
                $countdown_init,
                need_coundown;
            if ($countdown.length) {
                $countdown_init = $countdown.find('.js-countdown');
                need_coundown = date && data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price;
                if (need_coundown && $countdown_init.attr('data-date') !== date) {
                    theme.ProductCountdown.reinit($countdown_init, date);
                }
                if (!need_coundown) {
                    $countdown.addClass('d-none-important');
                }
            }
        },
        _updateSKU: function ($product, data) {
            var $sku = $product.find('[data-js-product-sku]');
            if ($sku.length) {
                $sku[data.update_variant.sku ? 'removeClass' : 'addClass']('d-none-important');
                $sku.find('span').html(data.update_variant.sku);
            }
        },
        _updateBarcode: function ($product, data) {
            var $barcode = $product.find('[data-js-product-barcode]');
            if ($barcode.length) {
                $barcode[data.update_variant.barcode ? 'removeClass' : 'addClass']('d-none-important');
                $barcode.find('span').html(data.update_variant.barcode);
            }
        },
        _updateAvailability: function ($product, data) {
            var $availability = $product.find('[data-js-product-availability]');
            if ($availability.length) {
                var html = '',
                    quantity = 0;
                $.each(data.json.variants_quantity, function () {
                    if (+this.id === +data.update_variant.id) {
                        quantity = +this.quantity;
                    }
                });
                var vStr = "<span><b>{{ count }}</b> Products</span>";
                if (data.update_variant.available) {
                    /* html += "<span><b>{{ count }}</b> Products</span>"; */
                    html += Shopify.addValueToString(vStr, {
                        'count': quantity,
                        'item': quantity === 1 ? "item" : "items"
                    });
                } else {
                    html += "Out of stock";
                }
                $availability.attr('data-availability', data.update_variant.available).find('span').html(html);
            }
        },
        _updateStockCountdown: function ($product, data) {
            var $stock_countdown = $product.find('[data-js-prd-stock]'),
                $number = $stock_countdown.find('[data-js-prd-stock-number]'),
                $progress = $stock_countdown.find('[data-js-prd-stock-progress]'),
                min = +$stock_countdown.attr('data-min'),
                quantity = 0;
            $.each(data.json.variants_quantity, function () {
                if (+this.id === +data.update_variant.id) quantity = +this.quantity;
            });
            if ($number) {
                $number.html(quantity);
            }
            if ($progress) {
                $progress.width(quantity / (min / 100) + '%');
            }
            if ($stock_countdown.length) {
                if(quantity == 0){
                    $stock_countdown.removeClass('in-stock').addClass('out-stock');
                } else {
                    $stock_countdown.removeClass('out-stock').addClass('in-stock');
                }
                $stock_countdown[quantity > 0 && quantity < min ? 'addClass' : 'removeClass']('low-stock');
            }
        },
        _updateGallery: function ($product, data) {
            var $gallery = $product.find('[data-js-product-gallery]'),
                $for_option = $gallery.find('[data-js-for-option]'),
                image;
            if (data.update_variant.option1) {
                $for_option.each(function () {
                    var $this = $(this);
                    $this[$this.attr('data-js-for-option') === Shopify.handleize(data.update_variant.option1) ? 'removeClass' : 'addClass']('d-none');
                });
                if (!$for_option.filter(':not(.d-none)').length) {
                    $for_option.removeClass('d-none');
                }
            }
            if ($gallery.find('.fotorama').length) {
                if (data.update_variant.featured_media) {
                    image = data.update_variant.featured_media;
                } else if (data.json.media[0]) {
                    image = data.json.media[0];
                }
                $gallery.productGallery('switchImageById', image.id);
            }
            var media = data.update_variant.featured_media;
            if (media && media.hasOwnProperty('id')) {
                $("#thumb_img_" + media.id).trigger("click");
            }
        },
        _updateLinks: function ($product, data) {
            var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;
            $product.find('a[href*="products/' + data.json.handle + '"]').attr('href', url);
        },
        _updateHistory: function ($product, data) {
            var $options = $product.find(this.selectors.options);
            if (!data.has_unselected_options && $options.length && $options[0].hasAttribute('data-js-change-history')) {
                var url = window.location.href.split('?')[0] + '?variant=' + data.update_variant.id;
                history.replaceState({ foo: 'product' }, url, url);
            }
        }
    });

    theme.ProductOptions = new ProductOptions();
}();

alzThemes.ProductGallery = function () {

    function ProductGallery() {
        this.selectors = {
            main: '.main-image',
            nav: '[data-thumb-id]'
        };
        this.load();
    };
    ProductGallery.prototype = $.extend({}, ProductGallery.prototype, {
        load: function () {
            this.init();
        },
        init: function () {
            var $body = $('body');
            if(!$body.hasClass('template-product')) return;
            var detailsThumb = $('#product-single .product-gallery');
            if(detailsThumb.hasClass('grid_1_column') || detailsThumb.hasClass('grid_2_column') || detailsThumb.hasClass('grid_mix') ){
                this.gridGallery();
            }else {
                var zoomImage = $(this.selectors.main);
                var zoomConfig = this.zoomConfig();
                if (!$("div[data-thumb-id]").length) {
                    $(this.selectors.main).ezPlus(zoomConfig);
                }
                this.sliderGallery();
            }
        },
        gridGallery: function () {
            var _      = this,
            slideMain = $("div[data-slide-main]"),
            slideMainHtml = slideMain.clone().html();
            slideMain.on('click', 'img', function(){
                var imageId = $(this).closest('[data-image-id]').data('image-id');
                $("[data-js-gallery]").trigger('click', {imageId : imageId});
            })
            $('body').on('contentDesktopMode', function(){
                if(slideMain.hasClass('slick-initialized')){
                    slideMain.slick("unslick").html(slideMainHtml);
                }
                if(slideMain.data('enable-zoom')){
                    var zoomConfig = _.zoomConfig();
                    delete zoomConfig.zoomContainerAppendTo;
                    /*
                    zoomConfig = $.extend(zoomConfig, {
                        zoomType: 'inner',
                        cursor: 'crosshair'
                    });
                    */
                    $(_.selectors.main).each(function(){
                        $(this).ezPlus(zoomConfig);
                    });
                }
                $('body').on('afterVariantUpdated', function (e, $variant) {
                    var featuredImage = $variant.featured_image;
                    if(!$.isEmptyObject(featuredImage)){
                        var img = $('#main_img_' + featuredImage.id);
                        if(img.length){
                            $('html, body').animate({scrollTop: img.offset().top - 50}, 1000);
                        }
                    }
                });
            });
            $('body').on('contentMobileMode', function(){
                if(slideMain.hasClass('slick-initialized')) return;
                var isRTL  = $body.hasClass('rtl');
                slideMain.data($.extend({
                    'arrows'        : true,
                    'dots'          : true,
                    'infinite'      : true,
                    'rtl'           : isRTL,
                    'slidesToShow'  : 1,
                    'swipe'         : false
                }, slideMain.data()));
                slideMain.slick(slideMain.data());

                $('body').on('afterVariantUpdated', function (e, $variant) {
                    var featuredImage = $variant.featured_image;
                    if(!$.isEmptyObject(featuredImage)){
                        var img  = slideMain.find('.js-image-' + featuredImage.id),
                            idx = img.closest('.slick-slide').data('slick-index');
                        slideMain.slick('slickGoTo', idx);
                    }
                });
            });
        },
        sliderGallery: function () {
            var _         = this,
                initSlide = true,
                initSwipe = true,
                isRTL     = $body.hasClass('rtl'),
                slideMain = $("div[data-slide-main]").not('.slick-initialized'),
                slideNav  = $("div[data-slide-nav]").not('.slick-initialized');
            slideMain.on('click', 'img', function(){
                var imageId = $(this).closest('[data-image-id]').data('image-id');
                $("[data-js-gallery]").trigger('click', {imageId : imageId});
            })
            slideMain.data($.extend({
              'arrows'        : true,
              'dots'          : false,
              'infinite'      : true,
              'rtl'           : isRTL,
              'slidesToShow'  : 1,
              'swipe'         : false
            }, slideMain.data()));
            slideMain.on('init afterChange', function (event, slick, currentSlide, nextSlide) {
                if(event.type == 'init'){
                    initSwipe = slick.options.swipe;
                }
                var slickCurrent = $(slick.$slides.get(currentSlide)),
                    slickNext    = $(slick.$slides.get(nextSlide)),
                    imageId      = slickCurrent.data('image-id'),
                    mediaType    = slickCurrent.data('media_type');
                if(!mediaType || mediaType == 'image'){
                    slick.options.swipe = initSwipe;
                    _.zoomCreate(slickCurrent);
                }else {
                    _.zoomDestroy();
                    if(mediaType == 'model'){
                        var modelViewer = $(event.target).find('model-viewer');
                        if(!modelViewer.hasClass('shopify-model-viewer-ui__disabled')){
                            slick.options.swipe = false;
                        }
                    }else {
                        slick.options.swipe = initSwipe;
                    }
                }

                slickCurrent.find('.deferred-media__poster').trigger('click');

                $html.removeClass (function (index, className) {
                    return (className.match (/(^|\s)media_type-\S+/g) || []).join(' ');
                }).addClass('media_type-' + mediaType);
                if(!initSlide && slideNav.hasClass('slick-initialized')){
                    var idx        = slickCurrent.data('slick-index'),
                        slideCount = slideNav.slick('getSlick').slideCount;
                    if(slideCount > slideNav.data('slidesToShow')){
                        if(idx < 0){
                            idx += slideCount;
                        }
                        slideNav.slick('slickGoTo', idx);
                    } else {
                        slideNav.find('.slick-slide').each(function(){
                          if(idx == $(this).data('slick-index')){
                              $(this).addClass('slick-current');
                          }else{
                              $(this).removeClass('slick-current');
                          }
                        });
                    }
                }
                var disableAutoSwatchMatchImage = ( '' == 'true' );
                if(!disableAutoSwatchMatchImage && !initSlide){
                    var $product           = $('#product-single');
                    if($product.length){
                        var dataJson      = $product.find('.data-json-product'),
                            json          = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                            variants      = json.variants,
                            options       = $product.find('.option-item'),
                            currentOption = [];
                        $.each(options, function () {
                            var active = $(this).find('.product-options__value.active');
                            if(active.length){
                                currentOption.push(active.data('value'));
                            }
                        });
                        currentOption.shift();
                        var matchOne = [];
                        $.each(variants, function () {
                            if(this.featured_image && this.featured_image.id == imageId){
                                var optionsHandleize = this.options.map(x => Shopify.handleize(x));
                                optionsHandleize.shift();
                                var isMatch = (currentOption.join() == optionsHandleize.join());
                                if(matchOne.length == 0 || isMatch){
                                    matchOne = this.options;
                                }
                                if(isMatch){
                                    return false;
                                }
                            }
                        });
                        if(!initSlide){
                            $.each(matchOne, function (index, value) {
                                options.eq(index).find('[data-value="' + Shopify.handleize(value) + '"]').trigger('click');
                            });
                        }
                    }
                }
                initSlide = false;
            });
            slideMain.slick(slideMain.data());
            $('body').on('afterVariantUpdated', function (e, $variant) {
                var featuredImage = $variant.featured_image;
                if(!$.isEmptyObject(featuredImage)){
                    var img  = slideMain.find('.js-image-' + featuredImage.id),
                        idx = img.closest('.slick-slide').data('slick-index');
                    slideMain.slick('slickGoTo', idx);
                    initSlide = true;
                }
            });
            if(!slideNav.length) return;
            var responsive = [{breakpoint: 768, settings: {vertical: false, slidesToShow: 5, slidesToScroll: 1 }}];
            slideNav.data($.extend({
              'arrows'          : true,
              'dots'            : false,
              'infinite'        : false,
              'centerMode'      : false,
              'verticalSwiping' : slideNav.data("vertical"),
              'slidesToShow'    : slideNav.data("slidestoshow"),
              'responsive'      : responsive
            }, slideNav.data()));
            slideNav.slick(slideNav.data());
            var urlParams = new URLSearchParams(window.location.search),
                variant   = urlParams.get('variant');
            if(!variant){
                slideNav.slick('slickGoTo', 0); /* go to main image */
            }else {
                /* go to swatch image */
            }
            $(document).on('alzThemes:SwitchRTL:reload', function (event) {
                if($('body').hasClass('rtl')){
                  slideMain.attr('dir', 'rtl').data('rtl', true );
                  if(!slideNav.data('vertical')){
                    slideNav.attr('dir', 'rtl').data('rtl', true );
                  }
                }else {
                  slideMain.attr('dir', 'ltr').data('rtl', false );
                  slideNav.attr('dir', 'ltr').data('rtl', false );
                }
                slideMain.slick("unslick").slick(slideMain.data());
                slideNav.slick("unslick").slick(slideNav.data());
                _.zoomDestroy();
                $('.slick-current ' + _.selectors.main).ezPlus(_.zoomConfig());;
            });
            $('body').on('afterVariantUpdated', function (e, $variant) {
                var featuredImage = $variant.featured_image;
                if(!$.isEmptyObject(featuredImage)){
                    var img        = slideNav.find('[data-thumb-id="' + featuredImage.id + '"]'),
                        idx        = img.closest('.slick-slide').data('slick-index'),
                        slideCount = slideNav.slick('getSlick').slideCount;
                    if(slideCount > slideNav.data('slidesToShow')){
                        if(idx < 0){
                            idx += slideCount;
                        }
                        slideNav.slick('slickGoTo', idx);
                    } else {
                        img.closest('.slick-slide').addClass('slick-current').siblings().removeClass('slick-current');
                    }
                }
            });
            slideNav.on('click', '.slick-slide', function () {
                if(!slideMain.length) return;
                slideMain.slick('slickGoTo', $(this).data('slick-index'));
                $(this).addClass('slick-current').siblings().removeClass('slick-current');
                initSlide = true;
            });
            $('body').trigger('slideMain-init');
        },
        zoomConfig: function () {
            var zoomImage = $(this.selectors.main),
                $img = $('.item-main img'),
                zoomWidth  = $("div[data-slide-main]").data("width-zoom"),
                zoomHeight = $("div[data-slide-main]").data("height-zoom"),
                zoomStyle  = zoomImage.data("style-zoom"),
                zoomEffect = zoomImage.data("effect"),
                effectDuration = zoomImage.data("effect-duration"),
                zoomLevel  = (zoomStyle == 2 || zoomStyle == 4) ? 1 : zoomImage.data("zoomLevel"),
                zoomContainerAppendTo = '.js_product_single .zoomContainerAppendTo',
                zoomTypeMap = {'1':'window', '2':'inner', '3':'lens', '4':'mousewheel'},
                zoomConfig,
                /* default effect flyOutImageToWindow */
                effect = [
                    { transform: $('body').hasClass('rtl') ? 'translate3d(100%, 0, 0) scale(0)' : 'translate3d(-100%, 0, 0) scale(0)' },
                    { transform: 'translate3d(0, 0, 0) scale(1)' },
                    { transition: 'all 0.8s linear both' }
                ],
                timing = { duration: parseInt(effectDuration), iterations: 0.5 };
                switch (zoomEffect) {
                    case 'flyOutWindow':
                        effect = [
                          { transform: 'translate3d(0%, 0, 0) scale(0)' },
                          { transform: 'translate3d(0, 0, 0) scale(1)' },
                          { transition: 'all .8s linear both' }
                        ];
                        break;
                    case 'flySpinningWindow':
                        effect = [
                          { transform: 'scale(0) rotateZ(0)' },
                          { transform: 'scale(1) rotateZ(-360deg)' },
                          { transition: 'all 0.5s linear both' }
                        ];
                        break;
                    case 'flySpinningImageToWindow':
                        effect = [
                          { transform: $('body').hasClass('rtl') ? 'translate3d(100%, 0, 0) scale(0) rotateZ(0)' : 'translate3d(-100%, 0, 0) scale(0) rotateZ(0)' },
                          { transform: 'translate3d(0, 0, 0) scale(1) rotateZ(360deg)' },
                          { transition: 'all 0.5s linear both' }
                        ];
                        break;
                    default:
                }
            var defaults = {
                borderSize: 1,
                lensFadeIn: 500,
                lensFadeOut: 500,
                zoomLevel: zoomLevel,
                easing: false,
                easingAmount: 10,
                gallery: 'slider-nav',
                galleryActiveClass: "slick-current",
                zoomContainerAppendTo: zoomContainerAppendTo,
                zoomWindowWidth: parseInt(zoomWidth) ? zoomWidth : $img.width(),
                zoomWindowHeight: parseInt(zoomHeight) ? zoomHeight : $img.height(),
                onZoomedImageLoaded: function(img){
                    $(zoomContainerAppendTo).css({position: "absolute", top: 0, left: 0});
                    $(zoomContainerAppendTo).find('.zoomContainer').css({position: "static"});
                },
                onShow: function (ez){
                    if(ez.options.zoomType !== 'window'){
                        return;
                    };
                    var alzZoom = window.alzZoom || {},
                        uuid = ez.options.zoomId,
                        zoomWindow = document.querySelector('[uuid="' + uuid + '"] .zoomWindow');
                    if(zoomWindow){
                        if(alzZoom && alzZoom[uuid]){
                            alzZoom[uuid].cancel();
                        }
                        alzZoom[uuid] = zoomWindow.animate(effect, timing);
                    }
                }
            };
            switch (zoomStyle) {
                case 1:
                    zoomConfig = defaults;
                    $body.addClass('productzoom-window');
                    break;
                case 2:
                    zoomConfig = $.extend(defaults, {
                        zoomType: 'inner',
                        cursor: 'crosshair',
                    });
                    $body.addClass('productzoom-inner');
                    break;
                case 3:
                    zoomConfig = $.extend(defaults, {
                        zoomType: 'lens',
                        lensShape: 'round',
                        lensSize: 200,
                    });
                    $body.addClass('productzoom-lens');
                    break;
                case 4:
                    zoomConfig = $.extend(defaults, {
                        scrollZoom: true,
                    });
                    $body.addClass('productzoom-mousewheel');
                    break;
                default:
                    zoomConfig = defaults;
            };

            return zoomConfig;
        },
        zoomCreate: function ($el) {
            if( $(window).width() < mobileScreen ) return;
            var zoomImage = $(this.selectors.main);
            if(!zoomImage.data("style-zoom")){
                /* disable zoom */
                return;
            }
            var zoomConfig = this.zoomConfig();
            $('.zoomContainer').remove();
            zoomImage.removeData('elevateZoom');
            var id = $el.data('image-id');
            var currentImage = zoomImage.parent().find('.js-image-' + id);
            currentImage.attr('src', $(this).data('image'));
            currentImage.data('zoom-image', $(this).data('z-image'));
            $script([cms_js.data('ez')], function () {
                currentImage.ezPlus(zoomConfig);
            });
        },
        zoomDestroy: function () {
            var zoomImage = $(this.selectors.main);
            $('.zoomContainer').remove();
            zoomImage.removeData('elevateZoom');
        }
    });

    return new ProductGallery();
}();
alzThemes.ProductTextCountdown = function () {
    function ProductTextCountdown() {
        this.selectors = {};
        this.load();
    };
    ProductTextCountdown.prototype = $.extend({}, ProductTextCountdown.prototype, {
        load: function () {
            this.init($('.js-text-countdown').not('.init'));
        },
        init: function ($elems) {
            var $countdown = $elems.not('.init');
            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-text-countdown-counter]'),
                    $date = $this.find('[data-js-text-countdown-delivery]'),
                    $days = +$this.data('days'),
                    $hrs = +$this.data('hrs'),
                    $mins = +$this.data('mins'),
                    $secs = +$this.data('secs'),
                    date_counter = new Date();
                date_counter.setDate(date_counter.getDate() + $days);
                date_counter.setHours($hrs, $mins, $secs, 0);
                var t = $counter.countdown({
                    until: date_counter,
                    days_text: $this.data('days-text'),
                    hrs_text: $this.data('hrs-text'),
                    mins_text: $this.data('mins-text'),
                    secs_text: $this.data('secs-text'),
                    timeout: $this.data('timeout-text')
                });
                $this.addClass('init');
            });
        },
        destroy: function ($countdown) {
            if (!$countdown.hasClass('init')) return;
            $countdown.countdown('remove').off().removeClass('init').html('');
        },
        reinit: function ($countdown, date) {
            this.destroy($countdown);
            var $new_countdown = $countdown.clone();
            $countdown.replaceWith($new_countdown);
            $countdown.remove();
            if (date) {
                $new_countdown.attr('data-date', date);
            }
            this.init($new_countdown);
        }
    });

    return new ProductTextCountdown();
}();
alzThemes.ProductVisitors = function () {

    function ProductVisitors() {
        this.selectors = {

        };
        this.load();
    };

    ProductVisitors.prototype = $.extend({}, ProductVisitors.prototype, {
        load: function () {
            this.init($('.js-visitors').not('.init'));
        },
        init: function ($elems) {
            var $countdown = $elems.not('.init');
            function randomInteger(min, max) {
                return Math.round(min - 0.5 + Math.random() * (max - min + 1));
            };
            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-counter]'),
                    min = $this.attr('data-min'),
                    max = $this.attr('data-max'),
                    interval_min = $this.attr('data-interval-min'),
                    interval_max = $this.attr('data-interval-max'),
                    stroke = +$this.attr('data-stroke'),
                    current_value,
                    new_value;
                $this.addClass('visitors--processing');
                function update() {
                    setTimeout(function () {
                        if (!$this.hasClass('visitors--processing')) {
                            return;
                        }
                        current_value = +$counter.text();
                        new_value = randomInteger(min, max);
                        if (Math.abs(current_value - new_value) > stroke) {
                            new_value = new_value > current_value ? current_value + stroke : current_value - stroke;
                            new_value = randomInteger(current_value, new_value);
                        }
                        $counter.text(new_value);
                        update();
                    }, randomInteger(interval_min, interval_max) * 1000);
                };
                update();
                $this.addClass('init');
            });
        },
        destroy: function ($countdown) {
            if ($countdown.hasClass('init')) {
                $countdown.off().removeClass('visitors--processing init').html('');
            }
        }
    });

    return new ProductVisitors();
}();
alzThemes.ProductBuyNow = function () {
    var $buyitnow = $('.js_product_single .group-button-buyitnow.disabled');
    if ($buyitnow.length) {
        setTimeout(function () { $buyitnow.find('.shopify-payment-button__button').prop("disabled", true) }, 999);
        $buyitnow.change(function () {
            if ($buyitnow.find('input:checked').length) {
                $buyitnow.removeClass('disabled');
                $buyitnow.find('.shopify-payment-button__button').prop("disabled", false);
            } else {
                $buyitnow.addClass('disabled');
                $buyitnow.find('.shopify-payment-button__button').prop("disabled", true);
            }
        });
    }
}();
alzThemes.getProductsHtml = function (template, productIds) {
    var html = '';
    var query = 'id:';
    if(Array.isArray(productIds)){
        query += productIds.join(' OR id:');
    }else {
        query += productIds.replace(/,/g, ' OR id:');
    }
    /* query = 'id:41756822044849 OR id:41756822044850' */
    $.ajax({
      async: false,
      dataType: 'html',
      type: 'GET',
      url: Shopify.routes.root + 'search?view=' + template + '&type=product&q=' + encodeURI(query),
      success: function (data) {
            html = data;
      },
      error: function () {
        return 'error';
      }
    });
    return html;
};
alzThemes.getProductHtml = function (template='pr_lazy_load', handle ) {
    var html = '';
    $.ajax({
      async: false,
      dataType: 'html',
      type: 'GET',
      url: Shopify.routes.root + 'products/' + handle + '/?view=' + template,
      success: function (data) {
            html = data;
      },
      error: function () {
        return 'error';
      }
    });
    return html;
};
alzThemes.ProductRecently = function () {
    var recently = $('.js_recently_wrapper');
    if (!recently.length) return;
    var storage     = localStorage.getItem('product-recent'),
        items       = storage ? JSON.parse(storage) : [],
        limit       = parseInt(recently.data('limit')) ? parseInt(recently.data('limit')) : 10,
        productHtml = '',
        exist       = false,
        num         = 0,
        $product    = $('#product-single'),
        dataJson    = $product.find('.data-json-product'),
        jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
        currentHandle = jsonProduct ? jsonProduct.handle : '',
        style       = recently.data('style'),
        ratio       = recently.data('ratio');

    $.each(items , function(index, handle) {
        if(num == limit) return false;
        if($product.length > 0 && handle == currentHandle){
            exist = true;
            return;
        };
        productHtml += alzThemes.getProductLazy(handle, style, ratio, index);
        num++;
    });

    if(productHtml){
        recently.closest('.js-recently-viewed').removeClass('hide').addClass('show');
        recently.html(productHtml);
        if(recently.data('use-slider') == true){
            recently.addClass('grid-slider');
        }
    }

    $('body').trigger('contentUpdated');

    if(exist) return;
    if(items.length > limit + 1){
        items.pop();
    }

    if ($product.length > 0) {
        items.unshift(currentHandle);
        localStorage.setItem('product-recent', JSON.stringify(items));
    }
}();
alzThemes.Loader = function () {

    function Loader() {
        var _ = this;

        this.$loader = $('#theme-loader .js-loader');
        _.load();
    };

    Loader.prototype = $.extend({}, Loader.prototype, {
        load: function () {

        },
        set: function ($elem, obj) {
            $elem.addClass('loading-element');
        },
        unset: function ($elem) {
            /* $("body").removeClass('ajax_loading'); */
            $elem.removeClass('loading-element');
        }
    });

    theme.Loader = new Loader();
}();
alzThemes.StoreLists = function () {

    function Engine(namespace, callback) {
        this.namespace = namespace;
        this.selectors = {
            button: '.js-store-lists-add-' + namespace,
            button_remove: '.js-store-lists-remove-' + namespace,
            button_clear: '.js-store-lists-clear-' + namespace,
            has_items: '[data-js-store-lists-has-items-' + namespace + ']',
            dhas_items: '[data-js-store-lists-dhas-items-' + namespace + ']'
        };
        if (theme.customer) {
            this.current_storage = namespace + '-customer-' + theme.customer.id;
            this.app_obj = {
                namespace: namespace,
                customerid: theme.customer.id
            };
        } else {
            this.current_storage = namespace + '-guest';
        }
        this.load(callback);
    };

    Engine.prototype = $.extend({}, Engine.prototype, {
        load: function (callback) {
            var _ = this,
                namespace = this.namespace;
            this.checkProductStatus();
            $body.on('contentUpdated', function(){
                _.checkProductStatus();
            });
            $body.on('click', "[data-js-popup-button='" + namespace + "-full']", function (e) {
                e.preventDefault();
                $('.js-close-sidebar').first().trigger('click');
                var $popup = $('[data-js-popup-name="' + namespace + '-full"]');
                _.updateFull($popup);
                var $content = $popup.find('.popup-' + namespace + '-full__content');
                $content.parent().removeClass('open');
                setTimeout(function () { $content.parent().addClass('open'); }, 500);
            });
            if(namespace == 'wishlist'){
                this.processWishlist();
                $(document).on('shopify:section:unload shopify:section:load', function (event) {
                    _.processWishlist();
                });
            }
            $body.on('click', ".popup-" + namespace + "-full__head [data-js-popup-close]", function (e) {
                $.magnificPopup.close();
            });
            $body.on('click', this.selectors.button, function (e) {
                e.preventDefault();
                var $this = $(this);
                var $product = $this.parents('[data-js-product]'),
                    dataJson = $product.find('.data-json-product'),
                    jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                    handle = jsonProduct.handle,
                    id = jsonProduct.default_variant_id;
                $this.attr('disabled', 'disabled');
                if ($this.attr('data-button-status') === 'added') {
                    _.removeItem(id, handle, function (data) {
                        $this.removeAttr('data-button-status');
                        $this.removeAttr('disabled');
                    });
                } else {
                    _.addItem(id, handle, function (data) {
                        $this.attr('data-button-status', 'added');
                        $this.removeAttr('disabled');
                    });
                }
            });
            function removeCallback($product, handle) {
                var find = '[data-js-store-lists-product-' + _.namespace + ']';
                if (handle) find += '[data-product-handle="' + handle + '"]';
                $(find).each(function () {
                    var $this = $(this);
                    $($this.parent('[class*="col"]').children().length == 1 ? $this.parent() : $this).remove();
                });
                if ($product.length) $product.remove();
            };
            $body.on('click', this.selectors.button_remove, function () {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    handle = $product.data('product-handle'),
                    id = +$product.attr('data-product-variant-id');
                    if(!handle){
                        var dataJson = $product.find('.data-json-product'),
                            jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                            handle = jsonProduct.handle;
                    }
                _.removeItem(id, handle, function () {
                    removeCallback($product, handle);
                });
            });
            $body.on('click', this.selectors.button_clear, function () {
                _.clear(function () {
                        /* do after clear */
                });
            });
        },
        processWishlist: function () {
            var _ = this,
                wishlist = $('.js-collection-wishlist');
            $body.on('click', "[data-id='#wishlist_popup'], .js-wishlist", function (e) {
                var $popup = $('[data-js-popup-ajax]');
                _.update($popup);
                if($body.is("#wishlist")){
                    var $item = $(this).closest('.productLazyload'),
                        $items = $item.parent();
                    $item.remove();
                    if($item.length && !$items.html()){
                        $body.find('.wishlist-empty').fadeIn();
                    }
                  }
            });
            if(wishlist.length){
                var storage = localStorage.getItem(this.current_storage),
                    items   = storage ? JSON.parse(storage) : [];
                if (items.length) {
                    var productHtml = '',
                        style  = wishlist.data('style'),
                        ratio  = wishlist.data('ratio');
                    $.each(items , function(index, item) {
                          $.each( item , function(id, handle) {
                              productHtml += alzThemes.getProductLazy(handle, style, ratio, index);
                          });
                    });
                    if(wishlist.data('use-slider') == true){
                        wishlist.html(productHtml).addClass('grid-slider');
                    } else {
                        wishlist.html(productHtml);
                    }
                    $('body').trigger('contentUpdated');
                }else {
                    $body.find('.wishlist-empty').fadeIn();
                }
            }
        },
        addItem: function (id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                item = {},
                exist = false;
            $.each(items, function () {
                $.each(this, function (k, v) {
                    if (v == handle) exist = true;
                });
            });
            item[id] = handle;
            if (!exist) items.push(item);
            localStorage.setItem(this.current_storage, JSON.stringify(items));
            this.checkProductStatus();
            this.updateHeaderCount();
            var $popup = $('[data-js-popup-ajax]');
            this.update($popup);
            $('[data-js-' + this.namespace + '-count]').first().parent().trigger('click');
            if (callback) callback();
        },
        removeItem: function (id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [];
            $.each(items, function (i) {
                $.each(this, function (k, v) {
                    if (v == handle){
                        items.splice(i, 1);
                    };
                });
            });
            localStorage.setItem(this.current_storage, JSON.stringify(items));
            this.checkProductStatus();
            $(this.selectors.has_items)[items.length > 0 ? 'removeClass' : 'addClass']('d-none');
            $(this.selectors.dhas_items)[items.length > 0 ? 'addClass' : 'removeClass']('d-none');
            this.updateHeaderCount();
            var $popup = $('[data-js-popup-ajax]');
            this.update($popup);
            if (callback) callback();
        },
        clear: function (callback) {
            localStorage.removeItem(this.current_storage);
            this.checkProductStatus();
            $(this.selectors.has_items).addClass('d-none');
            $(this.selectors.dhas_items).removeClass('d-none');
            this.updateHeaderCount();
            if (callback) callback();
        },
        checkProductStatus: function ($products) {
            $products = $products || $('[data-js-product]');
            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                namespace = this.namespace,
                items = storage ? JSON.parse(storage) : [],
                handles = [];
            $.each(items, function () {
                $.each(this, function (k, v) {
                    handles.push(v);
                });
            });
            $.each($products, function () {
                var $product = $(this),
                handle = $product.attr('data-product-handle');
                if(!handle){
                    var dataJson = $product.find('.data-json-product'),
                        jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                        handle = jsonProduct ? jsonProduct.handle : '';
                }
                if(handles.indexOf(handle) !== -1){
                    $product.find(_.selectors.button).attr('data-button-status', 'added');
                } else{
                    $product.find(_.selectors.button).removeAttr('data-button-status');
                }
            });
            $("div[data-lazy-product-load]").on('lazyloaded', function () {
                var $product = $(this).find('.product-inner');
                if(!$product.length) return;
                var dataJson = $product.find('.data-json-product'),
                    jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
                    productHandle = jsonProduct ? jsonProduct.handle : '';
              $.each(JSON.parse(storage), function (key, item) {
                $.each(item, function (id, handle) {
                  if (handle == productHandle) {
                    $product.find('.js-' + namespace).attr('data-button-status', 'added');
                  }
                });
              });
            });
        },
        updateHeaderCount: function (callback) {
            var storage = localStorage.getItem(this.current_storage),
                count = storage ? JSON.parse(storage).length : 0,
                namespace = this.namespace;
            $('[data-js-' + namespace + '-count]').attr('data-js-' + namespace + '-count', count).html(count);
            if (callback) callback();
        },
        _resultToHTML: function ($items, data, callback) {
            var $template = $($('#template-' + this.namespace + '-ajax')[0].content),
                $fragment = $(document.createDocumentFragment());
            for (var i = 0; i < data.params.length; i++) {
                $.each(data.params[i], function (k, v) {
                    var product = null,
                        variant = null;
                    $.each(data.products, function () {
                        if (this.handle === v) {
                            product = this;
                        }
                    });
                    if (!product) return;
                    var image = product.featured_image;
                    var $item = $template.clone(),
                        $product = $item.find('.product-store-lists'),
                        $image = $item.find('.product-store-lists__image img'),
                        $title = $item.find('.product-store-lists__title a'),
                        $price = $item.find('.product-store-lists__price .price'),
                        $links = $item.find('a').not('.product-store-lists__remove');
                    $product.attr('data-product-variant-id', k);
                    $product.attr('data-product-handle', v);
                    $links.attr('href', '/products/' + v + '?variant=' + k);
                    $title.html(product.title);
                    $image.attr('srcset', Shopify.resizeImage(image, '120x') + ' 1x, ' + Shopify.resizeImage(image, '240x') + ' 2x');
                    alzThemes.ProductCurrency.setPrice($price, product.price, product.compare_at_price);
                    $fragment.append($item);
                });
            }
            $items.html($fragment);
            if (callback) {
                callback();
            }
        },
        _getProducts: function (items, callback) {
            var total = items.length,
                products = [] ;
            $.each(items, function (index, item) {
                var handle = Object.values(item)[0];
                $.ajax({
                    type: 'GET',
                    url: Shopify.routes.root + 'products/' + handle + '.js',
                    cache: false,
                    dataType: 'json'
                }).done(function (data){
                    products.push(data);
                }).fail(function(xhr){
                }).always(function (xhr, status, data) {
                    total--;
                    if(!total && callback){
                        callback({
                            params: items,
                            products: products
                        });
                    }
                });
            });
        },
        update: function ($popup, callback) {
            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                items   = storage ? JSON.parse(storage) : [],
                $content = $popup.find('.popup-' + this.namespace + '_content'),
                $empty  = $popup.find('.popup-' + this.namespace + '_empty'),
                $items  = $popup.find('.popup-' + this.namespace + '_items'),
                $count  = $popup.find('[data-js-popup-' + this.namespace + '-count]');
            $content[items.length > 0 ? 'removeClass' : 'addClass']('d-none-important');
            $empty[items.length > 0 ? 'addClass' : 'removeClass']('d-none-important');
            if (items.length) {
                var data = this._getProducts(items, function (data) {
                    _._resultToHTML($items, data, callback);
                    alzThemes.ProductCurrency.update();
                });
            } else {
                $items.html('');
                if (callback) {
                    callback();
                }
            }
        },
        updateFull: function ($popup, callback) {
            var namespace = this.namespace;
            var _ = this,
                $content = $popup.find('.popup-' + namespace + '-full__content'),
                storage = localStorage.getItem(theme.StoreLists.lists[namespace].current_storage),
                items = storage ? JSON.parse(storage) : [],
                query = [];
            for (var i = 0; i < items.length; i++) {
                $.each(items[i], function (v, k) {
                    query.push('handle' + ':' + k);
                });
            }
            query = query.join(' OR ');
            $.ajax({
                cache: false,
                data: {
                    q: query,
                    type: 'product',
                    'options[unavailable_products]': 'last',
                    view: namespace
                },
                type: 'GET',
                url: Shopify.routes.root + 'search',
                success: function (data) {
                    $content.html(data);
                    alzThemes.ProductCurrency.update();
                    $(".close_popup_ajax").trigger("click");
                    $.magnificPopup.open({
                        items: {
                            src: '.popup-' + namespace + '-full'
                        },
                        callbacks: {
                            beforeOpen: function() {
                                if($popup.data('effect')) this.st.mainClass = $popup.data('effect');
                            }
                        },
                        type: 'inline',
                        removalDelay: 500, /* delay removal by X to allow out-animation */
                        tClose: "Close"
                    });
                }
            });
        }
    });
    function StoreLists() {
        this.namespaces = ['wishlist', 'compare'];
        this.load();
    };
    function Popup(namespace) {
        this.namespace = namespace;
        this.load();
    };

    StoreLists.prototype = $.extend({}, StoreLists.prototype, {
        lists: {},
        popups: {},
        load: function () {
            var triggers_array = [];
            for (var i = 0; i < this.namespaces.length; i++) {
                this.lists[this.namespaces[i]] = new Engine(this.namespaces[i], function (obj) {
                    triggers_array.push(obj);
                });
            }
            if (triggers_array.length) {
                var $button_confirm = $('[data-js-button-transfer-data]');
                $button_confirm.one('click', function () {
                    $button_confirm.attr('data-js-active', true);
                });
            }
            this.updateHeaderCount();
        },
        checkProductStatus: function () {
            $.each(this.lists, function () {
                this.checkProductStatus();
            });
        },
        updateHeaderCount: function () {
            $.each(this.lists, function () {
                this.updateHeaderCount();
            });
        }
    });

    theme.StoreLists = new StoreLists();
}();
alzThemes.ToggleForm = (function fn() {
    $(document).ready(function ($) {
        $(document).on("click", ".forgot-password", function () {
            $('#recoverPassword').slideDown();
            $('#loginForm').slideUp();
        });
        $(document).on("click", ".back-login", function () {
            $('#loginForm').slideDown();
            $('#recoverPassword').slideUp();
        });
    });
    $(document).on("click", ".title-login", function () {
        var _this = $(this);
        if ( !_this.hasClass('active') ){
            $('.title-register').removeClass('active');
            _this.addClass('active');
            $('#registerForm').slideUp();
            $('#loginForm').slideDown();
        }
    });
    $(document).on("click", ".title-register", function () {
        var _this = $(this);
        if ( !_this.hasClass('active') ){
            $('.title-login').removeClass('active');
            _this.addClass('active');
            $('#loginForm').slideUp();
            $('#recoverPassword').slideUp();
            $('#registerForm').slideDown();
        }
    });

    return fn;
}());
alzThemes.CustomerForm = (function fn() {
    var registerForm = $('#create_customer').not('.init');
    if(registerForm.length){
        var rules = {
                'customer[password]' : {
                    required: true,
                    minlength : 6
                }
            };
        if(registerForm.find('#PasswordConfirmation').length){
            $.extend(rules, {
                'customer[password_confirmation]' : {
                    required: true,
                    minlength : 6,
                    equalTo : "#CreatePassword"
                }
            });
        }
        $script([cms_js.data('validate')], function () {
            registerForm.addClass('init');
            registerForm.validate({
                rules : rules
            });
            registerForm.find( "button" ).click(function() {
              console.log( "Valid: " + registerForm.valid() );
            });
        });
    }
    return fn;
}());
alzThemes.countUpAndNumberProcess = function () {
    var count = $('.number-count');
    if(count.length){
        $script([cms_js.data('counterup')], function(){
            setTimeout(function(){
              $('.number-count').counterUp();
            }, 10);
        });
    }
    $('.number-process').each(function() {
      var counter = 0;
      var data_count = $(this).data('count');
      setInterval(() => {
        if(counter == data_count ){
          clearInterval();
        }
        else{
          counter+=1;
          $(this).css('width', counter + '%');
        }
      }, 80);
    });
}();
alzThemes.Megamenu = function () {
    function Menu() {
        this.init();
    };

    Menu.prototype = $.extend({}, Menu.prototype, {
        init: function () {
            this.sticky($('.header-sticky'));
            this.lazyMenu();
            this.accordion();
        },
        sticky: function (sticky) {
            if(!sticky.length) return;
            let bodyHtml = $('body, html');
            let body = $('body');
            let sticky_p = sticky.offset().top;
            let page_p = 0;
            let header = $("header");
            body.attr('sticky', sticky.height()).css('--sticky-height', sticky.height() + 'px');
            $(window).on('scroll', () => {
                let page_scroll = bodyHtml.scrollTop();
                let header_classes     = 'is-sticky';
                if (page_scroll > sticky_p){
                    header.addClass(header_classes);
                } else {
                    header.removeClass(header_classes);
                }
                if (page_p < page_scroll && page_scroll > 0) {
                    $('body').addClass("scrollDown").removeClass("scrollUp");
                } else if (page_p > page_scroll && page_scroll > 0) {
                  $('body').addClass("scrollUp").removeClass("scrollDown");
                } else {
                  $('body').addClass("scrollUp").removeClass("scrollDown");
                }
                page_p = page_scroll;
            });
        },
        lazyMenu: function(){
            $('body').on('lazyincluded', '.type_mega .lazy_menu', function (e) {
              $(this).find('a').each(function() {
                  if($(this).find('.fix').length) return;
                  var href = new URL($(this).attr('href'));
                  href.searchParams.set('preview_theme_id', Shopify.theme.id);
                  $(this).attr('href', href.toString());
              });
              var p_id = $(this).attr("id");
              $("#"+p_id +" .product-slider-nav").gridSlider();
              alzThemes.ProductReview();
            });
        },
        allCategories: function () {
            var $vmenu = $('.vertical_menu');
            var moreCat = $vmenu.find('.js-all-cat');
            var num = moreCat.data('numb');
            var allCategories = $vmenu.find('.lazy_vertical_menu > li').not('.js-all-cat');
            if(allCategories.hasClass('init')){
              return;
            } else {
              allCategories.addClass('init');
            }
            allCategories.each(function (index) {
              if (index >= num) {
                $(this).hide();
              }
            });
            var catplus = $vmenu.find('.lazy_vertical_menu > li:hidden').not('.js-all-cat');
            var style = moreCat.data('style');
            if (catplus.length) {
              if (style == 'nextcats') {
                $vmenu.find('.js-all-cat').show().click(function (event) {
                  allCategories.slideToggle('slow');
                  moreCat.toggleClass('less');
                });
              } else {
                $vmenu.find('.js-all-cat').show().click(function (event) {
                  catplus.slideToggle('slow');
                  moreCat.toggleClass('less');
                });
              }
            } else {
              moreCat.hide();
            }
        },
        accordion: function () {
            /* sidebar accordion menu */
            $('.nav-accordion').magicaccordion({ openedActive: true });
            $('.nav-accordion_categories').magicaccordion({ openedActive: true });
        },
    });

    return new Menu();
}();

alzThemes.Footer = function () {
    /* footer mobile */
    $(document).on('click', '.js-mobile-toggle', function () {
      $(this).next(".js-mobile-toggle-content").slideToggle(400);
      $(this).parent().toggleClass('active');
    });
    var copyRight = $body.find('.copyright');
    if(!copyRight.length) return;
    copyRight.html(copyRight.html().replace("yyyy", new Date().getFullYear()));
}();

$(function ($) {
    "use strict";

    function searchURL(url) {
        try {
            var arr = url.split('&product_type='),
                arr_q = arr[1].split('&q='),
                query = arr[0] + '&q=' + arr_q[1];
            if(arr_q[0] != '*'){
                query += '*' + '+product_type:' + arr_q[0];
            }
            return query;
        } catch (e) {
            return url + '*';
        }
    };

    alzShopify = (function () {
        return {
            init: function () {
                alzShopify.sidePopup();
                alzShopify.searchAjax();
                alzShopify.searchType();
                alzShopify.ajaxCart();
                alzShopify.stickyAddToCart();
                alzShopify.miniCart();
                alzShopify.miniCartAddons();
                alzShopify.mainCart();
                alzShopify.init_popup();
                alzShopify.sc_lazy();
                alzShopify.back_to_top();
                alzShopify.editCart();
                alzShopify.mainProduct();
                alzShopify.quickView();
                alzShopify.Sortby();
                alzShopify.quantity();
                alzShopify.Numberby();
                alzShopify.changeTagFilter();
                alzShopify.priceSlider();
                alzShopify.changeView();
                alzShopify.sticky_Sidebar();
                alzShopify.sticky_Product();
                alzShopify.sidebarhomepage();
                alzShopify.mobileSidebar();
                alzShopify.countdownProduct();
                alzShopify.InitPopupVideo();
                alzShopify.PromotionPopup();
                alzShopify.NewsletterPopup();
                alzShopify.tab_heading();
                alzShopify.PagePopup();
                alzShopify.SalesPopup();
            },
            getRandomInt: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            SalesPopup: function () {
                if ($(window).width() < mobileScreen) return;
                var popup = $('div[data-popup-crossell]');
                if (!popup.length) return;
                var stt = popup.data('stt'),
                    show = stt.show,
                    limit = stt.limit - 1,
                    pp_type = stt.pp_type,
                    catLink = stt.catlink,
                    arrId = JSON.parse($('#id_sale_pp').html()),
                    arrTitle = JSON.parse($('#title_sale_pp').html()),
                    arrUrl = stt.url,
                    arrImage = stt.image,
                    arrID = stt.id,
                    arrLocation = JSON.parse($('#location_sale_pp').html()),
                    arrTime = JSON.parse($('#time_sale_pp').html()),
                    ClassUp = stt.ClassUp,
                    ClassDown = stt.classDown[ClassUp],
                    StarTimeout, StayTimeout,
                    slpr_img = $('.js_slpr_img'),
                    slpr_a = $('.js_slpr_a'),
                    slpr_tt = $('.js_slpr_tt'),
                    slpr_location = $('.js_slpr_location'),
                    slpr_ago = $('.js_slpr_ago'),
                    slpr_qv = $('.pp_slpr_qv'),
                    index = 0,
                    min = 0,
                    max = arrUrl.length - 1,
                    max2 = arrLocation.length - 1,
                    max3 = arrTime.length - 1,
                    StarTime = stt.StarTime * stt.StarTime_unit,
                    StayTime = stt.StayTime * stt.StayTime_unit;

                var Updatedata = function (index) {
                    var img = arrImage[index],
                        img_url = img.replace(".jpg?v=", "_80x.jpg?v=").replace(".png?v=", "_70x.png?v=").replace(".gif?v=", "_70x.gif?v="),
                        img_url2 = img.replace(".jpg?v=", "_130x.jpg?v=").replace(".png?v=", "_130x.png?v=").replace(".gif?v=", "_130x.gif?v=");
                    slpr_img.attr('src', img_url).attr('srcset', img_url + ' 1x,' + img_url2 + ' 2x');
                    slpr_tt.html(arrTitle[index]);
                    slpr_tt.attr("data-pid", arrId[index]);
                    slpr_a.attr('href', arrUrl[index]);
                    /* update id quick view */
                    slpr_qv.attr('data-id', arrID[index]);
                    slpr_location.html(arrLocation[alzShopify.getRandomInt(min, max2)]);
                    /* update time */
                    slpr_ago.html(arrTime[alzShopify.getRandomInt(min, max3)]);
                    showSalesPopUp();
                };
                /* Load sales popup */
                var loadSalesPopup = function () {
                    if (pp_type == '1') {
                        Updatedata(index);
                        ++index;
                        if (index > limit || index > max) { index = 0 }
                    } else {
                        Updatedata(alzShopify.getRandomInt(min, max));
                    }
                    StayTimeout = setTimeout(function () {
                        unloadSalesPopup();
                    }, StayTime);
                };

                /* unLoad sales popup */
                var unloadSalesPopup = function () {
                    hideSalesPopUp();
                    StarTimeout = setTimeout(function () {
                        loadSalesPopup();
                    }, StarTime);
                };
                var showSalesPopUp = function () {
                    popup.removeClass('hide').addClass(ClassUp).removeClass(ClassDown);
                };
                var hideSalesPopUp = function () {
                    popup.removeClass(ClassUp).addClass(ClassDown);
                };
                $(".pp_slpr_close").on("click", function (e) {
                    e.preventDefault();
                    hideSalesPopUp();
                    clearTimeout(StayTimeout);
                    clearTimeout(StarTimeout);
                });
                popup.on('open_slpr_pp', function () {
                    unloadSalesPopup();
                });
                unloadSalesPopup();
            },
            back_to_top: function () {
                var $backToTop = $body.find('.back-to-top');
                var lastScrollTop = 0;
                $(window).on('scroll', function () {
                    var st = $(this).scrollTop();
                    if(st + $(this).height() == $(document).height()){
                        $body.addClass('scroll_down_end');
                    }else {
                        $body.removeClass('scroll_down_end');
                    }
                    if(st == 0){
                        $body.addClass('scroll_up_end');
                    }else {
                        $body.removeClass('scroll_up_end');
                    }
                    if (st > lastScrollTop){
                        $body.removeClass('scroll_up scroll_init').addClass('scroll_down');
                    } else if(st == lastScrollTop){
                        $body.removeClass('scroll_down scroll_up').addClass('scroll_init');
                    } else {
                        $body.removeClass('scroll_down scroll_init').addClass('scroll_up');
                    }
                    lastScrollTop = st;
                    if (st > 300) {
                        $backToTop.addClass('show');
                    } else {
                        $backToTop.removeClass('show');
                    }
                });
                $(document).on('click', '.back-to-top', function () {
                    $('html, body').animate({ scrollTop: 0 }, 800);
                    return false;
                });
            },
            priceSlider: function () {
                if ( !($body.hasClass('template-collection') || $body.hasClass('template-search')) ) return;
                if(!cms_js.data('nouislider')) return;
                $script([cms_js.data('nouislider')], function () {
                    $(window).on('collectionUpdated contentUpdated filterUpdated', function(event){
                        var $priceRange = document.getElementsByTagName("price-range");
                        if(!$priceRange.length) return;
                        var style = document.createElement('link');
                            style.rel  = 'stylesheet';
                            style.type = 'text/css';
                            style.href = cms_js.data('nouislider-style');
                            style.media = 'all';
                            document.head.appendChild(style);
                        Array.from($priceRange).forEach(function (element) {
                            if(element.classList.contains('price-slider-init')){
                                return;
                            }
                            element.classList.add('price-slider-init');
                            var $min = element.querySelector('[name="filter.v.price.gte"]'),
                                $max = element.querySelector('[name="filter.v.price.lte"]'),
                                min = parseInt($min.getAttribute('min')),
                                max = parseInt($max.getAttribute('max')),
                                minStart = ($min.value !== '') ? parseInt($min.value) : min,
                                maxStart = ($max.value !== '') ? parseInt($max.value) : max,
                                step = parseFloat($max.getAttribute('step')),
                                divSlider = document.createElement('div');
                            divSlider.setAttribute('id', 'price-slider');
                            element.parentNode.insertBefore(divSlider, element);
                            var priceSlider = element.parentNode.querySelector('#price-slider'),
                                direction = $body.hasClass('rtl') ? 'rtl' : 'ltr';
                            noUiSlider.create(priceSlider, {
                                start: [minStart, maxStart],
                                step: isNaN(step) ? 1 : step,
                                connect: true,
                                direction: direction,
                                range: {
                                  'min': min,
                                  'max': max
                                }
                            });
                            priceSlider.noUiSlider.on('change', function (values, handle) {
                                if (handle) {
                                    $max.value = parseFloat(values[handle]).toFixed();
                                    $max.dispatchEvent(new Event('input', { bubbles: true }));
                                }else {
                                    $min.value = parseFloat(values[handle]).toFixed();
                                    $min.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            });
                            $min.addEventListener('input', function (e) {
                                priceSlider.noUiSlider.set([this.value, null]);
                            });
                            $max.addEventListener('input', function (e) {
                                priceSlider.noUiSlider.set([null, this.value]);
                            });
                        });
                    });

                    $('body').trigger('contentUpdated');
                    var facetFiltersForm = document.querySelector('#FacetFiltersForm');
                    if(facetFiltersForm){
                        facetFiltersForm.addEventListener('DOMSubtreeModified', function () {
                            $('body').trigger('filterUpdated');
                        }, false);
                    }
                    var collectionFiltersForm = document.querySelector('#CollectionFiltersForm');
                    if(collectionFiltersForm){
                        collectionFiltersForm.addEventListener('DOMSubtreeModified', function () {
                            $('body').trigger('filterUpdated');
                        }, false);
                    }
                });
            },
            sidePopup: function () {
                var mask = $body.find('.mask-overlay'),
                    classActive = 'act_current';
                $(document).on("click", ".push_side", function (e) {
                    var _this = $(this),
                        _id = _this.data('id'),
                        $id = $(_id);
                    if (!$id.length) return;
                    e.preventDefault();
                    $('html').trigger('popupOff');
                    closeMenu();
                    if (!_this.hasClass(classActive)) { openMenu(_this, _id, $id) }
                });
                $(document).on("click touchstart", ".mask-overlay, .act_opened .close_popup_ajax", function (e) {
                    closeMenu();
                    $('html').trigger('maskOverlayOff');
                });
                function openMenu(_this, _id, $id) {
                    _this.addClass(classActive);
                    $html.addClass('hside_opened');
                    $html.addClass('pside_opened');
                    $id.addClass('act_opened');
                    mask.addClass('mask_opened');
                }
                function closeMenu() {
                    $('.push_side.act_current').removeClass(classActive);
                    $html.removeClass('hside_opened');
                    $html.removeClass('pside_opened');
                    $('.hero_canvas.act_opened').removeClass('act_opened');
                    mask.removeClass('mask_opened');
                }
            },
            searchAjax: function () {
                if ($body.hasClass('js_search_false')) return;
                var slug_js = '&view=js', timer = 0, data, _this, wrap, frm, $result, val_old, val_currect;
                var input = $('.js_iput_search');
                /* add search mask */
                $(document).on('keyup', '.js_iput_search', function (e, bl) {
                    _this = $(this);
                    wrap = _this.closest('.alz-search');
                    frm = _this.closest("form");
                    _this.attr('autocomplete', 'on');
                    $result = $('.js_prs_search');
                    if (e.code === "Escape" || bl === "Escape"){
                        _this.val('');
                    }
                    val_currect = _this.val();
                    console.log(bl);
                    console.log(val_currect);
                    console.log('s1: ');
                    console.log(wrap.attr('class'));
                    if (val_currect == ""){
                        val_old = val_currect;
                        wrap.removeClass('open_result');
                        wrap.removeClass('typing');
                    }
                    if ((val_old == val_currect || val_currect == "") && bl != '1') return;
                    wrap.removeClass('open_result');
                    wrap.addClass('loading');
                    wrap.addClass('typing');
                    console.log('s2: ');
                    console.log(wrap.attr('class'));
                    slug_js = '&view=js';
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        data = searchURL(frm.serialize());
                        $.ajax({
                            url: frm.attr('action'),
                            data: data + slug_js,
                            success: function (result) {
                                console.log('s3: ');
                                console.log(wrap.attr('class'));
                                var arr = result.split('||');
                                $(arr[0]).show();
                                $result.html(arr[1]);
                                val_old = val_currect;
                                console.log('success');
                                console.log('s4: ');
                                console.log(wrap.attr('class'));
                            },
                            complete: function () {
                                console.log('s5: ');
                                console.log(wrap.attr('class'));
                                wrap.addClass('open_result');
                                wrap.removeClass('loading');
                                console.log('complete');
                                console.log('s6: ');
                                console.log(wrap.attr('class'));
                            }
                        });
                    }, 400);
                });
                $body.on('click', function (e) {
                    var target = e.target;
                    if (!$(target).is('.alz-search') && !$(target).parents().is('.alz-search')) {
                        $('.open_result').removeClass('open_result');
                        val_old = '';
                    }
                });
                input.on('focus', function() {
                    if($(this).val()){
                        $(this).closest('.alz-search').addClass("open_result");
                    }
                });
                $('.search-loader').on('click', function() {
                    $(this).closest('.alz-search').find('.js_iput_search').trigger('keyup', 'Escape').focus();
                });
                $('.alz-search').on('change', 'select', function () {
                    $('.alz-search .js_iput_search').trigger('keyup', 1);
                });
            },
            searchType: function () {
                $body.on('click', '.js_btn_search', function (e) {
                    e.preventDefault();
                    var _frm  = $(this).closest("form"),
                        query = _frm.find('input[name="q"]').val();
                    if(query){
                        location.href = _frm.attr('action') + '?' + searchURL(_frm.serialize());
                    }
                });
            },
            CreatNotices: function (txt) {
                var $sp_notices = $('#sp_notices_wrapper');
                $sp_notices.html('<p class="shopify-info sp_notice"><i class="facl facl-attention"></i>' + txt + '<i class="pegk pe-7s-close"></i></p>');
                setTimeout(function () { $sp_notices.find('.sp_notice').addClass('show_notice'); }, 200);
            },
            onError: function (XMLHttpRequest, textStatus) {
                var data = eval('(' + XMLHttpRequest.responseText + ')');
                alzShopify.CreatNotices(data.description);
            },
            quantity: function () {
                $(document).on('click', '.js-quantity .js_minus, .js-quantity .js_plus', function (e) {
                    e.preventDefault();
                    var $qty = $(this).closest(".js-quantity").find('.js_qty'),
                        currentVal = parseFloat($qty.val()),
                        max = parseFloat($qty.data('max')),
                        min = parseFloat($qty.data('min')),
                        step = $qty.data('step');
                    if($qty.data('product-id')){
                        $('body').trigger('startLoading');
                        $(this).addClass('ajax-loading');
                    }
                    if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
                    if (max === '' || max === 'NaN' || max < 0) max = '';
                    if (min === '' || min === 'NaN') min = 0;
                    if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;
                    if ($(this).is('.js_plus')) {
                        if (max && (max == currentVal || currentVal > max)) {
                            $qty.val(max);
                        } else {
                            $qty.val(currentVal + parseFloat(step));
                        }
                    } else {
                        if (min && (min == currentVal || currentVal < min)) {
                            $qty.val(min);
                        } else if (currentVal > 0) {
                            $qty.val(currentVal - parseFloat(step));
                        }
                    }
                    $qty.trigger('change');
                });
            },
            ajaxCart: function () {
                var ajaxcartDisabled = ( '' == 'false' ),
                    ajaxcartAfter    ="sidebar_cart",
                    disableAutoSelect = ( '' == 'disable' );
                if(ajaxcartDisabled) return;
                $(document).on('click', '.js_add_to_cart_button', function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        $form = $this.closest('form'),
                        $product = $this.closest('.product-item'),
                        drawerQuery = '';
                    $this.addClass('ajax_loading');
                    if(!$form.length){
                        $form = $product.find('form');
                        if(!$form.length){
                            $form  = $('<form><input type="hidden" name="utf8" value="✓"><input type="hidden" name="form_type" value="product" tabindex="0"></form>');
                        }
                    }
                    if(!$form.find('[name="id"], [name="variant_id "]').length){
                        $form.append('<input name="id" type="hidden" value="' + $this.data('pid') + '">');
                    }
                    if(!$form.find('[name="quantity"]').length && $product.find('[name="quantity"]').length){
                        $form.append('<input name="quantity" type="hidden" value="' + $product.find('[name="quantity"]').val() + '">');
                    }
                    if($body.hasClass('template-product')){
                        var singleProduct = $form.closest('.js_product_single');
                        if( singleProduct.length ){
                            if(disableAutoSelect){
                                var options = singleProduct.find('.option-item .active');
                                if(!options.length){
                                    alert("Select Options");
                                    $this.removeClass('ajax_loading');
                                    return;
                                }
                            }
                            var drawer = {
                                sections: 'cart-notification-product,cart-notification-button,cart-icon-bubble',
                                sections_url: window.location.pathname
                            };
                            drawerQuery = '&' + Object.keys(drawer).map(key => {
                                return `${key}=${encodeURIComponent(drawer[key])}`;
                            }).join('&');
                        }
                    }
                    $('body').trigger('beforeAjax:addToCart', $form);
                    $.ajax({
                        type: 'POST',
                        url: Shopify.routes.root + 'cart/add.js',
                        data: $form.serialize() + drawerQuery,
                        dataType: 'json',
                        success: function (response) {
                            $this.removeClass('ajax_loading');
                            $this.addClass('added').find('.text').text("Added");
                            $('.js_add_to_cart_button').removeAttr("disabled").css('pointer-events', 'auto');
                            $('body').trigger('ajax:addToCart', {
                                'form': $form,
                                'response': response
                            });
                            if(ajaxcartAfter == 'reload'){
                                location.reload();
                                return;
                            } else if(ajaxcartAfter && ajaxcartAfter != 'sidebar_cart'){
                                document.location.href = Shopify.routes.root + ajaxcartAfter;
                                return;
                            }
                            setTimeout(function () {
                                if(!$this.is(':disabled')){
                                    $this.removeClass('added').find('.text').text("Add to cart");
                                }
                            }, 1000);
                            if ($html.hasClass('pside_opened')) return;
                            if(ajaxcartAfter == 'sidebar_cart'){
                                $('.push_side[data-id="#js_cart_popup"]').trigger('click');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus) {
                            $this.attr('disabled', 'disabled').attr('data-button-status', 'sold-out');
                            $this.addClass('sold_out').find('.text').text("Sold Out");
                            $this.removeClass('ajax_loading');
                        }
                    });
                });
                $(document).on('click', ".js-remove-item", function (event) {
                    event.preventDefault();
                    var $this = $(this),
                        $item = $this.closest('.product-item'),
                        $page = $('body');
                    $('body').trigger('startLoading');
                    $item.addClass('ajax-loading');
                    $.ajax({
                        url: Shopify.routes.root + 'cart/update.js',
                        type: 'POST',
                        dataType: 'json',
                        data: "updates[" + $this.data('id') + "]=0",
                        success: function (data) {
                            $('body').trigger('endLoading');
                            if($page.hasClass('template-cart')){
                                $item.remove();
                            }
                            $('body').trigger('ajax:deleteCart', {
                                'productId': $this.data('id'),
                                'response': data
                            });
                        }
                    });
                });
                $(document).on('change', ".js-quantity .js_qty", function (event) {
                    event.preventDefault();
                    var $this = $(this);
                    var productId = $this.data('product-id') ? $this.data('product-id') : $this.attr('id');
                    if( !productId || $this.is("#Quantity") ) return;
                    productId = isNaN(productId) ? productId.replace(/\D/g, '') : productId;
                    var quanlity  = $this.val();
                    $('#updates_' + productId).val(quanlity);
                    var $item  = $this.closest('.each-item');
                    $('body').trigger('startLoading');
                    $item.addClass('ajax-loading');
                    $.ajax({
                        url: Shopify.routes.root + 'cart/update.js',
                        type: 'POST',
                        dataType: 'json',
                        data: "updates[" + productId + "]=" + quanlity + "",
                        success: function (data) {
                            $('body').trigger('endLoading');
                            $item.removeClass('ajax-loading');
                            $('body').trigger('ajax:updateCart', {
                                'productId': productId,
                                'response': data
                            });
                        }
                    });
                });
            },
            stickyAddToCart: function () {
                var $product = $('.js_product_single'),
                    $stickyCart = $('.js_sticky_atc_wrapper');
                if(!$product.length || !$stickyCart.length){
                    return;
                }
                var dataJson = $stickyCart.find('.data-json-product'),
                    json = dataJson.length ? JSON.parse(dataJson.html()) : $stickyCart.data('json-product'),
                    variants = json.variants,
                    $trigger   = $('.product-summary');
                if (!$stickyCart.length || !$trigger.length || ($(window).width() < mobileScreen && $stickyCart.hasClass('mobile_false'))) return;
                var summaryOffset = $trigger.offset().top + $trigger.outerHeight(),
                    slpr_wrap = $('div[data-popup-crossell]'),
                    _footer = $('.footer'),
                    off_footer = 0,
                    ck_footer = _footer.length > 0;

                var stickyAddToCartToggle = (function fn() {
                    var windowScroll = $(window).scrollTop(),
                        windowHeight = $(window).height(),
                        documentHeight = $(document).height();
                    if (ck_footer) {
                        off_footer = _footer.offset().top - _footer.height();
                    } else {
                        off_footer = windowScroll;
                    }

                    if (windowScroll + windowHeight == documentHeight || summaryOffset > windowScroll || windowScroll > off_footer) {
                        $body.removeClass('show-sticky');
                        $stickyCart.removeClass('sticky_atc_shown');
                        slpr_wrap.removeClass('sticky_atc_shown');
                    } else if (summaryOffset < windowScroll && windowScroll + windowHeight != documentHeight) {
                        $body.addClass('show-sticky');
                        $stickyCart.addClass('sticky_atc_shown');
                        slpr_wrap.addClass('sticky_atc_shown');
                    }
                    return fn;
                }());
                if(variants){
                    $stickyCart.find('.popup_variant').on('click', function(){
                        $(this).closest('.wrap_variant').toggleClass('active');
                    });
                    var optionsItem = $stickyCart.find('.option-item'),
                        selectItem  = $('.js_sticky_atc_wrapper .js_sticky_sl'),
                        selectSticky = selectItem.closest('.select-sticky');
                    $(window).on('click', function(e){
                        let elTarget = $(e.target);
                        if(elTarget.is(selectItem) && !selectItem.closest('.select-sticky').hasClass('open')){
                            selectItem.closest('.select-sticky').addClass('open');
                        }else {
                            selectItem.closest('.select-sticky').removeClass('open');
                        }
                    });
                    selectItem.on('change', function () {
                        $(this).closest('.select-sticky').removeClass('open');
                        var variantId = $(this).val();
                        $.each(variants, function(index, value){
                            if(value && value.id == variantId){
                                /* $product.find('[name="id"]').val(variantId); */
                                var options = value.options;
                                $.each(options, function(idx, val){
                                    var stripSymbols = '-+!"\'#$€₹%&*,./:;<=>?@[\\]_`{|}~()°^';
                                    var stripSymbolsArr = stripSymbols.split('');
                                    for (var i = 0; i < stripSymbolsArr.length; i++) {
                                        val = val.replace(stripSymbolsArr[i],'');
                                    }
                                    val = val.replace('\\','').replace(/\s/g,'');
                                    optionsItem.eq(idx).find('[data-value="' + val + '"]').trigger('click');
                                });
                            }
                        });
                    });
                    $product.find('[name="id"]').on('input', function () {
                        var selectVal = selectItem.val(),
                            idVal = $(this).val();
                        if(selectVal != idVal){
                            selectItem.val(idVal);
                        }
                    });
                }
                $(window).on('scroll', stickyAddToCartToggle);
                $('.js_sticky_atc_wrapper .js_sticky_qty').on('change', function () {
                    $('#Quantity .js_qty').val($(this).val())
                });
                $('#Quantity .js_sticky_qty').on('change', function () {
                    $('.js_sticky_atc_wrapper .js_qty').val($(this).val());
                });
                $(document).on('click', '.sticky_atc_js', function (e) {
                    var $product = $('.js_product_single');
                    if(!$product.length) return;
                    var qty = parseInt($('.js_sticky_qty').val());
                    $product.find('input[name="quantity"]').val(qty);
                    $product.find('.js_add_to_cart_button').trigger('click');
                });
            },
            miniCart: function () {
                $(document).on('update:miniCart ajax:addToCart ajax:updateCart ajax:deleteCart', function (e) {
                    var $minicart = $('#js_cart_popup');
                    $.ajax({
                        async: false,
                        cache: false,
                        url: Shopify.routes.root + 'cart?view=minicart',
                        type: 'GET',
                        dataType: 'html',
                        success: function (response) {
                            var cart = $(response);
                            if(cart.find('#MainContent').length) cart = cart.find('#MainContent');
                            $minicart.html(cart);
                            var data = cart.find('#json-data-cart');
                            data = JSON.parse(data.text());
                            $(".js-total-price").html(Shopify.formatMoney(data.total_price, theme.moneyFormat)).find('.money').css('opacity', '0').delay(500).fadeTo(50, 1);
                            $(".js-cart-count").html(data.item_count);
                            updateFreeShipping(data);
                            $('body').trigger('contentUpdated');
                        },
                        error: function (request, status, error) {
                            window.location.reload();
                        }
                    });
                });

                window.addEventListener('pageshow', function (event) {
                    if (event.persisted) {
                        $('body').trigger('update:miniCart');
                    }
                }, false);

                function updateFreeShipping(data) {
                    var $free_shipping = $('.js-free-shipping'),
                        $progress = $free_shipping.find('[data-js-progress]'),
                        $massage = $free_shipping.find('[data-js-text]'),
                        $spend_html = $free_shipping.find('.spend_html'),
                        $free_html = $free_shipping.find('.free_html'),
                        $shipping = $('.template-cart .shipping_at_checkout'),
                        $shipping_note = $('.template-cart .cart__shipping_note'),
                        value = $free_shipping.attr('data-value'),
                        total = data.total_price,
                        procent = Math.min(total / (value / 100), 100),
                        money = Math.max(value - total, 0);
                    if (money > 0) {
                        $massage.html($spend_html.html());
                        var moneyHtml = $massage.find('.money');
                        if(moneyHtml.length){
                            $massage.find('.money').html(Shopify.formatMoney(money, theme.moneyFormat));
                        }else {
                            var htlmMsg = $massage.html();
                            var oldPrice = htlmMsg.replace(/[^0-9.,-]+/g,"");
                            if(oldPrice){
                                var newPrice = Shopify.formatMoney(money, theme.moneyFormat).replace(/[^0-9.,-]+/g,"");
                                var newHtml  = htlmMsg.replace(oldPrice, newPrice);
                                $massage.html(newHtml);
                            }
                        }
                        if ($shipping.length) $shipping.addClass('hidden');
                        if ($shipping_note.length) $shipping_note.removeClass('hidden');
                    } else {
                        $massage.html($free_html.html());
                        if ($shipping.length) $shipping.removeClass('hidden');
                        if ($shipping_note.length) $shipping_note.addClass('hidden');
                    }
                    $progress.css({
                        width: procent + '%'
                    });
                }

            },
            miniCartAddons: function () {
                $(document).on('click', '#js_cart_popup', function(e){
                    if($(e.target).is('#js_cart_popup') && $(this).hasClass('addons-open')){
                        $(this).find('.cart-addon.open .btn-cancel').trigger('click');
                    }
                });
                $(document).on('click', '.mini_cart_addon_btn', function(){
                    var cartPopup = $(this).closest('#js_cart_popup');
                    cartPopup.addClass('addons-open').find('#addon_' + $(this).data('open')).addClass('open').siblings().removeClass('open');
                    if(localStorage.getItem('storedDiscount')){
                        cartPopup.find('[name="discount"]').val(localStorage.getItem('storedDiscount'));
                    }
                });
                $(document).on('click', '.cart-addon .btn-cancel', function(){
                    $(this).closest('#js_cart_popup').removeClass('addons-open').find('.cart-addon').removeClass('open');
                });
                $(document).on('click', '.cart-addon [data-action]', function(e){
                    var addon = $(this).closest('.cart-addon'),
                        bodyX = addon.find('[name]').serialize(),
                        bodyX = new URLSearchParams(bodyX),
                        bodyX = Object.fromEntries(bodyX),
                        body  = JSON.stringify(bodyX);
                    switch($(this).data('action')) {
                      case 'note':
                        fetch(`${window.routes.cart_update_url}`, {...fetchConfig(), ...{body}});
                        break;
                      case 'discount':
                        localStorage.setItem('storedDiscount', bodyX.discount);
                        var url = window.Shopify.routes.root + `discount/${bodyX.discount}`
                        fetch(`${url}`);
                        break;
                      default:
                        fetch(`${window.routes.cart_update_url}`, {...fetchConfig(), ...{body}});
                    }
                    addon.find('.btn-cancel').trigger('click');
                });
                $('body').on('ajax:addToCart', function(){
                    $('#js_cart_popup').removeClass('addons-open');
                });
            },
            mainCart: function() {
                if (!$body.hasClass('template-cart')) return;

                /* Discount */
                var saveTotal = (function fn() {
                    var discount = 0;
                    $('.discounts__discount').each(function () {
                        if($(this).data('discount')){
                            discount += parseFloat($(this).data('discount'));
                        }
                    });
                    $('.alz-discount').each(function () {
                        if($(this).data('total-save')){
                            var qty = $(this).closest('.quantity-item').find('.js_qty').val();
                            discount += parseFloat(qty)*parseFloat($(this).data('total-save'));
                        }
                    });

                    if(discount){
                        $('.total-discount').show().find('.total-save').html(Shopify.formatMoney(discount, theme.moneyFormat));
                    }
                    return fn;
                }());
                $(document).on('ajax:addToCart ajax:updateCart ajax:deleteCart', function (e, $data) {
                    var data = $data.response,
                        cartTotal = $('.cart-total'),
                        shoppingCart = $('.cart-table'),
                        items = data.items,
                        subtotal = Shopify.formatMoney(data.items_subtotal_price, theme.moneyFormat),
                        total = Shopify.formatMoney(data.total_price, theme.moneyFormat);
                    cartTotal.find('.subtotal .price').html(subtotal).find('.money').css('opacity', '0').delay(500).fadeTo(50, 1);
                    cartTotal.find('.total .price').html(total).find('.money').css('opacity', '0').delay(500).fadeTo(50, 1);
                    $.each(items, function (key, item) {
                        var id = item.id;
                        var price = Shopify.formatMoney(item.final_line_price, theme.moneyFormat);
                        var element = shoppingCart.find('#item-id-' + id);
                        if (element.length) {
                            element.find('.total .price').html(price).find('.money').css('opacity', '0').delay(500).fadeTo(50, 1);
                        }
                    });
                    saveTotal();
                });
                if(localStorage.getItem('storedDiscount')){
                    $('[name="discount"]').val(localStorage.getItem('storedDiscount'));
                }
                /* Add to cart on page cart */
                $('body').on('ajax:addToCart', function(){
                    var mainSection = $('.cart-page');
                    if(mainSection.length){
                        var sectionId = mainSection.attr('id').replace('shopify-section-', '');
                        fetch(`${window.routes.cart_url}?section_id=${sectionId}`)
                        .then((response) => response.text())
                        .then((responseText) => {
                            const html = new DOMParser().parseFromString(responseText, 'text/html');
                            const source = html.getElementById(`shopify-section-${sectionId}`);
                            const destination = document.getElementById(`shopify-section-${sectionId}`);
                            if (source && destination) destination.innerHTML = source.innerHTML;
                            saveTotal();
                        });
                    }
                });
            },
            refresh_masonry: function (el) {
                var option = el.attr("data-isotope") || '{}';
                el.isotope(JSON.parse(option));
            },
            sc_lazy: function () {
                var $inc_lz = $('.inc_lz');
                if (!$inc_lz.length && $('.inl_cnt_js').length) return;
                /* collection */
                $('.inc_pr_laz').each(function () {
                    $(this).addClass('lazyload').one('lazyincluded', function (e) {
                        if (e.detail.content) {
                            var el = $(e.target).find('.js_carousel');
                            if (!el.length) return;
                        } else {
                            $(e.target).hide().remove();
                        }
                    });
                });
                /* lookbook */
                $('.inc_lb_laz, .inc_cat_laz, .inc_gl_laz, .inc_ins_laz').each(function () {
                    $(this).addClass('lazyload').one('lazyincluded', function (e) {
                        if (e.detail.content) {
                        } else {
                            $(e.target).hide().remove();
                        }
                    });
                })
            },
            init_popup: function () {
                $body.on('click', '[data-opennt]', function (e) {
                    var $this = $(e.currentTarget),
                        datas = $this.data(),
                        id = datas.opennt,
                        color = datas.color,
                        bg = datas.bg,
                        position = datas.pos,
                        ani = datas.ani || 'has_ntcanvas',
                        remove = datas.remove,
                        cl = datas.class,
                        close = datas.close || false,
                        focuslast = datas.focuslast || false,
                        focus = $this.attr("data-focus"),
                        YOffset = window.pageYOffset,
                        height = window.height - $('#shopify-section-header_banner').outerHeight() - $('.ntheader_wrapper').outerHeight();

                    $this.addClass("current_clicked");
                    $.magnificPopup.open({
                        items: {
                            src: id,
                            type: "inline",
                            tLoading: '<div class="loading-spin dark"></div>'
                        },
                        tClose: "Close (Esc)",
                        removalDelay: 300,
                        closeBtnInside: close,
                        focus: focus,
                        autoFocusLast: focuslast,
                        callbacks: {
                            beforeOpen: function () {
                                var classes =  ani + " " + color + " " + ani + "_" + position;
                                if($this.data('effect')) classes = classes + ' ' + $this.data('effect');
                                this.st.mainClass = classes;
                            },
                            open: function () {
                                $html.addClass(ani);
                                $html.addClass(ani + "_" + position);
                                cl && $(".mfp-content").addClass(cl);
                                bg && $(".mfp-bg").addClass(bg);

                                $("body").on('click', '.close_pp', function (e) {
                                    e.preventDefault();
                                    $.magnificPopup.close();
                                });
                                if (!YOffset) return;
                                $('html, body').scrollTop(YOffset);
                            },
                            beforeClose: function () {
                                $html.removeClass(ani);
                            },
                            afterClose: function () {
                                $html.removeClass(ani + "_" + position);
                                $(".current_clicked").removeClass("current_clicked");
                                remove && $(id).removeClass("mfp-hide");
                            }
                        }
                    });
                    e.preventDefault();
                })
            },
            editCart: function () {
                $(document).on('click', '#js_cart_popup .edit-cart, .js_select_options', function (event) {
                    event.preventDefault();
                    var $this = $(this),
                        item = $this.closest('.product-item');
                    $this.addClass('ajax-loading');
                    if($this.hasClass('edit-cart')){
                        item.addClass('ajax-loading');
                    }
                    if(!$('#quick-editcart-modal').length){
                        $body.append('<div id="quick-editcart-modal" class="popup-quickedit mfp-with-anim mfp-popup bigger" data-effect="mfp-move-horizontal" style="display:none"></div>');
                    }
                    var $quickEditcart = $("#quick-editcart-modal"),
                        url  = $(this).attr('href');
                        url +=  (url.includes('?') > 0 ) ? '&view=ajax-edit-cart': '?view=ajax-edit-cart';
                    $quickEditcart.show();
                    $quickEditcart.load(url + " #product-quick-edit-cart", function () {

                        $.magnificPopup.open({
                            items: {
                                src: '#quick-editcart-modal',
                                type: 'inline'
                            },
                            callbacks: {
                                beforeOpen: function() {
                                    if($quickEditcart.data('effect')) this.st.mainClass = $quickEditcart.data('effect');
                                    $('html').addClass('open-popup');
                                    $('html').addClass('open-edit-cart');
                                    $('body').trigger('endLoading');
                                    $this.removeClass('ajax-loading');
                                    item.removeClass('ajax-loading');
                                },
                                close: function(){
                                   $('html').removeClass('open-popup');
                                   $('html').removeClass('open-edit-cart');
                                }
                            },
                            type: 'inline',
                            removalDelay: 500
                        });
                        var $product = $quickEditcart.find('#product-quick-edit-cart'),
                            $addCart = $quickEditcart.find('.js_add_to_cart_button'),
                            productId = $addCart.data('pid'),
                            qty = item.find('input.js_qty').val();
                        if(!qty) qty = 1;
                        $product.find('input[name="quantity"]').val(qty);
                        $product.on('click', '.js_edit_cart_button', function(){
                            var $thisButton = $(this).addClass('ajax_loading'),
                                action = $this.is('edit-cart') ?  'change.js' : 'add.js'
                            $.ajax({
                                url: Shopify.routes.root + 'cart/' + action,
                                type: 'POST',
                                dataType: 'json',
                                data: {'id': productId, 'quantity': 0},
                                success: function (data) {
                                    $addCart.data('pid', $product.data('product-variant-id'));
                                    $addCart.trigger('click');
                                    $('body').on('ajax:addToCart', function(){
                                        $.magnificPopup.close();
                                        $thisButton.removeClass('ajax_loading');
                                    })
                                }
                            });
                        });
                    });
                });
            },
            mainProduct: function () {
                if(!$body.hasClass('template-product')) return;
                /* Init fotoraman */
                $script([$('#cms_js').data('fotorama')], function () {
                    var fotoramaElement = $('div[data-fotorama]'),
                        images = fotoramaElement.children().clone(),
                        startIndex = 0;
                    $("[data-js-gallery]").click(function (event, data) {
                        if(!fotoramaElement.hasClass('init')){
                            fotoramaElement.children().each(function() {
                                let lazy = $(this).data('src');
                                if(lazy){
                                    $(this).attr('src', lazy);
                                }
                            });
                            fotoramaElement.addClass('init');
                        }
                        if(data && data.imageId){
                            var imageId = data.imageId
                        } else {
                            var currentSlide = $("div[data-slide-main]").find('.slick-current');
                            if(currentSlide.length){
                                var imageId  = currentSlide.data('image-id');
                            }
                        }
                        images.each(function( index ) {
                            if($(this).data('image-id') == imageId){
                                startIndex = index;
                                return false;
                            }
                        });
                        var fotorama = fotoramaElement.fotorama({allowfullscreen: true, nav: 'thumbs'}).data('fotorama');
                        fotorama.show({index: startIndex, time: 0});
                        fotorama.requestFullScreen();
                    });
                    $('div[data-fotorama]').on('click', function (e, fotorama) {
                        if ($(e.target).hasClass("fotorama__stage__frame")) {
                            $('div[data-fotorama]').data('fotorama').cancelFullScreen();
                            $('div[data-slide-nav]').find(".slick-track").css("transform","none");
                        }
                    });
                });

                /* CLick slick arrow button */
                $(document).on('click','div[data-slide-nav] .slick-arrow', function(){
                    if ($("div[data-slide-nav] .thumb_img.slick-active").length > 0){
                        $("div[data-slide-nav] .thumb_img.slick-current").trigger('click');
                    }
                });
            },
            quickView: function () {
                $(document).on('click', '.quick-view, .js_quick_view', function (event) {
                    event.preventDefault();
                    $(this).addClass('ajax_loading');
                    var $quickView = $("#quick-view-modal"),
                        url = $(this).attr('href'),
                        isRTL = $body.hasClass('rtl');
                    $quickView.addClass('open');
                    $quickView.load(url + " #product-single", function () {
                        $('.button-quick-view').removeClass('ajax_loading');
                        $.magnificPopup.open({
                            items: {
                                src: '#quick-view-modal',
                                type: 'inline'
                            },
                            callbacks: {
                                beforeOpen: function() {
                                    if($quickView.data('effect')) this.st.mainClass = $quickView.data('effect');
                                    $('html').addClass('open-popup');
                                },
                                close: function(){
                                   $('html').removeClass('open-popup');
                                }
                            },
                            type: 'inline',
                            removalDelay: 500
                        });
                        alzThemes.ProductReview();
                        alzShopify.countdownProduct();
                        var initSwipe = true,
                            slideMain = $quickView.find('div[data-slide-main]');
                        slideMain.on('init afterChange', function (event, slick, currentSlide, nextSlide) {
                            if(event.type == 'init'){
                                initSwipe = slick.options.swipe;
                            }
                            var slickCurrent = $(slick.$slides.get(currentSlide)),
                                mediaType    = slickCurrent.data('media_type');
                            $html.removeClass (function (index, className) {
                                return (className.match (/(^|\s)media_type-\S+/g) || []).join(' ');
                            }).addClass('media_type-' + mediaType);
                            if(mediaType == 'model'){
                                var modelViewer = $(event.target).find('model-viewer');
                                if(!modelViewer.hasClass('shopify-model-viewer-ui__disabled')){
                                    slick.options.swipe = false;
                                }
                            }else {
                                slick.options.swipe = initSwipe;
                            }
                        });
                        slideMain.slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true,
                            arrows: true,
                            dots: true,
                            fade: false,
                            rtl : isRTL,
                            lazyLoad: 'ondemand'
                        });
                        $('body').on('afterVariantUpdated', function (e, $variant) {
                            var featuredImage = $variant.featured_image;
                            if(!$.isEmptyObject(featuredImage)){
                                var img  = slideMain.find('.js-image-' + featuredImage.id),
                                    idx = img.closest('.slick-slide').data('slick-index');
                                slideMain.slick('slickGoTo', idx);
                            }
                        });
                        $script([cms_js.data('fotorama'), cms_js.data('product-model')], function () {
                            var fotoramaElement = $quickView.find('div[data-fotorama]'),
                                images = fotoramaElement.children().clone(),
                                startIndex = 0;
                            $("[data-js-gallery]").click(function () {
                                if(!fotoramaElement.hasClass('init')){
                                    fotoramaElement.children().each(function() {
                                        let lazy = $(this).data('src');
                                        if(lazy){
                                            $(this).attr('src', lazy);
                                        }
                                    });
                                    fotoramaElement.addClass('init');
                                }
                                var currentSlide = slideMain.find('.slick-current');
                                if(currentSlide.length){
                                    var imageId  = currentSlide.data('image-id');
                                    images.each(function( index ) {
                                        if($(this).data('image-id') == imageId){
                                            startIndex = index;
                                            return false;
                                        }
                                    });
                                }
                                var fotorama = fotoramaElement.fotorama({allowfullscreen: true, nav: 'thumbs'}).data('fotorama');
                                fotorama.show({index: startIndex, time: 0});
                                fotorama.requestFullScreen();
                            });
                            $quickView.find('div[data-fotorama]').on('click', function (e, fotorama) {
                                if ($(e.target).hasClass("fotorama__stage__frame")) {
                                    $('div[data-fotorama]').data('fotorama').cancelFullScreen();
                                    $('div[data-slide-nav]').find(".slick-track").css("transform", "none");
                                }
                            });
                        });
                        $quickView.find('[data-page-open-popup]').magnificPopup({
                            callbacks: {
                                beforeOpen: function() {
                                    this.st.mainClass = this.st.el.attr('data-effect');
                                }
                            },
                            type: 'inline',
                            removalDelay: 500,
                            midClick: true
                        });
                    });
                });
            },
            Sortby: function () {
                if (!$('.js_cat_sortby').length) return;
                $("body").on('click', 'a.js_sortby_pick', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var $this = $(this),
                        pr = $this.closest('.js_cat_sortby');
                    if ($(pr).hasClass('opended')) {
                        $(pr).removeClass('opended');
                    } else {
                        $(pr).addClass('opended');
                    }
                });
                $("body").click(function (e) {
                    if ($(e.target).hasClass('js_sortby_pick')) return;
                    $('.js_cat_sortby.opended').removeClass('opended');
                });
                $("body").on("click", ".js_ajaxsortby a", function (e) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                    $(".js_cat_sortby .js_sr_txt").html($(this).html());
                })
            },
            Numberby: function () {
                if (!$('.js_num_pagination').length) return;
                $("body").on('click', 'a.js_number_pick', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $this = $(this),
                        pr = $this.closest('.js_num_pagination');
                    if ($(pr).hasClass('opended')) {
                        $(pr).removeClass('opended');
                    } else {
                        $(pr).addClass('opended');
                    }
                });
                $("body").click(function (e) {
                    if ($(e.target).hasClass('js_number_pick')) return;
                    $('.js_num_pagination.opended').removeClass('selected');
                });
                $("body").on("click", ".js_ajaxnumby a", function (e) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                    $(".js_num_pagination .js_sr_txt").html($(this).html());
                })
            },
            changeTagFilter: function () {
                if (!$("div[data-filter]").length) return;
                $("body").on('click', 'div[data-filter] li a', function (e) {
                    var $this = $(this),
                        pr = $this.closest('li'),
                        parent = $(pr).parent();

                    var attr = $(parent).attr('data-list-categories');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        $(parent).find("li").removeClass('current');
                    } else {
                        $(pr).find('a').addClass('active');
                        $this.removeClass('active');
                    }
                    if ($(pr).hasClass('current')) {
                        $(pr).removeClass('current');
                    } else {
                        $(pr).addClass('current');
                    }
                });
            },
            sticky_Sidebar: function () {
                var stickySidebar = $('.js-stickySidebar'),
                    additionalTop = 10;
                if(!stickySidebar.length) return;
                if (window.matchMedia("(min-width: 1200px)").matches) {
                    additionalTop = 10 + parseInt($('body').attr('sticky'));
                }
                $script([cms_js.data('sticky-sidebar')], function(){
                    stickySidebar.StickySidebar({ additionalMarginTop: additionalTop });
                });
            },
            sticky_Product: function () {
                var stickyProduct = $('#js-stickyProduct');
                if(!stickyProduct.length) return;
                $script([cms_js.data('sticky-sidebar')], function(){
                    stickyProduct.StickySidebar({ additionalMarginTop: 60 });
                });
            },
            changeView: function () {
                var categoriesContent = $('.js_categories_content');
                var holder = categoriesContent.find('.js_products_arrivals');
                var productLayout = '';
                $(document).on('click', '.js_cat_view', function (e) {
                    e.preventDefault();
                    var _this = $(this),
                        _col = _this.data('col'),
                        _parent = _this.closest('div');

                    if (_col == 2) {
                        productLayout = 'grid-2';
                    } else if (_col == 3) {
                        productLayout = 'grid-3';
                    } else if (_col == 4) {
                        productLayout = 'grid-4';
                    } else if (_col == 5) {
                        productLayout = 'grid-5';
                    } else if (_col == 6) {
                        productLayout = 'grid-6';
                    } else if (_col == 7) {
                        productLayout = 'grid-7';
                    } else if (_col == 8) {
                        productLayout = 'grid-8';
                    } else {
                        productLayout = _this.hasClass('list-button') ? 'list' : 'grid';
                    }
                    holder.removeClass("grid-2-style grid-3-style grid-4-style grid-5-style grid-6-style grid-7-style grid-8-style grid-style list-style").addClass(productLayout + '-style');
                    if(productLayout != 'list'){
                        holder.addClass('grid-style');
                    }
                    if (holder.hasClass('js_isotope')) {
                        holder.isotope('layout');
                    }
                });

            },
            mobileSidebar: function () {
                $(document).on('click', '.js-mobile-sidebar', function () {
                    $("html").toggleClass('open_sidebar');
                    $(".mask-overlay").addClass('mask_opened');
                });
                $(document).on('click', '.js-close-sidebar', function () {
                    $("html").removeClass('open_sidebar');
                     $(".mask-overlay").removeClass('mask_opened');
                });
                $('html').on('maskOverlayOff', function (){
                    $("html").removeClass('open_sidebar');
                });
            },
            sidebarhomepage: function () {
                $(document).on('click', '.js-mobile-sidebar-homepage', function () {
                    $("html").toggleClass('open-sidebar-homepage');
                });
                $(document).on('click', '.js-close-sidebar', function () {
                    $("html").removeClass('open-sidebar-homepage');
                });
            },
            countdownProduct: function () {
                var labels = ['Years', 'Months', 'Weeks', 'Days', 'Hrs', 'Mins', 'Secs'];
                var layoutDefault = '<span class="box-count day"><span class="number">{dnn}</span> <span class="text">Days</span></span><span class="box-count hrs"><span class="number">{hnn}</span> <span class="text">Hrs</span></span><span class="box-count min"><span class="number">{mnn}</span> <span class="text">Mins</span></span><span class="box-count secs"><span class="number">{snn}</span> <span class="text">Secs</span></span>';
            $('.cms-countdown').not('.init').each(function () {
                var $counter = $(this),
                    layout = ($counter.data('layout') === undefined) ? layoutDefault : $counter.data('layout'),
                    year   = Number($counter.data('y').toString().replace("yyyy", new Date().getFullYear())),
                    mm     = Number($counter.data('m').toString().replace("mm", new Date().getMonth())),
                    dd     = Number($counter.data('d').toString().replace("dd", new Date().getDate() + 1));
                var austDay = new Date(year, mm, dd, $counter.data('h'), $counter.data('i'), $counter.data('s'));
                $counter.countdown({
                    until: austDay,
                    labels: labels,
                    layout: layout,
                    timeout : '<span class="timeout">Timeout</span>'
                });
                $counter.addClass('init');
            });
        },
        InitPopupVideo : function () {
            if (!$('[data_js_mfp_video]').length) return;
            $('[data_js_mfp_video]').magnificPopup({
                disableOn: 0,
                type: 'iframe',
                tClose: 'Close',
                removalDelay: 500,
                iframe: {
                    markup: '<div class="mfp-iframe-scaler pr"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',
                    patterns: {
                        youtube: {
                            index: 'youtube.com/',
                            id: 'v=',
                            src: '//www.youtube.com/embed/%id%?autoplay=1'
                        },
                        vimeo: {
                            index: 'vimeo.com/',
                            id: '/',
                            src: '//player.vimeo.com/video/%id%?autoplay=1'
                        }
                    },
                    srcAction: 'iframe_src',
                }
            });
        },
        tab_heading: function () {
            var $tabHeading = $('.sp-tabs .tab-heading');
            if (!$tabHeading.length) return;
            $tabHeading.click(function (e) {
                e.preventDefault();
                var _this = $(this),
                    parent = _this.closest('.sp-tab'),
                    parent_top = _this.closest('.sp-tabs'),
                    el = _this.closest('.alz-section'),
                    time = 300,
                    time2 = time + 50;
                if (!el.length) {
                    el = _this.closest('.shopify-section')
                }
                if (parent.hasClass('active')) {
                    parent.removeClass('active');
                    parent.find('.sp-tab-content').stop(true, true).slideUp(time);
                } else {
                    parent_top.find('.sp-tab').removeClass('active');
                    parent.addClass('active');
                    parent_top.find('.sp-tab-content').stop(true, true).slideUp(time);
                    parent.find('.sp-tab-content').stop(true, true).slideDown(time);
                }
            });
        },

        PromotionPopup: function () {
            var pp_version = 1;
            if (!$('[data-js-lazy-popup]').length || $(window).width() < 1025 || $.cookie('core_theme_' + pp_version) == 'shown') return;
            var popup = $('[data-js-lazy-popup]');
            var showPopup = function () {
                var stt = $('[data-js-lazy-popup]').data('stt');
                $.magnificPopup.open({
                    items: {
                        src: '.type_promotion_popup .js_popup_prpr_wrap'
                    },
                    type: 'inline',
                    removalDelay: 500,
                    tClose: "Close",
                    callbacks: {
                        beforeOpen: function () {
                            this.st.mainClass = 'mfp-move-horizontal prpr_pp_wrapper';
                        },
                        open: function () {
                            $(document).off('mouseleave.registerexit');
                            popup.find('.grid-slider').slick('refresh');
                        },
                        close: function () {
                            $.cookie('core_theme_' + pp_version, 'shown', { expires: stt.day_next, path: '/' });
                        }
                    }
                });
            };
            var time = $('[data-js-lazy-popup]').data('time');
            setTimeout(function () {
                showPopup();
            }, time)
        },
        NewsletterPopup: function () {
            var pp_version = 1;
            var popup = $('[data-js-lazy-newsletter-popup]');
            if (!popup.length || $.cookie('core_theme_newsletter' + pp_version) == 'shown') return;
            var showPopup = function () {
                var stt = $('[data-js-lazy-newsletter-popup]').data('stt');
                $.magnificPopup.open({
                    items: {
                        src: '.type_promotion_popup .js_popup_prpr_wrap_newsletter'
                    },
                    type: 'inline',
                    removalDelay: 500,
                    tClose: "Close",
                    callbacks: {
                        beforeOpen: function () {
                            var classes = 'mfp-move-horizontal prpr_pp_wrapper ';
                            if(popup.data('effect')) classes += classes + popup.data('effect');
                            this.st.mainClass = classes;
                        },
                        open: function () {
                            $(document).off('mouseleave.registerexit');
                        },
                        close: function () {
                            var poupOff = popup.find('.do-not-show-again input:checked');
                            if (poupOff.length) {
                                $.cookie('core_theme_newsletter' + pp_version, 'shown', { expires: stt.day_next, path: '/' });
                            } else {
                                /* $.cookie('core_theme_newsletter' + pp_version, 'shown', { expires: stt.day_next, path: '/' }); */
                            }
                        }
                    }
                });
            };
            var time = $('[data-js-lazy-newsletter-popup]').data('time');
            alzShopify.NewsletterPopup.Timeout = setTimeout(function () {
                showPopup();
            }, time);
            $('html').on('popupOff', function(){
                clearTimeout(alzShopify.NewsletterPopup.Timeout);
            });
        },
        PagePopup: function() {
            var $popup = $('[data-page-open-popup]');
            if(!$popup.length) return;
             $script([cms_js.data('magnific-popup')], function () {
                $popup.magnificPopup({
                  callbacks: {
                    beforeOpen: function() {
                      this.st.mainClass = this.st.el.attr('data-effect');
                    }
                  },
                  type: 'inline',
                  removalDelay: 500,
                  midClick: true
                });
             });
        }
    }
   }());
   /* End alzShopify */

    $script([cms_js.data('wow')], function () {
      new WOW().init();
    });

    var $qty = $("#Quantity");
    if ($qty.length && $qty.data("max") == 0) {
        $qty.val($qty.data("max"));
    }

    $("div[data-lazy-product-load]").on('lazyloaded', function () {
        var self = this;
        setTimeout(function(){
            alzThemes.ProductReview($(self));
        }, 100);
        alzThemes.ProductCurrency.update();
        alzShopify.countdownProduct();
    });
    /* Show slider after lazy is loaed*/
    $(".alz-slideshow .content-item").css('visibility', "visible");
    if ($(".alz-slideshow .pr_lazy_img").hasClass("lazyloaded")) {
        $(".alz-slideshow .content-item").removeClass('closed');
    }
    /* End show*/
    $('#login-popup').one('lazyincluded', function (e) {
        alzThemes.ToggleForm();
        alzThemes.CustomerForm();
    });
    $(".write-review").on("click", function () {
        $('[href="#tab_review"]').trigger('click');
        $(".spr-summary-actions-newreview").trigger('click');
    });
    if ($(".wrap-main-collection").hasClass("cms-full")) {
        $(".header-top > .container").addClass('cms-full');
    }
    $(".cms-header-bar-link").on("click", function () {
        $("div[data-header-bottom]").toggleClass('opened');
    });
    $(document).on('click', '.dcp_cd_btn', function (e) {
        var _this = $(this),
            html = _this.siblings('.dcp_cd_ip')[0];
        html.select();
        html.setSelectionRange(0, 99999);
        document.execCommand("copy");
        _this.text('Copied Shortcode');
    });

    $(document).on('click', '.button-copy', function (e) {
        var _this = $(this),
            copyWarp = _this.closest('.copy-clipboard-warp'),
            html = copyWarp.find('.copy-clipboard')[0];
        html.select();
        html.setSelectionRange(0, 99999);
        document.execCommand("copy");
        _this.addClass('done');
    });

    $(document).on('click', '.compare-color-value', function (e) {
        var $product = $('#product-single'),
            dataJson = $product.find('.data-json-product'),
            jsonProduct = dataJson.length ? JSON.parse(dataJson.html()) : $product.data('json-product'),
            color = $(this).data('value');
        var variant = alzThemes.getFeatureImageByOptions(jsonProduct, [color]);
        if(Object.keys(variant).length){
            var colorImage = $(this).closest('.mfp-popup-content').find('.compare-color-image');
            if(!colorImage.find('[data-color="' + color + '"]').length){
                colorImage.append('<div class="color-img"><img data-color="' + color + '" src="' + variant.featured_image.src + '" ><span class="color-text">' + color + '</span></div>');
            }
        }
    });

    $script.ready('load_basic', function () {
        alzShopify.init();
    });
    $(document).on('shopify:section:load', function (event) {
        $('.cp_cd_js').removeClass('d-none');
        alzThemes.Megamenu.accordion();
        alzShopify.init();
    });

    /* Filter - dropdown */
    $(document).on('click', '.sidebar-dropdown-btn', function () {
        $(this).closest('.facets').toggleClass('active');
        $('.js-sidebar-mobile-content').slideToggle();
    });

    /* Widget - toggle */
    $(document).on('click', '.collection-page .sidebar .widget-title', function () {
        $(this).parent().toggleClass('active');
        $(this).parent().find('.widget-content').slideToggle(400);
    });

    // Header Search Popup
    $(document).on('click', '.search-open-btn', function () {
        $('body').addClass('open-search');
        setTimeout(function (){
            $('.header-search-popup').find('.js_iput_search').focus();
        }, 200);
        return false;
    });
    $(document).on('click', '.search-close-btn', function () {
        $('body').removeClass('open-search');
        return false;
    });

    // Mobile Menu
    $(document).on('click', '.menu-mobile-open', function () {
        $('body').addClass('open-menu-mobile');
        return false;
    });
    $(document).on('click', '.menu-mobile-close, .mask-overlay', function () {
        $('body').removeClass('open-menu-mobile');
        return false;
    });
    $(document).on('click', '.menu-item > a .caret', function () {
        $(this).closest('.menu-item').toggleClass('open');
        $(this).closest('.menu-item').children('.submenu').slideToggle('fast');
        return false;
    });

    // Product item - gallery
    $(document).on('click', '.product-thumb .media-nav .media-nav-item', function (event) {
        var $this      = $(this),
            $navImgSrc = $this.find('img').data('image'),
            $mainImg   = $this.closest('.product-thumb').find('.media').find('img');
        if ($mainImg) {
            $mainImg.removeClass('source-loaded');
            setTimeout(function(){
                $mainImg.attr('src', $navImgSrc).addClass('source-loaded');
            }, 0);
            $this.addClass('active').siblings().removeClass('active');
        }

        event.preventDefault();
    });

    // Product filters - show more
    $(document).on('click', '.button-show-more', function () {
        var _this = $(this),
            _item = _this.closest('.widget').find('.facets__item-more');
        _this.toggleClass('active');
        if (_this.hasClass('active')){
            _item.slideDown();
        } else {
            _item.slideUp();
        }
        return false;
    });
    
    /* Dropdown */
    $(document).on('click', function (event) {
        var $target = $(event.target).closest('.alz-dropdown'),
            $current = $target.closest('.alz-parent-toggle'),
            $parent = $('.alz-dropdown');

        if ($target.length) {
            $parent.not($target).not($current).removeClass('open');
            if ($(event.target).is('[data-alz="alz-dropdown"]') ||
                $(event.target).closest('[data-alz="alz-dropdown"]').length) {
                $target.toggleClass('open');
                event.preventDefault();
            }
        } else {
            $('.alz-dropdown').removeClass('open');
        }
    });

    // Product Grid Button
    $(document).on('click', 'section .grid-btn .sub-menu a', function () {
        var _this = $(this),
            _col = _this.data('col'),
            _text = _this.text();
        if (!_this.hasClass('active')){
            _this.siblings().removeClass('active');
            _this.addClass('active');
            _this.closest('section').css('--cols', _col).css('--cols-1500', _col);
            _this.closest('.grid-btn').removeClass('open');
            _this.closest('.grid-btn').children('a').text(_text);
        }
        return false;
    });

});

/* Custom code js for your theme here */

/* Example custom before change option variant: */
/*
$('body').on('beforeVariantUpdated', function (e) {
    console.log('beforeVariantUpdated');
});
/*

/* Example custom after change option variant: */
/*
$('body').on('afterVariantUpdated', function (e, $variant) {
    console.log($variant);
    console.log('Variant id: ' + $variant.id);
    console.log('Variant Price: ' + $variant.price);
    console.log('Variant Sku: ' + $variant.sku);
});
*/

/* Example custom after ajax add to cart : */
/*
$('body').on('ajax:addToCart', function (e, $data) {
    console.log($data.form);
    console.log($data.response);
    /* yampiClick(); /*
});
*/
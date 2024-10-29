(function ($) {
    'use strict';
    $(document).ready(function ($) {
          console.log('0');
        $("#edit_{{ address.id }} .address-edit-toggle").click(function () {
            $("#EditAddress_{{ address.id }}").removeClass('hidden');
            $("#edit_{{ address.id }}").addClass('hidden');
          console.log('1');
        });

        $(".hidden_form_vertical").click(function () {
            $("#EditAddress_{{ address.id }}").addClass('hidden');
            $("#edit_{{ address.id }}").removeClass('hidden');
        })
    });
});
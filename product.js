function Product(form, options) {
    this.form = $(form);
    this.add2cart = this.form.find(".add2cart");
    this.button = this.form.find("#add_to_cart button");
    for (var k in options) {
        this[k] = options[k];
    }

    var self = this;
    // add to cart block: services
    this.form.find(".services input[type=checkbox]").click(function () {
        var obj = $('select[name="service_variant[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
            if(use_uniform) {
                 $.uniform.update(obj);
            }
        }
        self.updatePrice();
    });
    this.form.find(".services .service-variants").on('change', function () {
        self.updatePrice();
    });
    this.form.find('.inline-select a').click(function () {
        var d = $(this).closest('.inline-select');
        d.find('a.active').removeClass('active');
        $(this).addClass('active');
        d.find('.sku-feature').val($(this).data('value')).change();
        return false;
    });
    this.form.find(".skus input[type=radio]").click(function () {
        if ($(this).data('image-id')) {
            $("#product-image-" + $(this).data('image-id')).click();
        }
        if ($(this).data('disabled')) {
            self.button.attr('disabled', 'disabled');
        } else {
            self.button.removeAttr('disabled');
        }
        var sku_id = $(this).val();
        self.updateSkuServices(sku_id);
        self.updatePrice();
    });
    this.form.find(".skus input[type=radio]:checked").click();
    this.form.find(".sku-feature").change(function () {
        var key = "";
        self.form.find(".sku-feature").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });
        var sku = self.features[key];
        if (sku) {
            if (sku.image_id) {
                $("#product-image-" + sku.image_id).click();
            }
            self.updateSkuServices(sku.id);
            if (sku.available) {
                self.button.removeAttr('disabled');
            } else {
                self.form.find("div.stocks div").hide();
                self.form.find(".sku-no-stock").show();
                self.button.attr('disabled', 'disabled');
            }
            self.form.find("#our_price_display").data('price', sku.price);
            self.updatePrice(sku.price, sku.compare_price);
        } else {
            self.form.find("div.stocks div").hide();
            self.form.find(".sku-no-stock").show();
            self.button.attr('disabled', 'disabled');
            self.form.find("#old_price_display").hide();
            self.form.find("#our_price_display").empty();
        }
    });
    this.form.find(".sku-feature:first").change();
    if (!this.form.find(".skus input:radio:checked").length) {
        this.form.find(".skus input:radio:enabled:first").attr('checked', 'checked');
    }

    this.form.submit(function () {
        var f = $(this);
        var param = '';
        if (ruble_symbol) {
            param = '?html=1';
        }
        $.post(f.attr('action') + param, f.serialize(), function (response) {
            if (response.status == 'ok') {
                if ($('#product').hasClass('content_only')) {
                    var cart_total = window.parent.$(".shopping_cart");
                } else {
                    var cart_total = $(".shopping_cart");
                }

                var cart_div = f;
                var clone = $('<div class="cart"></div>').append(f.clone());
                if (cart_div.closest('.dialog').length) {
                    clone.insertAfter(cart_div.closest('.dialog'));
                } else {
                    clone.insertAfter(cart_div);
                }
                clone.css({
                    top: cart_div.offset().top - $(window).scrollTop(),
                    left: cart_div.offset().left,
                    width: cart_div.width() + 'px',
                    height: cart_div.height() + 'px',
                    position: 'fixed',
                    overflow: 'hidden',
                    'z-index': 9999
                }).animate({
                    top: cart_total.offset().top,
                    left: cart_total.offset().left,
                    width: 0,
                    height: 0
                }, 500, function () {
                    $(this).remove();
                    var info = cart_div.find('.ajax_product_info');
                    var quantity = parseInt($('#quantity_wanted').val());
                    if (cart_total.find('dt[data-id=' + response.data.item_id + ']').length) {
                        var item = cart_total.find('dt[data-id=' + response.data.item_id + ']');
                        var quantity = parseInt(item.find('.quantity').text()) + quantity;
                        item.find('.quantity').text(quantity);
                        cart_total.find('.ajax_block_cart_total').html(response.data.total);
                        cart_total.find('.ajax_cart_quantity').text(response.data.count);
                    } else {
                        var tpl_data = {
                            url: info.data('url'),
                            name: info.data('name'),
                            img: info.data('img'),
                            price: info.data('price'),
                            quantity: quantity,
                            id: response.data.item_id
                        };
                        $('#cart_block_list_item_tmpl').tmpl(tpl_data).appendTo('.cart_block_list .products');
                        cart_total.find('.ajax_block_cart_total').html(response.data.total);
                        cart_total.find('.ajax_cart_quantity').html(response.data.count);
                        cart_total.find('.ajax_cart_discount').html(response.data.discount);
                        cart_total.find('.ajax_cart_no_product').addClass('unvisible');
                        cart_total.find('.ajax_cart_product_txt').removeClass('unvisible');
                        cart_total.find('.ajax_cart_quantity').removeClass('unvisible');
                        cart_total.find('.cart_block_no_products').hide();
                    }


                    $('#layer_cart_product_title').text(info.data('name'));
                    $('#layer_cart_product_price').html(info.data('price'));
                    $('#layer_cart_product_quantity').text(quantity);
                    $('.layer_cart_img').html('<img class="layer_cart_img img-responsive" src="' + info.data('big-img') + '" alt="' + info.data('name') + '" title="' + info.data('name') + '" />');
                    $('#layer_cart .ajax_block_cart_total').html(response.data.total);
                    $('#layer_cart .ajax_cart_quantity').html(response.data.count);
                    $('#layer_cart .ajax_cart_discount').html(response.data.discount);
                    var n = parseInt($(window).scrollTop()) + 'px';
                    $('.layer_cart_overlay').css('width', '100%');
                    $('.layer_cart_overlay').css('height', '100%');
                    $('.layer_cart_overlay').show();
                    $('#layer_cart').css({'top': n}).fadeIn('fast');
                    $('#panel .cart .count').text(response.data.count);
                    $('#panel .cart').removeAttr('disabled');
                });
                if (cart_div.closest('.dialog').length) {
                    cart_div.closest('.dialog').hide().find('.cart').empty();
                }

                if (response.data.error) {
                    alert(response.data.error);
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
        }, "json");
        return false;
    });
}

Product.prototype.currencyFormat = function (number, no_html) {
// Format a number with grouped thousands
//
// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +	 bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;
    var decimals = this.currency.frac_digits;
    var dec_point = this.currency.decimal_point;
    var thousands_sep = this.currency.thousands_sep;
    // input sanitation & defaults
    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
    var number = km + kw + kd;
    var s = !ruble_symbol || no_html ? this.currency.sign : this.currency.sign_html;
    if (!this.currency.sign_position) {
        return s + this.currency.sign_delim + number;
    } else {
        return number + this.currency.sign_delim + s;
    }
};

Product.prototype.serviceVariantHtml = function (id, name, price) {
    return $('<option data-price="' + price + '" value="' + id + '"></option>').text(name + ' (+' + this.currencyFormat(price, 1) + ')');
};
Product.prototype.updateSkuServices = function (sku_id) {
    this.form.find("div.stocks div").hide();
    this.form.find(".sku-" + sku_id + "-stock").show();
    for (var service_id in this.services[sku_id]) {
        var v = this.services[sku_id][service_id];
        if (v === false) {
            this.form.find(".service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked');
        } else {
            this.form.find(".service-" + service_id).show().find('input').removeAttr('disabled');
            if (typeof (v) == 'string') {
                this.form.find(".service-" + service_id + ' .service-price').html(this.currencyFormat(v));
                this.form.find(".service-" + service_id + ' input').data('price', v);
            } else {
                var select = this.form.find(".service-" + service_id + ' .service-variants');
                var selected_variant_id = select.val();
                for (var variant_id in v) {
                    var obj = select.find('option[value=' + variant_id + ']');
                    if (v[variant_id] === false) {
                        obj.hide();
                        if (obj.attr('value') == selected_variant_id) {
                            selected_variant_id = false;
                        }
                    } else {
                        if (!selected_variant_id) {
                            selected_variant_id = variant_id;
                        }
                        obj.replaceWith(this.serviceVariantHtml(variant_id, v[variant_id][0], v[variant_id][1]));
                    }
                }
                this.form.find(".service-" + service_id + ' .service-variants').val(selected_variant_id);
            }
        }
    }
};
Product.prototype.updatePrice = function (price, compare_price) {
    if (price === undefined) {
        var input_checked = this.form.find(".skus input:radio:checked");
        if (input_checked.length) {
            var price = parseFloat(input_checked.data('price'));
            var compare_price = parseFloat(input_checked.data('compare-price'));
        } else {
            var price = parseFloat(this.form.find("#our_price_display").data('price'));
        }
    }
    if (compare_price) {
        this.form.find("#old_price_display").html(this.currencyFormat(compare_price)).show();
        var reduction_percent = Math.floor((compare_price - price) / compare_price * 100);
        this.form.find('#reduction_percent_display').html('-' + reduction_percent + '%');
        this.form.find('#reduction_percent').show();
    } else {
        this.form.find("#old_price_display").hide();
        this.form.find('#reduction_percent').hide();
    }
    var self = this;
    this.form.find(".services input:checked").each(function () {
        var s = $(this).val();
        if (self.form.find('.service-' + s + '  .service-variants').length) {
            price += parseFloat(self.form.find('.service-' + s + '  .service-variants :selected').data('price'));
        } else {
            price += parseFloat($(this).data('price'));
        }
    });
    this.form.find("#our_price_display").html(this.currencyFormat(price));
    this.form.find(".ajax_product_info").data('price', this.currencyFormat(price));
}

$(function () {

    $(document).ready(function () {
        var maxH = 0;
        $(".product-box .product-image").each(function () {
            var h_block = parseInt($(this).height());
            if (h_block > maxH) {
                maxH = h_block;
            }
            ;
        });
        $(".product-box .product-image").height(maxH);
    });

    $(document).on('click', '.product_quantity_up', function (e) {
        e.preventDefault();
        var fieldName = $(this).data('field-qty');
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        quantityAvailableT = 100000000;
        if (!isNaN(currentVal) && currentVal < quantityAvailableT) {
            $('input[name=' + fieldName + ']').val(currentVal + 1).trigger('keyup');
        } else {
            $('input[name=' + fieldName + ']').val(quantityAvailableT);
        }
    });

    $(document).on('click', '.product_quantity_down', function (e) {
        e.preventDefault();
        var fieldName = $(this).data('field-qty');
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        if (!isNaN(currentVal) && currentVal > 1) {
            $('input[name=' + fieldName + ']').val(currentVal - 1).trigger('keyup');
        } else {
            $('input[name=' + fieldName + ']').val(1);
        }
    });

// compare block
    $("a.compare-add").click(function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare += ',' + $(this).data('product');
        } else {
            compare = '' + $(this).data('product');
        }
        if (compare.split(',').length > 1) {
            var url = $("#compare-link").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
            $("#compare-link").attr('href', url).show().find('span.count').html(compare.split(',').length);
        }
        $.cookie('shop_compare', compare, {expires: 30, path: '/'});
        $(this).hide();
        $("a.compare-remove").show();
        return false;
    });
    $("a.compare-remove").click(function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare = compare.split(',');
        } else {
            compare = [];
        }
        var i = $.inArray($(this).data('product') + '', compare);
        if (i != -1) {
            compare.splice(i, 1)
        }
        $("#compare-link").hide();
        if (compare) {
            $.cookie('shop_compare', compare.join(','), {expires: 30, path: '/'});
        } else {
            $.cookie('shop_compare', null);
        }
        $(this).hide();
        $("a.compare-add").show();
        return false;
    });
});

$(function () {
    if (typeof product_reviews_display_mode == 'undefined' || product_reviews_display_mode != 'product_page') {
        return false;
    }
    var loading = $('<div><i class="icon16 loading"></i></div>');
    $('#product_comments_block_tab')
            .append(loading)
            .load(product_url + 'reviews/ .reviews', {random: "1"},
            function () {
                initFormControl();

                $('div.wa-captcha .wa-captcha-refresh, div.wa-captcha .wa-captcha-img').unbind('click').click(function () {
                    var div = $(this).parents('div.wa-captcha');
                    var captcha = div.find('.wa-captcha-img');
                    if (captcha.length) {
                        captcha.attr('src', captcha.attr('src').replace(/\?.*$/, '?rid=' + Math.random()));
                        captcha.one('load', function () {
                            div.find('.wa-captcha-input').focus();
                        });
                    }
                    ;
                    div.find('input').val('');
                    return false;
                });

                /**
                 * Hotkey combinations
                 * {Object}
                 */
                var hotkeys = {
                    'alt+enter': {
                        ctrl: false, alt: true, shift: false, key: 13
                    },
                    'ctrl+enter': {
                        ctrl: true, alt: false, shift: false, key: 13
                    },
                    'ctrl+s': {
                        ctrl: true, alt: false, shift: false, key: 17
                    }
                };

                var form_wrapper = $('#product-reivew-form');
                var form = form_wrapper.find('form');
                var content = $('.center_column .reviews');

                var input_rate = form.find('input[name=rate]');
                if (!input_rate.length) {
                    input_rate = $('<input name="rate" type="hidden" value=0>').appendTo(form);
                }
                $('#review-rate').rateWidget({
                    onUpdate: function (rate) {
                        input_rate.val(rate);
                    }
                });

                content.off('click', '.review-reply, .write-review a').on('click', '.review-reply, .write-review a', function () {
                    var self = $(this);
                    var item = self.parents('li:first');
                    var parent_id = parseInt(item.attr('data-id'), 10) || 0;
                    prepareAddingForm.call(self, parent_id);
                    return false;
                });

                var captcha = $('.wa-captcha');
                var provider_list = $('#user-auth-provider li');
                var current_provider = provider_list.filter('.selected').attr('data-provider');
                if (current_provider == 'guest' || !current_provider) {
                    captcha.show();
                } else {
                    captcha.hide();
                }

                provider_list.find('a').click(function () {
                    var self = $(this);
                    var li = self.parents('li:first');
                    if (li.hasClass('selected')) {
                        return false;
                    }
                    li.siblings('.selected').removeClass('selected');
                    li.addClass('selected');

                    var provider = li.attr('data-provider');
                    form.find('input[name=auth_provider]').val(provider);
                    if (provider == 'guest') {
                        $('div.provider-fields').hide();
                        $('div.provider-fields[data-provider=guest]').show();
                        captcha.show();
                        return false;
                    }
                    if (provider == current_provider) {
                        $('div.provider-fields').hide();
                        $('div.provider-fields[data-provider=' + provider + ']').show();
                        captcha.hide();
                        return false;
                    }

                    var left = (screen.width - 600) / 2;
                    var top = (screen.height - 400) / 2;
                    window.open(
                            $(this).attr('href'), "oauth", "width=600,height=400,left=" + left + ",top=" + top + ",status=no,toolbar=no,menubar=no"
                            );
                    return false;
                });

                addHotkeyHandler('textarea', 'ctrl+enter', addReview);
                form.submit(function () {
                    addReview();
                    return false;
                });

                function addReview() {
                    $.post(
                            location.href.replace(/\/#\/[^#]*|\/#|\/$/g, '') + '/reviews/add/',
                            form.serialize(),
                            function (r) {
                                if (r.status == 'fail') {
                                    clear(form, false);
                                    showErrors(form, r.errors);
                                    return;
                                }
                                if (r.status != 'ok' || !r.data.html) {
                                    if (console) {
                                        console.error('Error occured.');
                                    }
                                    return;
                                }
                                var html = r.data.html;
                                var parent_id = parseInt(r.data.parent_id, 10) || 0;
                                var parent_item = parent_id ? form.parents('li:first') : content;
                                var ul = $('ul.reviews-branch:first', parent_item);
                                if (parent_id) {
                                    ul.show().append(html);
                                } else {
                                    ul.show().prepend(html);
                                }
                                $('.reviews-count-text').text(r.data.review_count_str);
                                $('.reviews-count').text(r.data.count);
                                form.find('input[name=count]').val(r.data.count);
                                clear(form, true);
                                content.find('.write-review a').click();
                                form_wrapper.hide();
                                if (typeof success === 'function') {
                                    success(r);
                                }
                            },
                            'json')
                            .error(function (r) {
                                if (console) {
                                    console.error(r.responseText ? 'Error occured: ' + r.responseText : 'Error occured.');
                                }
                            });
                }
                ;

                function showErrors(form, errors) {
                    for (var name in errors) {
                        $('[name=' + name + ']', form).after($('<em class="errormsg"></em>').text(errors[name])).addClass('error');
                    }
                }
                ;

                function clear(form, clear_inputs) {
                    clear_inputs = typeof clear_inputs === 'undefined' ? true : clear_inputs;
                    $('.errormsg', form).remove();
                    $('.error', form).removeClass('error');
                    $('.wa-captcha-refresh', form).click();
                    if (clear_inputs) {
                        $('input[name=captcha], textarea', form).val('');
                        $('input[name=rate]', form).val(0);
                        $('input[name=title]', form).val('');
                        $('.rate', form).trigger('clear');
                    }
                }
                ;

                function prepareAddingForm(review_id)
                {
                    var self = this; // clicked link
                    if (review_id) {
                        self.parents('.actions:first').after(form_wrapper);
                        $('.rate ', form).trigger('clear').parents('.review-field:first').hide();
                    } else {
                        self.parents('.write-review').after(form_wrapper);
                        form.find('.rate').parents('.review-field:first').show();
                    }
                    clear(form, false);
                    $('input[name=parent_id]', form).val(review_id);
                    form_wrapper.show();
                }
                ;

                function addHotkeyHandler(item_selector, hotkey_name, handler) {
                    var hotkey = hotkeys[hotkey_name];
                    form.off('keydown', item_selector).on('keydown', item_selector,
                            function (e) {
                                if (e.keyCode == hotkey.key &&
                                        e.altKey == hotkey.alt &&
                                        e.ctrlKey == hotkey.ctrl &&
                                        e.shiftKey == hotkey.shift)
                                {
                                    return handler();
                                }
                            }
                    );
                }
                ;
            });
});

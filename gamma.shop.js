function initCompare() {

    $('.product_list').on('click', '.add_to_compare', function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare = compare.split(',');
        } else {
            compare = [];
        }
        if (!$(this).hasClass('checked')) {
            var i = $.inArray($(this).data('id') + '', compare);
            if (i == -1) {
                compare.push($(this).data('id'));
            }
            $('.total-compare-val').text(compare.length);
            if (compare.length > 1) {
                compare_url = compare_url.replace(/compare\/.*$/, 'compare/' + compare.join(',') + '/');
                $(".bt_compare_bottom").removeAttr('disabled');
                $('#panel .compare').removeAttr('disabled');
            }
            $(this).addClass('checked');
        } else {
            var i = $.inArray($(this).data('id') + '', compare);
            if (i != -1) {
                compare.splice(i, 1);
            }
            $('.total-compare-val').text(compare.length);

            if (compare.length < 2) {
                $(".bt_compare_bottom").attr('disabled', 'disabled');
                $('#panel .compare').attr('disabled', 'disabled');
            }
            $(this).removeClass('checked');
        }
        var url = $(".bt_compare_bottom").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
        if ($(".bt_compare_bottom").length) {
            $(".bt_compare_bottom").attr('href', url);
        }
        $('#panel .compare').attr('href', url);

        $('#panel .compare .count').text(compare.length);

        if (compare.length > 0) {
            $.cookie('shop_compare', compare.join(','), {expires: 30, path: '/'});
        } else {
            $.cookie('shop_compare', null, {expires: 30, path: '/'});
        }
        return false;
    });
}

function initWishlist() {

    $('.product_list').on('click', '.add_to_wishlist', function () {
        var wishlist = $.cookie('shop_wishlist');
        if (wishlist) {
            wishlist = wishlist.split(',');
        } else {
            wishlist = [];
        }

        if (!$(this).hasClass('checked')) {
            var i = $.inArray($(this).data('id') + '', wishlist);
            if (i == -1) {
                wishlist.push($(this).data('id'));
            }

            $(this).addClass('checked');
        } else {
            var i = $.inArray($(this).data('id') + '', wishlist);
            if (i != -1) {
                wishlist.splice(i, 1);
            }
            $(this).removeClass('checked');
        }

        $('#panel .wishlist .count').text(wishlist.length);
        if (wishlist.length > 0) {
            $.cookie('shop_wishlist', wishlist.join(','), {expires: 30, path: '/'});
            $('#panel .wishlist').removeAttr('disabled');
        } else {
            $.cookie('shop_wishlist', null, {expires: 30, path: '/'});
            $('#panel .wishlist').attr('disabled', 'disabled');
        }
        return false;
    });
}

function initQuickView()
{
    $(document).on('click', '.quick-view:visible', function (e) {
        e.preventDefault();
        var url = this.rel;
        if (url.indexOf('?') != -1)
            url += '&';
        else
            url += '?';

        if (!!$.prototype.fancybox)
            $.fancybox({
                'padding': 0,
                'width': 1087,
                'height': 610,
                'type': 'iframe',
                'href': url + 'content_only=1&quick_view=1'
            });
    });
}

function initFilterSlider() {

    $('#filter-slider').slider({
        range: true,
        min: filter_slider_min_value,
        max: filter_slider_max_value,
        values: [filter_slider_min_price, filter_slider_max_price],
        slide: function (event, ui) {
            var v = ui.values[0];
            if (v == $(this).slider('option', 'min')) {
                v = '';
            }
            $('.filters input[name="price_min"]').val(v);
            v = ui.values[1];
            if (v == $(this).slider('option', 'max')) {
                v = '';
            }
            $('.filters input[name="price_max"]').val(v);
        },
        stop: function (event, ui) {
            $('input[name="price_min"]').change();
        }
    });
    $(".filters input[name=price_min], .filters input[name=price_max]").change(function () {
        var min = parseFloat($(".filters input[name=price_min]").val());
        if (!min) {
            min = $("#filter-slider").slider('option', 'min');
        }
        var max = parseFloat($(".filters input[name=price_max]").val());
        if (!max) {
            max = $("#filter-slider").slider('option', 'max');
        }
        if (max >= min) {
            $("#filter-slider").slider('option', 'values', [min, max]);
        }
    });
}

function display(view)
{
    var nbItemsPerLine = 3;
    var nbItemsPerLineMobile = 3;
    var nbItemsPerLineTablet = 2;
    var html;
    if (view == 'list')
    {
        $('#product-list ul.product_list').removeClass('grid').addClass('list row');
        $('#product-list .product_list > li').removeClass('col-xs-12 col-sm-' + 12 / nbItemsPerLineTablet + ' col-md-' + 12 / nbItemsPerLine).addClass('col-xs-12');
        $('#product-list .product_list > li').each(function (index, element) {
            html = '';
            html = '<div class="product-container"><div class="row">';
            html += '<div class="left-block col-xs-4 col-xs-5 col-md-4">' + $(element).find('.left-block').html() + '</div>';
            html += '<div class="center-block col-xs-4 col-xs-7 col-md-4">';
            html += '<div class="product-flags">' + $(element).find('.product-flags').html() + '</div>';
            html += '<h5 itemprop="name">' + $(element).find('h5').html() + '</h5>';
            var rating = $(element).find('.comments_note').html(); // check : rating
            if (rating != null) {
                html += '<div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating" class="comments_note">' + rating + '</div>';
            }
            html += '<p class="product-desc">' + $(element).find('.product-desc').html() + '</p>';
            var colorList = $(element).find('.color-list-container').html();
            if (colorList != null) {
                html += '<div class="color-list-container">' + colorList + '</div>';
            }
            var availability = $(element).find('.availability').html();	// check : catalog mode is enabled
            if (availability != null) {
                html += '<span class="availability">' + availability + '</span>';
            }
            html += '</div>';
            html += '<div class="right-block col-xs-4 col-xs-12 col-md-4"><div class="right-block-content row">';
            var price = $(element).find('.content_price').html();       // check : catalog mode is enabled
            if (price != null) {
                html += '<div class="content_price col-xs-5 col-md-12">' + price + '</div>';
            }
            html += '<div class="button-container col-xs-7 col-md-12">' + $(element).find('.button-container').html() + '</div>';
            html += '<div class="functional-buttons clearfix col-sm-12">' + $(element).find('.functional-buttons').html() + '</div>';
            html += '</div>';
            html += '</div></div>';
            $(element).html(html);
        });
        $('.display').find('li#list').addClass('selected');
        $('.display').find('li#grid').removeAttr('class');
        $.totalStorage('display', 'list');
    }
    else
    {
        $('#product-list ul.product_list').removeClass('list').addClass('grid row');
        $('#product-list .product_list > li').removeClass('col-xs-12').addClass('col-xs-12 col-sm-' + 12 / nbItemsPerLineTablet + ' col-md-' + 12 / nbItemsPerLine);
        $('#product-list .product_list > li').each(function (index, element) {
            html = '';
            html += '<div class="product-container">';
            html += '<div class="left-block">' + $(element).find('.left-block').html() + '</div>';
            html += '<div class="right-block">';
            html += '<div class="product-flags">' + $(element).find('.product-flags').html() + '</div>';
            html += '<h5 itemprop="name">' + $(element).find('h5').html() + '</h5>';
            var rating = $(element).find('.comments_note').html(); // check : rating
            if (rating != null) {
                html += '<div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating" class="comments_note">' + rating + '</div>';
            }
            html += '<p itemprop="description" class="product-desc">' + $(element).find('.product-desc').html() + '</p>';
            var price = $(element).find('.content_price').html(); // check : catalog mode is enabled
            if (price != null) {
                html += '<div class="content_price">' + price + '</div>';
            }
            html += '<div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="button-container">' + $(element).find('.button-container').html() + '</div>';
            var colorList = $(element).find('.color-list-container').html();
            if (colorList != null) {
                html += '<div class="color-list-container">' + colorList + '</div>';
            }
            var availability = $(element).find('.availability').html(); // check : catalog mode is enabled
            if (availability != null) {
                html += '<span class="availability">' + availability + '</span>';
            }
            html += '</div>';
            html += '<div class="functional-buttons clearfix">' + $(element).find('.functional-buttons').html() + '</div>';
            html += '</div>';
            $(element).html(html);
        });
        $('.display').find('li#grid').addClass('selected');
        $('.display').find('li#list').removeAttr('class');
        $.totalStorage('display', 'grid');
    }
}

function bindGrid()
{
    var view = $.totalStorage('display');
    if(!view) {
        view = default_product_view;
    }

    if (view && view != 'grid')
        display(view);
    else
        $('.display').find('li#grid').addClass('selected');

    $(document).on('click', '#grid', function (e) {
        e.preventDefault();
        display('grid');
    });

    $(document).on('click', '#list', function (e) {
        e.preventDefault();
        display('list');
    });
}

$(document).ready(function () {
    initCompare();
    initWishlist();
    bindGrid();

    if (quick_view) {
        initQuickView();
    }
    if (filter_slider) {
        initFilterSlider();
    }
    
    $(document).on('click', '#layer_cart .cross, #layer_cart .continue, .layer_cart_overlay', function (e) {
        e.preventDefault();
        $('.layer_cart_overlay').hide();
        $('#layer_cart').fadeOut('fast');
    });

    if ($('#is_product_page').length) {
        var $this = $('#is_product_page');
        var products = $.cookie('viewed_products');
        if (products) {
            products = products.split(',');
        } else {
            products = [];
        }

        var i = $.inArray($this.val(), products);
        if (i != -1) {
            products.splice(i, 1);
        }
        products.unshift($this.val());
        if (products) {
            $.cookie('viewed_products', products.join(','), {expires: 30, path: '/'});
        }
    }

    $("#first-currencies a").click(function () {
        var url = location.href;
        if (url.indexOf('?') == -1) {
            url += '?';
        } else {
            url += '&';
        }
        location.href = url + 'currency=' + $(this).data('code');
        return false;
    });


    $("#columns").on('click', '.ajax_add_to_cart_button', function () {
        $(this).closest('form').submit();
        return false;
    });

    $("#center_column").on('submit', '.product_list .addtocart', function () {
        var f = $(this);
        if (f.data('url')) {
            var d = $('#dialog');
            var c = d.find('.cart');
            c.load(f.data('url'), function () {
                c.prepend('<a href="#" class="dialog-close">&times;</a>');
                d.show();
                if ((c.height() > c.find('form').height())) {
                    c.css('bottom', 'auto');
                } else {
                    c.css('bottom', '15%');
                }
            });
            return false;
        }
        var param = '';
        if(ruble_symbol) {
            param = '?html=1';
        }
        $.post(f.attr('action') + param, f.serialize(), function (response) {
            if (response.status == 'ok') {
                var cart_total = $(".shopping_cart");

                var origin = f.closest('.ajax_block_product');
                var block = $('<div></div>').append(origin.clone().removeClass('col-md-4 col-sm-6'));
                var insertAfter = f.closest('.ajax_block_product');
                if (origin.hasClass('product-box') || $('#product_comparison').length) {
                    insertAfter = $('#columns');
                }

                block.css({
                    'z-index': 10,
                    top: origin.offset().top - $(window).scrollTop(),
                    left: origin.offset().left,
                    width: origin.width() + 'px',
                    height: origin.height() + 'px',
                    position: 'fixed',
                    overflow: 'hidden'
                }).insertAfter(insertAfter).animate({
                    top: cart_total.offset().top - origin.height(),
                    left: cart_total.offset().left
                }, 500, function () {
                    $(this).remove();

                    var info = origin.find('.ajax_product_info');

                    var quantity = 1;
                    if (cart_total.find('dt[data-id=' + response.data.item_id + ']').length) {
                        var item = cart_total.find('dt[data-id=' + response.data.item_id + ']');
                        quantity = parseInt(item.find('.quantity').text()) + 1;
                        item.find('.quantity').text(quantity);
                        cart_total.find('.ajax_block_cart_total').html(response.data.total);
                        cart_total.find('.ajax_cart_quantity').text(response.data.count);
                    } else {
                        var tpl_data = {
                            url: info.data('url'),
                            name: info.data('name'),
                            img: info.data('img'),
                            price: info.data('price'),
                            quantity: 1,
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


                    if (layer_cart) {

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
                    }

                    $('#panel .cart .count').text(response.data.count);
                    $('#panel .cart').removeAttr('disabled');



                });


                if (response.data.error) {
                    alert(response.data.error);
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
        }, "json");
        return false;
    });


    $('#selectProductSort option').click(function () {
        location.assign($(this).val());
    });

    $('#nb_item').change(function () {
        if ($(this).val()) {
            $.cookie('products_per_page', $(this).val(), {expires: 30, path: '/'});
        } else {
            $.cookie('products_per_page', '', {expires: 0, path: '/'});
        }
        location.reload();
    });

    $('#columns').on('change', '.filters.ajax form input', function () {
        $('.product_list').prepend($('#layered_ajax_loader').html());
        $('.product_list').css('opacity', '0.7');
        var f = $(this).closest('form');
        var url = '?' + f.serialize();
        $(window).lazyLoad && $(window).lazyLoad('sleep');
        $.get(url, function (html) {
            var tmp = $('<div></div>').html(html);
            $('.product_list').html(tmp.find('.product_list').html());
            $('.product_list').css('opacity', '1');
            if (!!(history.pushState && history.state !== undefined)) {
                window.history.pushState({}, '', url);
            }
            //$(window).lazyLoad && $(window).lazyLoad('reload');
        });
    });

    //LAZYLOADING
    if ($.fn.lazyLoad) {

        var paging = $('.lazyloading-paging');
        if (!paging.length) {
            return;
        }
        // check need to initialize lazy-loading
        var current = paging.find('li.selected');
        if (current.children('a').text() != '1') {
            return;
        }
        paging.hide();
        var win = $(window);

        // prevent previous launched lazy-loading
        win.lazyLoad('stop');

        // check need to initialize lazy-loading
        var next = current.next();
        if (next.length) {
            win.lazyLoad({
                container: '#main > .content',
                load: function () {
                    win.lazyLoad('sleep');

                    var paging = $('.lazyloading-paging').hide();

                    // determine actual current and next item for getting actual url
                    var current = paging.find('li.selected');
                    var next = current.next();
                    var url = next.find('a').attr('href');
                    if (!url) {
                        win.lazyLoad('stop');
                        return;
                    }

                    var product_list = $('#product-list .product-list');
                    var loading = paging.parent().find('.loading').parent();
                    if (!loading.length) {
                        loading = $('<div><i class="icon16 loading"></i>Loading...</div>').insertBefore(paging);
                    }

                    loading.show();
                    $.get(url, function (html) {
                        var tmp = $('<div></div>').html(html);
                        if ($.Retina) {
                            tmp.find('#product-list .product-list img').retina();
                        }
                        product_list.append(tmp.find('#product-list .product-list').children());
                        var tmp_paging = tmp.find('.lazyloading-paging').hide();
                        paging.replaceWith(tmp_paging);
                        paging = tmp_paging;

                        // check need to stop lazy-loading
                        var current = paging.find('li.selected');
                        var next = current.next();
                        if (next.length) {
                            win.lazyLoad('wake');
                        } else {
                            win.lazyLoad('stop');
                        }

                        loading.hide();
                        tmp.remove();
                    });
                }
            });
        }

    }
});

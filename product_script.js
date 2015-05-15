$(document).ready(function () {


    //hover 'other views' images management
    $('#views_block li a').hover(
            function () {
                displayImage($(this));
            },
            function () {
            }
    );

    //set jqZoom parameters if needed
    if (typeof (jqZoomEnabled) != 'undefined' && jqZoomEnabled)
    {
        $('.jqzoom').jqzoom({
            zoomType: 'innerzoom', //innerzoom/standard/reverse/drag
            zoomWidth: 458, //zooming div default width(default width value is 200)
            zoomHeight: 458, //zooming div default width(default height value is 200)
            xOffset: 21, //zooming div default offset(default offset value is 10)
            yOffset: 0,
            title: false
        });
    }
    //add a link on the span 'view full size' and on the big image
    $(document).on('click', '#view_full_size, #image-block', function (e) {
        $('#views_block .shown').click();
    });

    //catch the click on the "more infos" button at the top of the page
    $(document).on('click', '#short_description_block .button', function (e) {
        $('#more_info_tab_more_info').click();
        $.scrollTo('#more_info_tabs', 1200);
    });



    original_url = window.location + '';
    first_url_check = true;



    $(document).on('click', 'a[name=resetImages]', function (e) {
        e.preventDefault();
        refreshProductImages(0);
    });





    if (contentOnly == false)
    {
        if (!!$.prototype.fancybox)
            $('.fancybox').fancybox({
                'hideOnContentClick': true,
                'openEffect': 'elastic',
                'closeEffect': 'elastic'
            });
    }
    else
    {
        $(document).on('click', '.fancybox', function (e) {
            e.preventDefault();
        });

        $(document).on('click', '#image-block', function (e) {
            e.preventDefault();
            var productUrl = window.document.location.href + '';
            var data = productUrl.replace('content_only=1', '');
            window.parent.document.location.href = data;
        });

        if (typeof ajax_allowed != 'undefined' && !ajax_allowed)
            $('#buy_block').attr('target', '_top');
    }

});



//update display of the large image
function displayImage(domAAroundImgThumb, no_animation)
{
    if (typeof (no_animation) == 'undefined')
        no_animation = false;
    if (domAAroundImgThumb.prop('href'))
    {
        var new_src = domAAroundImgThumb.attr('href').replace('thickbox', 'large');
        var new_title = domAAroundImgThumb.attr('title');
        var new_href = domAAroundImgThumb.attr('href');
        if ($('#bigpic').prop('src') != new_src)
        {
            $('#bigpic').attr({
                'src': new_src,
                'alt': new_title,
                'title': new_title
            }).load(function () {
                if (typeof (jqZoomEnabled) != 'undefined' && jqZoomEnabled)
                    $(this).attr('rel', new_href);
            });
        }
        $('#views_block li a').removeClass('shown');
        $(domAAroundImgThumb).addClass('shown');
    }
}




// Serialscroll exclude option bug ?
function serialScrollFixLock(event, targeted, scrolled, items, position)
{
    if ($('body').find('#image-block').outerWidth() > 469) {
        serialScrollNbImagesDisplayed = 4;
    }
    else if (469 > $('body').find('#image-block').width() > 374) {
        serialScrollNbImagesDisplayed = 3;
    }
    else if ($('body').find('#image-block').width() == 220) {
        serialScrollNbImagesDisplayed = 2;
    }
    else {
        serialScrollNbImagesDisplayed = 2;
    }
    serialScrollNbImages = $('#thumbs_list li:visible').length;
    var leftArrow = position == 0 ? true : false;
    var rightArrow = position + serialScrollNbImagesDisplayed >= serialScrollNbImages ? true : false;

    $('#view_scroll_left').css('cursor', leftArrow ? 'default' : 'pointer').fadeTo(0, leftArrow ? 0 : 1).css('display', leftArrow ? 'none' : 'block');
    $('#view_scroll_right').css('cursor', rightArrow ? 'default' : 'pointer').fadeTo(0, rightArrow ? 0 : 1).css('display', rightArrow ? 'none' : 'block');
    return true;
}

// Change the current product images regarding the combination selected
function refreshProductImages(id_product_attribute)
{
    $('#thumbs_list_frame').scrollTo('li:eq(0)', 700, {axis: 'x'});

    id_product_attribute = parseInt(id_product_attribute);

    if (id_product_attribute > 0 && typeof (combinationImages) != 'undefined' && typeof (combinationImages[id_product_attribute]) != 'undefined')
    {
        $('#thumbs_list li').hide();
        $('#thumbs_list').trigger('goto', 0);
        for (var i = 0; i < combinationImages[id_product_attribute].length; i++)
            if (typeof (jqZoomEnabled) != 'undefined' && jqZoomEnabled)
                $('#thumbnail_' + parseInt(combinationImages[id_product_attribute][i])).show().children('a.shown').trigger('click');
            else
                $('#thumbnail_' + parseInt(combinationImages[id_product_attribute][i])).show();
    }
    else
        $('#thumbs_list li').show();

    if (parseInt($('#thumbs_list_frame >li:visible').length) != parseInt($('#thumbs_list_frame >li').length))
        $('#wrapResetImages').stop(true, true).show();
    else
        $('#wrapResetImages').stop(true, true).hide();

    var thumb_width = $('#thumbs_list_frame >li').width() + parseInt($('#thumbs_list_frame >li').css('marginRight'));
    $('#thumbs_list_frame').width((parseInt((thumb_width) * $('#thumbs_list_frame >li').length)) + 'px');
    $('#thumbs_list').trigger('goto', 0);
    serialScrollFixLock('', '', '', '', 0);// SerialScroll Bug on goto 0 ?
}
//To do after loading HTML
function galeryReload() {
    //init the serialScroll for thumbs
    $('#thumbs_list').serialScroll({
        items: 'li:visible',
        prev: '#view_scroll_left',
        next: '#view_scroll_right',
        axis: 'x',
        offset: 0,
        start: 0,
        stop: true,
        onBefore: serialScrollFixLock,
        duration: 700,
        step: 1,
        lazy: true,
        lock: false,
        force: false,
        cycle: false
    });

    $('#thumbs_list').trigger('goto', 1);// SerialScroll Bug on goto 0 ?
    $('#thumbs_list').trigger('goto', 0);
}
$(document).ready(galeryReload);
$(window).resize(refreshProductImages);



$(document).ready(function (e) {

    if ($(document).width() >= 768) {
        minSlides = 6
        maxSlides = 6;
    } else {
        minSlides = 3;
        maxSlides = 3;
    }

    if (!!$.prototype.bxSlider) {
        upselling_slider = $('#bxslider-upselling').bxSlider({
            minSlides: minSlides,
            maxSlides: maxSlides,
            slideWidth: 178,
            slideMargin: 20,
            pager: false,
            nextText: '',
            prevText: '',
            moveSlides: 1,
            infiniteLoop: false,
            hideControlOnEnd: true
        });
    }

    if ($('#bxslider-upselling').length) {
        $(window).resize(function () {
            if ($(document).width() <= 767) {
                upselling_slider.reloadSlider({
                    minSlides: 3,
                    maxSlides: 3,
                    slideWidth: 178,
                    slideMargin: 20,
                    pager: false,
                    nextText: '',
                    prevText: '',
                    moveSlides: 1,
                    infiniteLoop: false,
                    hideControlOnEnd: true
                })
            }
            else if ($(document).width() >= 768) {

                minSlides = 6;

                upselling_slider.reloadSlider({
                    minSlides: minSlides,
                    maxSlides: 6,
                    slideWidth: 178,
                    slideMargin: 20,
                    pager: false,
                    nextText: '',
                    prevText: '',
                    moveSlides: 1,
                    infiniteLoop: false,
                    hideControlOnEnd: true
                })
            }
        })
    }

    if (!!$.prototype.bxSlider)
        crossselling_slider = $('#bxslider-crossselling').bxSlider({
            minSlides: minSlides,
            maxSlides: maxSlides,
            slideWidth: 178,
            slideMargin: 20,
            pager: false,
            nextText: '',
            prevText: '',
            moveSlides: 1,
            infiniteLoop: false,
            hideControlOnEnd: true
        });
    if ($('#bxslider-crossselling').length) {
        $(window).resize(function () {
            if ($(document).width() <= 767) {
                crossselling_slider.reloadSlider({
                    minSlides: 3,
                    maxSlides: 3,
                    slideWidth: 178,
                    slideMargin: 20,
                    pager: false,
                    nextText: '',
                    prevText: '',
                    moveSlides: 1,
                    infiniteLoop: false,
                    hideControlOnEnd: true
                })
            }
            else if ($(document).width() >= 768) {
                minSlides = 6;
                crossselling_slider.reloadSlider({
                    minSlides: minSlides,
                    maxSlides: 6,
                    slideWidth: 178,
                    slideMargin: 20,
                    pager: false,
                    nextText: '',
                    prevText: '',
                    moveSlides: 1,
                    infiniteLoop: false,
                    hideControlOnEnd: true
                })
            }
        })
    }
});

$(document).ready(function (e) {
    $('.favorite a').click(function () {
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
            $(this).text('Удалить из избранного');
        } else {
            var i = $.inArray($(this).data('id') + '', wishlist);
            if (i != -1) {
                wishlist.splice(i, 1);
            }
            $(this).removeClass('checked');
            $(this).text('Добавить в избранное');
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
});
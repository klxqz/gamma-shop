$(document).ready(function () {
    var homeslider_speed = 500;
    var homeslider_pause = 3000;
    var homeslider_loop = true;
    var homeslider_width = 780;



    if (!!$.prototype.bxSlider)
        $('#homeslider').bxSlider({
            mode: 'fade',
            useCSS: false,
            maxSlides: 1,
            slideWidth: homeslider_width,
            infiniteLoop: homeslider_loop,
            hideControlOnEnd: true,
            pager: false,
            autoHover: true,
            autoControls: true,
            auto: homeslider_loop,
            speed: homeslider_speed,
            pause: homeslider_pause,
            controls: true,
            startText: '',
            stopText: '',
            pagerCustom: ''
        });

    $('.homeslider-description').click(function () {
        window.location.href = $(this).prev('a').prop('href');
    });
});
/* ================================
   MAIN.JS
   ================================ */

// Only run scroll effects on home page
if (document.body.classList.contains('home')) {

    $(window).scroll(function() {
        var heroHeight = $('header').height();
        var yPosition = $(document).scrollTop();

        if (yPosition <= heroHeight) {
            var effectFactor = yPosition / heroHeight;
            var rotation = effectFactor * (Math.PI / 2 - Math.asin((heroHeight - yPosition) / heroHeight));
            $('.hero').css({
                '-webkit-transform': 'rotateX(' + rotation + 'rad)',
                'transform': 'rotateX(' + rotation + 'rad)',
            })
            .find('.overlay').css('opacity', effectFactor);
        }

        /**
         * Sticky nav-bar
         */
        if (yPosition <= heroHeight) {
            $('.nav').removeClass('fixed');
        } else {
            $('.nav').addClass('fixed');
        }

    });

}

console.log('RNK site loaded successfully.');
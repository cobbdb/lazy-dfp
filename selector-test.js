(function ($) {
    $.extend($.expr[':'], {
        'near-viewport': function (el, i, meta) {
            var margin = meta[3] || 0;
            var rect = el.getBoundingClientRect();
            var top = rect.top - margin; // <-- this /= $().offset().top !!
            var bottom = rect.bottom + margin;
            var height = bottom - top;
            // @see https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
            var windowTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var windowHeight = window.innerHeight || $(window).height();
            var windowBottom = windowTop + windowHeight;
            var windowScroll = windowHeight - height;
            var otherHeight = windowTop + height + windowHeight;
            console.log('~~ Var dump:');
            console.log('meta: ' + meta);
            console.log('margin: ' + margin);
            console.log('top: ' + top);
            console.log('bottom: ' + bottom);
            console.log('height: ' + height);
            console.log('windowTop: ' + windowTop);
            console.log('windowHeight: ' + windowHeight);
            console.log('windowBottom: ' + windowBottom);
            console.log('windowScroll: ' + windowScroll);
            console.log('otherHeight: ' + otherHeight);
            return (top > windowScroll && top < otherHeight);
            //return bottom > windowTop || top > windowBottom;
        }
    });
}(jQuery));

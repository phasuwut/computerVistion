(function($, window) {
    $(document).ready(function() {
        $(window).bind('resize', function(e) {
            if (isWindowResizeEvent()) {
                doResponsive(this);
                $('#search_crumb_container').width($('#content_container').width());
                $('#breadcrumbs, .breadcrumbs:first').trigger('window_resize');
                $('.toc_container_wrapper').trigger('window_resize');
            }
        });
        
        fixExamplesOld();
        hideFooterForMOS();
    });

    function doResponsive(window) {
        var browserInfo = $.browserInfo();
        if (browserInfo.name === 'msie' && browserInfo.version <= 8) {
            if ($(window).width() <= 290) {
                style_480.remove();
                $('head').append(style_290);
            } else if ($(window).width() <= 480) {
                style_290.remove();
                $('head').append(style_480);
            } else {
                style_480.remove();
                style_290.remove();
            }

            if ($(window).height() <= 480) {
                $('head').append(style_height_480);
            } else {
                style_height_480.remove();
            }
        }
    }

    var style_480 = $("<style type='text/css'> " +
        ".toc_pane { position:absolute; z-index:1100; }" +
        ".site_container.site_toc_opened { margin-left:60px !important; }" +
        ".site_container.site_toc_opened .toc_container_wrapper { width:270px !important; }" +
        ".site_container.site_toc_closed .toc_container_wrapper { width:30px !important; }</style>");

    var style_290 =  $("<style type='text/css'> " +
        ".toc_pane { position:absolute; z-index:1100; }" +
        ".site_container.site_toc_opened { margin-left:60px !important; }" +
        ".site_container.site_toc_opened .toc_container_wrapper { width:270px !important; }" +
        ".site_container.site_toc_closed .toc_container_wrapper { width:30px !important; }" +
        ".toc_pane { position:fixed; }" +
        ".content_container { padding-top:15px; }" +
        "#search_crumb_container { width:100%; padding-top:0px; background-color:#fff; position:relative; } " +
        ".site_container.site_toc_opened .toc_container_wrapper { width:200px !important; }" +
        "</style>");
    var style_height_480 =  $("<style type='text/css'> " +
            ".content_container { padding-top:15px; }" +
            "#search_crumb_container { width:100%; padding-top:0px; background-color:#fff; position:relative; } " +
            "</style>");



    function isWindowResizeEvent() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var currentHeight = $(window).data('height');
        var currentWidth = $(window).data('width');

        if (currentHeight == undefined || currentHeight != windowHeight
            || currentWidth == undefined || currentWidth != windowWidth) {
            $(window).data('height', windowHeight);
            $(window).data('width', windowWidth);
            return true;
        }
        return false;
    }

    function fixExamplesOld() {
        var regex = RegExp("category=examples-old");
        
        var exTopNav = $("#crux_nav_example a");
        if (exTopNav && exTopNav.length > 0) {
            var exTopNavLink = exTopNav.attr("href");
            if (regex.test(exTopNavLink)) {
                // Find the last item in  the first breadcrumb.
                var correctCatLink = $("ul.nav_disambiguation:first li:last a").attr("href");
                if (correctCatLink && correctCatLink.length > 0) {
                    var newCatRegex = /\/([^/]*)\.html/;
                    var newCatMatch = newCatRegex.exec(correctCatLink);
                    if (newCatMatch && newCatMatch.length > 1) {
                        exTopNav.attr("href", exTopNavLink.replace("category=examples-old", "category=" + newCatMatch[1]));
                    }
                }
            }
        }
    }

    // hide footer for MATLAB Online Server
    function hideFooterForMOS() {
        if (typeof isFromMatlabOnline !== "undefined") {
            if (isFromMatlabOnline()) {
                var footer = $('#footer');
                if (footer.length > 0) {
                    footer[0].style.display = "none";
                }
            }
        }
    }
    
})(jQuery, window);

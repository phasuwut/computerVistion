//===============================================================================
////==================Search page templates======================================

window.JST = window.JST || {};

(function ($) {
    $.setParameter = function(uri, key, value){
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        //if the query parameter is already set, simply replace the new value in query parameter.
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            return uri + separator + key + "=" + value;
        }
    };

    $(function() {
        $("#current_year").text(new Date().getFullYear());
    });
})(jQuery);

JST['highlighter'] = _.template(
    '<% _.each(highlights, function(value,index) { if (index % 2 !== 0) { %><span style="font-weight:bold"><%= escapeHtml(value) %></span><%} else { %><%= escapeHtml(value) %><% }})%>'
);

JST['searchresults']  = _.template(
    '<% _.each(searchResults, function(searchResult, index) { %>' +
    '<table class="table search_result_table">' +
      '<tr>' +
        '<td class="search_result_desc">' +
          '<span class="search_title">' +
            '<a href="<%= resolveProductHelpDir(searchResult.product)%>/<%= searchResult.path %><%= appendSearchParameters(searchResult, index) %>"><%=escapeHtml(searchResult.title) %></a>' +
            '<% if(searchResult.summary) { %>' +
               ' - <%= JST["highlighter"]({"highlights":searchResult.summary}) %>' +
            '<% } %>' +
          '</span>' +
          '<div class="search_highlight">' +
            '<% _.each(searchResult.highlights, function(highlight,highlightIdx) { %>' +
              '<% if (highlightIdx > 0) { %> ... <% } %><%= JST["highlighter"]({"highlights":highlight}) %>' +
            '<% }) %>' +
          '</div>' +
          '<% if (searchResult.requiredprods) { %>' +
              '<div class="search_required_products"><em><%= searchResult.requiredprods %></em></div>' +
          '<% } %>' +
          '<div class="search_url add_font_color_tertiary">' +
            '<% _.each(searchResult.breadcrumbs, function(breadcrumbList) { %>' +
            '<% var docTypeLink = "../documentation-center.html" %>' +
            '<a href="<%=docTypeLink %>"><%=searchResult.pageType.doclabel %></a>' +
            '<% _.each(breadcrumbList, function(breadcrumb, index) { %>' +
            ' &gt; <a href="<%= resolveProductHelpDir(searchResult.product) %>/<%= breadcrumb.relativepath %>">' +
                '<%= breadcrumb.label %>' +
            '</a>' +
            '<% })%>' +
            '<% }) %>' +
          '</div>' +
        '</td>' +
        '<% if (searchResult.thumbnail && searchResult.thumbnail.indexOf("DefaultImage.png") < 0) { %>' +
          '<td class="search_result_additional_right thumb">' +
            '<a class="thumbnail_container" href="<%= resolveProductHelpDir(searchResult.product)%>/<%= searchResult.path %><%= appendSearchParameters(searchResult, index) %>" style="background-image:url(../<%=searchResult.thumbnail %>)"></a>' +
          '</td>' +
        '<% } %>' +
        '<% if (searchResult.type && searchResult.type.length > 0) { %>' +
          '<td class="search_result_icons">' +
            '<% _.each(searchResult.type, function(type) { %>' +
              '<%= getResultTypeElement(type, searchResult.typeLabels[type]) %>' +
            '<% }) %>' +
          '</td>' +
        '<% } %>' +
      '</tr>' +
    '</table>' +
    '<% })%>'
);

JST['pagination'] = _.template(
    '<div class="pull-right add_font_color_general">' +
        '<a href="<%= getPageUrl(footer.selectedpage - 1) %>"' +
        '<% if(footer.selectedpage == 1) { %>' +
          ' class="inactive link_disabled" tabindex="-1"' +
        '<% } %>' +
          '><span class="icon-arrow-open-left icon_32 pull-left"></span>' +
        '</a>' +

        '<p class="pull-left add_margin_0" style="line-height:36px"><%= footer.summarytext %></p>' +

        '<a href="<%= getPageUrl(footer.selectedpage + 1) %>"' +
        '<% if(footer.selectedpage == footer.numpages) { %>' +
          ' class="inactive link_disabled" tabindex="-1"' +
        '<% } %>' +
        '><span class="icon-arrow-open-right icon_32 pull-right"></span>' +
        '</a>' +
    '</div>'
);

JST['facets'] = _.template(
    '<% _.each(facets, function (facetObject) { %>' +
    '<% _.each(facetObject, function (value, key) { %>' +
    '<div class="search_refine <%= key %>">' +
        '<h3><%= value.facettitle %></h3>' +
        '<div class="search_refine_scroll">' +
            '<% if(value.refinedfacet) { %>' +
            '<%= refinedFacetTemplate({refinedfacet: value.refinedfacet, facetType: key, iconClassFcn: getTypeIconClass, refinedFacetTemplate:' +
            'refinedFacetTemplate, refinableFacetTemplate: refinableFacetTemplate}) %>' +
            '<% } else { %>' +
            '<% if(value.refinablefacets) { %>' +
            '<%= refinableFacetTemplate({refinablefacets: value.refinablefacets, facetType: key, iconClassFcn: getTypeIconClass}) %>' +
            '<% } %>' +
            '<% } %>' +
        '</div>' +
    '</div>' +
    '<% }) %>' +
    '<% }) %>'
);

JST['refinablefacet'] = _.template(
    '<ul>' +
        '<% _.each(refinablefacets, function(result, i) { %>' +
        '<li class="refinable">' +
            '<a id="refine-<%= facetType %>-<%= result.facetid %>" href="searchresults.html?<%= result.faceturlquery %>">' +
              '<% if (iconClassFcn(result.facetid)) { %>' +
                '<span class="icon-<%= iconClassFcn(result.facetid)%> icon_16" style="padding-right:4px;"></span>' +
              '<% }%>' +
              '<span class="refine_<%= facetType %>_count"><%= result.facetcount %></span>' +
              '<%= result.facetname %>' +
            '</a>' +
        '</li>' +
        '<% }) %>' +
    '</ul>'
);

JST['refinedfacet'] = _.template(
    '<ul>' +
        '<li class="refined">' +
            '<a href="searchresults.html?<%= refinedfacet.faceturlquery %>">' +
              '<% if (iconClassFcn(refinedfacet.facetid)) { %>' +
                '<span class="icon-<%= iconClassFcn(refinedfacet.facetid)%> icon_16" style="padding-right:4px;"></span>' +
              '<% }%>' +
              '<%= refinedfacet.facetname %>' +
            '</a>' +
            '<% if(refinedfacet.refinedfacet) { %>' +
            '<%= refinedFacetTemplate({refinedfacet: refinedfacet.refinedfacet, facetType: facetType, ' +
            'refinedFacetTemplate: refinedFacetTemplate, refinableFacetTemplate: refinableFacetTemplate, iconClassFcn: iconClassFcn}) %>' +
            '<% } else {%>' +
            '<% if(refinedfacet.refinablefacets) { %>' +
            '<%= refinableFacetTemplate({refinablefacets: refinedfacet.refinablefacets, facetType: facetType, iconClassFcn: iconClassFcn}) %>' +
            '<% } %>' +
            '<% } %>' +
        '</li>' +
    '</ul>'
);

JST['spellcheck'] = _.template(
    '<div class="didyoumean">' +
        '<% if (spellcheck.spellcheck !== undefined && spellcheck.spellcheck !== "") { %>' +
            '<div>' +
                '<%= spellcheck.didyoumeanmessage %>' +
            '</div>' +
        '<% } %>' +
    '</div>'
);

JST['suggestionlist'] = _.template(
    '<div>' +
    '<div><p style="margin-top:20px;"><%= suggestionsheader %></p></div>' +
    '<ol>' +
    '<% _.each(suggestions, function(suggestion){ %>' +
    '<li><%= suggestion %></li>' +
    '<% }) %>' +
    '</ol>' +
    '</div>'
);

JST['sources'] = _.template(
    '<div class="search_refine source">' +
        '<h3>Refine by Source</h3>' +
        '<div class="search_refine_scroll">' +
            '<ul>' +
                '<% _.each(sources, function (sourceObject) { %>' +
                        '<% if (sourceObject.selectedsource) { %>' +
                            '<%= selectedSourceTemplate({selectedsource: sourceObject.selectedsource}) %>' +
                        '<% } else if (sourceObject.selectablesource) { %>' +
                            '<%= selectableSourceTemplate({selectablesource: sourceObject.selectablesource}) %>' +
                        '<% } else if (sourceObject.disabledsource) { %>' +
                            '<%= disabledSourceTemplate({disabledsource: sourceObject.disabledsource}) %>' +
                        '<% } %>' +
                '<% }) %>' +
            '</ul>' +
        '</div>' +
    '</div>'
);

JST['selectedsource'] = _.template(
    '<% var nameid = "search_source_" + selectedsource.source; %>' +
    '<% var sourcename = getLocalizedString(nameid); %>' +
     '<li class="refined">' +
        '<a id="refine-source-<%= selectedsource.source %>" href="searchresults.html?qdoc=<%= encodeURIComponent(selectedsource.searchterm) %>&selectedsource=<%= selectedsource.source %>">' +
            '<span class="icon_16" style="padding-right:24px;"></span>' +
            '<span class="refine_type_count"><%= selectedsource.fullresultcount %></span>' +
        '<%= sourcename %></a>' +
     '</li>'
);

JST['selectablesource'] = _.template(
    '<% var nameid = "search_source_" + selectablesource.source; %>' +
    '<% var sourcename = getLocalizedString(nameid); %>' +
     '<li class="refinable">' +
        '<a id="refine-source-<%= selectablesource.source %>" href="searchresults.html?qdoc=<%= encodeURIComponent(selectablesource.searchterm) %>&selectedsource=<%= selectablesource.source %>&newsource=<%= selectablesource.source %>">' +
            '<span style="padding-right:24px;"></span>' +
            '<span class="refine_type_count"><%= selectablesource.fullresultcount %></span>' +
        '<%= sourcename %></a>' +
    '</li>'
);

JST['disabledsource'] = _.template(
    '<% var nameid = "search_source_" + disabledsource.source; %>' +
    '<% var sourcename = getLocalizedString(nameid); %>' +
     '<li class="inactive link_disabled">' +
        '<a id="refine-source-<%= disabledsource.source %>" href="#">' +
            '<span style="padding-right:24px;"></span>' +
            '<span class="refine_type_count"><%= disabledsource.fullresultcount %></span>' +
        '<%= sourcename %></a>' +
     '</li>'
);

//===============================================================================

function getSearchResultsHtml(searchResults, searchTerm) {
    var jsonData = {searchResults: searchResults};
    _.extend(jsonData, {
        getHighlights: function (highlights, separator) {
            return highlights.join(separator);
        },
        getSearchResultClassType: function (type) {
            return 'result_type_' + type;
        },
        resolveProductHelpDir: function (productHelpDir) {
            if (productHelpDir.match(/^file:.*/) || productHelpDir.match(/^https?:.*/)) {
                return productHelpDir;
            } else {
                return "../" + productHelpDir;
            }
        },
        appendSearchParameters: function (searchResult, index) {
            var separator = "?";
            var searchParameters = "";

            if (searchTerm && searchTerm.length > 0) {
                searchParameters = separator + "searchHighlight=" + encodeURIComponent(searchTerm);
                separator = "&";
            }

            var searchResultIndex = getSearchResultIndex(index);
            searchParameters = searchParameters + separator + "searchResultIndex=" + encodeURIComponent(searchResultIndex);

            return searchParameters;
        },
        getResultTypeElement: function(type, label) {
            var iconType = getTypeIconClass(type);
            if (iconType) {
                return '<span class="icon-' + iconType + ' icon_16 icon_color_general" title="' + label + '"></span>'
            } else {
                return "";
            }
        }

    });
    return JST['searchresults'](jsonData);
}

function getSearchResultIndex(index) {
    var pageNumber = $.getParameterByName('page');
    if (pageNumber.length == 0) {
        pageNumber = "1";
    }
    return (parseInt(pageNumber)-1)*10+parseInt(index+1);
}

function appendHighlightExpand(highlightExpand, searchTerm) {
    if (searchTerm && highlightExpand) {
        if (localStorage && localStorage.setItem) {
            localStorage.setItem(searchTerm, JSON.stringify(highlightExpand));
        }
    }
}

function getTypeIconClass(type) {
    switch (type) {
        case "fcn" : return "function";
        case "blk" : return "block";
        case "so" : return "systemobject";
        case "ex" : return "examples";
        case "rn" : return "releasenotes";
        case "ht" : return "documentation";
        case "app" : return "app";
        default : return null;
    }
}

function getSearchSummaryHtml(searchSummary) {
    return '<div id="result_summary_top">' + getPagination(searchSummary) + '</div>';
}

function getSearchFooterHtml(searchSummary) {
    return '<div id="result_summary_bottom">' + getPagination(searchSummary) + '</div>';
}

function getPagination(searchSummary) {
    var jsonData = {footer: searchSummary};
    _.extend(jsonData, {
        getPageUrl: function (pageNumber) {
            return $.setParameter(window.location.href, 'page', pageNumber);
        },
        getLocalizedString: function(str, locale) {
                return getLocalizedString(str, locale);
        }
    });

    return JST['pagination'](jsonData);
}

function getFacetResultsHtml(facetResults) {
    var jsonData = {
        facets: facetResults,
        refinedFacetTemplate: JST['refinedfacet'],
        refinableFacetTemplate: JST['refinablefacet'],
    }
    _.extend(jsonData, {
        getTypeIconClass : function(type) {
            return getTypeIconClass(type);
        }
    });
    return JST['facets'](jsonData);
}

function getSourceResultsHtml(sourceResults) {
    var jsonData = {
        sources: sourceResults,
        selectedSourceTemplate: JST['selectedsource'],
        selectableSourceTemplate: JST['selectablesource'],
        disabledSourceTemplate: JST['disabledsource']
    }
    return JST['sources'](jsonData);
}

function getSpellCheckResultsHtml(jsonData) {
    return JST['spellcheck'](jsonData);
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

//===============================================================================

function getErrorHtml(error) {
    var html = '';
    html += '<div>';
    html += '<p>';
    html += '<font color="red">';
    html = html + error;
    html += '</font>';
    html += '</p>';
    html += '</div>';

    return html;
} // end function getErrorHtml

function getSuggestionsListHtml(noResultJson) {
    return JST['suggestionlist'](noResultJson);

}

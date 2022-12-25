var get_facet_label;
function populateResults(allSearchResults) {
    var sourceJson = getSourceJson(allSearchResults);  
    var sources = sourceJson.sources;
    var jsonObject = sourceJson.selectedsearchresults;

    var facetLabels = jsonObject.facetlabels ? jsonObject.facetlabels : {};
    populateLookupTable(facetLabels);
    
    if (jsonObject.responsetype === "noresults") {
        populateNoResults(jsonObject, sources);
        populateSource(sources);
    } else if (jsonObject.responsetype === "error") {
        displayError(jsonObject);
    } else {
        populateResultsList(jsonObject.results, jsonObject.searchtext);
        populateResultData(jsonObject.pagedata, sources);
        populateSource(sources);
        populateFacets(jsonObject.facets);
        populateSpellCheck(jsonObject);
        appendHighlightExpand(jsonObject.highlightexpand, jsonObject.searchtext);
    }
}

function getSourceJson(allSearchResults) {
    var allJson = {};
    var sources = [];

    if (! Array.isArray(allSearchResults)) {
        allJson["selectedsearchresults"] = allSearchResults;
        allJson["sources"] = sources;        
        return allJson;        
    }

    if (allSearchResults.length == 1) {
        allJson["selectedsearchresults"] = allSearchResults[0];
        allJson["sources"] = sources;        
        return allJson;        
    }

    var i;
    for (i = 0; i < allSearchResults.length; i++) { 
        var searchResults = allSearchResults[i];

        var sourceJson = {};
        sourceJson["source"] = searchResults.source;
        sourceJson["fullresultcount"] = searchResults.fullresultcount;
        sourceJson["searchterm"] = getSearchTerm(searchResults.searchtext);

        var selectedSource = (searchResults.source == searchResults.selectedsource);
        if (selectedSource) {
            allJson["selectedsearchresults"] = searchResults;
            sources.push({"selectedsource":sourceJson});
        } else {
            if (searchResults.fullresultcount == "0") {
                sources.push({"disabledsource":sourceJson});
            } else {
                sources.push({"selectablesource":sourceJson});
            }
        }
    }

    // Sort sources alphabetically on the 'source' property, then reverse it to get mw first.
    sources.sort(function (a, b) {
        return (Object.values(a)[0].source.localeCompare(Object.values(b)[0].source));
    });
    sources.reverse();

    allJson["sources"] = sources;        
    return allJson;
}

function getSearchTerm(searchText) {
    // Clean-up the search text, removing the facet data
    var typeIdx = searchText.indexOf("type");
    if (typeIdx >= 0) {
        return searchText.substring(0, typeIdx-1);
    }
    var prodIdx = searchText.indexOf("product");
    if (prodIdx >= 0) {
        return searchText.substring(0, prodIdx-1);
    }
    return searchText;
}

function populateResultsList(searchresults, searchTerm) {
    var highlightTerm = "";
    if (searchTerm && searchTerm.length > 0) {
        highlightTerm = searchTerm;
    } else if( $('#docsearch') && $('#docsearch').val() ){
        highlightTerm = $('#docsearch').val();
    }
    $('#wait').remove();

    var resultsHtml = '';
    resultsHtml = getSearchResultsHtml(searchresults, highlightTerm);

    var resultsDiv = $('#results_area');
    resultsDiv.html(resultsHtml);
}

function populateResultData(jsonObject, sourceJson) {
    var searchterm = jsonObject.searchterm;
    var productbreadcrumb = jsonObject.productbreadcrumb;
    var summarydata = jsonObject.summarydata;
    var footerdata = jsonObject.footerdata;
    var searchTextDescJson = getSearchTextDescJson(jsonObject, sourceJson);

    $('#docsearch').val(searchterm);
    tokenizeSearchText();

    var summaryHtml = '';
    summaryHtml = getSearchSummaryHtml(footerdata);

    if (searchTextDescJson.length == 1) {
        var searchingInfoDiv = $('#search_result_info_header');
        searchingInfoDiv.html(searchTextDescJson[0]);   
    } else if (searchTextDescJson.length > 1) {
        var searchingInfoDiv1 = $('#search_result_info_line1');
        searchingInfoDiv1.html(searchTextDescJson[0]);   
        var searchingInfoDiv2 = $('#search_result_info_line2');
        searchingInfoDiv2.html(searchTextDescJson[1]);   
    }

    var summaryDiv = $('#search_result_header');
    summaryDiv.html(summaryHtml);

    var footerHtml = '';
    footerHtml = getSearchFooterHtml(footerdata);

    var footerDiv = $('#search_result_footer');
    footerDiv.html(footerHtml);

    setPageTitle();
}

function getSearchTextDescJson(jsonObject, sourceJson) {
    if ((! sourceJson) || jQuery.isEmptyObject(sourceJson)) {
        return [jsonObject.searchtext];
    }

    var searchTextDescJson = [];
    searchTextDescJson.push(getSourceSearchTextDesc(sourceJson, 'selectedsource'));

    var selectableSourceSearchText = getSourceSearchTextDesc(sourceJson, 'selectablesource');
    var disabledSourceSearchText = getSourceSearchTextDesc(sourceJson, 'disabledsource');

    if (selectableSourceSearchText.length > 0) {        
        searchTextDescJson.push(selectableSourceSearchText);
    } else if (disabledSourceSearchText.length > 0) {
        searchTextDescJson.push(disabledSourceSearchText);
    }

    return searchTextDescJson;
}

function getSourceSearchTextDesc(sourceJson, type) {
    var itemType = getSourceJsonForType(sourceJson, type);
    if (itemType) {
        return getFormattedSearchTextDesc(itemType, type);
    }

    return '';
}

function getFormattedSearchTextDesc(sourceJson, type) {
    switch (type) {
        case "selectedsource" : return getLocalizedString("search_results_for_source_" + sourceJson.source).replace(/\{0\}/, sourceJson.searchterm).replace(/\{1\}/, Number(sourceJson.fullresultcount).toLocaleString('en'));
        case "selectablesource" : return getLocalizedString("search_in_source_" + sourceJson.source).replace(/\{0\}/, getSearchInHyperlink(sourceJson)).replace(/\{1\}/, Number(sourceJson.fullresultcount).toLocaleString('en'));
        case "disabledsource" : return getLocalizedString("search_no_results_source_" + sourceJson.source).replace(/\{0\}/, sourceJson.searchterm).replace(/\{1\}/, Number(sourceJson.fullresultcount).toLocaleString('en'));
        default : return '';
    }
}

function getSearchInHyperlink(sourceJson) {
    var searchTerm = encodeURIComponent(sourceJson.searchterm);
    var searchText = sourceJson.searchterm;
    var source = sourceJson.source;
    return '<a href="searchresults.html?qdoc=' + searchTerm + '&selectedsource=' + source + '&newsource=' + source + '">' + '<strong><i>' + searchText + '</i></strong>' + '</a>';
}

function populateSource(sourceJson) {
    if ((! sourceJson) || jQuery.isEmptyObject(sourceJson)) {
        return;
    }    
    // Populate the selected source in the search input params.
    // This is needed so that a new search on the page respects the slected source.
    populateSelectedSource(sourceJson);    
    // Populate the source area in the left nav.
    var sourceHtml = getSourceResultsHtml(sourceJson);
    var sourceDiv = $('#source_area');
    sourceDiv.html(sourceHtml);
}

function populateSelectedSource(sourceJson) {
    var i;
    for (i = 0; i < sourceJson.length; i++) {
        var source = sourceJson[i];
        if (source.selectedsource) {
            var selectedsource = source.selectedsource;
            setSelectedSource(selectedsource.source);
        }
    }
}

function setSelectedSource(selectedSource) {
  document.getElementById('selected_source').value = selectedSource;
}

function populateFacets(facetJson) {
    var facetHtml = '';
    facetHtml = getFacetResultsHtml(facetJson);
    var facetDiv = $('#facets_area');
    facetDiv.html(facetHtml);
}

function displayError(error) {
    $('#docsearch').val(error.searchtext);
    var errorHtml = getErrorHtml(error.message);

    var errorDiv = $('#results_area');
    errorDiv.html(errorHtml);
    setPageTitle();
}

function populateNoResults(jsonObject, sources) {
    var jsonData = _getNoResultsData(jsonObject, sources);
    displayNoResults(jsonData);
    displaySearchTips(jsonData);
    displaySpellCheck(jsonData);
}

function _getNoResultsData(jsonData, sources) {
    var allJson = {};

    var noResultsJson = _getNoResultsMessages(jsonData, sources);
    var searchTipsJson = _getSearchTipsMessages(jsonData, sources);

    var dymMessageId = (jsonData.hasfacets && jsonData.hasfacets === true ?
                        'search_dym_message_results_without_filter_mw' :
                        'search_dym_message_results_mw');
    var stidQSParam = 'SRCH_DYM_NA';
    var spellCheckJson = _getSpellCheckMessages(jsonData.spellcheck, dymMessageId, stidQSParam);

    $.extend(allJson, jsonData);
    $.extend(allJson, noResultsJson);
    $.extend(allJson, searchTipsJson);
    $.extend(allJson, spellCheckJson);

    return allJson;
}

function _getNoResultsMessages(jsonData, sources) {
    var noResultsJson = {};
    var message = _getNoResultsMessage(jsonData, sources);
    var altSearchMessage = _getAltSearchMessage(sources);
    noResultsJson.message = message;
    noResultsJson.alternatesearchmessage = altSearchMessage;
    return noResultsJson;
}

function _getAltSearchMessage(sourceJson) {
    if ((! sourceJson) || jQuery.isEmptyObject(sourceJson)) {
        return '';
    }

    var selectableSourceJson = getSourceJsonForType(sourceJson, 'selectablesource');
    if (! selectableSourceJson) {
        return '';
    }

    var messageId = "search_no_results_alt_search_" + selectableSourceJson.source;
    var searchHyperlink = getSearchInHyperlink(selectableSourceJson);
    var message = getLocalizedString(messageId).replace(/\{0\}/, searchHyperlink).replace(/\{1\}/, selectableSourceJson.fullresultcount);

    return message;
}

function _getNoResultsMessage(jsonData, sources) {
    var baseMessageId = _getNoResultsMessageId(jsonData, sources);
    var message = getLocalizedString(baseMessageId).replace(/\{0\}/, jsonData.spellcheck.searchtext);
    return message;    
}

function _getNoResultsMessageId(jsonData, sources) {
    var baseMessageId = (jsonData.hasfacets === false ? "search_no_results_tips_message" : "search_no_results_tips_message_with_filter");

    var sourceIds = _getSourceIds(jsonData, sources);    
    if ((! sourceIds) || jQuery.isEmptyObject(sourceIds)) {
        baseMessageId = baseMessageId + '_mw';
        return baseMessageId;
    }

    for(var i = 0; i < sourceIds.length; i++) {
        var sourceId = sourceIds[i];
        baseMessageId = baseMessageId + '_' + sourceId;
    }

    return baseMessageId;
}

function _getSourceIds(jsonData, sourceJson) {
    if ((! sourceJson) || jQuery.isEmptyObject(sourceJson)) {
        return '';
    }

    var selectedSourceJson = getSourceJsonForType(sourceJson, 'selectedsource');
    var disabledSourceJson = getSourceJsonForType(sourceJson, 'disabledsource');

    var sourceIds = [];
    sourceIds.push(selectedSourceJson.source);

    if (disabledSourceJson) {
        sourceIds.push(disabledSourceJson.source);
    }

    // Sort sources alphabetically on the 'source' property, then reverse it to get mw first.
    sourceIds.sort(function (a, b) {
        return (Object.values(a)[0].localeCompare(Object.values(b)[0]));
    });
    sourceIds.reverse();

    return sourceIds;
}

function getSourceJsonForType(sourceJson, type) {
    for(var i = 0; i < sourceJson.length; i++) {
        var item = sourceJson[i];
        var itemType = item[type];
        if (itemType) {
            return itemType;
        }
    }

    return undefined;
}

function _getSearchTipsMessages(jsonData, sources) {
    var searchTipsJson = {};

    var suggestionsheader = getLocalizedString("search_no_results_tips_header");
    var suggestions = [];
    var ctr = 0;
    var tip = getLocalizedString("search_no_results_tip_" + (ctr+1));
    while (tip && tip.length > 0) {
        suggestions[ctr] = tip;
        ctr++;
        tip = getLocalizedString("search_no_results_tip_" + (ctr+1));
    }

    searchTipsJson.suggestionsheader = suggestionsheader;
    searchTipsJson.suggestions = suggestions;

    return searchTipsJson;
}

function _getSpellCheckMessages(spellcheck, dymMessageId, stidQSParam) {
    var dymJson = {};

    var spellCheckHyperlink = _getSpellCheckHyperlink(spellcheck, stidQSParam);
    var dymMessage = getLocalizedString(dymMessageId).replace(/\{0\}/, spellCheckHyperlink).replace(/\{1\}/, spellcheck.spellcheckresultcount);

    spellcheck.didyoumeanmessage = dymMessage;
    
    dymJson.spellcheck = spellcheck;

    return dymJson;
}

function _getSpellCheckHyperlink(spellcheck, stidQSParam) {
    var searchTerm = encodeURIComponent(spellcheck.spellcheck);
    var searchText = spellcheck.spellcheck;
    return '<a href="searchresults.html?qdoc=' + searchTerm + '&s_tid=' + stidQSParam + '">' + searchText + '</a>';
}

function displayNoResults(jsonData) {
    if (jsonData.alternatesearchmessage && jsonData.alternatesearchmessage.length > 0) {
        var searchingInfoDiv1 = $('#search_result_info_line1');
        searchingInfoDiv1.html(jsonData.message);   
        var searchingInfoDiv2 = $('#search_result_info_line2');
        searchingInfoDiv2.html(jsonData.alternatesearchmessage);   
    } else {
        var searchingInfoDiv = $('#search_result_info_header');
        searchingInfoDiv.html(jsonData.message);  
    }
}

function displaySearchTips(jsonData) {
    var messageDiv = $('#results_area');
    messageDiv.empty();
    $('#docsearch').val(jsonData.searchtext);
    tokenizeSearchText();
    messageDiv.append(getSuggestionsListHtml(jsonData));
    setPageTitle();
}

function setPageTitle() {
    document.title = "Search Results - " + $("#docsearch").val();
}

function tokenizeSearchText() {
    $('form#docsearch_form').tokenize({
        fields: ["product", "category", "type"],
        remove_if_empty: true,
        label_function: get_facet_label
    });
}

function populateSpellCheck(jsonData) {
    var allJson = {};

    var dymMessageId = ('search_dym_message_results');
    var stidQSParam = 'SRCH_DYM_LS';
    var spellCheckJson = _getSpellCheckMessages(jsonData.spellcheck, dymMessageId, stidQSParam);

    $.extend(allJson, jsonData);
    $.extend(allJson, spellCheckJson);

    displaySpellCheck(allJson);
}

function displaySpellCheck(jsonData) {
    if(jsonData === undefined) {
        return;
    }

    var spellcheckHtml = '';
    spellcheckHtml = getSpellCheckResultsHtml(jsonData);

    var messageDiv = $('#search_result_dym_header');
    messageDiv.html(spellcheckHtml);
}

function populateLookupTable(facetLabelJson) {

    var labels = {};
    for (var facetLabel in facetLabelJson) {
        if (facetLabelJson.hasOwnProperty(facetLabel)) {
            labels[facetLabelJson[facetLabel].field + ":" + 
                    facetLabelJson[facetLabel].value] = facetLabelJson[facetLabel].label;
        }
    }
    get_facet_label = function (token) {
        var labelDataString = sessionStorage.getItem('facetlookuptable');
        if(labelDataString !== undefined && labelDataString != null) {
            var labelData = JSON.parse(labelDataString);
            if (labelData !== undefined && labelData != null) {
                return labelData[token.field + ":" + token.value];                
            }
        }
        return labels[token.field + ":" + token.value];
    }
    
    if(!$.isEmptyObject(labels)) {
        sessionStorage.setItem('facetlookuptable', JSON.stringify(labels));
    }
}

$(document).ready(function() {
  populateStrings();
  searchData = parseQueryString(); 
  if (! searchData["selectedsource"]) {
    searchData["selectedsource"] = "mw";
  } 
  var supportedSources = getSupportedSources(searchData.selectedsource);
  getSearchResults(searchData, supportedSources);
});

function getSupportedSources(selectedSource) {
    var supportedSources;
    var searchSource = getSessionStorageValue('searchsource');
    if (searchSource) {
        searchSource = searchSource.replace("+", " ");
        supportedSources = searchSource.split(" ");
    } else {
        supportedSources = [selectedSource];
    }
    return supportedSources;
}

function getSessionStorageValue(key) {
    var value;
    try {
        value = sessionStorage.getItem(key);
    } catch (e) {
        value = null;
    }
    return value;
}

function getSearchResults(searchData, supportedSources) {   
    var allDeferreds = [];

    var i;
    for (i = 0; i < supportedSources.length; i++) { 
        var source = supportedSources[i];
        var deferredSearchData = {};
        $.extend(deferredSearchData, searchData);
        $.extend(deferredSearchData, {"source":source});
        var searchResultsDeferred = getSearchDeferred(deferredSearchData);
        allDeferreds[i] = searchResultsDeferred;
    }

    $.when.apply($,allDeferreds).then(function() {
         var allSearchResults = $.makeArray(arguments);
         populateResults(allSearchResults);
    });    
}

function getSearchDeferred(searchData) {
    var deferred = $.Deferred(function() {});
    var services = {
        'messageservice' : 'help/search/query',
        'messagechannel':'docsearch',
        'webservice': getSearchWebServiceUrl()
	};
    var errorhandler = function() {
        deferred.reject();
    }
    var successhandler = function(data) {
        deferred.resolve(data);
    }
    requestHelpService(searchData, services, successhandler, errorhandler);
    return deferred;
}

function getSearchWebServiceUrl() {
    var release = "";
    const regex = /.*\/help\/releases\/(R20\d\d[ab])\/.*/;
    const found = document.location.href.match(regex);
    if (found != null && found.length >= 2) {
        release = "/" + found[1];
    }
    return "/help/search/json/doccenter/en" + release;    
}

function getDocReleaseFromSearchBox() {

    var localeEl = $("#docsearch_form");
    return localeEl.attr('data-release');
}

function populateStrings() {
    var footerElt;
    if (! isFileProtocol()) {
        // MATLAB views documentation served by the connector.
        footerElt = $(".matlab_footer");
    } else {
        // Polyspace views documentation served off of the file system.
        footerElt = $(".polyspace_footer");
    }
    footerElt.removeClass("off");
    $(footerElt).find("#acknowledgments").text(getLocalizedString("acknowledgments"));
    $(footerElt).find("#trademarks").text(getLocalizedString("trademarks"));
    $(footerElt).find("#patents").text(getLocalizedString("patents"));
    $(footerElt).find("#terms_of_use").text(getLocalizedString("terms_of_use"));
}

function isFileProtocol() {
    var prtcl = document.location.protocol;
    return prtcl.match(/file/);
}

function parseQueryString() {
    var params = {};
    var qs = window.location.search;
    if (qs && qs.length > 0) {
        var paramsArray = qs.replace(/^\?/,"").split("&");
        for (var i = 0; i < paramsArray.length; i++) {
            var nameValPair = paramsArray[i].split("=");
            var name = nameValPair[0];
            var value = nameValPair.length > 1 ? nameValPair[1] : "";
            if (name && name.length > 0) {
                value = decodeURIComponent(value.replace(/\+/g," "));
                if (params[name]) {
                    params[name] += "," + value;
                } else {
                    params[name] = value;
                }
            }
        }
    }
    return params;
}
function getQueryStringParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
function viewer_loader() {
	var doc_url = $('#hidden_anchor', parent.document).prop('href');
	var encoded_query = encodeURIComponent(getQueryStringParameterByName('query', doc_url));
	var organism_qid = getQueryStringParameterByName('organism', doc_url);
	var parent_iframe_width = parseInt($('#parent_iframe', parent.document).css('width'));
	var parent_iframe_height = parseInt($('#parent_iframe', parent.document).css('height'));
	var first_row_height = parseInt($('#first_row').css('height'));
	var width = (parent_iframe_width * 0.99) + "px";
	var height = ((parent_iframe_height - first_row_height) * 0.98) + "px";
	$('#iframe_viewer').prop('src', "https://query.wikidata.org/embed.html#" + encoded_query);
	$('#iframe_viewer').css('border', "none");
	$('#iframe_viewer').css('width', width);
	$('#iframe_viewer').css('height', height);
	$('#cited_link').prop('href', "Cited_records.html?organism=" + organism_qid);
};
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
	$('#iframe_viewer').attr('src', "https://query.wikidata.org/embed.html#" + getQueryStringParameterByName('wd_query'));
    $('#cited_link').attr('href', "Cited_records.html?organism=" + getQueryStringParameterByName('organism'));
    var width = getQueryStringParameterByName('frame_width');
	var height = parseInt(getQueryStringParameterByName('frame_height')) - parseInt($('#first_row').height());
	width = width - (width * 0.02);
	height = height - (height * 0.02);
	$('#iframe_viewer').attr('style', "border: none; " + "width: " + width + "px; height: " + height + "px;");
};
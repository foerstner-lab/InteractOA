function getQueryStringValue(key) {
	return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
};

$(document).ready(function() {
   $.getJSON('/python_func', {organism_qid : getQueryStringValue("organism")}, function(dat) {
     $('#content').html(dat.results);
   });
});
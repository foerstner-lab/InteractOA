function getQueryStringParameterByName(name, url) {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
$(document).ready(function() {
	$.getJSON('python_func', {
		organism_qid : getQueryStringParameterByName("organism")
	}, function(data) {
		$('#content').html(data.results);
	});
	$("#search").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$("#data_tbl tr").filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
	$('#RefsModalTitle', parent.document).html('Citations and References');
});
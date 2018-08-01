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
	$.getJSON('fetch_references', {
		organism_qid : getQueryStringParameterByName("organism")
	}, function(data) {
		$('#content').html(data.results);
		$('#data_tbl').DataTable({"ordering": false, "autoWidth": false, "lengthChange": true, responsive: {details: false}});
		$("#data_tbl_filter").children().prop('class', 'form-control form-control-md');
		$("#data_tbl_length").children().prop('class', 'form-control form-control-md');		
	});
	$('#RefsModalTitle', parent.document).html('Citations and References');
});
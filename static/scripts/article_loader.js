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
	var article_url = "https://europepmc.org/articles/PMC" + getQueryStringParameterByName("article_PMCID");
	$.ajax({
		url : article_url,
		dataType : 'html',
		success : function(response) {
			var content = jQuery(response).find('#article_body').html();
			var search_phrase = getQueryStringParameterByName("quote");
			var link_to_source = "See the article in the main source: <a href=\"" + article_url + '\" target="_blank">Click here </a>';
			var content_edited = content;
			$('#link_to_source').html(link_to_source);
			$('#content').html(content_edited);
			var punc = ":;.,-–—‒_(){}[]!'\"+=".split("");
			var options = {
				"separateWordSearch" : false,
				"acrossElements" : true,
				ignorePunctuation : punc
			};
			$("#content").mark(search_phrase, options);
			window.find(search_phrase);
		}
	});
	$('#RefsModalTitle', parent.document).html('Article Viewer');
});


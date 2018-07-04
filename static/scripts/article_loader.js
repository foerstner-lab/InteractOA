function getQueryStringValue(key) {
	var tmp = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	return tmp = tmp.replace(new RegExp("\\+","g"),' ');
};

$(document).ready(function() {
	var article_url = "https://europepmc.org/articles/PMC" + getQueryStringValue("article_PMCID");
	$.ajax({
		url : article_url,
		dataType : 'html',
		success : function(response)
		{
			var content = jQuery(response).find('#article_body').html();
			var search_phrase = getQueryStringValue("quote");
			var link_to_source = "See the article in the main source: <a href=\"" + article_url + "\">Click here </a>";
			var content_edited = content;
			$('#link_to_source').html(link_to_source);
			$('#content').html(content_edited);
			var punc = ":;.,-–—‒_(){}[]!'\"+=".split("");
			var options = {"separateWordSearch": false, "acrossElements": true, ignorePunctuation: punc};
			$("#content").mark(search_phrase, options);
			window.find(search_phrase);
		}
	});
});



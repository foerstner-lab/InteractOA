function getQueryStringParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
$(document).ready(function () {
    let article_url = "https://europepmc.org/articles/PMC" + getQueryStringParameterByName("article_PMCID");
    /*$("#ifrm").attr('src', `${article_url}#:~:text=${getQueryStringParameterByName("quote")}`);*/
    $.ajax({
        url: article_url,
        dataType: 'html',
        success: function (response) {
            let content = jQuery(response).find('#article_body').html();
            let search_phrase = getQueryStringParameterByName("quote");
            let link_to_source = "See the article in the main source: <a href=\"" + article_url + '\" target="_blank">Click here </a>';
            let content_edited = content;
            $('#link_to_source').html(link_to_source);
            $('#content').html(content_edited);
            let punc = ":;.,-–—‒_(){}[]!'\"+=".split("");
            let options = {
                "separateWordSearch": false,
                "acrossElements": true,
                ignorePunctuation: punc
            };
            $("#content").mark(search_phrase, options);
            window.find(search_phrase);
        },
        error: function (){alert("Error loading the article")}
    });
    $('#RefsModalTitle', parent.document).html('Article Viewer');
});


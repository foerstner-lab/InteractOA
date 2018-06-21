function getQueryStringValue (key)
{
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
};
function readFile()
{
    var res = ""
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "QUERY_TEMPLATE.txt", false);
    xhttp.onreadystatechange = function ()
    {
        if(xhttp.readyState === 4)
        {
            if(xhttp.status === 200 || xhttp.status == 0)
            {
                res = xhttp.responseText;
            }
        }
    }
    xhttp.send(null);
    return res;
};
function loader()
{
    var query_template = "";
    query_template = readFile();
    var query = query_template.replace("#QID#", getQueryStringValue("organism"));
    query = query.replace("#view_type#", getQueryStringValue("viewer_type"));
    query = encodeURIComponent(query);
    query = "https://query.wikidata.org/embed.html#" + query
    document.getElementById('iframe_viewer').src = query;
};
function open_viewer(organism, view_type)
{
    //str = str.substring(0, str.length - 1);
    var my_url = "viewer.html";
    window.open(my_url + "?organism=" + organism + "&viewer_type=" + view_type, "_blank");
};
// Would write the value of the QueryString-variable called name to the console
console.log(getQueryStringValue("name"));


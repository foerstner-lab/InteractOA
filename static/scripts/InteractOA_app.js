let global_var_query = "";
let global_var_organism = "";
/*
let global_var_iframe_height = 0;
let global_var_iframe_width = 0;
*/

function button_view_on_click() {
    let viewer_type = "";
    let words = "";
    let RNA_types = "";
    let show_types = "";
    let optional_interact = "";
    let only_no_interact = "";
    $('#settings_form input[type=checkbox]:checked, #settings_form input[type=text], #settings_form select').each(
        function (index) {
            let input = $(this);
            if (input.attr('name') == 'viewer_type') {
                viewer_type = input.val();
            }
            if (input.attr('name') == 'WORDS') {
                words = input.val();
            }
            if (input.attr('name') == 'RNA_TYPE') {
                RNA_types += input.val() + ',';
            }
            if (input.attr('name') == 'SHOW_TYPE') {
                show_types += input.val() + ',';
            }
            if (input.attr('name') == 'OPTIONAL_INTERACT') {
                optional_interact = input.val();
            }
            if (input.attr('name') == 'ONLY_NO_INTERACT') {
                only_no_interact = input.val();
            }
            global_var_organism = $('#organism').val();
        });
    RNA_types = RNA_types.slice(0, -1);
    show_types = show_types.slice(0, -1);
    $.getJSON('generate_viewer_query', {
        organism_qid: global_var_organism,
        view_type: viewer_type,
        filters: RNA_types,
        shows: show_types,
        words: words,
        is_interacted: optional_interact,
        only_no_interacted: only_no_interact
    }, function (returned_query) {
        global_var_query = encodeURIComponent(returned_query.results);
        $('#iframe_viewer').prop('src', "https://query.wikidata.org/embed.html#" + global_var_query);
    });
    /*
    global_var_iframe_height = parseInt($('#Vis_div').prop('scrollHeight')) * 0.95;
    global_var_iframe_width = parseInt($('#Vis_div').prop('scrollWidth')) * 0.97;
    $('#iframe_viewer').css('border', "none");
    $('#iframe_viewer').css('width', global_var_iframe_width + "px");
    $('#iframe_viewer').css('height', global_var_iframe_height + "px");
     */
    $("#div_visalizer_iframe").show();
    $("#div_visualizer_settings").hide();
    $('#iframe_viewer')[0].contentWindow.location.reload(true);
    //$('#VisualizerModal').modal('handleUpdate');
}

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
function mark_text(searchVal) {
    var punc = ".?!,:;––—()[]{}<>“”‘/… *& #~\@^|+=".split("");
    var options = {
        "separateWordSearch": false,
        "acrossElements": true,
        "ignoreJoiners": true,
        "ignorePunctuation": punc
    };
    $("#article_body").unmark({
        done: function () {
            $("#article_body").mark(searchVal, options);
        }
    });
    window.find(searchVal);
}


$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('quote')) {
        mark_text(searchParams.get('quote'));
    }

    $('#ONLY_NO_INTERACT').change(function () {
        if (this.checked) {
            $("#OPTIONAL_INTERACT").removeAttr("checked");
            $("#OPTIONAL_INTERACT").prop("checked", false);
            $("#OPTIONAL_INTERACT").attr("disabled", true);
        } else {
            $("#OPTIONAL_INTERACT").removeAttr("disabled");
        }
    });
    //-------------------------------------------------------------
    $('[data-toggle="tooltip"]').tooltip();
    //-------------------------------------------------------------
    $('#VisualizerModal').on('hidden.bs.modal', function (e) {
        $("#div_visalizer_iframe").hide();
        $("#div_visualizer_settings").show();
        $('#iframe_viewer').prop('src', "");
    });
    $('#VisualizerModal').on('shown.bs.modal', function (e) {
        $("#div_visalizer_iframe").hide();
        $("#div_visualizer_settings").show();
    });
    /*
    //--------------------------------------------------------------
    $('#RefsModal').on('show.bs.modal', function (e) {
        $('#browser_alert').hide();
    });
    */
    $('#RefsModal').on('shown.bs.modal', function (e) {
        /*
        var browser = (function () {
            var test = function (regexp) {
                return regexp.test(window.navigator.userAgent)
            }
            switch (true) {
                case test(/edg/i):
                    return "Microsoft Edge";
                case test(/trident/i):
                    return "Microsoft Internet Explorer";
                case test(/firefox|fxios/i):
                    return "Mozilla Firefox";
                case test(/opr\//i):
                    return "Opera";
                case test(/ucbrowser/i):
                    return "UC Browser";
                case test(/samsungbrowser/i):
                    return "Samsung Browser";
                case test(/chrome|chromium|crios/i):
                    return "Google Chrome";
                case test(/safari/i):
                    return "Apple Safari";
                default:
                    return "Other";
            }
        })();
        if (browser === "Mozilla Firefox"){
             $('#browser_alert').show();

        }
         */
        global_var_organism = $('#organism').val();
        /*
        global_var_iframe_height = parseInt($('#refs_div').prop('scrollHeight')) * 0.93;
        global_var_iframe_width = parseInt($('#refs_div').prop('scrollWidth')) * 0.97;
        */
        console.log();
        $.getJSON('fetch_references', {
            organism_qid: $("#organism option:selected").val()
        }, function (data) {
            $('#content').html(data.results);
            $('#data_tbl').DataTable({
                "ordering": false,
                "autoWidth": false,
                "lengthChange": true,
                scrollCollapse: true,
                paging: false,
                responsive: {details: false}
            });
            /*scrollY: `${global_var_iframe_height * 0.75}px`,*/
            $("#data_tbl_filter").children("input").prop('class', 'form-control form-control-md');
            $("#data_tbl_length").children().prop('class', 'form-control form-control-md');
        });

    });

    $('#RefsModal').on('hidden.bs.modal', function (e) {
        $('#content').html("");
    });
    //-------------------------------------------------------------

});
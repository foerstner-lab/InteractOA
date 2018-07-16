function generate_query()
{
	var organism_qid = "";
	var viewer_type = "";
	var words = "";
	var RNA_types = "";
	var show_types = "";
	var optional_interact = "";
	var only_no_interact = "";
	$('#form input[type=checkbox]:checked, #form input[type=text], #form select').each(
	    function(index){
	        var input = $(this);
	        if (input.attr('name') == 'organism'){organism_qid = input.val();}
	        if (input.attr('name') == 'viewer_type'){viewer_type = input.val();}
	        if (input.attr('name') == 'WORDS'){words = input.val();}
	        if (input.attr('name') == 'RNA_TYPE'){RNA_types += input.val() + ',';}
	        if (input.attr('name') == 'SHOW_TYPE'){show_types += input.val() + ',';}
	        if (input.attr('name') == 'OPTIONAL_INTERACT'){optional_interact = input.val();}
	        if (input.attr('name') == 'ONLY_NO_INTERACT'){only_no_interact = input.val();}
	    })
	RNA_types = RNA_types.slice(0, -1);
	show_types = show_types.slice(0, -1);
	var query = ""
	$.getJSON('generate_viewer_query', {organism_qid : organism_qid, view_type : viewer_type, filters : RNA_types, shows : show_types, words : words, is_interacted : optional_interact, only_no_interacted : only_no_interact}, function(returned_query) {
    	query = encodeURIComponent(returned_query.results);
		$('#Visualizer').attr('style', "border: none; " + "width: " + $('#Vis_div').width() + "px; height: " + ($('#Vis_div').height() - 2) + "px;");
    	$('#Visualizer').attr('src', "viewer.html?wd_query=" + encodeURIComponent(query) + "&organism=" + organism_qid + "&frame_height=" + $('#Vis_div').height() + "&frame_width=" + $('#Vis_div').width());
	});
};
$(document).ready(function() {
	$('#ONLY_NO_INTERACT').change(function(){
	    if(this.checked){
	        $( "#OPTIONAL_INTERACT").removeAttr("checked");
	        $( "#OPTIONAL_INTERACT").prop("checked", false);
			$( "#OPTIONAL_INTERACT").attr("disabled", true);
	    }
	    else{
	    	$( "#OPTIONAL_INTERACT").removeAttr("disabled");
	    }
	});
});
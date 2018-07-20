var global_var_query = "";
var global_var_organism = "";
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
	        global_var_organism = organism_qid;
	    })
	RNA_types = RNA_types.slice(0, -1);
	show_types = show_types.slice(0, -1);
	$.getJSON('generate_viewer_query', {organism_qid : organism_qid, view_type : viewer_type, filters : RNA_types, shows : show_types, words : words, is_interacted : optional_interact, only_no_interacted : only_no_interact}, function(returned_query) {
    	$('#VisualizerModal').modal('show');
    	global_var_query = encodeURIComponent(returned_query.results);
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
	//---------------------------------------------
	$('[data-toggle="tooltip"]').tooltip();
	//--------------------------------------------- 
    $('#VisualizerModal').on('shown.bs.modal', function (e) {
  		var height = parseInt($('#Vis_div').css('height')) * 0.94;
    	var width = parseInt($('#Vis_div').css('width')) * 0.97;
    	var QS = "?query=" + global_var_query + "&organism=" + global_var_organism;
    	$('#parent_iframe').prop('src', "viewer.html");
		$('#parent_iframe').css('border', "none");
		$('#parent_iframe').css('width', width + "px");
		$('#parent_iframe').css('height', height + "px");
		$('#hidden_anchor').prop('href', QS);
		//$('#VisualizerModal').modal('handleUpdate');
	});
});
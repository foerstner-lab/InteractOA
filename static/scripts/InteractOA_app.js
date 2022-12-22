let global_var_query = "";
let global_var_organism = "";
let global_var_iframe_height = 0;
let global_var_iframe_width = 0;
function button_view_on_click()
{
	let viewer_type = "";
	let words = "";
	let RNA_types = "";
	let show_types = "";
	let optional_interact = "";
	let only_no_interact = "";
	$('#settings_form input[type=checkbox]:checked, #settings_form input[type=text], #settings_form select').each(
	    function(index){
	        let input = $(this);
	        if (input.attr('name') == 'viewer_type'){viewer_type = input.val();}
	        if (input.attr('name') == 'WORDS'){words = input.val();}
	        if (input.attr('name') == 'RNA_TYPE'){RNA_types += input.val() + ',';}
	        if (input.attr('name') == 'SHOW_TYPE'){show_types += input.val() + ',';}
	        if (input.attr('name') == 'OPTIONAL_INTERACT'){optional_interact = input.val();}
	        if (input.attr('name') == 'ONLY_NO_INTERACT'){only_no_interact = input.val();}
	        global_var_organism = $('#organism').val();
	    });
	RNA_types = RNA_types.slice(0, -1);
	show_types = show_types.slice(0, -1);
	$.getJSON('generate_viewer_query', {organism_qid : global_var_organism, view_type : viewer_type, filters : RNA_types, shows : show_types, words : words, is_interacted : optional_interact, only_no_interacted : only_no_interact}, function(returned_query) {
    	global_var_query = encodeURIComponent(returned_query.results);
    	$('#iframe_viewer').prop('src', "https://query.wikidata.org/embed.html#" + global_var_query);
	});
	global_var_iframe_height = parseInt($('#Vis_div').prop('scrollHeight')) * 0.95;
    global_var_iframe_width = parseInt($('#Vis_div').prop('scrollWidth')) * 0.97;
	$('#iframe_viewer').css('border', "none");
	$('#iframe_viewer').css('width', global_var_iframe_width + "px");
	$('#iframe_viewer').css('height', global_var_iframe_height + "px");
	$("#div_visalizer_iframe").show();
	$("#div_visualizer_settings").hide();
	$('#iframe_viewer')[0].contentWindow.location.reload(true);
	//$('#VisualizerModal').modal('handleUpdate');
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
	//--------------------------------------------------------------
	$('#RefsModal').on('shown.bs.modal', function (e) {
		global_var_organism = $('#organism').val();
		global_var_iframe_height = parseInt($('#refs_div').prop('scrollHeight')) * 0.93;
    	global_var_iframe_width = parseInt($('#refs_div').prop('scrollWidth')) * 0.97;
		$('#refs_iframe').css('border', "none");
		$('#refs_iframe').css('width', global_var_iframe_width + "px");
		$('#refs_iframe').css('height', global_var_iframe_height + "px");
		$('#refs_iframe').prop('src', "Cited_records.html?organism=" + global_var_organism);
	});
	//-------------------------------------------------------------
	$('#RefsModal').on('hidden.bs.modal', function (e) {
		$('#refs_iframe').prop('src', "");
		$('#refs_iframe')[0].contentWindow.location.reload(true);
	});
});
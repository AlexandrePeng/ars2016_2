// ------------------------------------------------------------------------------------------------
// Save all parameters
// ------------------------------------------------------------------------------------------------
function ars3_carto_save() {
	showMessage("Un moment s'il vous plait, en cours de sauvegarde ...");
	var _data = "";
	_data += "&PAR_RAPPORT=ars3_rpt_carto";
	
	
	$(".isParameter").each(function() {
			var _type  = $(this).prop("type");
			var _name  = $(this).prop("name");
			var _value = $(this).val();
			_value = (_value == "undefined") ? "_FOC_NULL" : _value;
 
			switch (_type) {
				case "select-one"       :
				case "select-multiple"  :
					_data += "&PAR_NAME="  + _name;
					_data += "&PAR_VALUE=" + _value;
					_data += "\n" ;
					break;
	
				case "radio" :
					if ( typeof $(this).prop("checked") != "undefined") {
						_value = $("input[name=" + _name + "]:checked").val();
						_data += "&PAR_NAME="  + _name;
						_data += "&PAR_VALUE=" + _value;
						_data += "\n" ;
					}
					break;
	
				case "checkbox" :
					var _bln = "false";
					if ( $(this).prop('checked') ) {
						_bln = "true";					
					} 
					_data += "&PAR_NAME="  + _name;
					_data += "&PAR_VALUE=" + _bln;
					_data += "\n" ;
					break;
			}
		})
	_data += "&RND=" + Math.random();
	_data = _data.replace(/,/g , ";");		// Seperator cannot be comma. See fex (...FORMAT COM)
	var _fex = "sql_parameters_save";
 
 
	// --- Check delete/insert process
    //window.open( glbUrl + _fex + _data );
	//return;
 
	//--- Update database met nieuwe status
	$.ajax({
		type    : "POST",
		url     : glbUrl + _fex,
		data	: _data,
		cache   : false,
		success : function(_retval) {
			$("#msgWindow").remove();
		}
	});
 
} 
 
// ------------------------------------------------------------------------------------------------
// Get parameters and update objects 
// ------------------------------------------------------------------------------------------------
 
 
var glbUrl = "/ibi_apps/WFServlet?IBIF_ex=";
 
// --------------------------------------------------------------------------------------------
// FS: Load Parameters
// --------------------------------------------------------------------------------------------
function ars3_carto_load() {
	showMessage("Un moment s'il vous plait, en cours de chargement ...");
	var _data = "";
	_data += "&PAR_RAPPORT=ars3_rpt_statut";
 
	var _fex = "sql_parameters_load";
 
	// --- Check delete/insert process
   	//window.open( glbUrl + _fex + _data );
	//return;
 
	//--- Update database met nieuwe status
	$.ajax({
		type    : "POST",
		url     : glbUrl + _fex,
		data	: _data,
		cache   : false,
		success : function(_retval) {
			var _pos = _retval.lastIndexOf(",");
			_retval  = _retval.substring(0, _pos);
			var _jsonData = eval("[" + _retval + "]");
			
			$.each(_jsonData, function(i, _item) {
				// --- Find the type of control for the parameter
				var _type = $('[name="'  + _item.name + '"]').prop('type');
				
				switch (_type) {
					case "select-one"       :
					case "select-multiple"  :
						setValuesForListbox(_item.name , _item.value );
						break;
					
					case "checkbox"			:
						setValueForCheckbox(_item.name , _item.value );
						break;
					
					case "radio"			:
						setValueForRadio(_item.name , _item.value );
						break;
				}
			});
			$("#msgWindow").remove();
		}
	});
}
 
 
//	function parametersLoad() {
//		resetAllObjects();
//	
//		setValuesForListbox("dir_listb_geo",   3);
//		setValuesForListbox("dir_listb_ent",   2);
//		setValuesForListbox("dir_listb_act",   4);
//		setValuesForListbox("dir_listb_corps", 5);
//		setValuesForListbox("dir_listb_geo_reg",  "R42;R83");
//		setValuesForListbox("dir_listb_geo_dept", "D03;D43;D67");
//		
//		setValueForRadio("radio1", 2012); 
//		setValueForRadio("radio2", 2); 
//		
//		setValueForCheckbox("checkbox1", "ASD13CTS_HCTSN3"); 
//		setValueForCheckbox("checkbox1", "ASD13CTS_CTN"); 
//	}
 
 
// ------------------------------------------------------------------------------------------------
// Resett all objects (listbox / radio / checkbox)
// ------------------------------------------------------------------------------------------------
function resetAllObjects() {
	$(".isParameter").each(function(i) {
		//alert(i);
		$(this)[0].selectedIndex = 0;
		$(this).prop("checked", false);
		$(this).trigger("click");						// Perform action; If not defined on object, no problem
		$(this).trigger("change");						// Perform action; If not defined on object, no problem
	})
}
 
 
// ------------------------------------------------------------------------------------------------
// Set values for listbox (both simple- and multiple-select listboxes)
// ------------------------------------------------------------------------------------------------
function setValuesForListbox(_name, _value) {
	_value   = String(_value);					// If value is numeric; change it to type String.
	var _arr = _value.split(";");				// Make array of value/all values
 
	var $obj = $("#" + _name);
	$obj.val(_arr);
	$obj.trigger("click");						// Perform action; If not defined on object, no problem
	$obj.trigger("change");						// Perform action; If not defined on object, no problem
}
 
 
// ------------------------------------------------------------------------------------------------
// Set values for radio
// ------------------------------------------------------------------------------------------------
function setValueForRadio(_name, _value) {
    var $radios = $('input:radio[name="' + _name + '"]');
    $radios.filter('[value="' + _value + '"]').prop('checked', true);
}
 
 
// ------------------------------------------------------------------------------------------------
// Set values for checkbox
// ------------------------------------------------------------------------------------------------
function setValueForCheckbox(_name, _value) {
	if (_value == "true" ) {
		$("input[name=" + _name + "]").prop('checked', 'checked');		
	}
	else {
		$("input[name=" + _name + "]").removeAttr('checked');
	}
}
 
 function showMessage(_msg) {
	$("body").append("<div id='msgWindow'>" + _msg + "</div>");
	$("#msgWindow").css({
		position 		: "absolute",
		zIndex			: 99999,
		padding			: "10px" ,
		top				: "250px",
		left			: "0px",
		width			: "400px",
		height			: "75px",
		fontSize		: "1.2em",
		backgroundColor	: "#5472ae" ,
		color			: "#fff"
	})
}

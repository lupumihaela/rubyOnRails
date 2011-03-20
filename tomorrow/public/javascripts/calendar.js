$(window).scroll(scroll_or_resize);
$(window).resize(scroll_or_resize);

/* profile */
function scroll_or_resize(){
    var left = document.body.scrollLeft;
    var calendar_bar_pos = $(".display_box").position().left + 5;
    var absolute_right_pos = $(".display_box").position().left + 475;
    $(".absolute_right").css("left",absolute_right_pos-left);
    $(".calendar_bar").css("left",calendar_bar_pos-left);
    
    $('.schedule').css("height", (window.innerHeight-100));
    
}

    

/* list events */

var edit = false;
$(".added_time_slot").click(function() {
   edit = true;
   $(".event_detail").show();

});

String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
	var reg = new RegExp("\\{" + i + "\\}", "gm");
	s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

function resize_update_when(event, ui) {
    var obj = temp_eb_list[temp_eb_list.length-1]
    var top_pos = obj.position().top;
    var bottom_pos = top_pos+obj.height();
    var st_time = Math.floor(top_pos/30)/2;
    var ed_time = Math.floor(bottom_pos/30)/2;
    $('input[name*="add_start_time"]').val(st_time);
    $('input[name*="add_end_time"]').val(ed_time);
}

function drag_update_when(event, ui) {
    var obj = temp_eb_list[temp_eb_list.length-1]
    var st_time = Math.floor(obj.position().top/30)/2;
    
    var ed_time = st_time + Math.ceil(obj.height()/30)/2;
    $('input[name*="add_start_time"]').val(st_time);
    $('input[name*="add_end_time"]').val(ed_time);
}

var resize_var = {
    grid:30, 
    minHeight:30, 
    minWidth:350,
    maxWidth:350,
    resize:resize_update_when
};

var drag_var = {
    snap: ".half_hour_slot",
    axis: "y",
    drag:drag_update_when
};

var temp_eb_counter = 0;
var temp_eb_list = new Array();

function perm_add_event_block(id, st, ed) {
    if (temp_eb_list.length > 0) 
	temp_eb_list.pop().hide();

    var cond = 'div[half_slot="'+id+'"]';
    var div_str = '<div class="perm_event_block" eb_id="'
	+ temp_eb_counter  +'"></div>';
    $(cond).append(div_str);
    var this_eb = $( ".perm_event_block" );
    this_eb.resizable(resize_var);
    this_eb.draggable(drag_var);
    temp_eb_list.push(this_eb);


    temp_eb_counter ++;
}

$(".half_hour_slot").click(function() {
    $(".add_event").hide();
    if (edit) {
	edit = false;
	
	return;
    }
    
    $(".event_detail").hide();
    var id = $(this).attr("half_slot");
    var st = parseFloat(id,10);
    var ed = st+1;

    perm_add_event_block(id, st, ed);

    $('input[name*="add_start_time"]').val(st);
    $('input[name*="add_end_time"]').val(ed);
    $(".add_event").show();


    $(".filtered_events").hide();
    var fields = st
    $.ajax( {
	type: "POST",
	url: "filter_events",
	async: true,
	data:fields,
    });
    $(".filtered_events").show();
    
    $(".popup_right_half").show();


});


$('.schedule').jScrollPane({animateTo:false});
$(document).ready(
   function() {
   $('.schedule')[0].scrollTo(500);
   return false;
});

var calendar_bar_pos = $(".display_box").position().left+5;
$(".calendar_bar").css("left",calendar_bar_pos);

/* add event */
function add_event_click() {
    var fields = $("form").serializeArray();
    
    var res = $.ajax( {
        type: "POST",
        url: "add_event",
        async: false,
        data:fields,
    }).responseText;
    
    if (res=="OK") {
        alert(res);
	
        $(".add_event").hide();
    }
};
$("#add_submit").button();





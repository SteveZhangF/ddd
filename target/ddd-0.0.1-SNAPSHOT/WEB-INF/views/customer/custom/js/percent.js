/**
 * add a progressbar to the element
 * 
 * */


(function($) {
	var defaults = {
		height : "10px",
		width : "1%"
	};
	var addProcessbar = function(obj) {
		$processbar = $("<div class=\"progress\"> <div class=\"progress-bar\" role=\"progressbar\"  aria-valuemin=\"0\" aria-valuemax=\"100\" > "
				+ "</div></div>");
//		$processbar.find(".progress-bar").attr(" aria-valuenow",defaults.width*100);
		$processbar.find(".progress-bar").css({
			"height" : defaults.height,
			"width" : defaults.width,
			"background-color": "#00b9ff"
		});
		$(obj).append(function() {
			console.log($processbar.html());
			return $(obj).append($processbar)
		});
	}

	$.fn.addProcessbar = function(options) {
		var options = $.extend(defaults, options);
		return this.each(function() {
			addProcessbar(this);
		});
	}
})(jQuery);
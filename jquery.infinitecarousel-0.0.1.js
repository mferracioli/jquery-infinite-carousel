(function($){  
	$.fn.infiniteCarousel = function(options) {  

		var defaults = {
			next: ".next",
			previous: ".previous",
			width: 500,
			height: 250,
			seconds: 5,
			timer: null,
			afterNext: function() {},
			afterPrevious: function() {},
			beforeNext: function() {},
			beforePrevious: function() {}
		};
		
		var options = $.extend(defaults, options);

		var ul = $("ul", this);
		
		$(this).css({ width: options.width, height: options.height, overflow: "hidden", position: "relative" });
		$(ul).css({ width: options.width, height: options.height, position: "relative" });
		$("li", ul).css({ width: options.width, height: options.height, position: "absolute", top: 0 });
		
		$("<ul class=\"pager\"></ul>").appendTo($("#carousel"));
		
		$("ul li", this).each(function(i,li){
			$(li).css("left", (i * options.width));
			
			$("#carousel ul.pager").append("<li><a class=\"page-"+i+"\" href=\"#\">"+(i+1)+"</a></li>");
			
			$("#carousel ul.pager a:eq("+i+")").click(function(){
				jumpTo(i);
			});
		});
		
		var index = 0;
		var count = $("#carousel ul.pager a").length;
		mark();
		
		function jumpTo(go) {
			
			if(go < index) {
				for(var i=0; i < (index-go); i++) {
					window.setTimeout(function() { previous(100) }, 120 * i);
				}
			}
			
			if(go > index) {
				for(var i=0; i < (go-index); i++) {
					window.setTimeout(function() { next(100) }, 120 * i);
				}
			}
		}
		
		function next(t) {
			var first = $("li:first", $(ul));
			var clone = $("li:first", $(ul)).clone();
			var left = $("li:last", $(ul)).position().left + options.width;

			clone.css("left", left);
			clone.appendTo($(ul));
			
			index++;
			
			if(index > (count-1)) {
				index = 0;
			}
			
			autoNext();
			options.beforeNext();
			mark();

			$(ul).animate({ left: "-=" + options.width }, t, function(){
				$(first).remove();
				options.afterNext();
			});
		}
		
		function previous(t) {
			var last = $("li:last", $(ul));
			var clone = $(last).clone();
			var left = $("li:first", $(ul)).position().left - options.width;

			clone.css("left", left);
			clone.prependTo($(ul));
			
			index--;
			
			if(index < 0) {
				index = (count - 1);
			}
			
			autoNext();
			options.beforePrevious();
			mark();

			$(ul).animate({ left: "+=" + options.width }, t, function(){
				$(last).remove();
				options.afterPrevious();
			});
		}
		
		function mark() {
			$("#carousel ul.pager li").removeClass("active");
			$("#carousel ul.pager li:eq("+ index +")").addClass("active");
		} 
		
		$(options.next).click(function(){
			next();
		});
		
		$(options.previous).click(function(){
			previous(250);
		});
		
		if(options.seconds > 0) {
			autoNext(250);
		}
		
		function autoNext() {
			if(options.timer != null) {
				window.clearTimeout(options.timer);
			}
			
			options.timer = window.setTimeout(function() {
				$(options.next).click();
			}, options.seconds * 1000);
		}

	};  
})(jQuery);
'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

	// SIDEBAR SCALE TO MOBILE/TABLET
	$(window).resize(() => {
		if($(document).width() >= 1023) {
			$('#sidebar').removeClass('sidebar-toggle')
			$('.sidebar').children('ul').removeClass('sidebar-ul-toggle')
			$('.content').removeClass('content-toggle')
		}
	})

	$('#nav-button').on('click', () => {
		$('#sidebar').toggleClass('sidebar-toggle')
		$('.sidebar').children('ul').toggleClass('sidebar-ul-toggle')
		$('.content').toggleClass('content-toggle')
	})

}))

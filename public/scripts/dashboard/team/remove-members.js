'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

	// REMOVE MEMBERS POPUP
	$('#remove-button').on('click', function(){
		$('.remove-member-popup').addClass('remove-member-popup-display');
	})

	$('.remove-member-cancel').on('click', function(){
		$('.remove-member-popup').removeClass('remove-member-popup-display');
	})

}));

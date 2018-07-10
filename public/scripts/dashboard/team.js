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

	// LEAVE TEAM POPUP
	$('#leave-team-button').on('click', function(){
	  $('.leave-team-form-hidden').addClass('leave-team-form-display');
	})

	$('.nevermind-leave').on('click', function(){
	  $('.leave-team-form-hidden').removeClass('leave-team-form-display');
	})

}));

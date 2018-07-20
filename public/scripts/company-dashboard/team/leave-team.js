'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

	// LEAVE TEAM POPUP
	$('#leave-team-button').on('click', function(){
	  $('.leave-team-form-hidden').addClass('leave-team-form-display')
	})

	$('.nevermind-leave').on('click', function(){
	  $('.leave-team-form-hidden').removeClass('leave-team-form-display')
	})

}))

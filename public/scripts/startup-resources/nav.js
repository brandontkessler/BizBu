'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  $('#nav-button').on('click', function(){
    $('#nav-target').slideToggle()
  })

}))

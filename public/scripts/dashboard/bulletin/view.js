'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let viewBtns = $('.view-button')

  viewBtns.each(function(){
    $(this).on('click', function(){
      let viewUL = $(this).parent().parent().parent().children('.bulletin-view')

      $(this).css("display", "none")
      $(this).parent().children('.hide-button').css("display", "inline-block")

      viewUL.css("display", "block")
    })
  })

}))

'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

  let deleteBtns = $('.delete-button'),
    responseBtns = $('.bulletin-message-response-btns');

  deleteBtns.each(function(){
    $(this).on('click', function(){
      let parentLi = $(this).parent().parent().parent();
      let confirmBtn = $(this).parent().parent().children('.confirm-button');
      let cancelBtn = $(this).parent().parent().children('.cancel-button');

      parentLi.css("color", "red");
      responseBtns.each(function(){
        $(this).css("display", "none");
      })

      confirmBtn.css("display", "inline-block");
      cancelBtn.css("display", "inline-block");
    })
  })

}));

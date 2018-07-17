'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let cancelBtns = $('.cancel-button'),
    responseBtns = $('.bulletin-message-response-btns'),
  	postBulletinBtn = $('#post-bulletin'),
		editBulletinBtn = $('#edit-bulletin'),
		commentBulletinBtn = $('#comment-bulletin'),
    bulletinInput = $('.post-bulletin-message')

  cancelBtns.each(function(){
    $(this).on('click', function(){
      let parentLi = $(this).parent().parent()

      postBulletinBtn.css("display", "block")
      editBulletinBtn.css("display", "none")
      commentBulletinBtn.css("display", "none")

      parentLi.css("color", "black")
      responseBtns.each(function(){
        $(this).css("display","inline-block")
      })

      $(this).parent().children('.confirm-button').css("display", "none")
      $(this).css("display", "none")
      bulletinInput.val("")
      bulletinInput.attr("placeholder", "Post a bulletin...")
    })
  })

}))

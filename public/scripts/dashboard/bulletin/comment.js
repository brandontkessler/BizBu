'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let commentBtns = $('.comment-button'),
    responseBtns = $('.bulletin-message-response-btns'),
		postBulletinBtn = $('#post-bulletin'),
		commentBulletinBtn = $('#comment-bulletin'),
		bulletinLis = $('.bulletin-message-container'),
    bulletinInput = $('.post-bulletin-message'),
    bulletinId = $("input[name='bulletinId']").val(),
    companyId = $("input[name='companyId']").val()

  commentBtns.each(function(){
		$(this).on('click', function(){
			let parentLi = $(this).parent().parent().parent()
			let cancelBtn = $(this).parent().parent().children('.cancel-button')

			postBulletinBtn.css("display", "none")
			commentBulletinBtn.css("display", "block")
			bulletinInput.attr("placeholder", "Comment on this bulletin...")
			parentLi.css("color", "rgb(68, 96, 181)")
			responseBtns.each(function(){
				$(this).css("display", "none")
			})

			cancelBtn.css("display", "inline-block")

			commentBulletinBtn.on('click', function(e){
				e.preventDefault()
				let bulletinsArrIndex = (function(){
					let initIndex = bulletinLis.index(parentLi)
					let count = bulletinLis.length - 1
					return count - initIndex
				}())
				let data = {
					message: $('.post-bulletin-message').val(),
					submittedBy: $("input[name='bulletin[submittedBy]']").val(),
					name: $("input[name='bulletin[name]']").val(),
					bulletinId: bulletinId,
					bulletinIndex: bulletinsArrIndex
				}

				$.ajax({
					'url': `/company-dashboard/${companyId}/bulletin-board/comment`,
					'type': 'POST',
					'data': data,
					'dataType' : 'json',
					'success': function(data){
						window.location = data.redirect
					}
				})

			})

		})
	})

}))

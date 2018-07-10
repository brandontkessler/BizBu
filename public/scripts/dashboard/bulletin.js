'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

	let bulletinLis = $('.bulletin-message-container'),
		postBulletinForm = $('#post-bulletin-form'),
		bulletinInput = $('.post-bulletin-message'),
		postBulletinBtn = $('#post-bulletin'),
		editBulletinBtn = $('#edit-bulletin'),
		commentBulletinBtn = $('#comment-bulletin'),
		bulletinId = $("input[name='bulletinId']").val(),
		companyId = $("input[name='companyId']").val();

	let responseBtns = $('.bulletin-message-response-btns'),
		editBtns = $('.edit-button'),
		deleteBtns = $('.delete-button'),
		viewBtns = $('.view-button'),
		commentBtns = $('.comment-button'),
		hideBtns = $('.hide-button'),
		confirmBtns = $('.confirm-button'),
		cancelBtns = $('.cancel-button');

	cancelBtns.each(function(){
		$(this).on('click', function(){
			let parentLi = $(this).parent().parent();

			postBulletinBtn.css("display", "block");
			editBulletinBtn.css("display", "none");
			commentBulletinBtn.css("display", "none");

			parentLi.css("color", "black");
			responseBtns.each(function(){
				$(this).css("display","inline-block");
			})

			$(this).parent().children('.confirm-button').css("display", "none");
			$(this).css("display", "none");
			bulletinInput.val("");
			bulletinInput.attr("placeholder", "Post a bulletin...");
		})
	})

	editBtns.each(function(){
		$(this).on('click', function(){
			let parentLi = $(this).parent().parent().parent();
			let bulletinText = $(this).parent().parent().parent().children('p.bulletin-message')[0].innerHTML.trim();
			let cancelBtn = $(this).parent().parent().children('.cancel-button');

			postBulletinBtn.css("display", "none");
			editBulletinBtn.css("display", "block");

			parentLi.css("color", "rgb(226, 226, 226)");
			responseBtns.each(function(){
				$(this).css("display", "none");
			})

			cancelBtn.css("display", "inline-block");
			bulletinInput.val(bulletinText);

			editBulletinBtn.on('click', function(e){
				e.preventDefault();
				let bulletinsArrIndex = (function(){
					let initIndex = bulletinLis.index(parentLi);
					let count = bulletinLis.length - 1;
					return count - initIndex
				}());

				$.ajax({
					'url': "/company_dashboard/" + companyId + "/bulletin-board?_method=PUT",
					'type': 'POST',
					'data': {
						name: $("input[name='bulletin[name]']").val(),
						message: $('.post-bulletin-message').val(),
						bulletinId: bulletinId,
						bulletinIndex: bulletinsArrIndex
					},
					'dataType' : 'json',
					'success': function(data){
						window.location = data.redirect;
					}
				})
			})

		})
	})

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

	confirmBtns.each(function(){
		$(this).on('click', function(e){
			e.preventDefault()
			let parentLi = $(this).parent().parent();

			let bulletinsArrIndex = (function(){
				let initIndex = bulletinLis.index(parentLi);
				let count = bulletinLis.length - 1;
				return count - initIndex
			}());

			$.ajax({
				'url': "/company_dashboard/" + companyId + "/bulletin-board?_method=DELETE",
				'type': 'POST',
				'data': {
					name: $("input[name='bulletin[name]']").val(),
					bulletinId: bulletinId,
					bulletinIndex: bulletinsArrIndex
				},
				'dataType' : 'json',
				'success': function(data){
					window.location = data.redirect;
				}
			})
		})
	})

	commentBtns.each(function(){
		$(this).on('click', function(){
			let parentLi = $(this).parent().parent().parent();
			let cancelBtn = $(this).parent().parent().children('.cancel-button');

			postBulletinBtn.css("display", "none");
			commentBulletinBtn.css("display", "block");
			bulletinInput.attr("placeholder", "Comment on this bulletin...");
			parentLi.css("color", "rgb(68, 96, 181)");
			responseBtns.each(function(){
				$(this).css("display", "none");
			})

			cancelBtn.css("display", "inline-block");

			commentBulletinBtn.on('click', function(e){
				e.preventDefault()
				let bulletinsArrIndex = (function(){
					let initIndex = bulletinLis.index(parentLi);
					let count = bulletinLis.length - 1;
					return count - initIndex
				}());
				let data = {
					message: $('.post-bulletin-message').val(),
					submittedBy: $("input[name='bulletin[submittedBy]']").val(),
					name: $("input[name='bulletin[name]']").val(),
					bulletinId: bulletinId,
					bulletinIndex: bulletinsArrIndex
				}

				$.ajax({
					'url': "/company_dashboard/" + companyId + "/bulletin-board/comment",
					'type': 'POST',
					'data': data,
					'dataType' : 'json',
					'success': function(data){
						window.location = data.redirect;
					}
				})

			})

		})
	})

	viewBtns.each(function(){
		$(this).on('click', function(){
			let viewUL = $(this).parent().parent().parent().children('.bulletin-view');

			$(this).css("display", "none");
			$(this).parent().children('.hide-button').css("display", "inline-block");

			viewUL.css("display", "block");
		});
	})

	hideBtns.each(function(){
		$(this).on('click', function(){
			let viewUL = $(this).parent().parent().parent().children('.bulletin-view');

			$(this).css("display", "none");
			$(this).parent().children('.view-button').css("display", "inline-block");

			viewUL.css("display", "none");
		})
	})


}));

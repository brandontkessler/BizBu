'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});
	let userId = $('#userId').val();
	let userName = $('#userName').val();
	let userHideChat = $('#userHideChat').val();
	let companyId = $('#companyId').val();
	let chatId = $('#chatId').val();
	let host = $('#host').val();


// ***************************************************************************
	// SIDEBAR SCALE TO MOBILE/TABLET
	$(window).resize(() => {
		if($(document).width() >= 1023) {
			$('#sidebar').removeClass('sidebar-toggle');
			$('.sidebar').children('ul').removeClass('sidebar-ul-toggle');
			$('.content').removeClass('content-toggle');
		}
	});

	$('#nav-button').on('click', () => {
		$('#sidebar').toggleClass('sidebar-toggle');
		$('.sidebar').children('ul').toggleClass('sidebar-ul-toggle');
		$('.content').toggleClass('content-toggle');
	});


	// REMOVE MEMBER POPUP
	$('#remove-button').on('click', () => {
		$('.remove-member-popup').addClass('remove-member-popup-display');
	})

	$('.remove-member-cancel').on('click', () => {
		$('.remove-member-popup').removeClass('remove-member-popup-display');
	})


	// LEAVE TEAM POPUP
	$('#leave-team-button').on('click', () => {
		$('.leave-team-form-hidden').addClass('leave-team-form-display');
	})

	$('.nevermind-leave').on('click', () => {
		$('.leave-team-form-hidden').removeClass('leave-team-form-display');
	})
// ***************************************************************************

	const flash = document.querySelector('.flash');

	// HANDLE FLASH
	window.addEventListener('load', () => {
		// HANDLE FLASH TIMEOUTS
		if(flash){
			setTimeout(()=>{
				flash.style.opacity = '0';
			}, 2000)
			setTimeout(()=>{
				flash.style.display = 'none';
			}, 4000)
		}
	})

 // ****************************** CHAT *************************************
	let chatDropdown = $('.chat-hide');
	let chatReveal = $('.chat-reveal');
	let chatUL = $('.chat-messages-content-background');
	let chatForm = $('.chat-form');

	let scrollToBottom = () => {
		chatUL.animate({scrollTop: $('.chat-messages-content-background li').last().offset().top}, 'fast')
	};

	scrollToBottom();

	if(userHideChat.toString() === "true"){
		chatDropdown.css("display", "none");
		chatUL.css("display", "none");
		chatForm.css("display", "none");
		chatReveal.css("display", "block");
	} else {
		chatDropdown.css("display", "block");
		chatUL.css("display", "block");
		chatForm.css("display", "block");
		chatReveal.css("display", "none");
	}

 // ****************************** SOCKET *************************************
	let socket = io();
	let chatBtn = $('#chat-button');
	let chatMsg = $('.chat-message');

	socket.on('connect', () => {
		socket.emit('joinChat', {
		  userName,
		  companyId,
			chatId
		});
	});

	socket.on('populate chat', (msgs) => {
		for (let msg of msgs){
			chatUL.append(`<li class="chat-list-item"><p class="chat-message-name">${msg.user}</p><p class="chat-message-content">${msg.message}</p></li>`);
		}
	})

	// ******** HANDLING NEW MESSAGES
	$(".chat-message").keypress(function(e) {
		if(e.which === 13) {
			e.preventDefault();
			socket.emit('chat message', {
				userName,
				'chatMessage': chatMsg.val(),
				chatId
			});
			chatMsg.val("");
		}
	});

	chatBtn.on('click', function(e){
		e.preventDefault();
		socket.emit('chat message', {
			userName,
			'chatMessage': chatMsg.val(),
			chatId
		});
		chatMsg.val("");
	})

	socket.on('new message', data => {
		let newMessageUserName = data.userName.split(' ')[0];
		chatUL.append(`<li class="chat-list-item"><p class="chat-message-name">${newMessageUserName}</p><p class="chat-message-content">${data.chatMessage}</p></li>`);
		scrollToBottom();
	});

	chatDropdown.on('click', () => {
		chatDropdown.css("display", "none");
		chatUL.css("display", "none");
		chatForm.css("display", "none");
		chatReveal.css("display", "block");
		socket.emit('set hide true', { userId });
	});

	chatReveal.on('click', () => {
		chatDropdown.css("display", "block");
		chatUL.css("display", "block");
		chatForm.css("display", "block");
		chatReveal.css("display", "none");
		socket.emit('set hide false', { userId });
	});

}));

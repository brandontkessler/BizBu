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
	let chatWindow = $('.chat-window');
	let chatDropdown = $('.chat-hide');
	let chatReveal = $('.chat-reveal');
	let chatUL = $('.chat-messages-content-background');
	let chatForm = $('.chat-form');
	let activeUserList = $('#active-user-ul');

	let scrollToBottom = () => {
		chatUL.animate({scrollTop: $('.chat-messages-content-background li').last().offset().top}, 'fast')
	};

	let chatHideFunc = () => {
		chatDropdown.css("display", "none");
		chatUL.css("display", "none");
		chatForm.css("display", "none");
		chatWindow.css("height", "0");
		chatReveal.css("display", "block");
	}

	let chatRevealFunc = () => {
		chatDropdown.css("display", "block");
		chatUL.css("display", "block");
		chatForm.css("display", "block");
		chatWindow.css("height", "500px");
		chatReveal.css("display", "none");
		scrollToBottom();
	}

	if(userHideChat.toString() === "true"){
		chatHideFunc();
	} else {
		chatRevealFunc();
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

		socket.emit('active user', {
			userName,
			companyId,
			chatId
		})
	});

	socket.on('populate chat', msgs => {
		for (let msg of msgs){
			chatUL.append(`<li class="chat-list-item"><p class="chat-message-name">${msg.user}</p><p class="chat-message-content">${msg.message}</p></li>`);
		}
	})

	socket.on('populate active users', activeUsers => {
		activeUserList.empty();
		for (let user of activeUsers){
			activeUserList.append(`<li class="active-user-item">${user.split(" ")[0]}</li>`);
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
			}, data => {
				chatUL.append(`<li class="chat-list-item"><em><p class="chat-message-content-error">${data}</p></em></li>`);
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
		}, data => {
			chatUL.append(`<li class="chat-list-item"><em><p class="chat-message-content-error">${data}</p></em></li>`);
		});
		chatMsg.val("");
	})

	socket.on('new message', data => {
		let newMessageUserName = data.userName.split(' ')[0];
		chatUL.append(`<li class="chat-list-item"><p class="chat-message-name">${newMessageUserName}</p><p class="chat-message-content">${data.chatMessage}</p></li>`);
		scrollToBottom();
	});

	chatDropdown.on('click', () => {
		chatHideFunc();
		socket.emit('set hide true', { userId });
	});

	chatReveal.on('click', () => {
		chatRevealFunc();
		socket.emit('set hide false', { userId });
	});

}));

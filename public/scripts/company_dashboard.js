(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

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

	const 	flash = document.querySelector('.flash');

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


}));

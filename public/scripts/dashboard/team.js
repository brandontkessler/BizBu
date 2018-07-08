// REMOVE MEMBERS POPUP
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

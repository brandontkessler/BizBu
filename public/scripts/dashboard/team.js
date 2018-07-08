// LEAVE TEAM POPUP
$('#leave-team-button').on('click', () => {
  $('.leave-team-form-hidden').addClass('leave-team-form-display');
})

$('.nevermind-leave').on('click', () => {
  $('.leave-team-form-hidden').removeClass('leave-team-form-display');
})

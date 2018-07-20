'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let messageTabs = $('.message-tab'),
    replyBtn = $('.reply-btn'),
    cancelBtn = $('.cancel-btn'),
    deleteBtn = $('.delete-btn'),
    cancelDeleteBtn = $('.cancel-delete-btn'),
    msgActions = $('.message-actions'),
    firstMsg = $('#my-messages-ul').children('.message-tab').first(),
    onLoadMsgId = firstMsg.next().val(),
		currentId = $('#currentId'),
    msgWindow = $('#message-window')

  firstMsg.addClass('selected')
  firstMsg.parent().children('.message-actions').first().css("display", "inline-block")
  $.ajax({
    'url': `/homebase/user/${currentId}/my-messages/query/${onLoadMsgId}`,
    'type': 'GET',
    'dataType': 'json',
    'success': function(data){
      msgWindow.append(data.data)
    }
  })

  messageTabs.each(function(){
    $(this).on('click', function(){
      let msgId = $(this).next().val()

      messageTabs.each(function(){
        $(this).removeClass('selected')
      })

      msgActions.each(function(){
        $(this).css("display", "none")
      })

      $(this).addClass('selected')
      $(this).next().next().css("display", "inline-block")

      msgWindow.empty()

      $.ajax({
        'url': `/homebase/user/${currentId}/my-messages/query/${msgId}`,
        'type': 'GET',
        'dataType': 'json',
        'success': function(data){
          msgWindow.append(data.data)
        }
      })
    })
  })

  replyBtn.each(function(){
    $(this).on('click', function(){
      $(this).css("display", "none")
      $(this).parent().children('.delete-btn').css("display", "none")
      $(this).parent().children('.reply-message-form').css("display", "block")
      msgWindow.css("height", "calc(100vh - 90px - 50px - 110px)")
    })
  })

  cancelBtn.each(function(){
    $(this).on('click', function(e){
      e.preventDefault()
      $(this).parent().children('textarea').val('')
      $(this).parent().css("display", "none")
      $(this).parent().parent().children('.reply-btn').css("display", "inline-block")
      $(this).parent().parent().children('.delete-btn').css("display", "inline-block")
      msgWindow.css("height", "calc(100vh - 90px - 50px)")
    })
  })

  deleteBtn.each(function(){
    $(this).on('click', function(){
      $(this).css("display", "none")
      $(this).prev().css("display", "none")
      $(this).next().css("display", "block")
    })
  })

  cancelDeleteBtn.each(function(){
    $(this).on('click', function(e){
      e.preventDefault()
      $(this).parent().css("display", "none")
      $(this).parent().prev().css("display", "inline-block")
      $(this).parent().prev().prev().css("display", "inline-block")
    })
  })

}))

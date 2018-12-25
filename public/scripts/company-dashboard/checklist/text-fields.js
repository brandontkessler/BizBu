'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let checklistText = $('.checklist-item').children('textarea')

  checklistText.each(function(){
    $(this).on('click', function(){
      let val = $(this).val()

      checklistText.each(function(){
        $(this).removeClass('active')
      })

      $(this).addClass('active')
      $(this).focus().val("").val(val).scrollTop($(this)[0].scrollHeight);

    })
  })


}))

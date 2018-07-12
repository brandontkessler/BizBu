'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

  let editBtns = $('.edit-button'),
    responseBtns = $('.bulletin-message-response-btns'),
    cancelBtns = $('.cancel-button');

  let postBulletinBtn = $('#post-bulletin'),
		editBulletinBtn = $('#edit-bulletin');

  let bulletinLis = $('.bulletin-message-container'),
    bulletinInput = $('.post-bulletin-message');

  let bulletinId = $("input[name='bulletinId']").val(),
    companyId = $("input[name='companyId']").val();

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
          'url': `/company_dashboard/${companyId}/bulletin-board?_method=PUT`,
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

}));

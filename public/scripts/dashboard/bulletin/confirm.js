'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

  let confirmBtns = $('.confirm-button');

  let bulletinLis = $('.bulletin-message-container');

  let bulletinId = $("input[name='bulletinId']").val(),
    companyId = $("input[name='companyId']").val();

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
        'url': `/company-dashboard/${companyId}/bulletin-board?_method=DELETE`,
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

}));

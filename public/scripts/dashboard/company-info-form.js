'use strict';
(function(code){
	code(window.jQuery, window, document);
}(function($, window, document){
	$(function(){
		// The DOM is ready
	});

  let editBtn = $('.edit-btn'),
    saveBtn = $('.save-btn'),
    cancelBtn = $('.cancel-btn'),
    tagline = $('.tagline'),
    description = $('.company-description'),
    needs = $('.company-needs');

  editBtn.on('click', function(){
    $(this).css("display", "none");
    tagline.prop('disabled', false);
    description.prop('disabled', false);
    needs.prop('disabled', false);
    saveBtn.css("display", "inline-block");
    cancelBtn.css("display", "inline-block");
  })

  cancelBtn.on('click', function(){
    $(this).css("display", "none");
    tagline.prop('disabled', true);
    description.prop('disabled', true);
    needs.prop('disabled', true);
    saveBtn.css("display", "none");
    editBtn.css("display", "inline-block");
  })


}));

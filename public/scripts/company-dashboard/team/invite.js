'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  let inviteList = $("#available-to-invite").children()
  for (let invite of inviteList) {
    if(invite.childNodes[3].className === "invite-pending"){
      invite.childNodes[5].remove()
    }
  }

}))

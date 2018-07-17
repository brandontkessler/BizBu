'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

  const flash = $('.flash')

  window.addEventListener('load', () => {
    // HANDLE FLASH TIMEOUTS
    if(flash){
      setTimeout(()=>{
        flash.css("transform", "scale(0)")
      }, 2000)
      setTimeout(()=>{
        flash.css("display", "none")
      }, 2500)
    }
  })

}))

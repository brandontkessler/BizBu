'use strict';
const 	flash = document.querySelector('.flash');


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

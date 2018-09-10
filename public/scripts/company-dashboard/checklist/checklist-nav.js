'use strict';
(function(code){
	code(window.jQuery, window, document)
}(function($, window, document){
	$(function(){
		// The DOM is ready
	})

	let btnBack = $('.checklist-btn-back'),
		btnNext = $('.checklist-btn-next'),
		companyInfo = $('.company-info'),
		assumptionRecommendations = $('.assumption-recommendations'),
		assumptions = $('.assumptions'),
		coFounders = $('.co-founders'),
		btnCoFounderYes = $('.co-founder-yes'),
		btnCoFounderNo = $('.co-founder-no'),
		coFounderInput = $('#co-founder-input'),
		founderBios = $('.founder-bios'),
		introVideo = $('.intro-video'),
		prototype = $('.prototype'),
		btnPrototypeYes = $('.prototype-yes'),
		btnPrototypeNo = $('.prototype-no'),
		prototypeInput = $('#prototype-input'),
		prototypeResources = $('.prototype-resources'),
		competition = $('.competition'),
		revenue = $('.revenue'),
		marketFinancialModel = $('.market-financial-model'),
		userAcquisition = $('.user-acquisition'),
		marketingRecommendations = $('.marketing-recommendation'),
		legal = $('.legal'),
		financialResources = $('.financial-resources'),
		btnFinancialResourcesYes = $('.financial-resources-yes'),
		btnFinancialResourcesNo = $('.financial-resources-no'),
		financialResourcesInput = $('#financial-resources-input'),
		financialResourcesAdvice = $('.financial-resources-advice'),
		initialCustomersPlan = $('.initial-customers-plan')

	let checklist = [
		companyInfo,
		assumptionRecommendations,
		assumptions,
		coFounders,
		prototype,
		competition,
		revenue,
		marketFinancialModel,
		userAcquisition,
		marketingRecommendations,
		legal,
		financialResources,
		initialCustomersPlan
	]

	let hideNext = function(firstClass){
		if(firstClass === 'co-founders'
			&& !btnCoFounderYes.hasClass('selected')
			&& !btnCoFounderNo.hasClass('selected')
			|| firstClass === 'prototype'
			&& !btnPrototypeYes.hasClass('selected')
			&& !btnPrototypeNo.hasClass('selected')
			|| firstClass === 'financial-resources'
			&& !btnFinancialResourcesYes.hasClass('selected')
			&& !btnFinancialResourcesNo.hasClass('selected')
			|| firstClass === 'initial-customers-plan'
		){
			btnNext.addClass('hide-btn')
		} else {
			btnNext.removeClass('hide-btn')
		}
	}

	companyInfo.addClass('display-from-right')

	// ******* Setting up yes, no answers on load ***********
	if (coFounderInput[0].value === 'True'){
		btnCoFounderYes.addClass('selected')
		btnNext.removeClass('hide-btn')
		let spliceIndex = checklist.indexOf(coFounders) + 1
		checklist.splice(spliceIndex, 0, introVideo)
		checklist.splice(spliceIndex, 0, founderBios)
	} else if (coFounderInput[0].value === 'False'){
		btnCoFounderNo.addClass('selected')
		btnNext.removeClass('hide-btn')
	}
	if (prototypeInput[0].value === 'True'){
		btnPrototypeYes.addClass('selected')
		btnNext.removeClass('hide-btn')
	} else if (prototypeInput[0].value === 'False'){
		btnPrototypeNo.addClass('selected')
		btnNext.removeClass('hide-btn')
		let spliceIndex = checklist.indexOf(prototype) + 1
		checklist.splice(spliceIndex, 0, prototypeResources)
	}
	if (financialResourcesInput[0].value === 'True'){
		btnFinancialResourcesYes.addClass('selected')
		btnNext.removeClass('hide-btn')
	} else if (financialResourcesInput[0].value === 'False'){
		btnFinancialResourcesNo.addClass('selected')
		let spliceIndex = checklist.indexOf(financialResources) + 1
		checklist.splice(spliceIndex, 0, financialResourcesAdvice)
	}

	// ************** NAVIGATION *************************
	btnNext.on('click', function(){
		for (let item of checklist){
			if (item.hasClass('display-from-left')){
				let nextItemIndex = checklist.indexOf(item) + 1

				if(checklist[nextItemIndex]){
					let firstClass = checklist[nextItemIndex][0].classList[0]

					item.removeClass('display-from-left')
					item.addClass('hide-left')

					checklist[nextItemIndex].removeClass('hide-right')
					checklist[nextItemIndex].addClass('display-from-right')

					hideNext(firstClass)
					break
				} else {
					break
				}

			} else if (item.hasClass('display-from-right')) {
				let nextItemIndex = checklist.indexOf(item) + 1

				if(checklist[nextItemIndex]){
					let firstClass = checklist[nextItemIndex][0].classList[0]

					item.removeClass('display-from-right')
					item.addClass('hide-left')

					checklist[nextItemIndex].removeClass('hide-right')
					checklist[nextItemIndex].addClass('display-from-right')

					hideNext(firstClass)

					break
				} else {
					break
				}
			} else {
				continue
			}
		}
	})

	btnBack.on('click', function(){
		for (let item of checklist){
			if (item.hasClass('display-from-left')){
				let previousItemIndex = checklist.indexOf(item) - 1

				if(previousItemIndex >= 0){
					let firstClass = checklist[previousItemIndex][0].classList[0]

					item.removeClass('display-from-left')
					item.addClass('hide-right')

					checklist[previousItemIndex].removeClass('hide-left')
					checklist[previousItemIndex].addClass('display-from-left')

					hideNext(firstClass)

					break
				} else {
					break
				}

			} else if (item.hasClass('display-from-right')) {
				let previousItemIndex = checklist.indexOf(item) - 1

				if(previousItemIndex >= 0){
					let firstClass = checklist[previousItemIndex][0].classList[0]

					item.removeClass('display-from-right')
					item.addClass('hide-right')
					checklist[previousItemIndex].removeClass('hide-left')
					checklist[previousItemIndex].addClass('display-from-left')

					hideNext(firstClass)

					break
				} else {
					break
				}

			} else {
				continue
			}
		}
	})

	// ************** Yes, No Buttons *************************
	btnCoFounderYes.on('click', function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected')
			btnNext.removeClass('hide-btn')
			coFounderInput.val("True")
			btnCoFounderNo.removeClass('selected')
			let introVideoIndex = checklist.indexOf(introVideo)
			if(introVideoIndex < 0){
				let spliceIndex = checklist.indexOf(coFounders) + 1
				checklist.splice(spliceIndex, 0, introVideo)
				checklist.splice(spliceIndex, 0, founderBios)
			}
		}
	})

	btnCoFounderNo.on('click', function(){
		if(!$(this).hasClass('selected')) {
			$(this).addClass('selected')
			btnNext.removeClass('hide-btn')
			coFounderInput.val("False")
			btnCoFounderYes.removeClass('selected')
			let introVideoIndex = checklist.indexOf(introVideo)
			if(introVideoIndex >= 0){
				let spliceIndex = checklist.indexOf(coFounders) + 1
				checklist.splice(spliceIndex, 2)
			}
		}
	})

	btnPrototypeYes.on('click', function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected')
			btnNext.removeClass('hide-btn')
			prototypeInput.val("True")
			btnPrototypeNo.removeClass('selected')
			let prototypeResourcesIndex = checklist.indexOf(prototypeResources)
			if(prototypeResourcesIndex >= 0){
				let spliceIndex = checklist.indexOf(prototype) + 1
				checklist.splice(spliceIndex, 1)
			}
		}
	})

	btnPrototypeNo.on('click', function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected')
			prototypeInput.val("False")
			btnNext.removeClass('hide-btn')
			btnPrototypeYes.removeClass('selected')
			let prototypeResourcesIndex = checklist.indexOf(prototypeResources)
			if(prototypeResourcesIndex < 0){
				let spliceIndex = checklist.indexOf(prototype) + 1
				checklist.splice(spliceIndex, 0, prototypeResources)
			}
		}
	})

	btnFinancialResourcesYes.on('click', function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected')
			financialResourcesInput.val("True")
			btnNext.removeClass('hide-btn')
			btnFinancialResourcesNo.removeClass('selected')
			let financialResourcesAdviceIndex = checklist.indexOf(financialResourcesAdvice)
			if(financialResourcesAdviceIndex >= 0){
				let spliceIndex = checklist.indexOf(financialResources) + 1
				checklist.splice(spliceIndex, 1)
			}
		}

	})

	btnFinancialResourcesNo.on('click', function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected')
			financialResourcesInput.val("False")
			btnNext.removeClass('hide-btn')
			btnFinancialResourcesYes.removeClass('selected')
			let financialResourcesAdviceIndex = checklist.indexOf(financialResourcesAdvice)
			if(financialResourcesAdviceIndex < 0){
				let spliceIndex = checklist.indexOf(financialResources) + 1
				checklist.splice(spliceIndex, 0, financialResourcesAdvice)
			}
		}
	})

}))

/*
 *	                  ....
 *	                .:   '':.
 *	                ::::     ':..
 *	                ::.         ''..
 *	     .:'.. ..':.:::'    . :.   '':.
 *	    :.   ''     ''     '. ::::.. ..:
 *	    ::::.        ..':.. .''':::::  .
 *	    :::::::..    '..::::  :. ::::  :
 *	    ::'':::::::.    ':::.'':.::::  :
 *	    :..   ''::::::....':     ''::  :
 *	    :::::.    ':::::   :     .. '' .
 *	 .''::::::::... ':::.''   ..''  :.''''.
 *	 :..:::'':::::  :::::...:''        :..:
 *	 ::::::. '::::  ::::::::  ..::        .
 *	 ::::::::.::::  ::::::::  :'':.::   .''
 *	 ::: '::::::::.' '':::::  :.' '':  :
 *	 :::   :::::::::..' ::::  ::...'   .
 *	 :::  .::::::::::   ::::  ::::  .:'
 *	  '::'  '':::::::   ::::  : ::  :
 *	            '::::   ::::  :''  .:
 *	             ::::   ::::    ..''
 *	             :::: ..:::: .:''
 *	               ''''  '''''
 *
 *
 *	AUTOMAD
 *
 *	Copyright (c) 2020 by Marc Anton Dahmen
 *	http://marcdahmen.de
 *
 *	Licensed under the MIT license.
 *	http://automad.org/license
 */


class AutomadSnippet {

	constructor({data}) {

		var create = Automad.util.create;

		this.data = {
			file: data.file || '',
		};

		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('uk-panel', 'uk-panel-box');
		this.wrapper.innerHTML = `
			<div class="am-block-icon">${AutomadSnippet.toolbox.icon}</div>
			<div class="uk-text-center">${AutomadSnippet.toolbox.title}</div>
			<hr>
			<div class="am-block-file-select uk-form-select uk-button uk-button-large uk-text-left uk-width-1-1" data-uk-form-select>
				<i class="uk-icon-file"></i>&nbsp;
				<span></span>
				${create.select(['am-block-file'], window.AutomadBlockTemplates.snippets, this.data.file).outerHTML}
			</div>
		`;

		this.inputs = {
			file: this.wrapper.querySelector('.am-block-file')
		}

	}

	static get toolbox() {

		return {
			title: 'Template Snippet',
			icon: '<svg width="15px" height="18px" viewBox="0 0 15 18"><path d="M11.02,1.52C9.89,0.39,9.25,0,7,0C5,0,4,0,4,0C1.79,0,0,1.79,0,4v10c0,2.21,1.79,4,4,4h7c2.21,0,4-1.79,4-4c0,0,0-4.02,0-6 c0-2.25-0.33-2.83-1.48-3.98C11.95,2.45,12.53,3.03,11.02,1.52z M13,14c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V4c0-1.1,0.9-2,2-2h3v2 c0,2.21,1.79,4,4,4h2V14z"/><path d="M8.63,9.43c-0.31,0.31-0.31,0.82,0,1.13L10.07,12l-1.43,1.43c-0.31,0.31-0.31,0.82,0,1.13C8.79,14.72,9,14.8,9.2,14.8 c0.21,0,0.41-0.08,0.57-0.23l2-2c0.31-0.31,0.31-0.82,0-1.13l-2-2C9.45,9.12,8.95,9.12,8.63,9.43z"/><path d="M6.37,9.43c-0.31-0.31-0.82-0.31-1.13,0l-2,2c-0.31,0.31-0.31,0.82,0,1.13l2,2c0.16,0.16,0.36,0.23,0.57,0.23 s0.41-0.08,0.57-0.23c0.31-0.31,0.31-0.82,0-1.13L4.93,12l1.43-1.43C6.68,10.25,6.68,9.75,6.37,9.43z"/></svg>'
		};

	}

	render() {

		return this.wrapper;

	}

	save() {

		return {
			file: this.inputs.file.value
		};

	}

}
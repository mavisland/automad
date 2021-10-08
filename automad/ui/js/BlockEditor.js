/*
 *                    ....
 *                  .:   '':.
 *                  ::::     ':..
 *                  ::.         ''..
 *       .:'.. ..':.:::'    . :.   '':.
 *      :.   ''     ''     '. ::::.. ..:
 *      ::::.        ..':.. .''':::::  .
 *      :::::::..    '..::::  :. ::::  :
 *      ::'':::::::.    ':::.'':.::::  :
 *      :..   ''::::::....':     ''::  :
 *      :::::.    ':::::   :     .. '' .
 *   .''::::::::... ':::.''   ..''  :.''''.
 *   :..:::'':::::  :::::...:''        :..:
 *   ::::::. '::::  ::::::::  ..::        .
 *   ::::::::.::::  ::::::::  :'':.::   .''
 *   ::: '::::::::.' '':::::  :.' '':  :
 *   :::   :::::::::..' ::::  ::...'   .
 *   :::  .::::::::::   ::::  ::::  .:'
 *    '::'  '':::::::   ::::  : ::  :
 *              '::::   ::::  :''  .:
 *               ::::   ::::    ..''
 *               :::: ..:::: .:''
 *                 ''''  '''''
 *
 *
 * AUTOMAD
 *
 * Copyright (c) 2020-2021 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

/*
 * A wrapper for editor.js.
 */

+(function (Automad, $) {
	Automad.BlockEditor = {
		dataAttr: 'data-am-block-editor',

		makeReadOnly: function (editor) {
			const holder = editor.configuration.holder,
				inputs = holder.querySelectorAll('input, select'),
				editables = holder.querySelectorAll('[contenteditable]');

			Array.from(inputs).forEach((element) => {
				element.setAttribute('readonly', true);
				element.setAttribute('disabled', true);
			});

			Array.from(editables).forEach((element) => {
				element.removeAttribute('contenteditable');
			});
		},

		createEditor: function (options) {
			const t = AutomadEditorTranslation.get;

			options = Object.assign(
				{
					holder: false,
					input: false,
					autofocus: false,
					readOnly: false,
					placeholder: '',
					flex: false,
					onReady: function () {},
				},
				options
			);

			var $input = $(options.input);

			try {
				// Unescape &amp; to make embed URLs with parameters work.
				var data = JSON.parse($input.val().replace(/&amp;/g, '&'));
			} catch (e) {
				var data = {};
			}

			data = this.convertLegacyData(data);

			// In order to avoid infinite loops due to initializing section editors,
			// the initialization of those readOnly preview editors has to be prevented as soon as
			// there is no section data anymore.
			if (typeof data.blocks === 'undefined' && options.readOnly) {
				return;
			}

			const editor = new EditorJS({
				holder: options.holder,
				logLevel: 'ERROR',
				data: data,
				tools: AutomadEditorConfig.tools(
					options.readOnly,
					options.flex
				),
				tunes: ['layout'],
				readOnly: options.readOnly,
				minHeight: false,
				autofocus: options.autofocus,
				placeholder: options.placeholder,
				i18n: {
					messages: {
						ui: {
							blockTunes: {
								toggler: {
									'Click to tune': t('ui_settings'),
								},
							},
							inlineToolbar: {
								converter: {
									'Convert to': t('ui_convert'),
								},
							},
							toolbar: {
								toolbox: {
									Add: t('ui_add'),
								},
							},
						},
						blockTunes: {
							delete: {
								Delete: t('ui_delete'),
							},
							moveUp: {
								'Move up': t('ui_move_up'),
							},
							moveDown: {
								'Move down': t('ui_move_down'),
							},
						},
					},
				},

				onChange: function (api, block) {
					Automad.BlockEditor.save(
						editor,
						$input.get(0),
						options.readOnly
					);
				},

				onReady: function () {
					const layout = new AutomadLayout(editor);

					layout.applyLayout(data, function () {
						if (!options.readOnly) {
							new AutomadEditorUndo({ editor, data });
							new DragDrop(editor);

							layout.settingsButtonObserver();
							layout.initPasteHandler();
						} else {
							Automad.BlockEditor.makeReadOnly(editor, data);
						}

						options.onReady();
					});

					let holder = editor.configuration.holder;

					if (
						typeof holder === 'string' ||
						holder instanceof String
					) {
						holder = document.getElementById(holder);
					}

					const save = () => {
						Automad.BlockEditor.save(
							editor,
							$input.get(0),
							options.readOnly
						);
					};

					$(holder).on(
						'click',
						`.${AutomadEditorConfig.cls.settingsButton}`,
						save
					);

					$(holder).on(
						'change keyup keydown',
						`.${AutomadEditorConfig.cls.input}, .${AutomadEditorConfig.cls.block} input, .${AutomadEditorConfig.cls.block} select`,
						save
					);
				},
			});

			return editor;
		},

		save: function (editor, input, readOnly) {
			if (!readOnly) {
				const $input = $(input);

				try {
					editor.save().then(function (data) {
						data.automadVersion = window.AM_VERSION;

						// Only trigger change in case blocks actually have changed.
						var blocksNew = JSON.stringify(data.blocks);

						try {
							var blocksCurrent = JSON.stringify(
								JSON.parse($input.val()).blocks
							);
						} catch (e) {
							var blocksCurrent = '';
						}

						if (blocksCurrent != blocksNew) {
							$input
								.val(JSON.stringify(data, null, 4))
								.trigger('change');
						}
					});
				} catch (e) {}
			}
		},

		normalizeVersion: function (version) {
			if (version === undefined) {
				version = '0.0.0';
			}

			const normalized = version
				.split('.')
				.map((n) => {
					return n.padStart(3, '0');
				})
				.join('');

			return normalized;
		},

		convertLegacyData: function (data) {
			if (data.blocks === undefined) {
				return data;
			}

			if (
				this.normalizeVersion(data.automadVersion) >=
				this.normalizeVersion('1.9.0')
			) {
				return data;
			}

			console.log('Converting legacy block data ...');

			data.blocks.forEach((block) => {
				if (block.tunes === undefined) {
					block.tunes = {
						layout: {
							width: block.data.widthFraction || false,
							stretched: block.data.stretched || false,
						},
					};
				}
			});

			return data;
		},

		initErrorHandler: function () {
			$(window).on('error', function (event) {
				let msg = event.originalEvent.message;

				if (
					msg.includes('closest') ||
					msg.includes('updateCurrentInput') ||
					msg.includes('normalize') ||
					msg.includes('DOMException')
				) {
					event.preventDefault();
				}
			});
		},

		init: function () {
			const selector = `[${this.dataAttr}]`;
			const containers = Array.from(document.querySelectorAll(selector));

			this.initErrorHandler();

			containers.forEach((container) => {
				const id = container.getAttribute(this.dataAttr);
				const input = container.querySelector('input');

				// Remove data attribute to prevent multiple initializations.
				container.removeAttribute(this.dataAttr);

				this.createEditor({
					holder: id,
					input: input,
					placeholder: AutomadEditorTranslation.get('ui_placeholder'),
					flex: false,
					onReady: () => {
						// Add init class to all editor tooltips in order to keep them
						// during clean-up after destroying section modal editor tooltips.
						$('.ct').toggleClass('init', true);
					},
				});
			});
		},
	};

	$(document).on('ajaxComplete', function (e, xhr, settings) {
		if (
			settings.url.includes('Page::data') ||
			settings.url.includes('Shared::data') ||
			settings.url.includes('InPage::edit')
		) {
			Automad.BlockEditor.init();
		}
	});
})((window.Automad = window.Automad || {}), jQuery);

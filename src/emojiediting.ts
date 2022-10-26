import { type Element, type DowncastWriter } from 'ckeditor5/src/engine';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import { Plugin } from 'ckeditor5/src/core';
import { EMOJI_CLASS_PREFIX } from './constants';

export default class EmojiEditing extends Plugin {
	public static override get requires(): Array<typeof Plugin> {
		return [ Widget ];
	}
	public static override get pluginName(): string {
		return 'EmojiEditing';
	}

	public override init(): void {
		this._defineSchema();
		this._defineConverters();
		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'em' ) )
		);
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( 'emoji', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'emojiName' ],
			isObject: true
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		const createEmojiElement = ( element: Element, writer: DowncastWriter ) => {
			const emojiName = String( element.getAttribute( 'emojiName' ) );

			return writer.createEmptyElement( 'emoji', {
				class: `${ EMOJI_CLASS_PREFIX }${ emojiName }`
			} );
		};

		conversion.for( 'downcast' ).elementToElement( {
			model: 'emoji',
			view: ( element, conversionApi ) => {
				return createEmojiElement( element, conversionApi.writer );
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'emoji',
			view: ( modelItem, { writer: viewWriter } ) => {
				const emojiElement = createEmojiElement( modelItem, viewWriter );

				return toWidget( emojiElement, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'emoji',
				classes: [ 'ap' ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const clazz = viewElement.getAttribute( 'class' );

				const emojiName = clazz ? clazz.substring( EMOJI_CLASS_PREFIX.length ) : '';
				return modelWriter.createElement( 'emoji', { emojiName } );
			}
		} );
	}
}

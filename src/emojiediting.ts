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
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasAttribute( 'emoji' ) )
		);
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( 'emoji', {
			inheritAllFrom: '$text',
			allowAttributes: [ 'emojiName' ]
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		const createEmojiElement = ( element: Element, writer: DowncastWriter ) => {
			const emojiName = String( element.getAttribute( 'emojiName' ) );

			const emoji = writer.createContainerElement( 'emoji', {
				class: `${ EMOJI_CLASS_PREFIX }${ emojiName }`,
				emoji: emojiName // for viewToModelPositionOutsideModelElement
			} );
			const innerText = writer.createText( ':' + emojiName + ':' );
			writer.insert( writer.createPositionAt( emoji, 0 ), innerText );
			return emoji;
		};

		conversion.for( 'dataDowncast' ).elementToElement( {
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

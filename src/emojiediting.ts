import { Plugin } from 'ckeditor5/src/core';
import { EMOJI_CLASS_PREFIX } from './constants';

export default class EmojiEditing extends Plugin {
	public static override get pluginName(): string {
		return 'EmojiEditing';
	}

	public override init(): void {
		this._defineSchema();
		this._defineConverters();
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( 'emoji', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'emojiName' ]
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		conversion.for( 'downcast' ).elementToElement( {
			model: 'emoji',
			view: ( element, conversionApi ) => {
				const { writer } = conversionApi;

				return writer.createAttributeElement( 'emoji', {
					class: `${ EMOJI_CLASS_PREFIX }${ element.getAttribute( 'emojiName' ) }`
				} );
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

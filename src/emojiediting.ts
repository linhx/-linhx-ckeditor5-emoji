import { Plugin } from 'ckeditor5/src/core';

const CLASS_PREFIX = 'ap ap-';

export default class EmojiEditing extends Plugin {
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
					class: `${ CLASS_PREFIX }${ element.getAttribute( 'emojiName' ) }`
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

				const emojiName = clazz?.substring( CLASS_PREFIX.length ) || '';
				return modelWriter.createElement( 'emoji', { emojiName } );
			}
		} );
	}
}

import { type Element, type DowncastWriter } from 'ckeditor5/src/engine';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import { ATTR_NAME, EMOJI_CLASSES_PREFIX, EMOJI_CLASS_PREFIX, HTML_TAG_NAME, SCHEMA_NAME } from './constants';

const ATTR_FOR_VIEW_ELEMENT_MATCHER = 'emoji';

export default class EmojiEditing extends Plugin {
	private classesPrefix: string;
	private classPrefix: string;

	public static override get requires(): Array<typeof Plugin> {
		return [ Widget ];
	}
	public static override get pluginName(): string {
		return 'EmojiEditing';
	}

	public constructor( editor: Editor ) {
		super( editor );
		this.classesPrefix = EMOJI_CLASSES_PREFIX || this.editor.config.get( 'emoji.classesPrefix' );
		this.classPrefix = EMOJI_CLASS_PREFIX || this.editor.config.get( 'emoji.classPrefix' );
	}

	public override init(): void {
		this._defineSchema();
		this._defineConverters();
		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model,
				viewElement => viewElement.hasAttribute( ATTR_FOR_VIEW_ELEMENT_MATCHER ) )
		);
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( SCHEMA_NAME, {
			inheritAllFrom: '$text',
			allowAttributes: [ ATTR_NAME ]
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		const createEmojiElement = ( element: Element, writer: DowncastWriter ) => {
			const emojiName = String( element.getAttribute( ATTR_NAME ) );

			const emoji = writer.createContainerElement( HTML_TAG_NAME, {
				class: `${ this.classesPrefix }${ emojiName }`,
				[ ATTR_FOR_VIEW_ELEMENT_MATCHER ]: emojiName // for viewToModelPositionOutsideModelElement
			} );
			const innerText = writer.createText( ':' + emojiName + ':' );
			writer.insert( writer.createPositionAt( emoji, 0 ), innerText );
			return emoji;
		};

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: SCHEMA_NAME,
			view: ( element, conversionApi ) => {
				return createEmojiElement( element, conversionApi.writer );
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: SCHEMA_NAME,
			view: ( modelItem, { writer: viewWriter } ) => {
				const emojiElement = createEmojiElement( modelItem, viewWriter );

				return toWidget( emojiElement, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: HTML_TAG_NAME,
				classes: [ 'em' ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const classes = viewElement.getClassNames();

				for ( const clazz of classes ) {
					if ( clazz.startsWith( this.classPrefix ) ) {
						const emojiName = clazz.substring( this.classPrefix.length );
						const emojiElement = modelWriter.createElement( SCHEMA_NAME, {
							[ ATTR_NAME ]: emojiName
						} );
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore: avoid error when emoji place at the end of code block,
						// can't move the cursor there because of missing element data
						// TODO find better way
						emojiElement.data = emojiName;
						return emojiElement;
					}
				}
				return null;
			}
		} );
	}
}

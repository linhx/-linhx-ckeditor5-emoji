import { type Element, type DowncastWriter } from 'ckeditor5/src/engine';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import { ATTR_EMOJI_KEY, EMOJI_CLASS, getClassesPrefix, HTML_TAG_NAME, SCHEMA_NAME } from './constants';

export default class EmojiEditing extends Plugin {
	private tagName: string;
	private classEmoji: string;
	private classPrefix: string;
	private classesPrefix: string;

	public static override get requires(): Array<typeof Plugin> {
		return [ Widget ];
	}
	public static override get pluginName(): string {
		return 'EmojiEditing';
	}

	public constructor( editor: Editor ) {
		super( editor );
		this.tagName = this.editor.config.get( 'emoji.tag' ) || HTML_TAG_NAME;
		this.classEmoji = this.editor.config.get( 'emoji.class' ) || EMOJI_CLASS;
		this.classPrefix = `${ this.classEmoji }-`;
		this.classesPrefix = getClassesPrefix( this.classEmoji );
	}

	public override init(): void {
		this._defineSchema();
		this._defineConverters();
		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model,
				viewElement => {
					const classes = viewElement.getClassNames();
					let hasClassEm = false;
					let hasClassPrefix = false;
					for ( const clazz of classes ) {
						if ( clazz === this.classEmoji ) {
							hasClassEm = true;
						}
						if ( clazz.startsWith( this.classPrefix ) ) {
							hasClassPrefix = true;
						}
						if ( hasClassEm && hasClassPrefix ) {
							return true;
						}
					}
					return false;
				} )
		);
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( SCHEMA_NAME, {
			inheritAllFrom: '$text',
			allowAttributes: [ ATTR_EMOJI_KEY ]
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		const createEmojiElement = ( element: Element, writer: DowncastWriter ) => {
			const emojiKey = String( element.getAttribute( ATTR_EMOJI_KEY ) );

			const emoji = writer.createContainerElement( this.tagName, {
				class: `${ this.classesPrefix }${ emojiKey }`
			} );
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
				name: this.tagName,
				classes: [ this.classEmoji ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const classes = viewElement.getClassNames();

				for ( const clazz of classes ) {
					if ( clazz.startsWith( this.classPrefix ) ) {
						const emojiKey = clazz.substring( this.classPrefix.length );
						const emojiElement = modelWriter.createElement( SCHEMA_NAME, {
							[ ATTR_EMOJI_KEY ]: emojiKey
						} );
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore: avoid error when emoji place at the end of code block,
						// can't move the cursor there because of missing element data
						// TODO find better way
						emojiElement.data = emojiKey;
						return emojiElement;
					}
				}
				return null;
			}
		} );
	}
}

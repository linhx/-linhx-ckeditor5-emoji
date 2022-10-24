import { ButtonView } from 'ckeditor5/src/ui';
import { Plugin } from 'ckeditor5/src/core';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import ckeditor5Icon from '../theme/icons/ckeditor.svg';

export default class EmojiUI extends Plugin {
	public override init(): void {
		const editor = this.editor as EditorWithUI;

		editor.ui.componentFactory.add( 'emoji', locale => {
			const view = new ButtonView( locale );
			const t = editor.t;
			const model = editor.model;

			view.set( {
				label: t( 'Emoji plugin' ),
				icon: ckeditor5Icon,
				tooltip: true
			} );

			this.listenTo( view, 'execute', () => {
				const emojiName = 'shamrock';

				model.change( writer => {
					const imageElement = writer.createElement( 'emoji', {
						emojiName
					} );
					model.insertContent(
						imageElement
					);
				} );
			} );

			return view;
		} );
	}
}

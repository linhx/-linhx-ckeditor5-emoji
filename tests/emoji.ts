import { expect } from 'chai';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Emoji from '../src/emoji';

import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import type { DataApi } from 'ckeditor__ckeditor5-core/src/editor/utils/dataapimixin';

interface Editor extends EditorWithUI, DataApi {}

describe( 'Emoji', () => {
	it( 'should be named', () => {
		expect( Emoji.pluginName ).to.equal( 'Emoji' );
	} );

	describe( 'init()', () => {
		let domElement: HTMLElement, editor: Editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					Emoji
				],
				toolbar: [
					'emoji'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load Emoji', () => {
			const emojiPlugin = editor.plugins.get( 'Emoji' );

			expect( emojiPlugin ).to.be.an.instanceof( Emoji );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'emoji' ) ).to.equal( true );
		} );

		it( 'should add a text into the editor after clicking the icon', () => {
			const icon = editor.ui.componentFactory.create( 'emoji' );

			expect( editor.getData() ).to.equal( '' );

			icon.fire( 'execute' );

			expect( editor.getData() ).to.equal( '<p>Hello CKEditor 5!</p>' );
		} );
	} );
} );

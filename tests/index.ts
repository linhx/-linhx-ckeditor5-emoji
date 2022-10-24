import { expect } from 'chai';
import { Emoji as EmojiDll, icons } from '../src';
import Emoji from '../src/emoji';
import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 Emoji DLL', () => {
	it( 'exports Emoji', () => {
		expect( EmojiDll ).to.equal( Emoji );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );

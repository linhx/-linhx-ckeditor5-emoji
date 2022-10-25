import { type Locale, FocusTracker } from 'ckeditor5/src/utils';
import {
	View,
	type ViewCollection,
	ButtonView
} from 'ckeditor5/src/ui';
import { EMOJI_CLASS_PREFIX } from './constants';

import '../theme/emoji-grid.css';

export default class EmojiGridView extends View {
	private tiles: ViewCollection<View>;
	private focusTracker: FocusTracker;

	constructor( locale: Locale ) {
		super( locale );
		this.tiles = this.createCollection();

		this.setTemplate( {
			tag: 'div',
			children: [
				{
					tag: 'div',
					attributes: {
						class: [
							'emoji',
							'emoji-grid__tiles'
						]
					},
					children: this.tiles
				}
			],
			attributes: {
				class: [
					'emoji',
					'emoji-grid'
				]
			}
		} );

		/**
		 * Tracks information about the DOM focus in the grid.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();
	}

	public createTile( character: string, name: string ): ButtonView {
		const tile = new ButtonView( this.locale );

		tile.set( {
			label: character,
			class: `${ EMOJI_CLASS_PREFIX }${ name }`
		} );

		tile.extendTemplate( {
			attributes: {
				title: name
			}
		} );

		tile.on( 'execute', () => {
			this.fire( 'execute', { name, character } );
		} );

		return tile;
	}

	public clearTitles(): void {
		this.tiles.clear();
	}

	public addTitle( title: ButtonView ): void {
		this.tiles.add( title );
	}
}

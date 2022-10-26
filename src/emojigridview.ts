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
							'emoji-grid__tiles',
							'ck-reset_all-excluded'
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

	public createTile( character: string, name: string ): View {
		const tile = new ButtonView( this.locale );

		const bind = tile.bindTemplate;
		tile.setTemplate( {
			tag: 'button',
			attributes: {
				label: character,
				title: name,
				class: `em-grid-item ${ EMOJI_CLASS_PREFIX }${ name }`
			},
			on: {
				mousedown: bind.to( evt => {
					evt.preventDefault();
				} ),

				click: bind.to( evt => {
					if ( tile.isEnabled ) {
						tile.fire( 'execute' );
					} else {
						evt.preventDefault();
					}
				} )
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

	public addTitle( title: View ): void {
		this.tiles.add( title );
	}
}

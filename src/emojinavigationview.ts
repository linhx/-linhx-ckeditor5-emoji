import { type Locale, FocusTracker } from 'ckeditor5/src/utils';
import {
	View,
	ButtonView
} from 'ckeditor5/src/ui';

import '../theme/navigation.css';
import { DEFAULT_GROUP } from './constants';

export default class EmojiNavigationView extends View {
	constructor( locale: Locale, emojiGroups: Array<string>, initGroup: string = DEFAULT_GROUP ) {
		super( locale );

		const emojiBtns = emojiGroups.map( group => {
			const btn = new ButtonView( locale );
			btn.set( {
				withText: false,
				title: group,
				class: `${ initGroup === group ? 'active ' : '' }group group-${ group }`
			} );
			this.on( 'change:selectedGroup', ( evt, propertyName, newValue, oldValue ) => {
				btn.set( {
					class: `${ newValue === group ? 'active ' : '' }group group-${ group }`
				} );
			} );
			btn.on( 'execute', () => {
				this.set( {
					selectedGroup: group
				} );
				this.fire( 'execute', { group } );
			} );

			return btn;
		} );
		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: 'emoji-navi',
				tabindex: '-1'
			},
			children: emojiBtns
		} );
	}

	public setSelectedGroup( selectedGroup: string ): void {
		this.set( {
			selectedGroup
		} );
	}
}

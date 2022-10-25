import { ButtonView, createDropdown } from 'ckeditor5/src/ui';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import type { Locale } from 'ckeditor5/src/utils';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import ckeditor5Icon from '../theme/icons/grining.svg';
import EmojiGridView from './emojigridview';
import EmojiNavigationView from './emojinavigationview';
import EmojisView from './emojisview';
import { ALL_EMOJI_GROUPS, ALL_EMOJI_KEYS, DEFAULT_GROUP } from './constants';

export default class EmojiUI extends Plugin {
	public static override get pluginName(): string {
		return 'EmojiUI';
	}
	private _characters: Map<string, string>;
	private _groups: Map<string, Array<string>>;

	constructor( editor: Editor ) {
		super( editor );
		this._characters = this.editor.config.get( 'emoji.characters' ) || ALL_EMOJI_KEYS;
		this._groups = this.editor.config.get( 'emoji.groups' ) || ALL_EMOJI_GROUPS;
	}

	public override init(): void {
		const editor = this.editor as EditorWithUI;

		editor.ui.componentFactory.add( 'emoji', locale => {
			const dropdownView = createDropdown( locale );
			let dropdownPanelContent: any;
			const t = editor.t;
			const model = editor.model;

			dropdownView.buttonView.set( {
				label: t( 'Emoji plugin' ),
				icon: ckeditor5Icon
			} );

			dropdownView.on( 'execute', ( evt, data ) => {
				model.change( writer => {
					const imageElement = writer.createElement( 'emoji', {
						emojiName: data.name
					} );
					model.insertContent(
						imageElement
					);
				} );
				editor.editing.view.focus();
			} );

			dropdownView.on( 'change:isOpen', ( evt, propertyName, newValue, oldValue ) => {
				if ( !dropdownPanelContent ) {
					dropdownPanelContent = this._createDropdownPanelContent( locale, dropdownView );

					const specialCharactersView = new EmojisView(
						locale,
						dropdownPanelContent.navigationView,
						dropdownPanelContent.gridView
					);

					dropdownView.panelView.children.add( specialCharactersView );
				}

				if ( !newValue ) {
					dropdownPanelContent.navigationView.setSelectedGroup( DEFAULT_GROUP );
				}
			} );
			return dropdownView;
		} );
	}

	private getEmojisForGroup( groupName: string ) {
		return this._groups.get( groupName );
	}

	private getEmoji( name: string ) {
		return this._characters.get( name );
	}

	private _updateGrid( currentGroupName: string, gridView: EmojiGridView ) {
		gridView.clearTitles();

		const characterTitles = this.getEmojisForGroup( currentGroupName );

		console.log('characterTitles', characterTitles)

		if ( !characterTitles ) {
			return;
		}

		for ( const name of characterTitles ) {
			const character = this.getEmoji( name );
			console.log('character', character)

			if ( character ) {
				gridView.addTitle( gridView.createTile( character, name ) );
			}
		}
	}

	private _createDropdownPanelContent( locale: Locale, dropdownView: any ) {
		const emojiGroups = [ ...this._groups.keys() ];

		const initGroup = DEFAULT_GROUP;

		const navigationView = new EmojiNavigationView( locale, emojiGroups, initGroup );
		const gridView = new EmojiGridView( locale );

		gridView.delegate( 'execute' ).to( dropdownView );

		navigationView.on( 'execute', ( evt, data ) => {
			this._updateGrid( data.group, gridView );
		} );

		this._updateGrid( initGroup, gridView );

		return { navigationView, gridView };
	}
}

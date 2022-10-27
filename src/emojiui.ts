import { createDropdown } from 'ckeditor5/src/ui';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import type { Locale } from 'ckeditor5/src/utils';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import ckeditor5Icon from '../theme/icons/grining.svg';
import EmojiGridView from './emojigridview';
import EmojiNavigationView from './emojinavigationview';
import EmojisView from './emojisview';
import { ALL_EMOJI_GROUPS, ALL_EMOJI_KEYS, ATTR_NAME, DEFAULT_GROUP, EMOJI_CLASS, getClassesPrefix, SCHEMA_NAME } from './constants';

export default class EmojiUI extends Plugin {
	private classEmoji: string;
	private classesPrefix: string;

	public static override get pluginName(): string {
		return 'EmojiUI';
	}
	private _characters: Map<string, string>;
	private _groups: Map<string, Array<string>>;

	constructor( editor: Editor ) {
		super( editor );
		this._characters = this.editor.config.get( 'emoji.characters' ) || ALL_EMOJI_KEYS;
		this._groups = this.editor.config.get( 'emoji.groups' ) || ALL_EMOJI_GROUPS;
		this.classEmoji = this.editor.config.get( 'emoji.class' ) || EMOJI_CLASS;
		this.classesPrefix = getClassesPrefix( this.classEmoji );
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
					const imageElement = writer.createElement( SCHEMA_NAME, {
						[ ATTR_NAME ]: data.name
					} );
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore: avoid error when emoji place at the end of code block,
					// can't move the cursor there because of missing element data
					// TODO find better way
					imageElement.data = data.name;
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
					this._updateGrid( DEFAULT_GROUP, dropdownPanelContent.gridView );
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

		if ( !characterTitles ) {
			return;
		}

		for ( const name of characterTitles ) {
			const character = this.getEmoji( name );
			if ( character ) {
				gridView.addTitle( gridView.createTile( character, name ) );
			}
		}
	}

	private _createDropdownPanelContent( locale: Locale, dropdownView: any ) {
		const emojiGroups = [ ...this._groups.keys() ];

		const initGroup = DEFAULT_GROUP;

		const navigationView = new EmojiNavigationView( locale, emojiGroups, initGroup );
		const gridView = new EmojiGridView( locale, this.classesPrefix );

		gridView.delegate( 'execute' ).to( dropdownView );

		navigationView.on( 'execute', ( evt, data ) => {
			this._updateGrid( data.group, gridView );
		} );

		this._updateGrid( initGroup, gridView );

		return { navigationView, gridView };
	}
}

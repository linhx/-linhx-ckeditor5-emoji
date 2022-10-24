import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';

import ckeditor5Icon from '../theme/icons/ckeditor.svg';
import EmojiEditing from './emojiediting';
import EmojiUI from './emojiui';

export default class Emoji extends Plugin {
	public static override get pluginName(): string {
		return 'Emoji';
	}

	public static override get requires(): Array<typeof Plugin> {
		return [ EmojiEditing, EmojiUI ];
	}

	public override init(): void {

	}
}

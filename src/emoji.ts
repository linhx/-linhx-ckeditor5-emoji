import { Plugin } from 'ckeditor5/src/core';

import EmojiEditing from './emojiediting';
import EmojiUI from './emojiui';

export default class Emoji extends Plugin {
	public static override get pluginName(): string {
		return 'Emoji';
	}

	public static override get requires(): Array<typeof Plugin> {
		return [ EmojiEditing, EmojiUI ];
	}
}

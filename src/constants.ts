import { emojisList } from './emojisList';

export const DEFAULT_GROUP = 'people';

const _ALL_EMOJI_GROUPS = new Map();
const _ALL_EMOJI_KEYS = new Map();

emojisList.forEach( emoji => {
	if ( emoji.skinTone ) {
		return; // TODO add button change skin tone
	}
	let groupEmojis = _ALL_EMOJI_GROUPS.get( emoji.group );
	if ( !groupEmojis ) {
		groupEmojis = [];
		_ALL_EMOJI_GROUPS.set( emoji.group, groupEmojis );
	}
	groupEmojis.push( emoji.key );

	_ALL_EMOJI_KEYS.set( emoji.key, emoji.name );
} );

export const ALL_EMOJI_GROUPS = _ALL_EMOJI_GROUPS;
export const ALL_EMOJI_KEYS = _ALL_EMOJI_KEYS;

export const EMOJI_CLASS_PREFIX = 'em-';
export const EMOJI_CLASSES_PREFIX = 'em em-';
export const HTML_TAG_NAME = 'emoji';
export const SCHEMA_NAME = 'emoji';
export const ATTR_NAME = 'emojiName';

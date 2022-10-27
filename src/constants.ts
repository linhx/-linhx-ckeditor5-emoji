import { emojisList } from './emojisList';

export const DEFAULT_GROUP = 'people';

export type Emoji = { key: string; name?: string };

const _ALL_EMOJI_GROUPS = new Map<string, Array<Emoji>>();

emojisList.forEach( emoji => {
	if ( emoji.skinTone ) {
		return; // TODO add button change skin tone
	}
	let groupEmojis = _ALL_EMOJI_GROUPS.get( emoji.group );
	if ( !groupEmojis ) {
		groupEmojis = [];
		_ALL_EMOJI_GROUPS.set( emoji.group, groupEmojis );
	}
	groupEmojis.push( {
		key: emoji.key,
		name: emoji.name
	} );
} );

export const ALL_EMOJI_GROUPS = _ALL_EMOJI_GROUPS;

export const EMOJI_CLASS = 'em';
export const HTML_TAG_NAME = 'span';
export const SCHEMA_NAME = 'emoji';
export const ATTR_EMOJI_KEY = 'emojiKey';

export const getClassesPrefix = ( classEmoji: string ): string => {
	return `${ classEmoji } ${ classEmoji }-`;
};

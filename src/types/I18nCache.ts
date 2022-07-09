import { I18nLocaleIdentifier } from '../constants/I18nLocaleIdentifier';

export type I18nCacheEntry = {
	[key: string]: string|I18nCacheEntry;
}

export type I18nCache = {
	[key in I18nLocaleIdentifier]?: {
		[scope: string]: Promise<I18nCacheEntry>;
	};
}

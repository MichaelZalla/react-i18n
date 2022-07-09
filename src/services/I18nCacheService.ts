import I18nSettings from '../types/I18nSettings';
import { I18nCache, I18nCacheEntry } from '../types/I18nCache';

import { I18nLocaleIdentifier } from '../constants/I18nLocaleIdentifier';

const cache: I18nCache = {}

const getContent = async <T extends string|I18nCacheEntry = string>(
	currentLanguage: I18nLocaleIdentifier,
	settings: I18nSettings,
	key: string,
	data?: any,
	ignoreMissing?: boolean): Promise<T|Error|undefined> =>
{

	if(!settings)
	{
		return undefined
	}

	const pathComponents = key.split('.')

	const scope = pathComponents[0]

	pathComponents.shift()

	const getUrl = settings.getContentsURL

	const url = getUrl(currentLanguage, scope)

	let cacheEntryPromise: Promise<I18nCacheEntry>

	let cacheEntry = cache[currentLanguage]

	if(
		cacheEntry &&
		typeof cacheEntry[scope] !== `undefined`
	)
	{
		cacheEntryPromise = cacheEntry[scope] as Promise<I18nCacheEntry>
	}
	else
	{
		if(!cacheEntry)
		{
			cacheEntry = cache[currentLanguage] = {}
		}

		cacheEntryPromise = cacheEntry[scope] = fetch(url)
			.then((res) => res.json())
			.catch(() => undefined)
	}

	return cacheEntryPromise

		.then((contents: I18nCacheEntry|undefined) => {

			if(!contents)
			{
				return new Error(`Failed to fetch JSON file: ${url}`)
			}

			// @TODO(mzalla) Cache `contents` by language-scope ID

			let haystack: I18nCacheEntry|string = contents
			let needle = pathComponents

			while(needle.length >= 0)
			{
				if(typeof haystack === 'string')
				{
					if(
						data &&
						typeof settings.interpolate === `function`
					)
					{
						return settings.interpolate(haystack, data, { ignoreMissing }) as T
					}

					return haystack as T
				}

				if(needle.length === 0 && typeof haystack === `object`)
				{
					return haystack as T;
				}

				if(needle[0] in haystack)
				{
					haystack = haystack[needle[0]] as I18nCacheEntry|string
					needle.shift()
				}
				else
				{
					return new Error(`Failed to find value for key '${key}' in JSON file: ${url}`)
				}
			}

		})

}

const I18nCacheService = {
	getContent,
}

export default I18nCacheService

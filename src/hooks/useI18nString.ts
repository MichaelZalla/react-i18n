import React from 'react';

import { I18nCacheEntry } from '../types/I18nCache';

import I18nSettingsContext from '../contexts/I18nSettingsContext';

import I18nCacheService from '../services/I18nCacheService';

import useAsync, { PromiseFn } from './useAync';
import { UseI18nSettingsHookResult } from './useI18nSettings';

type UseI18nStringHookResult<T extends string|I18nCacheEntry = string> = [
	T|undefined,
	Error|undefined,
	boolean,
]

const useI18nString = <T extends string|I18nCacheEntry = string>(
	key: string,
	data?: any,
	ignoreMissing?: boolean): UseI18nStringHookResult<T> =>
{

	const [currentLanguage, _, settings] = React.useContext<UseI18nSettingsHookResult>(I18nSettingsContext)

	const { getContent } = I18nCacheService;

	const fetchFn: PromiseFn<T|Error|undefined> = React.useCallback(
		async () => {

			if(getContent)
			{
				return getContent(currentLanguage, settings, key, data, ignoreMissing)
			}

			return new Promise<T|undefined>(res => res(undefined))

		},
		[
			currentLanguage,
			getContent,
			key,
			data,
			ignoreMissing,
			settings,
		]
	)

	if(!getContent)
	{
		return [undefined, undefined, false]
	}

	const [__, isPending, str, error] = useAsync<T|Error|undefined>(fetchFn)

	if(error)
	{
		return [undefined, error, isPending]
	}

	if(str instanceof Error)
	{
		return [undefined, str, isPending]
	}

	// @TODO(mzalla) Check first `str` returned after a `key` update;
	return [str, error, isPending]

}

export default useI18nString

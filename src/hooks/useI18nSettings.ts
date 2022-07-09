import React from 'react';

import I18nSettings from '../types/I18nSettings';

import { I18nLocaleIdentifier, I18nLocaleIdentifiers } from '../constants/I18nLocaleIdentifier';

export type CurrentLanguage = I18nLocaleIdentifier;
export type SetCurrentLanguageFn = (language: I18nLocaleIdentifier) => void;
export type Settings = I18nSettings;
export type SetSettingsFn = (partialSettings: Partial<I18nSettings>) => void;
// type GetContentFn = (key: string, data?: any, ignoreMissing?: boolean) => Promise<string|Error|undefined>;

export type UseI18nSettingsHookResult = [
	CurrentLanguage,
	SetCurrentLanguageFn,
	Settings,
	SetSettingsFn,
	// GetContentFn,
]

const getContentsURL = (
	language: I18nLocaleIdentifier, scope: string): string =>
{
	// Supports unique `development` and `production` base URLs:
	// - Honors `PUBLIC_URL` for Create React App projects;
	// - Honors `NEXT_PUBLIC_BASE_PATH` for NextJS projects;
	const BASE_URL =
		process.env.PUBLIC_URL ||
		process.env.NEXT_PUBLIC_BASE_PATH ||
		''

	return `${BASE_URL}/static/languages/${language}/${scope}.lang.json`
}

export const DefaultI18nSettings: I18nSettings = {
	preferredLanguage: I18nLocaleIdentifiers.English,
	defaultLanguage: I18nLocaleIdentifiers.English,
	supportedLanguages: [
		I18nLocaleIdentifiers.English,
	],
	keyErrorMessage: `%%_USE_I18N_STRING_ERROR_%%`,
	getContentsURL,
}

const useI18nSettings = (): UseI18nSettingsHookResult => {

	let [settings, setSettings] = React.useReducer(
		(settings: I18nSettings, partialSettings: Partial<I18nSettings>): I18nSettings => {

			return {
				...settings,
				...partialSettings,
			}

		},
		DefaultI18nSettings
	)

	let [currentLanguage, setCurrentLanguage] = React.useReducer(
		(currentLanguage: I18nLocaleIdentifier, requestedLanguage: I18nLocaleIdentifier): I18nLocaleIdentifier => {

			if(settings.supportedLanguages.includes(requestedLanguage))
			{
				if(process.env.NODE_ENV === `development`) {
					console.log(`Changing language from ${currentLanguage} to ${requestedLanguage}...`);
				}

				return requestedLanguage
			}

			console.warn(`Attempted to set i18n language to unsupported language '${requestedLanguage}'!`);

			return currentLanguage

		},
		settings.defaultLanguage
	)

	React.useEffect(() => {

		if(typeof settings.onChangeLanguage === `function`) {
			settings.onChangeLanguage(currentLanguage)
		}

	}, [currentLanguage, settings])

	React.useEffect(() => {

		if(
			settings.preferredLanguage &&
			settings.preferredLanguage !== currentLanguage
		)
		{
			setCurrentLanguage(settings.preferredLanguage)
		}

	}, [settings.preferredLanguage])

	return [
		currentLanguage,
		setCurrentLanguage,
		settings,
		setSettings,
	]

}

export default useI18nSettings

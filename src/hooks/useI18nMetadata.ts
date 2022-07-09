import React from 'react';

import I18nSettingsContext from '../contexts/I18nSettingsContext';

import useI18nString from './useI18nString';

type UseI18nMetadataHookResult = {
	htmlLang: string;
	title: string;
	description: string;
	omniPage: string;
}

const useI18nMetadata = (): UseI18nMetadataHookResult =>
{

	const [currentLanguage] = React.useContext(I18nSettingsContext)

	const [title] = useI18nString('meta.title')
	const [description] = useI18nString('meta.description')
	const [omniPage] = useI18nString('meta.omniPage')

	return {
		htmlLang: currentLanguage,
		title: title || ``,
		description: description || ``,
		omniPage: omniPage || ``,
	}

}

export default useI18nMetadata

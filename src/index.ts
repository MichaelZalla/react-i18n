export type { I18nCacheEntry } from './types/I18nCache';

export type { I18nLocaleIdentifier } from './constants/I18nLocaleIdentifier';

export type { I18nProps } from './components/I18n/I18n';

import I18nCacheService from './services/I18nCacheService';

import I18nSettingsContext from './contexts/I18nSettingsContext';

import useI18nSettings from './hooks/useI18nSettings';
import useI18nString from './hooks/useI18nString';
import useI18nMetadata from './hooks/useI18nMetadata';
import useI18nHtml from './hooks/useI18nHtml';

import I18n from './components/I18n/I18n';
import I18nLanguageSelect from './components/I18nLanguageSelect/I18nLanguageSelect';

export {
	I18nCacheService,
	I18nSettingsContext,
	I18n,
	I18nLanguageSelect as I18nLanguageSelect,
	useI18nSettings,
	useI18nString,
	useI18nMetadata,
	useI18nHtml,
}

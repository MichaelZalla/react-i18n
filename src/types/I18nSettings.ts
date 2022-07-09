import React from 'react';
import { I18nLocaleIdentifier } from '../constants/I18nLocaleIdentifier'

export type InterpolateFn = (template: string, data: any, options: any) => string;

interface I18nSettings {
	preferredLanguage: I18nLocaleIdentifier;
	defaultLanguage: I18nLocaleIdentifier;
	supportedLanguages: I18nLocaleIdentifier[];
	keyErrorMessage: string;
	i18nLoadingComponent?: React.FC<{
		key?: number;
		width?: number;
	}>;
	interpolate?: InterpolateFn;
	getContentsURL: (language: I18nLocaleIdentifier, scope: string) => string;
	onChangeLanguage?: (language: I18nLocaleIdentifier) => void;
}

export default I18nSettings

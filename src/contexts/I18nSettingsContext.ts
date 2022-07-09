import React from 'react'

import { UseI18nSettingsHookResult, DefaultI18nSettings } from '../hooks/useI18nSettings'

const I18nSettingsContext = React.createContext<UseI18nSettingsHookResult>([
	DefaultI18nSettings.defaultLanguage,
	() => {},
	DefaultI18nSettings,
	() => {},
])

I18nSettingsContext.displayName = `I18nSettingsContext`

export default I18nSettingsContext

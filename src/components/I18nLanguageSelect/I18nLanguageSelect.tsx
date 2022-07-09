import React, { FC } from 'react';

import I18nSettingsContext from '../../contexts/I18nSettingsContext';

type I18nLanguageSelectProps = React.PropsWithChildren<{
  labels: { [language: string]: string };
  ariaLabel?: string;
}>

const I18nLanguageSelect: FC<I18nLanguageSelectProps> = ({ labels, ariaLabel = 'Language Dropdown' }) => {

  const [currentLanguage, setCurrentLanguage, settings] = React.useContext(I18nSettingsContext)

  return (
    <select className="I18nLanguageSelect" data-testid="I18nLanguageSelect"
      aria-label={ariaLabel}
      value={currentLanguage}
      onChange={e => setCurrentLanguage(e.target.value)}>

      {
        settings.supportedLanguages.map(localeIdentifier => (
          <option key={localeIdentifier} value={localeIdentifier}>
            { labels[localeIdentifier as keyof typeof labels] }
          </option>
        ))
      }

    </select>
  )

}

export default I18nLanguageSelect;

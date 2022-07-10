import React from 'react';

import pupa from 'pupa';

import { useI18nSettings, I18nSettingsContext, I18n, I18nLanguageSelect } from '@michaelzalla/react-i18n'

import './App.css';

function App() {

  const [username] = React.useState('Cassidy')

  const [
    currentLanguage,
    setCurrentLanguage,
    settings,
    setSettings,
  ] = useI18nSettings()

  React.useEffect(() => {

    // We'll support English and French

    setSettings({
      supportedLanguages: [
        'en',
        'fr',
      ],
      interpolate: pupa,
    })

  }, [setSettings])

  return (
    <I18nSettingsContext.Provider value={[
      currentLanguage,
      setCurrentLanguage,
      settings,
      setSettings,
    ]}>

      <div className="App">

        <main>

          <h1>
            <I18n k='components.App.greeting' data={{ username }}>
              {/* Hello, {username}! */}
            </I18n>
          </h1>

        </main>

        <aside>
          <I18nLanguageSelect labels={{
            en: 'English',
            fr: 'Français',
          }} />
        </aside>

      </div>

    </I18nSettingsContext.Provider>
  )

}

export default App;

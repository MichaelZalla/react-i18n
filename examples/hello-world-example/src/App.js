import React from 'react';

import pupa from 'pupa';

import { useI18nSettings, I18nSettingsContext } from '@michaelzalla/react-i18n'

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
      {/* @TODO Localize me! */}
      <h1>Hello, {username}!</h1>
    </div>

    </I18nSettingsContext.Provider>
  )

}

export default App;

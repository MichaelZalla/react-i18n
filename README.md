# react-i18n

A strongly-typed library of React hooks and components for localizing your web app.

## Table of Contents

- [react-i18n](#react-i18n)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Quick Start](#quick-start)
  - [Configuration](#configuration)
  - [API Reference](#api-reference)
    - [Hooks](#hooks)
      - [useI18nSettings()](#usei18nsettings)
      - [useI18nString()](#usei18nstring)
      - [useI18nMetadata()](#usei18nmetadata)
      - [useI18nHtml()](#usei18nhtml)
    - [Contexts](#contexts)
      - [I18nSettingsContext](#i18nsettingscontext)
    - [Components](#components)
      - [I18n](#i18n)
      - [I18nLanguageSelect](#i18nlanguageselect)
  - [License](#license)

## Overview

`react-i18n` offers a simple family of React hooks and components to help you localize your web app quickly and easily.

## Quick Start

Suppose we start with the following `App` component, which has just one string—_"Hello, React!"_—hardcoded in English:

```tsx
// src/components/App/App.tsx

function App() {

  const [username] = React.useState('Cassidy')

  return (
    <div className="App">
      <h1>Hello, {username}!</h1>
    </div>
  )

}
```

We can localize `App` by following these steps:

1. Move our display content out of our code and into static JSON files:

  ```js
  // public/static/languages/en/components.lang.json
  {
    "App": {
      "greeting": "Hello, {username}!"
    }
  }

  // public/static/languages/fr/components.lang.json
  {
    "App": {
      "greeting": "Bonjour, {username}!"
    }
  }
  ```

2. Initialize the `react-i18n` library by calling the `useI18nSettings()` hook:

  ```tsx
  // src/components/App/App.tsx
  import React from 'react'

  import pupa from 'pupa';

  import { useI18nSettings } from 'react-i18n'

  const App = () => {

    const [
      currentLanguage,
      setCurrentLanguage,
      settings,
      setSettings,
    ] = useI18nSettings()

    React.useEffect(() => {
      setSettings({
        supportedLanguages: [
          'en',
          'fr',
        ],
        interpolate: pupa,
      })
    }, [setSettings])

    return (
      <div className="App">
        <h1>Hello, {username}!</h1>
      </div>
    )

  }
  ```

3. Share the current localization state with our app's component tree:

  ```tsx
  // src/components/App/App.tsx
  // ...
  import { useI18nSettings, I18nSettingsContext } from 'react-i18n'

  const App = () => {
    // ...
    return (
      <I18nSettingsContext.Provider value={[
        currentLanguage,
        setCurrentLanguage,
        settings,
        setSettings,
      ]}>

        <div className="App">
          <h1>Hello, {username}!</h1>
        </div>

      </I18nSettingsContext.Provider>
    )
  }
  ```

4. Replace our static content with the `I18n` component:

  ```tsx
  // src/components/App/App.tsx
  // ...
  import { useI18nSettings, I18nSettingsContext, I18n } from 'react-i18n'

  const App = () => {
    // ...
    return (
      <I18nSettingsContext.Provider value={[/*...*/]}>

        <div className="App">
          <h1>
            <I18n k='components.App.greeting' data={{ username }}>
              {/* Hello, {username}! */}
            </I18n>
          </h1>
        </div>

      </I18nSettingsContext.Provider>
    )
  }
  ```

5. Offer a language selector:

  ```tsx
  // src/components/App/App.tsx
  // ...
  import { useI18nSettings, I18nSettingsContext, I18n, I18nLanguageSelect } from 'react-i18n'

  const App = () => {
    // ...
    return (
      <I18nSettingsContext.Provider value={[/*...*/]}>

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
  ```

## Configuration

The settings objects passed to `setSettings({...})` support the following fields and defaults:

- `defaultLanguage`: The default language to display.

  ```ts
  defaultLanguage: string = `en`
  ```

- `supportedLanguages`: The set of language identifiers that your app will support (e.g., `['en', 'fr', 'de', 'ru']`).

  ```ts
  supportedLanguages: string[] = [`en`]
  ```

- `preferredLanguage`: A hint to the library to display a preferred language if that language is part of `supportedLanguages[]`. This can be useful if you want to set the current language to a user preference (language) that may or may not be supported by your app.

  ```ts
  preferredLanguage: string = `en`
  ```

- `keyErrorMessage`: A fallback string for the `I18n` component to render if the requested key `k` fails to resolve a string.

  ```ts
  keyErrorMessage: string = `%%_USE_I18N_STRING_ERROR_%%`
  ```

- `getContentsURL`: A function that accepts a `language` and a `scope`, and returns the location of the corresponding JSON file. This could be a file path relative to our app (or webserver), or it could be the path to a file hosted on another server or domain—or even a URL for a remote API that returns localization content from a database, given some request parameters.

  ```ts
  getContentsURL: (
    language: string,
    scope: string): string =>
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
  ```

- `i18nLoadingComponent`: A React component that `I18n` can render while it's waiting for a new string to resolve. The component should optionally accept a `key` prop and a `width` prop. The `I18n` component tracks the width (in pixels) and height (in lines) of its contents as it appears on screen. Whenever the current language changes, `I18n` will use these values to render a set of _`lines`_ loading components (as a list), with their `width` props set to _`width`_.

  ```ts
  i18nLoadingComponent?: React.FC<{ key?: number; width?: number; }> = undefined
  ```

- `interpolate`: A function to interpolate dynamic data into our localized strings. The `react-i18n` library doesn't implement its own interpolation function; it also doesn't bundle a third-party interpolation package as a dependency. This setting allows developers to choose any interpolation method they wish, while keeping `react-i18n` dependency-free.

  ```ts
  interpolate?: (template: string, data?: object) => string = undefined
  ```

- `onChangeLanguage`: A callback that will run whenever the current language changes. This is roughly equivalent to—but a bit easier than—setting up a `useEffect()` hook with `currentLanguage` as a dependency.

  ```ts
  onChangeLanguage?: (language: string) => void = undefined
  ```

## API Reference

### Hooks

#### useI18nSettings()

Initializes a new localization context and returns its current settings, along with some setter functions:

```ts
export type CurrentLanguage = string;
export type SetCurrentLanguageFn = (language: string) => void;
export type Settings = I18nSettings;
export type SetSettingsFn = (partialSettings: Partial<I18nSettings>) => void;

export type UseI18nSettingsHookResult = [
  CurrentLanguage,
  SetCurrentLanguageFn,
  Settings,
  SetSettingsFn,
]

const useI18nSettings = (): UseI18nSettingsHookResult => {…}
```

#### useI18nString()

Retrieves an individual string—or an entire tree of strings—based on current settings:

```ts
type UseI18nStringHookResult<T extends string|I18nCacheEntry = string> = [
  T|undefined,
  Error|undefined,
  boolean,
]

const useI18nString = <T extends string|I18nCacheEntry = string>(
  key: string,
  data?: any,
  ignoreMissing?: boolean): UseI18nStringHookResult<T> => {…}
```

This hook is used primarily in instances where we need to use a localized string for something other than rendering (i.e., visible text). Common examples include HTML attributes like `src`, `alt`, and `aria-label`:

```tsx
import { useI18nString } from 'react-i18n'

const MyComponent = () => {

  const imageSrc = useI18nString('components.MyComponent.image.src')
  const imageAlt = useI18nString('components.MyComponent.image.alt')

  return (
    <img width="128" height="128"
      src={imageSrc[0] || `#`}
      alt={imageAlt[0] || `My cool image.`} />
  )

}
```

#### useI18nMetadata()

Retrieves a set of localized values corresponding to several HTML metadata tags:

```ts
type UseI18nMetadataHookResult = {
  htmlLang: string;
  title: string;
  description: string;
}

const useI18nMetadata = (): UseI18nMetadataHookResult => {…}
```

The returned metadata object includes fields for `title` and `description`, as well as an `htmlLang` field corresponding to the `html` tag's `lang` attribute (which you may want to set whenever the current language changes). The resulting map of localized key-value pairs can be used in conjunction with popular metadata-synchronizing packages, such as `react-helmet` and `next/head`.

#### useI18nHtml()

Retrieves HTML content at a given URL:

```ts
type UseI18nHtmlHookResult = [
  string|undefined,
  Error|undefined,
  boolean
]

const useI18nHtml = (url: string): UseI18nHtmlHookResult => {…}
```

Sometimes we need our app to render entire chunks of static markup that is fetched from somewhere outside of our app. One example would be a static site headers. To localize this type of content, `react-i18n` offers a `useI18nHtml()` hook as a convenience. The hook is unaware of the current localization settings, because its only job is to asynchronously fetch markup from a URL you provide. React components that use this hook are responsible for passing an appropriate `url` based on the current language.

Below is an example of using this hook to render a dynamic site header—based on the current language—by fetching HTML content from a path on our server:

```tsx
import React from 'react';

import { I18nSettingsContext, useI18nHtml } from 'react-i18n';

const AppHeader = () => {

  const [currentLanguage] = React.useContext(I18nSettingsContext)

  const url = `/shared-assets/html/header-${currentLanguage}.html`

  const [markup] = useI18nHtml(url)

  if(!markup)
  {
    return <></>
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: markup }} />
  )

}
```

### Contexts

#### I18nSettingsContext

Captures a localization state—including `currentLanguage`, `settigns`, and setter functions—and provides it to a component subtree.

  ```tsx
  // ...
  const [currentLanguage, setCurrentLanguage, settings, setSettings] = useI18nSettings()

  return (
    <I18nSettingsContext.Provider value={[currentLanguage, setCurrentLanguage, settings, setSettings]}>
      {/* Your components here! */}
    </I18nSettingsContext.Provider>
  )
  }
  ```

Multiple contexts can be nested by using the `useI18nSettings()` hook from multiple places in your app's component tree. This can be very useful if you need to localize your app incrementally while continuously shipping new client builds to customers. Sections of your app that have not been localized yet can be wrapped in an `I18nSettingsContext` that restricts rendering to a single, fixed language (e.g., English).

### Components

#### I18n

Accepts a key `k` together with some `data` (optional) and resolves a localized string based on `k` and `currentLanguage`.

```tsx
<I18n k='components.App.greeting' data={{ username }}>
  {/* Hello, {username}! */}
</I18n>
```

Notes:

- This component renders a `span` tag with the resulting string as its text content.
- If the given key fails to resolve to a string, the component will use `settings.keyErrorMessage` to render a `span` with a fallback string.
- If an `i18nLoadingComponent` was set via `setSettings({…})`, `I18n` will use that component to render a "skeleton" representation of its on-screen content whenever it waits for a new string to resolve (i.e., when the current language changes).
- If the `interpolate` setting is undefined, `I18n` will not interpolate strings—even if you pass a `data` prop.

#### I18nLanguageSelect

Renders a simple `select` element. The `select` includes an `onChange` handler that will trigger a call to `setCurrentLanguage()` whenever the user chooses a different option from the drop-down:

```tsx
<I18nLanguageSelect labels={{
  en: 'English',
  fr: 'Français'
}} />
```

The library makes no assumptions about which languages your app will support, or how you'd like those languages to be labeled in the UI. Therefore, it doesn't come bundled with an exhaustive set of language labels. Instead, the `I18nLanguageSelect` component takes a `labels` prop, which it uses to retrieve a human-friendly label for each of the languages included in `settings.supportedLanguages`.

## License

See: [LICENSE](LICENSE)

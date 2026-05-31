### Localization

Localization is build using the `i18next` library. The localization files are located in the `src/localization` directory. The `i18next` library is used to load the localization files and provide the translations to the application. The `i18next` library is initialized in the `src/index.js` file.

### Adding a new language

To add a new language, create a new file in the `src/localization/locales` directory with the language code as the file name. For example, to add a new language with the language code `es`, create a new file named `es.json` under a folder`src/localization/locales/es` directory. The file should contain the translations for the new language. For example:

```json
{
  "hello": "Hola",
  "world": "Mundo"
}
```

Then, import the new language file in the `src/localization/config.ts` file and add it to the `resources` object. For example:

```typescript
import es from './locales/es/es.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};
```

Finally, update the `src/localization/config.ts` file to include the new language in the `supportedLanguages` array. For example:

```typescript
export const supportedLanguages = ['en', 'es'];
```

### Using localization

To use localization in the application, import the `useTranslation` hook from the `react-i18next` library. For example:

```typescript
import { useTranslation } from 'react-i18next';
```

Then, use the `t` function from the `useTranslation` hook to translate the text. For example:

```typescript
const { t } = useTranslation();

return (
    <div>
        <h1>{t('hello')}</h1>
        <p>{t('world')}</p>
    </div>
);
```

The `t` function takes a key as an argument and returns the translation for that key. If the translation is not found, the key is returned as the translation.

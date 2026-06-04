### Localization

Localization is built using the `i18next` library. The localization files are located in the `common/src/localization` directory. The `i18next` library is used to load the localization files and provide translations to the application. It is initialized by importing `@localization/config` (mapped to `common/src/localization/config.ts`) inside the app's `LocalizationProvider.tsx`.

### Adding a new language

To add a new language (e.g. Spanish `es`):

1. Create a new directory under `common/src/localization/locales/es/`.
2. Create `main.json`, `common.json`, and `error.json` containing the translation namespaces. For example:

```json
{
  "hello": "Hola",
  "world": "Mundo"
}
```

3. Import the new language files and merge them inside `common/src/localization/config.ts`:

```typescript
import commonEs from './locales/es/common.json';
import errorEs from './locales/es/error.json';
import mainEs from './locales/es/main.json';

// In the resources config block:
resources: {
  en: {
    translation: { ...main, ...common, ...error }
  },
  es: {
    translation: { ...mainEs, ...commonEs, ...errorEs }
  }
}
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

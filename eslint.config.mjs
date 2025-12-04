import fledra from '@fledra/eslint-config';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(fledra(), {
  languageOptions: {
    globals: {
      defineNuxtConfig: 'readonly',
    },
  },
});

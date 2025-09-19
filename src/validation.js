import * as yup from 'yup';
import i18n from './i18n.js';

yup.setLocale({
  mixed: {
    required: () => i18n.t('validation.required'),
  },
  string: {
    url: () => i18n.t('validation.url'),
  },
});

export const buildSchema = (feeds) => yup.object().shape({
  url: yup.string()
    .required()
    .url()
    .notOneOf(feeds, i18n.t('validation.duplicate')),
});

import * as yup from 'yup';
import i18n from './i18n.js';

export default (existingUrls) => {
  yup.setLocale({
    mixed: {
      required: () => i18n.t('errors.required'),
      notOneOf: () => i18n.t('errors.duplicate'),
    },
    string: {
      url: () => i18n.t('errors.url'),
    },
  });

  return yup.object().shape({
    url: yup.string().url().required().notOneOf(existingUrls),
  });
};

import i18n from 'i18next';

i18n.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        errors: {
          required: 'Поле обязательно',
          url: 'Ссылка должна быть валидным URL',
          duplicate: 'RSS уже существует',
          network: 'Ошибка сети',
          parse: 'Ресурс не содержит валидный RSS',
        },
        success: 'RSS успешно загружен',
      },
    },
    en: {
      translation: {
        errors: {
          required: 'This field is required',
          url: 'The link must be a valid URL',
          duplicate: 'RSS already exists',
          network: 'Network error',
          parse: 'The resource does not contain valid RSS',
        },
        success: 'RSS loaded successfully',
      },
    },
  },
});

export default i18n;

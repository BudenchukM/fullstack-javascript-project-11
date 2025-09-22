import * as yup from 'yup';

export const urlSchema = (existingUrls = []) => yup.string()
  .required('Поле не должно быть пустым')
  .url('Это не похоже на корректный URL')
  .notOneOf(existingUrls, 'Этот RSS уже добавлен');

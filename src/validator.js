import * as yup from 'yup';

const createValidator = (existingUrls = []) => {
  return yup.object().shape({
    url: yup
      .string()
      .required('URL is required')
      .url('Must be a valid URL')
      .notOneOf(existingUrls, 'RSS feed already exists'),
  });
};

export default createValidator;

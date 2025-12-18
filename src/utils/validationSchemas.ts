import * as Yup from 'yup';

export const registerSchema = Yup.object({
  password: Yup.string()
    .required('Required')
    .min(6, 'Password too short'), // Вимога: мінімум 6 символів
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match') // Вимога: паролі співпадають
});
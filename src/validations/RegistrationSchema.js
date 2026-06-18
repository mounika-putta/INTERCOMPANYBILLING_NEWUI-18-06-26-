import * as Yup from 'yup';

const RegistrationSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  title: Yup.string().required('Title is required'),
  gender: Yup.string().required('Gender is required'),
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  // email: Yup.string()
  //   .email('Invalid email format')
  //   .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Only @gmail.com emails are allowed')
  //   .required('Email is required'),
  email: Yup.string()
  .email('Invalid email format')
  .required('Email is required'),
  username: Yup.string().required('Username is required'),
 mobile: Yup.string()
  .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
  .required('Mobile number is required'),

  address: Yup.string().required('Address is required'),
  // department: Yup.string().required('Department is required'),
  company: Yup.string().required('Company is required'),
 password: Yup.string()
  .required('Password is required'),
confirmPassword: Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  .required('Confirm Password is required'),
   customerAccount: Yup.string().when('role', (roleId, schema, context) => {
  const roles = context?.options?.context?.roles || [];

  const selectedRole = roles.find((r) => r.id === Number(roleId));
  const isCustomer = selectedRole?.roleName === 'Customer';

  return isCustomer
    ? schema.required('Customer Account is required')
    : schema.notRequired();
}),


});

export default RegistrationSchema;

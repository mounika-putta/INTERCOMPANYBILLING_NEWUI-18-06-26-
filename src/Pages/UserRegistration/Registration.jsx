import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, fetchDepartments, registerUser, fetchActiveUrl } from '../../redux/RegistrationSlice';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { useFormik } from 'formik';
import RegistrationSchema from '../../validations/RegistrationSchema';
import HelpModal from '../../components/Common/HelpModal';
import { fetchCompaniesListwithoutRole } from '../../redux/CustomerSlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AuthLayout, Button, FormField, Icon } from '../../components/ui';

function Registration() {

  const dispatch = useDispatch();
  const [showHelp, setShowHelp] = useState(false);
  const companies = useSelector((state) => state.Customers.comapnieswithoutRole);
  const {
    roles,
    // departments,
    activeurl,
    // companies,
    loading,
    error
  } = useSelector((state) => state.registration);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch((fetchActiveUrl()));
    // dispatch(fetchDepartments());
    dispatch(fetchCompaniesListwithoutRole());
  }, [dispatch]);

  const redirectUrl = `${activeurl?.[0] || ''}activation`;
  console.log('redirectUrl:', redirectUrl);

  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    surname: '',
    gender: '',
    email: '',
    mobile: '',
    username: '',
    address: '',
    role: '',
    // department: '',
    company: '',
    customerAccount: '',
    password: '',
    confirmPassword: '',
    activationlink: ''
  });
  const formik = useFormik({
    initialValues: {
      role: '',
      title: '',
      name: '',
      surname: '',
      gender: '',
      email: '',
      username: '',
      mobile: '',
      address: '',
      // department: '',
      company: '',
      customerAccount: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: RegistrationSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          activationlink: redirectUrl,
        };
        setSubmitting(true);
        const response = await dispatch(registerUser(payload)).unwrap();

        const message = response?.message || 'User registered successfully.';
        alertify.alert('Success', message);
        resetForm();

      } catch (error) {
        console.error('Registration error:', error);

        let errorMessage = 'Registration failed. Please try again.';

        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        alertify.alert('error', errorMessage);
      } finally {
        setSubmitting(false);
      }
    }


  });
  // Update role state for conditional rendering
  const handleRoleChange = (e) => {
    formik.handleChange(e);
    setRole(e.target.value);
  };

  // Also have a state for errors
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // or '/login' depending on your routing setup
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'role') {
      setRole(value);
    }
  };

  const selectedRole = roles.find(r => r.id === Number(formik.values.role));
  const isCustomerRole = selectedRole?.roleName === 'Customer';

  const titleOptions = [
    { value: 'Miss', label: 'Miss' },
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
  ];
  const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Others', label: 'Others' },
  ];

  return (
    <AuthLayout
      contentMaxWidth={680}
      topRight={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<Icon name="back" size={13} />}
            onClick={handleBack}
            sx={{ borderRadius: 999, color: 'text.secondary', borderColor: 'divider' }}
          >
            Back to Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Icon name="help" size={13} />}
            onClick={() => setShowHelp(true)}
            sx={{ borderRadius: 999 }}
          >
            Help
          </Button>
        </Box>
      }
    >
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to register a new user
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            columnGap: 2,
          }}
        >
          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormField
              name="role"
              label="Role Type"
              type="select"
              required
              formik={formik}
              options={roles}
              getOptionValue={(r) => r.id}
              getOptionLabel={(r) => r.roleName}
              onChange={handleRoleChange}
              placeholder="Select Role"
            />
          </Box>

          <FormField name="title" label="Title" type="select" required formik={formik}
            options={titleOptions} placeholder="Select Title" />
          <FormField name="name" label="Name" required formik={formik} />
          <FormField name="surname" label="Surname" required formik={formik} />
          <FormField name="gender" label="Gender" type="select" required formik={formik}
            options={genderOptions} placeholder="Select Gender" />
          <FormField name="email" label="Email" type="email" required formik={formik} />
          <FormField name="username" label="Username" required formik={formik} />
          <FormField name="mobile" label="Mobile" required formik={formik}
            inputProps={{ maxLength: 10, pattern: '\\d*' }} />

          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormField name="address" label="Address" type="textarea" required formik={formik} />
          </Box>

          <FormField name="company" label="Company" type="select" required formik={formik}
            options={companies} getOptionValue={(c) => c.id} getOptionLabel={(c) => c.companyName}
            placeholder="Select Company" />

          {isCustomerRole && (
            <FormField name="customerAccount" label="Customer Account No" required formik={formik} />
          )}

          <FormField name="password" label="Password" type="password" required formik={formik} />
          <FormField name="confirmPassword" label="Confirm Password" required formik={formik} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" loading={formik.isSubmitting} sx={{ px: 6, py: 1.2 }}>
            Register
          </Button>
        </Box>
      </Box>

      <HelpModal
        show={showHelp}
        title="Registration  - Help & Overview"
        screenName="Registration "
        onClose={() => setShowHelp(false)}
      />
    </AuthLayout>
  );
}

export default Registration;

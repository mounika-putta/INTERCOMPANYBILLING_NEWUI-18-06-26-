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
import { colors } from '../../theme/tokens';

const BRAND_FEATURES = [
  'Quotations & approvals',
  'Invoicing & credit notes',
  'Customers & companies',
  'Role-based access control',
];

/**
 * Section card with a light-green header band (brand palette) and a white body.
 * Keeps every section visually consistent with the rest of the app's screens.
 */
const Section = ({ icon, title, children }) => (
  <Box
    sx={{
      mb: 1.25,
      border: `1px solid ${colors.line}`,
      borderRadius: 1.5,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.6,
        backgroundColor: colors.brandLight,
        borderBottom: `1px solid ${colors.line}`,
      }}
    >
      <Icon name={icon} size={14} color={colors.brand} />
      <Typography variant="caption" sx={{ fontWeight: 700, color: colors.brand, fontSize: '0.8rem' }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ px: 1.25, pt: 1, pb: 0.25 }}>{children}</Box>
  </Box>
);

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
      features={BRAND_FEATURES}
      contentMaxWidth={660}
      topRight={
        <Typography variant="body2" sx={{ color: colors.inkSoft }}>
          Already have an account?{' '}
          <Box
            component="span"
            onClick={handleBack}
            sx={{
              color: colors.brand,
              fontWeight: 700,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Login
          </Box>
        </Typography>
      }
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: 4,
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.12)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 3, sm: 3.5 },
        }}
      >
        {/* Header — mirrors the Login card header (icon circle + brand heading) */}
        <Box sx={{ textAlign: 'center', mb: 1.5 }}>
          {/* <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: colors.brandLight,
              mb: 0.75,
            }}
          >
            <Icon name="user-plus" size={18} color={colors.brand} />
          </Box> */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.4px',
              mb: 0.25,
              color: `${colors.brand} !important`,
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register a new account to get started with Inter-Company Billing
          </Typography>
        </Box>

        {/* Personal Information Section */}
        <Section icon="user" title="Personal Information">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 1.5,
              rowGap: 0.85,
            }}
          >
            <FormField name="title" label="Title" type="select" required formik={formik}
              options={titleOptions} placeholder="Select Title" />
            <FormField name="gender" label="Gender" type="select" required formik={formik}
              options={genderOptions} placeholder="Select Gender" />
            <FormField name="name" label="Name" required formik={formik} />
            <FormField name="surname" label="Surname" required formik={formik} />
          </Box>
        </Section>

        {/* Contact Information Section */}
        <Section icon="phone" title="Contact Information">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 1.5,
              rowGap: 0.25,
            }}
          >
            <FormField name="email" label="Email" type="email" required formik={formik} />
            <FormField name="mobile" label="Mobile" required formik={formik}
              inputProps={{ maxLength: 10, pattern: '\\d*' }} />
          </Box>
        </Section>

        {/* Company Information Section */}
        <Section icon="building" title="Company Information">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 1.5,
              rowGap: 0.25,
            }}
          >
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
            <FormField name="company" label="Company" type="select" required formik={formik}
              options={companies} getOptionValue={(c) => c.id} getOptionLabel={(c) => c.companyName}
              placeholder="Select Company" />
            {isCustomerRole && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <FormField name="customerAccount" label="Customer Account No" required formik={formik} />
              </Box>
            )}
          </Box>
        </Section>

        {/* Account Information Section */}
        <Section icon="lock" title="Account Information">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              columnGap: 1.5,
              rowGap: 0.25,
            }}
          >
            <FormField name="username" label="Username" required formik={formik} />
            <FormField name="password" label="Password" type="password" required formik={formik} />
            <FormField name="confirmPassword" label="Confirm Password" type="password" required formik={formik} />
          </Box>
        </Section>

        {/* Address Section */}
        <Section icon="location" title="Address">
          <FormField name="address" label="Address" type="textarea" required formik={formik} />
        </Section>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            mt: 1.5,
          }}
        >
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              minWidth: 160,
              height: 42,
              // backgroundColor: "red",
              // color: "#fff",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={formik.isSubmitting}
            endIcon={<Icon name="forward" size={13} />}
            sx={{
              minWidth: 160,
              height: 42,
              px: 3,
            }}
          >
            Create Account
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

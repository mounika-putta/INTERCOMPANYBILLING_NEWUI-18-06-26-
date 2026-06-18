import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, forgotPassword } from '../../redux/LoginSlice'; // adjust path if needed
import { useFormik } from 'formik';
import { LoginSchem } from '../../validations/LoginSchem';
import alertify from 'alertifyjs';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { AuthLayout, Button, Modal, Alert, Icon } from '../../components/ui';

const Login = () => {
  const [UserName, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loginError, forgotError, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ userName: UserName, Password }));
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: LoginSchem,
    onSubmit: (values) => {
      dispatch(login({ userName: values.username, Password: values.password }));
    }
  });

  useEffect(() => {
    if (user) {
      navigate('/landingpage');
    }
  }, [user, navigate]);

  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      alertify.alert('Warning', 'Please enter your registered email.');
      return;
    }
    setForgotLoading(true);
    try {
      const result = await dispatch(forgotPassword(forgotEmail)).unwrap();
      alertify.alert('Success', result.message || 'Password reset code sent to your email.');
      setShowForgotPopup(false);
      setForgotLoading(false);
      setForgotEmail('');
    } catch (error) {
      setForgotLoading(false);
      alertify.alert('error', error?.message || 'Failed to send password reset email.');
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
          Sign in to your Inter-Company Billing account
        </Typography>

        <Typography component="label" sx={{ fontWeight: 600, fontSize: 13, mb: 0.5, display: 'block' }}>
          Username
        </Typography>
        <TextField
          fullWidth
          name="username"
          placeholder="Enter your username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.username && formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username ? formik.errors.username : ' '}
        />

        <Typography component="label" sx={{ fontWeight: 600, fontSize: 13, mb: 0.5, display: 'block' }}>
          Password
        </Typography>
        <TextField
          fullWidth
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" variant="contained" fullWidth loading={loading} sx={{ mt: 1, py: 1.3 }}>
          Sign In
        </Button>

        {loginError && !showForgotPopup && <Alert severity="error">{loginError}</Alert>}


        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            width: '100%',
          }}
        >
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => navigate('/register')}
            sx={{ fontWeight: 600, fontSize: 13.5 }}
          >
            New User?
          </Link>

          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => setShowForgotPopup(true)}
            sx={{ fontWeight: 600, fontSize: 13.5 }}
          >
            Forgot Password?
          </Link>
        </Box>
      </Box>

      {/* Forgot Password Modal */}
      <Modal
        open={showForgotPopup}
        onClose={() => setShowForgotPopup(false)}
        title="Reset Password"
        actions={
          <Button
            type="submit"
            form="forgot-form"
            variant="contained"
            loading={forgotLoading}
            sx={{ px: 4 }}
          >
            Submit
          </Button>
        }
      >
        <Box component="form" id="forgot-form" onSubmit={handleForgotSubmit}>

          <TextField
            fullWidth
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            label="Email address"
          />
        </Box>
      </Modal>
    </AuthLayout>
  );
};

export default Login;

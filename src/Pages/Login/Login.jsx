import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, forgotPassword } from '../../redux/LoginSlice';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

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
      navigate('/quotationdashboard');
    }
  }, [user, navigate]);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      alertify.alert('Warning', 'Please enter your registered email.');
      return;
    }
    try {
      const result = await dispatch(forgotPassword(forgotEmail)).unwrap();
      alertify.alert('Success', result.message || 'Password reset code sent to your email.');
      setShowForgotPopup(false);
      setForgotEmail('');
    } catch (error) {
      alertify.alert('error', error?.message || 'Failed to send password reset email.');
    }
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          width: '100%',
          maxWidth: 460,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 5 },
          backgroundColor: '#fff',
          borderRadius: 4,
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.12)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#E6F3EA',
              mb: 3,
            }}
          >
            <Icon name="lock" size={22} color="#2E6C3B" />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.4px',
              mb: 1,
              color: '#2E6C3B !important'
            }}
          >
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue to your Inter-Company Billing account
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.username && formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username ? formik.errors.username : ' '}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3 }}>
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => setShowForgotPopup(true)}
              sx={{ fontWeight: 600, fontSize: 14 }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" fullWidth loading={loading} sx={{ py: 1.4, mb: 2 }}>
            Sign In
          </Button>

          {loginError && !showForgotPopup && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Don’t have an account?{' '}
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => navigate('/register')}
              sx={{ fontWeight: 600 }}
            >
              User Registration
            </Link>
          </Typography>
        </Box>
      </Box>

      <Modal
        open={showForgotPopup}
        onClose={() => setShowForgotPopup(false)}
        title="Reset Password"
        actions={
          <Button type="submit" form="forgot-form" variant="contained" sx={{ px: 4 }}>
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

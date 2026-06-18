import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AxiosInstance, baseURL } from '../../services/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AuthLayout, Button, Alert } from '../../components/ui';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      setMessage('Invalid activation link.');
      setStatus('error');
    }
  }, [searchParams]);

  const handleActivation = () => {
    setMessage('Activating your account...');
    setStatus('pending');

    AxiosInstance.post(`/saveactivationstatus?email=${email}`)
      .then((res) => {
        setMessage(res.data.message || 'Your account has been activated successfully.');
        setStatus('success');
        setActivated(true);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Activation failed. Please try again or contact support.');
        setStatus('error');
      });
  };

  const severity = status === 'success' ? 'success' : status === 'error' ? 'error' : 'info';

  return (
    <AuthLayout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Activate your account
        </Typography>
        {email && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            Hi, <strong>{email}</strong>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please click the button below to activate your account.
        </Typography>

        {status !== 'pending' && message && <Alert severity={severity}>{message}</Alert>}

        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          {!activated && email && (
            <Button
              variant="contained"
              onClick={handleActivation}
              loading={status === 'pending'}
              sx={{ px: 4, py: 1.1 }}
            >
              Activate Account
            </Button>
          )}

          {status === 'success' && (
            <Button href="/" variant="outlined" sx={{ px: 4, py: 1.1 }}>
              Go to Login
            </Button>
          )}
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ActivateAccount;

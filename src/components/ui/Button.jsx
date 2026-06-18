import React from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const Button = ({
  loading = false,
  disabled,
  children,
  startIcon,
  sx,
  ...rest
}) => (
  <MuiButton
    disabled={disabled || loading}
    startIcon={
      loading ? (
        <CircularProgress
          size={16}
          sx={{ color: '#fff' }}
        />
      ) : startIcon
    }
    sx={{
      ...sx,
      ...(loading && {
        '&.Mui-disabled': {
          color: '#fff !important',
        },
      }),
    }}
    {...rest}
  >
    {children}
  </MuiButton>
);

export default Button;
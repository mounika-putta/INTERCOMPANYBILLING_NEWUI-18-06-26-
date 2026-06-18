import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FaCheckCircle } from 'react-icons/fa';
import { colors } from '../../theme/tokens';

/**
 * Split-panel shell for authentication screens (Login / Register / Activation).
 * Left: green brand panel (logo, product name, tagline, feature bullets).
 * Right: the screen's form/content (children).
 * Stacks to a single column on small screens (brand panel hidden on xs).
 *
 * <AuthLayout title="MuniServ" subtitle="..." features={[...]} topRight={<Link/>}>
 *   <form/>
 * </AuthLayout>
 */
const DEFAULT_FEATURES = [
  'Quotations & approvals',
  'Invoicing & credit notes',
  'Customers & companies',
  'Audit logs & reports',
  'Role-based access control',
];

const AuthLayout = ({
  appName = 'Inter-Company Billing',
  tagline = 'Integrated Billing & Quotation Management',
  features = DEFAULT_FEATURES,
  logoSrc = '/files/assets/images/ITSALOGO.png',
  topRight,
  children,
  contentMaxWidth = 460,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: colors.background,
      }}
    >
      {/* Left brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          width: { md: '42%', lg: '38%' },
          px: { md: 6, lg: 8 },
          py: 6,
          position: 'relative',
          color: '#fff',
          background: `linear-gradient(160deg, ${colors.brandDark} 0%, ${colors.brand} 100%)`,
          overflow: 'hidden',
        }}
      >
       

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component="img"
            src={logoSrc}
            alt="logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            sx={{
              height: 64,
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.92)',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            {appName}
          </Typography>
          <Typography sx={{ opacity: 0.9, mb: 4, fontSize: '0.98rem' }}>{tagline}</Typography>

          <Stack spacing={1.6}>
            {features.map((f) => (
              <Stack key={f} direction="row" spacing={1.2} alignItems="center">
                <FaCheckCircle color="rgba(255,255,255,0.85)" size={16} />
                <Typography sx={{ fontSize: '0.95rem', opacity: 0.95 }}>{f}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right content panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          px: { xs: 2.5, sm: 5 },
          py: { xs: 5, sm: 6 },
          overflowY: 'auto',
        }}
      >
        {topRight && (
          <Box sx={{ position: 'absolute', top: 20, right: 24, zIndex: 2 }}>{topRight}</Box>
        )}
        <Box sx={{ width: '100%', maxWidth: contentMaxWidth }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;

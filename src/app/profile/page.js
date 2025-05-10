'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

const theme = createTheme({
  palette: {
    secondary: {
      main: green[500],
    },
  },
});

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Added loading state
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');
  const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');


  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to home if not logged in
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/getProfile'); // Correct URL
        if (!res.ok) {
          throw new Error(`Failed to fetch user data: ${res.status}`);
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setDeleteAccountError(error.message); // Set to a state variable.
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session, status, router]);

  const handleChangePassword = async () => {
    setChangePasswordError(''); // Reset error state
    setChangePasswordSuccess('');

    try {
      const res = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      const data = await res.json(); // Parse JSON response, even on success

      setChangePasswordSuccess(data.message || 'Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Error changing password:', error);
      setChangePasswordError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountError('');
    setDeleteAccountSuccess('');

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('/api/deleteAccount', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      const data = await res.json();
      setDeleteAccountSuccess(data.message || 'Account deleted successfully!');
      await signOut({ redirect: '/' }); // Sign out and redirect
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteAccountError(error.message);
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Failed to load user data.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> </Avatar>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Your Profile
          </Typography>

          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Grid container spacing={1}>
  
            <Grid container spacing={1}>
  
  </Grid>
  <Grid item xs={12} sm={6}>
    <Box width="100%">
      <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
        Email:
      </Typography>
      <Typography variant="body1">
        {session?.user?.email || 'N/A'}
      </Typography>
    </Box>
  </Grid>
</Grid>


            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Change Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {changePasswordError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {changePasswordError}
              </Alert>
            )}
            {changePasswordSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {changePasswordSuccess}
              </Alert>
            )}

            <Box mt={2}>
              <Button variant="contained" color="secondary" onClick={handleChangePassword}>
                Change Password
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Delete Account
            </Typography>
            {deleteAccountError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deleteAccountError}
              </Alert>
            )}

            <Box mt={2}>
              <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProfilePage;

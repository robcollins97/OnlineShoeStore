'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation'; // Import useRouter for page redirection
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react'; // Import useSession
import { useEffect } from 'react'; // Import useEffect

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

export default function Page() {
  const router = useRouter(); // Initialize router for page redirection
  const { data: session, status } = useSession(); // Use the useSession hook

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      console.log("Logged in user's email:", session.user.email);
    } else if (status === 'loading') {
      console.log("Session loading...");
    } else if (status === 'unauthenticated') {
      console.log("Not logged in.");
    }
  }, [session, status]);

  const handleSubmit = async (event) => {
    console.log("handling submit");
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    const result = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      alert(`Sign in error: ${result.error}`);
    } else {
      router.push('/dashboard');
    }
  }; // end handler

  const theme = createTheme({
    palette: {
      secondary: {
        main: green[500],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Welcome to Rob's Secret Shoe Shop, login to browse
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
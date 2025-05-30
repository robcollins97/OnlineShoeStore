'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation'; // ✅ correct import for App Router

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';


export default function Page() {
  const router = useRouter(); 


  /*
  This function does the actual work
  calling the fetch to get things from the database.
  */ 
  async function runDBCallAsync(url) {


    const res = await fetch(url);
    const data = await res.json();


    if(data.data== "true"){
      console.log("registered")

      
    } else {

      console.log("not registered  ")
    }
  }


  /*

  When the button is clicked, this is the event that is fired.
  The first thing we need to do is prevent the default refresh of the page.
  */
	const handleSubmit = async (event) => {
		
		console.log("handling submit");


    event.preventDefault();
  
		const data = new FormData(event.currentTarget);


    let email = data.get('email')
    let email2 = data.get('email2')
		let pass = data.get('pass')
    let pass2 = data.get('pass2')



    console.log("Sent email:" + email)
    console.log("Sent email2:" + email2)
    console.log("Sent pass:" + pass)
    console.log("Sent pass2:" + pass2)

    try {
      const res = await fetch(`/api/register?email=${email}&email2=${email2}&pass=${pass}&pass2=${pass2}`);
      const result = await res.json();

      if (result.data === true) {
        console.log("registered");
        router.push('/'); // Redirect to the homepage after successful registration
      } else {
        console.log("registration failed");
        // Handle failure case (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };


  
  const theme = createTheme({
    palette: {
     
      secondary: {
        main: green[500],
      },
    },
  });
  



  
  return (
    <ThemeProvider theme={theme}>
    <Container component="main"  maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          
        </Avatar>
        <Typography component="h1" variant="h5">
        Register
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
            id="email2"
            label="Email Address"
            name="email2"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Pass"
            type="pass"
            id="pass"
            autoComplete="current-password"
          />
            <TextField
            margin="normal"
            required
            fullWidth
            name="pass2"
            label="Pass"
            type="pass"
            id="pass2"
            autoComplete="current-password"
          />

         
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
           Register
          </Button>




        </Box>
      </Box>

    </Container>

    </ThemeProvider>

  );
}
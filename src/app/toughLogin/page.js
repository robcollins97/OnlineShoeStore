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

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

import Script from 'next/script'






export default function Page() {


  function onloadCallback() {
    alert("grecaptcha is ready!");
  };

  /*
  This function does the actual work
  calling the fetch to get things from the database.
  */ 
  async function runDBCallAsync(url, newurl) {


    const res = await fetch(newurl);
    const data = await res.json();

console.log(data)
 
  }


  /*

  When the button is clicked, this is the event that is fired.
  The first thing we need to do is prevent the default refresh of the page.
  */
  function onSubmit(token) {
console.log(token)
  }

	const handleSubmit = (event) => {
		
		console.log("handling submit");


    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let resp = data.get('g-recaptcha-response');

   let newurl = ('https://www.google.com/recaptcha/api/siteverify?secret=SECRET_KEY&response='+resp);

 



    let email = data.get('email')
		let pass = data.get('pass')
		let dob = data.get('dob')
    console.log("Sent email:" + email)
    console.log("Sent pass:" + pass)
    console.log("Sent dob:" + dob)


    runDBCallAsync(`api/register?email=${email}&pass=${pass}&dob=${dob}`, newurl)




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
            name="dob"
            label="dob"
            type="text"
            id="dob"
            autoComplete=""
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

<div  className="g-recaptcha" data-sitekey="6LdRBRYpAAAAAL7aly5-qD0OQvsN13H5bUzwYATA"></div>


          <Button 
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
           Register
          </Button>




          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

    </Container>
    <Script src="https://www.google.com/recaptcha/api.js"/>
    </ThemeProvider>

  );
}
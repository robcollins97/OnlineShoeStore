'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { green } from '@mui/material/colors';
import CardMedia from '@mui/material/CardMedia';
import { signOut, useSession } from 'next-auth/react'; // Import signOut and useSession
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Page() {
  const [data, setData] = useState(null);
  const [weather, setWeatherData] = useState(null);
  const { status } = useSession(); // Get session status
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetch("/api/getProducts")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching products:", err));

    fetch("/api/getWeather")
      .then((res) => res.json())
      .then(setWeatherData)
      .catch((err) => console.error("Error fetching weather:", err));

    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login page if not authenticated
    }
  }, [status, router]);

  const theme = createTheme({
    palette: {
      secondary: {
        main: green[500],
      },
    },
  });

  const putInCart = async (pname, price, image) => {
    try {
      const res = await fetch('/api/putInCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pname, price, image }), // Include price and image
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error("Failed to add to cart:", result.error);
      } else {
        console.log("Cart updated:", result.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  if (!data || !weather || status === 'loading') return <p>Loading...</p>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Shoe Store</Typography>
          <div>
            <Button color="inherit" href="/mens">Men's</Button>
            <Button color="inherit" href="/womens">Women's</Button>
            <Button color="inherit" href="/kids">Kids'</Button>
            <Button color="inherit" href="/cart">View My Cart</Button>
            <Button color="inherit" href="/profile">Profile</Button>
            <Button color="inherit" onClick={() => signOut({ redirect: '/' })}>Sign Out</Button> {/* Logout Button */}
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Today's Temperature: {weather.temp}°C
        </Typography>

        <Grid container spacing={3}>
          {data.map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card elevation={3}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image} // this assumes the field is called 'image'
                  alt={item.pname}
                  onError={(e) => e.target.style.display = 'none'}  // Hide image if missing
                />
                <CardContent>
                  <Typography variant="h6">{item.pname}</Typography>
                  <Typography color="text.secondary">€{item.price}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {item._id}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => putInCart(item.pname,item.price,item.image)} variant="contained" size="small">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
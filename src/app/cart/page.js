'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useSession } from 'next-auth/react'; // Import useSession
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const { data: session } = useSession(); // Use useSession to get the user's session

  useEffect(() => {
    if (session?.user?.email) {
      // Fetch cart items for the logged-in user
      fetch(`/api/getCart?email=${session.user.email}`) // Use email
        .then((res) => res.json())
        .then((data) => {
          setCartItems(data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, [session]);

  const theme = createTheme({
    palette: {
      secondary: {
        main: green[500],
      },
    },
  });

  const handleRemoveFromCart = async (pname) => {
    try {
      const res = await fetch('/api/removeFromCart', {
        method: 'POST', // Or 'DELETE', depending on your API route
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pname }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }

      const data = await res.json();
      console.log(data.message); // Log success message

      // Update the cartItems state to reflect the removal
      setCartItems(prevItems =>
        prevItems.filter(item => item.pname !== pname)
      );

    } catch (error) {
      console.error('Error removing item from cart:', error);
      //  Show error message to the user (e.g., using a Snackbar)
    }
  };

  if (!session) {
    return (
      <Container component="main" maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Please log in to view your cart.
        </Typography>
      </Container>
    );
  }

  if (!cartItems) {
    return (
      <Container component="main" maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Loading your cart...
        </Typography>
      </Container>
    );
  }

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


      <Container component="main" maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Items in Your Cart
        </Typography>
        <Grid container spacing={4}>
          {cartItems.length > 0 ? (
            cartItems.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card elevation={3}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image || '/placeholder.png'}
                    alt={item.pname}
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.pname}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    {item.price && (
                      <Typography variant="body2" color="text.secondary">
                        Price: ${item.price*item.quantity}
                      </Typography>
                    )}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => handleRemoveFromCart(item.pname)} // Call handleRemoveFromCart
                      >
                        Remove
                      </Button>
                      <Button variant="contained" color="secondary" fullWidth>
                        Checkout
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" align="center" color="text.secondary">
              Your cart is empty. Add some products to your cart!
            </Typography>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
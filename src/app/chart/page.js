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
import { useState, useEffect } from 'react'


function go(d){

	
    const ctx = document.getElementById('myChart');

    let xx = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: d,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    });


}



export default function Page() {


  





  
  const theme = createTheme({
    palette: {
     
      secondary: {
        main: green[500],
      },
    },
  });
  
	

  const [data, setData] = useState(null)

 
  useEffect(() => {
    fetch('http://localhost:3000/api/getChartData')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("Returned data")
        console.log(data);
      })
  }, [])
 

  if (!data) return <p>No data</p>


  
  return (
    <ThemeProvider theme={theme}>
  
	  
	  <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload"
        onLoad={() =>go(data)
	
	
	
        }//onload
      />
	
	  <div>
        <canvas id="myChart"></canvas>
    </div>
	  

	  
    </ThemeProvider>

  );
}



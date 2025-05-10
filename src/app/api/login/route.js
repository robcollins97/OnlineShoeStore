import { NextResponse } from 'next/server';  // Import NextResponse

export async function POST(req, res) {
  console.log("in the api page");

  // Extract email and password from the request body
  const { email, password } = await req.json();  // Assuming the request is JSON formatted

  console.log("Received email:", email);
  console.log("Received password:", password);

  const { MongoClient } = require('mongodb');
  const url = "mongodb://admin:pass@localhost:27017/?authSource=admin";
  const client = new MongoClient(url);
  
  const dbName = 'ShoeStoreDB';  // Database name

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('login');  // Collection name

  // Check for the provided email in the database
  const findResult = await collection.find({ "username": email }).toArray();  // Matching username with email
  console.log('Found documents =>', findResult);

  let valid = false;
  if (findResult.length > 0 && findResult[0].pass === password) {  // Check if password matches
      valid = true;
      console.log("Login valid");
  } else {
      console.log("Login invalid");

  }

  // Send a response indicating if login was successful
  return NextResponse.json({ success: valid });
}

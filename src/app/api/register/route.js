import { MongoClient } from 'mongodb';

export async function GET(req, res) {
  console.log("In the API page");

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const email2 = searchParams.get('email2');
  const pass = searchParams.get('pass');
  const pass2 = searchParams.get('pass2');
 

  console.log(email, email2, pass, pass2);

  const url = "mongodb://admin:pass@localhost:27017/?authSource=admin";
  const client = new MongoClient(url);
  const dbName = 'ShoeStoreDB';

  let valid = false; // Declare valid before using it

  try {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('login');

    if (email === email2 && pass === pass2) {
      const insertResult = await collection.insertOne({
        username: email,
        pass: pass,
      
      });

      console.log('Insert Result:', insertResult);
      valid = true;
    } else {
      console.log('Emails or passwords do not match');
    }

    return new Response(JSON.stringify({ data: valid }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close(); // Close DB connection to prevent memory leaks
  }
}


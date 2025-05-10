import { MongoClient } from 'mongodb';

export async function GET(req) {
  try {
    console.log("In the API page");

    const url = "mongodb://admin:pass@localhost:27017/?authSource=admin";
    const client = new MongoClient(url);

    const dbName = 'ShoeStoreDB'; // Database name
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('login'); // Collection name

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    // Close the connection after fetching data
    await client.close();

    return new Response(JSON.stringify(findResult), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching products:", error);

    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

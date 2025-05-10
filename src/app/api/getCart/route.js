import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(req) {
  try {
    console.log("in the api page - getCart");

    const url = "mongodb://admin:pass@localhost:27017/?authSource=admin";
    const client = new MongoClient(url);
    const dbName = 'ShoeStoreDB';

    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    const cartCollection = db.collection('shopping_cart');

    const session = await getServerSession();

    if (!session?.user?.email) {
      await client.close();
      return NextResponse.json({ error: "Unauthorized. Missing or invalid session." }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("Fetching cart for user:", userEmail); // Add this line for debugging

    const cartItems = await cartCollection.find({ username: userEmail }).toArray();

    await client.close();

    console.log("Cart items:", cartItems); // Add this line for debugging

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
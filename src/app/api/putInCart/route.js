import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    console.log("in the api page - putInCart");

    const url = "mongodb://admin:pass@localhost:27017/?authSource=admin";
    const client = new MongoClient(url);
    const dbName = 'ShoeStoreDB';

    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    const cartCollection = db.collection('shopping_cart');

    // Get user from session
    const session = await getServerSession();
    if (!session?.user?.email) {
      await client.close();
      return NextResponse.json({ error: "Unauthorized. Missing or invalid session." }, { status: 401 });
    }
    const userEmail = session.user.email;

    // Get data from the request body.  Now getting price and image.
    const { pname, price, image } = await req.json();

    if (!pname) {
      await client.close();
      return NextResponse.json({ error: "Product name (pname) is required" }, { status: 400 });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await cartCollection.findOne({
      username: userEmail,
      pname: pname,
    });

    if (existingCartItem) {
      // If the product is in the cart, increment the quantity
      const result = await cartCollection.updateOne(
        { username: userEmail, pname: pname },
        { $inc: { quantity: 1 } }
      );
      console.log("Quantity incremented", result);
      await client.close();
      return NextResponse.json({ message: "Quantity updated" }, { status: 200 });
    } else {
      // If the product is not in the cart, add it with quantity 1, price, and image
      const result = await cartCollection.insertOne({
        username: userEmail,
        pname: pname,
        quantity: 1,
        price: price, // Store price
        image: image, // Store image URL
      });
      console.log("Product added to cart", result);
      await client.close();
      return NextResponse.json({ message: "Product added to cart" }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req) { // Use POST for consistency, or DELETE if preferred
  try {
    console.log("in the api page - removeFromCart");

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

    // Get data from the request body.  Get product name to remove.
    const { pname } = await req.json();

    if (!pname) {
      await client.close();
      return NextResponse.json({ error: "Product name (pname) is required" }, { status: 400 });
    }

    // Check if the product is in the user's cart
    const existingCartItem = await cartCollection.findOne({
      username: userEmail,
      pname: pname,
    });

    if (!existingCartItem) {
      await client.close();
      return NextResponse.json({ error: "Product not found in cart" }, { status: 404 });
    }

    // Product is in the cart.  We have two scenarios:
    // 1. Quantity is greater than 1:  Decrement quantity.
    // 2. Quantity is 1:  Remove the item from the cart.
    if (existingCartItem.quantity > 1) {
      const result = await cartCollection.updateOne(
        { username: userEmail, pname: pname },
        { $inc: { quantity: -1 } } // Decrement quantity
      );
      console.log("Quantity decremented", result);
      await client.close();
      return NextResponse.json({ message: "Quantity decremented" }, { status: 200 });
    } else {
      const result = await cartCollection.deleteOne({  // Remove item
        username: userEmail,
        pname: pname,
      });
      console.log("Product removed from cart", result);
      await client.close();
      return NextResponse.json({ message: "Product removed from cart" }, { status: 200 });
    }


  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}
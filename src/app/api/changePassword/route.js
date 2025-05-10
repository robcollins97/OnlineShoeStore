import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next'; // Corrected import

const uri = "mongodb://admin:pass@localhost:27017/?authSource=admin";
const client = new MongoClient(uri);
const dbName = 'ShoeStoreDB';

export const POST = async (req) => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login');
    const session = await getServerSession({ req }); // Corrected usage of getServerSession

    if (!session?.user?.email) {
      await client.close();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { newPassword, confirmPassword } = body;
    console.log('newPassword:', newPassword);
    console.log('confirmedPassword:', confirmPassword);

    if (!newPassword||!confirmPassword) {
      await client.close();
      return NextResponse.json({ error: "Both new password and confirmed password required" }, { status: 400 });
    }

    // Verify that the currentEmail matches the user's email.
    if (newPassword !== confirmPassword) {
        await client.close();
        return NextResponse.json({ error: "Passwords dont match" }, { status: 401 });
    }


    const updateResult = await collection.updateOne(
      { username: session.user.email }, // Use currentEmail to identify the user
      { $set: { pass: newPassword } } // Update the username (which stores the email)
    );

    console.log('Update Result:', updateResult);

    if (updateResult.modifiedCount === 0) {
      await client.close();
      return NextResponse.json({ error: 'Password not changed. User not found or email is the same.' }, { status: 404 });
    }

    await client.close();
    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    await client.close();
    return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
  } 
};
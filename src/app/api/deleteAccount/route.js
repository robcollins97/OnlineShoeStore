import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

const uri = "mongodb://admin:pass@localhost:27017/?authSource=admin";
const client = new MongoClient(uri);
const dbName = 'ShoeStoreDB';

export const DELETE = async (req) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB for account deletion');
    const db = client.db(dbName);
    const collection = db.collection('login');
    const session = await getServerSession({ req });

    if (!session?.user?.email) {
      await client.close();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleteResult = await collection.deleteOne({ username: session.user.email });

    console.log('Delete Result:', deleteResult);

    if (deleteResult.deletedCount === 0) {
      await client.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await client.close();
    return NextResponse.json({ message: 'Profile deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database error during deletion:', error);
    await client.close();
    return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
  }
};

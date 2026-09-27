import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

// Fix for Node SRV lookup issues on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('Testing connection to MongoDB...');
console.log('URI:', process.env.MONGODB_URI);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connection successful!');
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Connection error:', err);
}

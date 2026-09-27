import app, { connectDB } from '../server/app.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB Connect Error:', err);
  }
  return app(req, res);
}

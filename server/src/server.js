import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await prisma.$connect();
    console.log(' Connected to DB');
  } catch (err) {
    console.error('DB connection error:', err);
  }
});

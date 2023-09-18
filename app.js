const express = require('express')
require('dotenv').config()
require('express-async-errors')
const fileUpload = require('express-fileupload');
const redis = require('redis');
const client = redis.createClient();







const app = express()


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json())





const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/authentication')
const authroute = require('./routes/auth')
const booksCatalogue = require('./routes/bookCatalogue')
const getUser = require('./routes/user')
const Book = require('./models/booksCatalogue')
const { cacheMiddleware } = require('./middleware/redisCache');
const books = require('./bookSeed')

const cacheBooks = cacheMiddleware('books')


app.use(fileUpload({ useTempFiles: true }));
app.use('/api/v1', authroute)
app.use('/api/v1/bookstore',cacheBooks, authMiddleware, booksCatalogue)
app.use('/api/v1/getuser', authMiddleware, getUser)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



async function seedDatabase() {
    try {
      
      await Book.deleteMany();
  
      
      await Book.insertMany(books);
  
      console.log('Database seeded successfully.');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }



client.on('error', (err) => {
    console.error('Redis error:', err);
  });



const port = process.env.PORT || 3002;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await seedDatabase();
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;





















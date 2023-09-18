const booksCatalogue = require('../models/booksCatalogue')
const User = require('../models/auth')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { performance } = require('perf_hooks');
const redis = require('redis');
const client = redis.createClient();
const cacheMiddleware = require('../middleware/redisCache'); 








const CreateBook = async (req, res) => {

    req.body.createdBy = req.user.userId
    const book = await booksCatalogue.create({...req.body})

    res.status(StatusCodes.CREATED).json({book})
}

const getAllBooks = async (req, res) => {

    const startTime = performance.now()
    const page = parseInt(req.query.page) || 1; 
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; 
  
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
  
    const totalBooks = await booksCatalogue.countDocuments();
  
    const books = await booksCatalogue.find({})
      .sort({ createdAt: -1 }) 
      .skip(startIndex)
      .limit(itemsPerPage)
      .lean()

      const endTime = performance.now()

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBooks / itemsPerPage),
    };
    
    const executionTime = endTime - startTime


    console.log(executionTime);

    client.setex('books', 3600, JSON.stringify(books));

    res.status(StatusCodes.OK).json({ books, pagination, executionTime });
  };
  
  
 

  const searchBooks = async (req, res) => {
      const startTime = performance.now();
      const { title } = req.query;
  
      if (!title) {
          throw new BadRequestError('Please provide a title');
      }
  
      
      const cacheKey = 'search_' + title;
  
      
      cacheMiddleware(cacheKey)(req, res, async () => {
          const book = await booksCatalogue.find({ title: { $regex: title, $options: 'i' } });
  
          if (book.length === 0) {
              throw new NotFoundError('No book found with that name');
          }
  
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          console.log(executionTime);
  
          return res.status(StatusCodes.OK).json({ book });
      });
  };
  









module.exports = {CreateBook, getAllBooks, searchBooks}
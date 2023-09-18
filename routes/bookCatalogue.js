const express = require('express')


const router = express.Router()

const {CreateBook, getAllBooks, searchBooks} = require('../controllers/bookStore')




router.route('/').post(CreateBook).get(getAllBooks)
router.route('/search').get(searchBooks)









module.exports = router
const User = require('../models/auth')
const booksCatalogue = require('../models/booksCatalogue')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')



const getUser = async (req,res) => {

    const getCurrentUser = req.user.userId

    const {getCurrentUser:userId} = req


    const foundUser = await User.find({userId}).select('-password')

    if (!foundUser) {
        throw new NotFoundError('No user found')
    }

    return res.status(StatusCodes.OK).json({user: foundUser})

}

module.exports = {getUser}
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

// register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    const checkIfUserExists = await User.findOne({
      $or: [{ username: username }, { email: email }]
    })

    if (checkIfUserExists) {
      return res.status(400).json({
        success: true,
        message: 'This User already exists in DB. Please login'
      })
    }

    const saltRounds = 10

    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hash,
      role: role || 'user'
    })

    await newUser.save()

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: 'User registered succesfully!!'
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unable to register User.'
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: 'Some error occured.'
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const currUser = await User.findOne({ username })

    if (!currUser) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    const isCorrect = await bcrypt.compare(password, currUser.password)

    if (isCorrect) {
      const payload = {
        _id: currUser._id,
        username: currUser.username,
        role: currUser.role
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '30m'
      })

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: currUser,
        token
      })
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      success: false,
      message: 'Server error'
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword
    const newPassowrd = req.body.newPassword

    const userId = req.userInfo._id
    const currUser = await User.findById(userId)
    const isCorrect = await bcrypt.compare(oldPassword, currUser.password)

    if (!isCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      })
    }

    const saltRounds = 10

    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(newPassowrd, salt)
    await User.findByIdAndUpdate(userId, { password: hash })

    return res.status(201).json({
      success: true,
      message: 'Password changed Successfully!!'
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = { registerUser, loginUser, changePassword }

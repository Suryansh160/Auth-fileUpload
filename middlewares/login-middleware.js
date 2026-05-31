const jwt = require('jsonwebtoken')

const loginMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not found. Please provide a token first'
    })
  }

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.userInfo = decoded
    next()
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: 'Please login first'
    })
  }
}

module.exports = loginMiddleware

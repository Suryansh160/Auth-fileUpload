const adminMiddleware = (req, res, next) => {
  if (req.userInfo.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to admins'
    })
  }

  next()
}

module.exports = adminMiddleware

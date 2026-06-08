require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectToDB = require('./database/db')
const authRoutes = require('./routes/auth-routes')
const adminRoutes = require('./routes/admin-routes')
const userRoutes = require('./routes/user-routes')
const fileRoutes = require('./routes/file-routes')

const app = express()
const PORT = process.env.PORT || 3000

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening to PORT ${PORT}`)
  })
})

// very important middleware
app.use(express.json())
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://auth-fileupload.onrender.com'
    ],
    credentials: true
  })
)

app.use('/api/auth', authRoutes)
app.use('/api', adminRoutes)
app.use('/api', userRoutes)
app.use('/api', fileRoutes)

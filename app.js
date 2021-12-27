const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const chalk = require('chalk')

dotenv.config({ path: './dev.env' })

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

console.log('====================================================================')
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('PORT', process.env.PORT)
console.log('MONGODB_URL', process.env.MONGODB_URL)
console.log('====================================================================')

require('./db/mongodb')

const router = require('./version')
app.use(router)

app.listen(process.env.PORT, () => {
  console.log(chalk.green(`Server is running at port: ${process.env.PORT}`))
})

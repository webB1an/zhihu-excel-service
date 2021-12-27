const express = require('express')
const router = express.Router()

const keyboard = require('../routes/keyboard')

router.use('/keyboard', keyboard)

module.exports = router

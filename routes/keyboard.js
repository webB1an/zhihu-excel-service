const express = require('express')
const router = express.Router()

const keyboardModel = require('../models/keyboard')

const output = require('../utils/output')

router.post('/list', async(req, res, next) => {
  const { id = '', name = '', switchs = '', light = '', connect = 6, minPrice = 0, maxPrice = 4000, minKeys = 0, maxKeys = 108 } = req.body
  let options

  if (id) {
    options = { id }
  } else {
    options = { price: { '$gte': minPrice, '$lte': maxPrice }, keys: { '$gte': minKeys, '$lte': maxKeys }}

    if (name) {
      const reg = new RegExp(name)
      options = { ...options, name: { $regex: reg }}
    }

    if (switchs) {
      options = { ...options, switchs }
    }

    if (light) {
      options = { ...options, light }
    }

    if (connect !== 6) {
      options = { ...options, connect }
    }
  }

  console.log('---------------search options---------------', options)

  const result = await keyboardModel.find(options, { _id: 0, __v: 0, createTime: 0, updateTime: 0 }).sort({ price: 1 })

  output({
    status: 200,
    code: 0,
    data: result,
    msg: '数据获取成功！'
  })(req, res, next)
})

router.post('/save', async(req, res, next) => {
  const { name, price, switchs, keys, light, connect, describe, url } = req.body
  console.log('---------------req.body---------------', req.body)
  const keyboard = await keyboardModel.find({ name })

  if (keyboard.length) {
    output({
      status: 200,
      code: 1,
      msg: '该键盘已存在！'
    })(req, res, next)
  } else {
    await keyboardModel.insertMany([
      { name, price, switchs, keys, light, connect, describe, url }
    ])
    output({
      status: 200,
      code: 0,
      data: [],
      msg: '数据保存成功！'
    })(req, res, next)
  }
})

router.post('/detail', async(req, res, next) => {
  const { id = '' } = req.body
  console.log('---------------req.body---------------', req.body)

  if (!id) {
    output({
      status: 200,
      code: 1,
      data: [],
      msg: '参数不正确！'
    })(req, res, next)
  }

  const result = await keyboardModel.find({ id })

  output({
    status: 200,
    code: 0,
    data: result,
    msg: '数据保存成功！'
  })(req, res, next)
})

router.post('/editor', async(req, res, next) => {
  const {
    id = '',
    name = '',
    price = '',
    switchs = '',
    keys = '',
    connect = 0,
    light = '',
    describe = '',
    url = ''
  } = req.body

  console.log('---------------req.body---------------', req.body)

  if (!id) {
    output({
      status: 200,
      code: 1,
      data: [],
      msg: '参数不正确！'
    })(req, res, next)
  } else {
    await keyboardModel.updateOne({ id }, {
      $set: {
        name,
        price,
        switchs,
        keys,
        connect,
        light,
        describe,
        url
      }
    })

    output({
      status: 200,
      code: 0,
      data: [],
      msg: '数据修改成功！'
    })(req, res, next)
  }
})

router.post('/add', async(req, res, next) => {
  const {
    name = '',
    price = '',
    switchs = '',
    keys = '',
    connect = 0,
    light = '',
    describe = '',
    url = ''
  } = req.body

  console.log('---------------req.body---------------', req.body)

  await keyboardModel.insertMany([
    {
      name,
      price,
      switchs,
      keys,
      connect,
      light,
      describe,
      url
    }
  ])

  output({
    status: 200,
    code: 0,
    data: [],
    msg: '数据保存成功！'
  })(req, res, next)
})

module.exports = router


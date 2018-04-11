#! /usr/bin/env node
const path = require('path')

require('dotenv').config({path: path.resolve(__dirname, '.env')})

require = require('esm')(module/*, options*/)

module.exports = require('./main.js').default

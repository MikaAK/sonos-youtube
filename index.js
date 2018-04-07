#! /usr/bin/env node

require = require('esm')(module/*, options*/)
require('dotenv').load()

module.exports = require('./main.js').default

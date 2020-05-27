const express = require('express');
const books = require('../routes/books')
const authors = require('../routes/authors')
const error = require('./error')

module.exports = function(app) {
    app.use(express.json())
    app.use('/api/authors', authors)
    app.use('/api/books', books)
    app.use(error)
}
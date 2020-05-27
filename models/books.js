const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const { authorsSchema } = require('./authors')

const booksSchema = new mongoose.Schema({
    naziv: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 64
    },
    datum_objave: {
        type: Date,
        required: true
    },
    cijena: {
        type: Number, 
        min: 0,
        max: 10000
    },
    broj_stranica: {
        type: Number, 
        min: 0,
        max: 10000
    },
    authors: {
        type: authorsSchema,
        required: true
    }
})

const Books = mongoose.model('books', booksSchema)

function validateBooks(Books) {
    const schema = {
        naziv: Joi.string().min(3).max(64).required(),
        datum_objave: Joi.date(),
        cijena: Joi.number().min(0).max(10000),
        broj_stranica: Joi.number().min(1000).max(3000),
        authors: Joi.objectId().required()
    }
    return Joi.validate(Books, schema)
}

exports.Books = Books
exports.validateBooks = validateBooks
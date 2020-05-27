const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const authorsSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 64
    },
    prezime: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 64
    },
    broj_dijela: {
        type: String, 
        min: 0,
        required: true
    }
})

const Authors = mongoose.model('authors', authorsSchema)

function validateAuthors(Authors) {
    const schema = {
        ime: Joi.string().min(3).max(64).required(),
        prezime: Joi.string().min(3).max(64).required(),
        broj_dijela: Joi.string().min(0).required()
    }
    return Joi.validate(Authors, schema)
}

exports.authorsSchema = authorsSchema
exports.Authors = Authors
exports.validateAuthors = validateAuthors
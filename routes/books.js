const {Books, validateBooks} = require('../models/books')
const {Authors} = require('../models/authors')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validateBooks(req.body)
    if (error) return res.status(400).send({
        "data": error.details[0].message,
        "status": "Failure"
    })

    const authors = await Authors.findById(req.body.authors_id)
    if (!authors) return res.status(400).send({
        "data": 'There is no author with given autor_id',
        "status": "Failure"
    })

    let books = new Employee({ 
        naziv: req.body.naziv,
        datum_objave: req.body.datum_objave,
        cijena: req.body.cijena,
        broj_stranica: req.body.broj_stranica,
        autor: {
            _id: autor._id,
            ime: autor.ime,
            prezime: autor.prezime,
            broj_dijela: autor.broj_dijela
        }
    })

    books = await books.save()
    return res.status(200).send({
        "data": books,
        "status": "Success"
    })
})

router.put('/:id', async (req, res) => {
    const { error } = validateBooks(req.body)
    if (error) return res.status(400).send({
        "data": error.details[0].message,
        "status": "Failure"
    })

    const authors = await Authors.findById(req.body.autor_id)
    if (!authors) return res.status(400).send({
        "data": 'There is no author with given autor_id',
        "status": "Failure"
    })


    const books = await Books.findByIdAndUpdate(req.params.id,
        { 
            naziv: req.body.naziv,
            datum_objave: req.body.datum_objave,
            cijena: req.body.cijena,
            broj_stranica: req.body.broj_stranica,
            autor: {
                _id: autor._id,
                ime: autor.ime,
                prezime: autor.prezime,
                broj_dijela: autor.broj_dijela
            }
        }, { new: true })

    if (!books) return res.status(404).send({
        "data": 'There is no books with given id',
        "status": "Failure"
    })
    
    return res.status(200).send({
        "data": books,
        "status": "Success"
    })
})

router.delete('/:id', async (req, res) => {
    const books = await Books.findByIdAndRemove(req.params.id)

    if (!books) return res.status(404).send({
        "data": 'There is no books with given id',
        "status": "Failure"
    })

    return res.status(200).send({
        "data": books,
        "status": "Success"
    })
})

router.get('/', async (req,res) => {
    authors = req.query.authors
    books = await Books.find(authors ? { 'autor._id': authors } : {}).sort('naziv')
    return res.send({
        "data": books,
        "status": "Success"
    })
})

module.exports = router 
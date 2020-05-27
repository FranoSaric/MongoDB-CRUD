const express = require('express')
const router = express.Router()

const { Authors, validateAuthors } = require('../models/authors')
const { Books } = require('../models/books')

router.post('/', async (req,res) => {
    const {error} = validateAuthors(req.body)
    if (error) return res.status(400).send({
        "data": error.details[0].message,
        "status": "Failure"
    })

    let authors = new Authors({
        ime: req.body.ime,
        prezime: req.body.prezime,
        broj_dijela: req.body.broj_dijela
    })

    authors = await authors.save()

    return res.status(200).send({
        "data": authors,
        "status": "Success"
    })
})

router.put('/:id', async (req, res) => {
    const { error } = validateAuthors(req.body)
    if (error) return res.status(400).send({
        "data": error.details[0].message,
        "status": "Failure"
    })
    
    updateFiels = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        broj_dijela: req.body.broj_dijela
    }

    const authors = await Authors.findByIdAndUpdate(req.params.id, updateFiels, {new:true})
    if (!authors) return res.status(404).send({
        "data": 'There is no authors with given id',
        "status": "Failure"
    })

    return res.status(200).send({
        "data": authors,
        "status": "Success"
    })
})

router.get('/', async (req,res) => {
    return res.status(200).send({
        "data": await Authors.find().sort('ime'),
        "status": "Success"
    })
})
  
router.delete('/:id', async (req, res) => {
    const postojiKnjigaSaOvimAutorom = await Books.findOne(
        { $or: [{'authors._id': req.params.id}]})
        
    if (postojiKnjigaSaOvimAutorom) return res.status(400).send({
        "data": 'Book exists with that author',
        "status": "Failure"
    })

    const authors = await Author.findByIdAndRemove(req.params.id)
    if (!authors) return res.status(404).send({
        "data": 'There is no author with given id',
        "status": "Failure"
    })

    return res.status(200).send({
        "data": authors,
        "status": "Success"
    })
})

module.exports = router
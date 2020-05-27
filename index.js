const express = require('express')

const app = express()


require('./startup/errorHandler')()
require('./startup/routes')(app)
require('./startup/db')
require('./startup/validation')()

const port = 3000
const server = app.listen(port, () => console.log(`Server is listening on port ${port}`))

module.exports = server
const express = require('express')
const app = express()

let persons = require('./db.json')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('root')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

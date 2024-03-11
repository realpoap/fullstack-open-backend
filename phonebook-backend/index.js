const express = require('express')
const app = express()

let persons = require('./db.json')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('root')
})

app.get('/info', (req, res) => {
    //enabling CORS (from stackoverflow)
    
    const nbrPersons = persons.length +1
    console.log(nbrPersons)
    // but how do you get the metadata from the req ?
    // need to enable CORS ?
    // this is driving me crazy... 

    //Do you mean we just need to create the timestamp ?
    //I've seen Data header is protected for the response and not reliable for the request
    //It's been 3h... I give up
    const date = Date(Date.now())
    console.log(date)
    

    res.send(`Phonebook has information on ${nbrPersons} persons.</br>Time of request : ${date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

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

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id);
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else { 
        res.status(404).end() 
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
    const id = Math.floor(Math.random()*10000)
    console.log(id)
    const person = req.body
    person.id = id
    console.log(req.body);

    if (person.name==='' || !person.number==='') {
        return (
            res.status(400).json({error: 'you must fill all info when creating a person contact'})
        )
    }

    if (persons.find(p => p.name === person.name)){
        return (
            res.status(400).json({error: 'name already used in Phonebook'})
        )
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

let persons = require('./db.json')

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

// ERROR HANDLER
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
      }
    next(error)
}

// ROUTES

app.get('/', (req, res) => {
    res.send('root')
})

app.use(morgan(':method :url :status :content - :response-time ms'))

app.get('/info', (req, res) => {
    const nbrPersons = persons.length +1
    const date = Date(Date.now())
    console.log(date)
    
    res.send(`Phonebook has information on ${nbrPersons} persons.</br>Time of request : ${date}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id);
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person).end()
    } else { 
        res.status(404).end() 
    }
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end() )
        .catch(err => next(err))
})

app.post('/api/persons/', (req, res) => {
    const body = req.body
    const person = new Person ({
        name: body.name,
        number: body.number,
    })

    if (person.name==='' || !person.number==='') {
        return (
            res.status(400).json({error: 'you must fill all info when creating a person contact'})
        )
    }

    person.save()
            .then(savedPerson => {
                res.json(savedPerson).end()
            })
            .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, {new:true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(err => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

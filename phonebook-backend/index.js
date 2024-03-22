require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

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
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    console.log('validation error in server console')
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

// ROUTES

app.get('/', (req, res) => {
  res.send('root')
})

app.use(morgan(':method :url :status :content - :response-time ms'))

app.get('/info', (req, res, next) => {
  const date = Date(Date.now())
  Person.countDocuments({})
    .then(count => res.send(`Phonebook has information on ${count} persons.</br>Time of request : ${date}`))
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end() )
    .catch(err => next(err))
})

app.post('/api/persons/', (req, res, next) => {
  const body = req.body
  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  if (person.name==='' || !person.number==='') {
    return (
      res.status(400).json({ error: 'you must fill all info when creating a person contact' })
    )
  }
  person.save()
    .then(savedPerson => {
      res.json(savedPerson).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(req.params.id,
    { name, number },
    { new:true, runValidators: true, context:'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

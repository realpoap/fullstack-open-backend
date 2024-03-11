const express = require('express')
const app = express()

let persons = require('./db.json')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('root')
})

app.get('/info', (req, res) => {
    const nbrPersons = persons.length +1
    console.log(nbrPersons)
    // but how do you get the metadata from the response ?
    res.send(`Phonebook has information on ${nbrPersons} persons.</br>Time of request : `)
    
    if (res.headersSent) {
        console.log('in if statement');
        (async() => {
            try {
                await (res.hasHeader('Date'))
                console.log('has Date')
                const headers = res.getHeaders()
                console.log(JSON.stringify(headers))
                // WTF ? how is this possible
            } catch (err) {
                console.log(err);
            } 
        })()
        
    } else {console.log(`No header`);}  
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

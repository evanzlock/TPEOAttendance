
const getMembers = require('./services/notion')
const getForms = require('./services/forms')
const express = require('express')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static('public'))
app.get('/members', async (req, res) => {
    const members = await getMembers()
    res.json(members)
})
app.get('/forms', async (req, res) => {
    const forms = await getForms()
    res.json(forms)
})
app.listen(PORT, console.log(`Server started on port ${PORT}`))

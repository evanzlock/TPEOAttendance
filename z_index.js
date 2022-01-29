const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const express = require('express')
const PORT = process.env.PORT || 5000


const app = express()

//middlewear
app.use(express.static('public'))

app.get('/members', async (req, res) => {
    const members = await getMembers()
    res.json(members)
})
app.get('/forms', async (req, res) => {
    const forms = await getForms()
    res.json(forms)
})
app.get('/absences', async (req,res) => {
    const absences = await getAbsenceForms();
    res.json(absences);
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))



const updateMembersData = async () => {
    //TODO: MAKE MORE EFFICIENT- should only do this computation 
    //once and figure out how to store it
    const absences = await getAbsenceForms();
    const present = await getForms();

    constAbsencesSet = new Set();
    for (var i = 0; i < absences.length; i++) {
        var obj = absences[i];
        if (obj != undefined) {
            constAbsencesSet.add(obj.name);
        }
    }
    console.log(constAbsencesSet);
    constPresentSet = new Set();
    for (var i = 0; i < present.length; i++) {
        var obj = present[i];
        if (obj != undefined) {
            constPresentSet.add(obj.name);
        }
    }
    console.log(constPresentSet);

    const members = await getMembers();
    for (var i = 0; i < members.length; i++) {
        var obj = members[i];
        if (obj != undefined) {
            if (constPresentSet.has(obj.name)) {
                console.log("present " + obj.name);
                //TODO: update members data base with 1 more meeting attended
            } 
            else if (constAbsencesSet.has(obj.name)) {
                console.log("excused " + obj.name);
                //TODO: update members data base with 1 more excused absence
            } else {
                console.log("unexcused " + obj.name);
                //TODO: update members data base with 1 more unexcused absence
            }
            
        }
    }

}

updateMembersData();
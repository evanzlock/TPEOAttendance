const { Client } = require('@notionhq/client')
const dotenv = require('dotenv').config()
const notion = new Client({ auth: process.env.NOTION_TOKEN_ABSENCES, })

const databaseMemberId = process.env.NOTION_DATABASE_MEMBER

const databaseFormId = process.env.NOTION_DATABASE_FORM
const databaseAbscencesId = process.env.NOTION_DATABASE_ABSENCES

//variables that will be sent in from frontend (hardcoded for now)
<<<<<<< HEAD
=======
var meetingNumber = 1;
var meetingType = "Engineering";

>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
const notionAbsences = new Client({
    auth: process.env.NOTION_TOKEN_ABSENCES,
})



<<<<<<< HEAD
module.exports = async function getAbsenceForms(meetingNumber, meetingType) {
=======
module.exports = async function getAbsenceForms(meetingNumber, meetingType, password) {
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
    const payload = {
        path: `databases/${databaseAbscencesId}/query`,
        method: 'POST'
    }
    const { results } = await notionAbsences.request(payload);

    const absences = results.map(page => {
        if (page.properties['Meeting Number'].number === meetingNumber
            && page.properties['Type of Meeting'].multi_select[0].name === meetingType) {
            return {
                name: page.properties.Name.title[0].text.content,
                meetingN: page.properties['Meeting Number'].number,
                meetingType: page.properties['Type of Meeting'].multi_select[0].name
            }

        }
    })
    return absences;
}

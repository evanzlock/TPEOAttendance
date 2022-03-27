const { Client } = require('@notionhq/client')
const dotenv = require('dotenv').config()
const notion = new Client({ auth: process.env.NOTION_KEY, })

const databaseFormId = process.env.NOTION_DATABASE_FORM



module.exports = async function getForms(meetingNumber, meetingType, password) {
    const payload = {
        path: `databases/${databaseFormId}/query`,
        method: 'POST'
    }
    const { results } = await notion.request(payload)
    //console.log(results)
    const forms = results.map(page => {
        //parses through the form records
        //only returns the forms that have the correct meeting type/number and code
        if (page.properties['Meeting Number'].number === meetingNumber
            && page.properties['Type of Meeting'].multi_select[0].name === meetingType
            && page.properties['Code Submitted'].rich_text[0].text.content === password) {
            return {
                name: page.properties.Name.title[0].text.content,
                code: page.properties['Code Submitted'].rich_text[0].text.content
            }
        }

    })
    return forms
}

const { Client } = require('@notionhq/client')
const dotenv = require('dotenv').config()
const notion = new Client({ auth: process.env.NOTION_KEY, })

const databaseMemberId = process.env.NOTION_DATABASE_MEMBER

const databaseFormId = process.env.NOTION_DATABASE_FORM


module.exports = async function getForms() {
    const payload = {
        path: `databases/${databaseFormId}/query`,
        method: 'POST'
    }
    const { results } = await notion.request(payload)

    const forms = results.map(page => {
        console.log(page.properties.Name.title)

        return {
            name: page.properties.Name.title[0].text.content,
            code: page.properties['Code Submitted'].rich_text[0].text.content
        }
    })
    return forms
}
module.exports = async function getMembers() {
    const payload = {
        path: `databases/${databaseMemberId}/query`,
        method: 'POST'
    }

    const { results } = await notion.request(payload)
    //console.log(results);

    const members = results.map(page => {
        console.log(page.properties['First Year'].checkbox)
        //console.log(page.properties.Team.multi_select[0].name)

        return {
            name: page.properties.Name.title[0].text.content,
            team: page.properties.Team.multi_select[0].name,
            status: page.properties.Status.multi_select[0].name,
            new: page.properties['First Year'].checkbox,
            excused: page.properties['Excused Absences'].number,
            unexcused: page.properties['Unexcused Absences'].number,
            total: page.properties['Total Meetings Attended'].number,
        }
    })
    return members
}
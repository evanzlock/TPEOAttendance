const dotenv = require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY, });
//database variables
const databaseMemberId = process.env.NOTION_DATABASE_MEMBER
const databaseFormId = process.env.NOTION_DATABASE_FORM

module.exports = async function getForms() {
    const payload = {
        path: `databases/${databaseFormId}/query`,
        method: 'POST'
    }
    const { results } = await notion.request(payload)

    const forms = results.map(page => {
        //console.log(page.properties['Type of Meeting'].multi_select[0].name);
        //console.log(page.properties['Meeting Number'].number);

        return {
            name: page.properties.Name.title[0].text.content,
            code: page.properties['Code Submitted'].rich_text[0].text.content,
            meetingN: page.properties['Meeting Number'].number,
            meetingType: page.properties['Type of Meeting'].multi_select[0].name
        }
    })
    return forms
}

module.exports = async function getMembers() {
    const databaseMemberId = process.env.NOTION_DATABASE_MEMBER
    const payload = {
        path: `databases/${databaseMemberId}/query`,
        method: 'POST'
    }

    const { results } = await notion.request(payload)
    //console.log(results);

    const members = results.map(page => {
        //console.log(page);
        //console.log(page.properties.Team.multi_select[0].name)
        return {
            name: page.properties.Name.title[0].text.content,
            team: page.properties.Team.multi_select[0].name,
            status: page.properties.Status.multi_select[0].name,
            new: page.properties['First Year'].checkbox,
            excused: page.properties['Excused Absences'].number,
            unexcused: page.properties['Unexcused Absences'].number,
            total: page.properties['Total Meetings Attended'].number,
            pageid: page.id,
            checkedin: page.properties['Currently Checked-in'].checkbox
        }
    })
    return members
}










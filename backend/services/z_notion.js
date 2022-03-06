const dotenv = require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY, });
//console.log(process.env.NOTION_KEY);
//const credentials = require("./cred.json");
const cors = require("cors");
//database variables
const databaseMemberId = process.env.NOTION_DATABASE_MEMBER
const databaseFormId = process.env.NOTION_DATABASE_FORM

//setting up express server
const express = require('express');

const app = express();


//app.listen(process.env.PORT || 3000, console.log('Server is up and running!') );
// app.get("/", (req, res) => {
//     console.log("");
// });
// //change password status
// app.put("/code", (req, res) => {
//     const body = req.body;
//     password.status = !password.status;
//     password.code = req.body.code;
//     if(password.status)
//     {
//         return res.json({ msg: "Code generated", data: {} });
//     }
//     return res.json({msg: "Code disabled", data: {}});
// });
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
            pageid: page.id
        }
    })
    return members
}










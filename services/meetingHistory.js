const dotenv = require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_MEETINGHISTORY_TOKEN })

//database variables
const databaseId = process.env.NOTION_MEETINGHISTORY_ID


//setting up express server
const express = require('express');

const app = express( );

module.exports = async function getMeetingHistory() {
    const payload = {
        path: `databases/${databaseId}/query`,
        method: 'POST'
    }
    const { results } = await notion.request(payload)

    const history = results.map(page => {
        return {
            meetingType: page.properties.MeetingType.title[0].text.content,
            meetingNumber: page.properties['Meeting #'].number,
            numAttended: page.properties['Attended'].number,
            numAbsent: page.properties['# Unexcused Absences'].number,
            attendancePercent: page.properties['%'].formula.number,
            pageid: page.id
        }
    })
    return history
}







const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const getMeetingHistory = require('./services/meetingHistory');
const express = require('express')
const PORT = process.env.PORT || 5000
const router = express.Router();
const cors = require("cors");
const app = express();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY });
//middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.get('/members', async (req, res) => {
  const members = await getMembers()
  var type = req.query.type;
  if (type == 'General') {
    res.json(members);
  } else {
    const result = members.filter(x => x.team === type);
    res.json(result);
  }

})
app.get('/meetingHistory', async (req, res) => {
  const meetingHist = await getMeetingHistory();
  res.json(meetingHist);
})

app.get('/MeetingBarData', async (req, res) => {
  var type = req.query.type;
  const meetingHist = await getMeetingHistory();
  const result = meetingHist.filter(x => x.meetingType == type);
  result.sort(function (a, b) {
    return parseFloat(a.meetingNumber) - parseFloat(b.meetingNumber);
  });
  res.json(result);

})

app.get('/DonutData', async (req, res) => {
  var meetingType = req.query.type;
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
  }
  const response = await notion.pages.retrieve({ page_id: pageId });
  var lastMeetingNum = response.properties[meetingType + " Meeting Number"].number - 1;
  const meetingHist = await getMeetingHistory();
  const result = meetingHist.filter(x => x.meetingType === meetingType && x.meetingNumber == lastMeetingNum);
  res.json(result);
})

app.get('/BarChartHorizData', async (req, res) => {
  const meetingHist = await getMeetingHistory();
  //find most recent meeting for each
  const responseG = await notion.pages.retrieve({ page_id: process.env.NOTION_GENERAL_MEETING_INFO });
  var lastGen = responseG.properties["General Meeting Number"];
  const responseD = await notion.pages.retrieve({ page_id: process.env.NOTION_DESIGN_MEETING_INFO });
  var lastDes = responseD.properties["Design Meeting Number"];
  const responseP = await notion.pages.retrieve({ page_id: process.env.NOTION_PRODUCT_MEETING_INFO });
  var lastProd = responseP.properties["Product Meeting Number"];
  const responseE = await notion.pages.retrieve({ page_id: process.env.NOTION_ENGINEERING_MEETING_INFO });
  var lastEng = responseE.properties["Engineering Meeting Number"];
  var result = meetingHist.filter(x => (x.meetingType === 'Product' && x.meetingNumber == lastProd.number) || (x.meetingType === 'Engineering' && x.meetingNumber == lastEng.number) || (x.meetingType === 'General' && x.meetingNumber == lastGen.number) || (x.meetingType === 'Design' && x.meetingNumber == lastDes.number));
  result.sort(function (a, b) {
    return a.meetingType.localeCompare(b.meetingType);
  });
  res.json(result);

})
app.get('/meeting/:meetingType', async (req, res) => {
  const meetingType = req.params.meetingType
  var pageId = '';
  var propertyType = '';
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    propertyType = "General Meeting Number"
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    propertyType = "Product Meeting Number"
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    propertyType = "Design Meeting Number"
  }
  const response = await notion.pages.retrieve({ page_id: pageId });
  var activeMeeting = false;
  // is an empty array if manually deleted otherwise an empty string
  if (Date.now() < response.properties['End Time'].number) {
    activeMeeting = true;
  }
  let endTime = response.properties['End Time'].number
  let number = response.properties[propertyType].number
  return res.json({
    msg: "Home page opened",
    data: {
      activeMeeting,
      number,
      endTime
    }
  })
});

//cancel meeting
app.put('/cancel', async (req, res) => {
  const body = req.body
  var pageId = '';
  var propertyType = '';
  const meetingType = body.type
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    propertyType = "General Meeting Number"
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    propertyType = "Product Meeting Number"
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    propertyType = "Design Meeting Number"
  }
  const resp = await notion.pages.retrieve({ page_id: pageId });
  var meetingNum = resp.properties[meetingType + " Meeting Number"].number - 1;
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Code': {
        rich_text: [{
          text: {
            content: ''
          }
        }
        ]
      },
      'Start Time': {
        number: null
      },
      'End Time': {
        number: null
      },
      [propertyType]: {
        number: meetingNum
      }
    }
  });

  //resets everyone's unexcused absences to what it was prior to the meeting (subtract 1)
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      //ensures only general and team-specific meetings counted for attendance
      if (obj.team == meetingType || meetingType == 'General') {
        const pageId = obj.pageid;
        const response = await notion.pages.update({
          page_id: pageId,
          properties: {
            "Unexcused Absences": obj.unexcused - 1,
            "Currently Checked-in": false
          },
        });
      }
    }
  }

  //deletes this meeting from meetingHistory database
  const meetingHistory = await getMeetingHistory();
  for (var j = 0; j < meetingHistory.length; j++) {
    var entry = meetingHistory[j];
    if (entry.meetingType == meetingType && entry.meetingNumber == meetingNum) {
      //found the entry, delete it
      const notionMeeting = new Client({ auth: process.env.NOTION_MEETINGHISTORY_TOKEN });
      const response = await notionMeeting.pages.update({
        page_id: entry.pageid,
        //deletes the row
        archived: true
      });
    }
  }
  return res.json({
    msg: "Cancelled"
  })
});

//call when timer ends
app.put('/update', async (req, res) => {
  const body = req.body
  const meetingType = body.type
  var propertyType = '';
  var pageId = '';
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    propertyType = "General Meeting Number"
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    propertyType = "Product Meeting Number"
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    propertyType = "Design Meeting Number"
  }
  const retrieveInfo = await notion.pages.retrieve({ page_id: pageId });
  let meetingNumber = parseInt(retrieveInfo.properties[propertyType].number)
  let newMeetingNumber = meetingNumber + 1;
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Meeting Type': {
        select: meetingType
      },
      'Code': {
        rich_text: [{
          text: {
            content: ''
          },
          plain_text: ''
        }
        ]
      },
      'Start Time': {
        number: null
      },
      'End Time': {
        number: null
      },
      'General Meeting Number': {
        number: newMeetingNumber
      }
    }
  });
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      if (obj.team == meetingType || obj.team == 'General') {
        //update member attendance database
        const pageId = obj.pageid;
        const response = await notion.pages.update({
          page_id: pageId,
          properties: {
            "Currently Checked-in": false
          },
        });
      }
    }
  }
  return res.json({
    msg: "Meeting Ended and entries updated"
  })
});

//endpoint for receiving meeting info and updating database with it- essentially creates the meeting
app.post('/meeting', async (req, res) => {
  const body = req.body
  var meetingType = body.type;
  var pageId = '';
  var propertyType = '';
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    propertyType = "General Meeting Number"
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    propertyType = "Product Meeting Number"
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    propertyType = "Design Meeting Number"
  }
  const retrieveInfo = await notion.pages.retrieve({ page_id: pageId });
  let meetingNumber = parseInt(retrieveInfo.properties[propertyType].number)
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Code': {
        rich_text: [{
          text: {
            content: body.code
          },
        }
        ]
      },
      'Start Time': {
        number: body.startTime
      },
      'End Time': {
        number: body.endTime
      },
      [propertyType]: {
        number: meetingNumber + 1
      }
    },
  });
  //upon creating the meeting, sets everyone who should be present to this meeting absent
  //(they are changed to present when they check in- handled elsewhere)
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      if (obj.team == meetingType || obj.team == 'General') {
        const pageId = obj.pageid;
        const response = await notion.pages.update({
          page_id: pageId,
          properties: {
            "Unexcused Absences": obj.unexcused + 1,
            "Currently Checked-in": false
          },
        });
      }
    }

  }

  //create an entry for meetingHistory
  const notionMeeting = new Client({ auth: process.env.NOTION_MEETINGHISTORY_TOKEN });
  const numMembers = await getNumMembers(meetingType);
  notionMeeting.pages.create({
    parent: { database_id: process.env.NOTION_MEETINGHISTORY_ID },
    properties: {
      "title": [{ "text": { "content": meetingType } }],
      "Meeting #": meetingNumber,
      "Attended": 0,
      "# Unexcused Absences": numMembers,
    }
  });

  return res.json({
    msg: "Success",
    data: {
      body
    }
  });
})

//endpoint called when member checks-in to a meeting (upon clicking submit on the check-in form)
//name, meeting type, and code sent in from frontend (from the form)
app.post('/updateCheckin', async (req, res) => {
  const body = req.body
  const name = body.name
  const meetingType = body.type
  const code = body.code
  var pageId = "";
  var meetingNum = '';
  //check if the meeting type is active at this time
  if (meetingType == "Engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
  }
  else if (meetingType == "General") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
  }
  else if (meetingType == "Product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
  }
  else if (meetingType == "Design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
  }
  const response = await notion.pages.retrieve({ page_id: pageId });
  var activeMeeting = false;
  // is an empty array if manually deleted otherwise an empty string
  if (Date.now() < response.properties['End Time'].number) {
    meetingNum = response.properties[meetingType + " Meeting Number"];
    activeMeeting = true;
  }
  if (!activeMeeting) {
    return res.json({ msg: 'Meeting is not currently active.' });
  }
  //check if meeting code is correct
  if (response.properties['Code'].rich_text[0].text.content !== code) {
    return res.json({ msg: 'Incorrect code' });
  }

  //if reached here, the code is right & meeting is active -> check if correct team -> update database
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      if (obj.name === name) {
        //ensures only general and team-specific meetings counted for attendance
        if (obj.team != meetingType && obj.team != 'General') {
          return res.json({ msg: 'You cannot sign in for this type of meetting based on your team.' });
        } else if (obj.checkedin == true) {
          return res.json({ msg: 'You have already signed in for this meeting.' });
        } else {
          const pageId = obj.pageid;
          var tardy = false;
          //update member attendance database
          if (Date.now() > response.properties['Tardy Time'].number) {
            //mark this person as tardy
            tardy = true;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Total Meetings Attended": obj.total + 1,
                "Unexcused Absences": obj.unexcused - 1,
                "Currently Checked-in": true,
                "Tardies": obj.tardies + 1
              },
            });
          } else {
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Total Meetings Attended": obj.total + 1,
                "Unexcused Absences": obj.unexcused - 1,
                "Currently Checked-in": true
              },
            });
          }
          //update meeting history database- no need to await (will speed up checkin time for user)
          updateMeetingHistory(meetingType, meetingNum);
          if (tardy) {
            return res.json({ msg: 'Success! You are checked in (tardy)' });
          } else {
            return res.json({ msg: 'Success! You are checked in.' });
          }
        }
      }
    }
  }
  //if reached here, looked through whole database and no names matched -> name is wrong
  return res.json({ msg: 'No member found with the name inputted' });
})

//endpoint called when member submits excused absence form
//name, meeting type, and reason for absence sent in from frontend (from the form)
app.post('/submitExcusedAbsence', async (req, res) => {
  //updates general database with +1 excused absence and -1 unexcused absence
  var body = req.body;
  var name = body.name;
  var meetingType = body.type;
  var reason = body.reason;
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      if (obj.name === name) {
        //ensures only general and team-specific meetings counted for attendance
        if (obj.team != meetingType && obj.team != 'General') {
          return res.json({ msg: 'you cannot submit an absence from for this type of meetting based on your team' });
        } else {
          const pageId = obj.pageid;
          const response = await notion.pages.update({
            page_id: pageId,
            properties: {
              "Excused Absences": obj.excused + 1,
              "Unexcused Absences": obj.unexcused - 1
            },
          });
          //found the member to update- exit loop
          i = members.length;
        }
      }
    }
  }

  //updates the excused absences database with the new entry
  const notionMeeting = new Client({ auth: process.env.NOTION_TOKEN_ABSENCES });
  notionMeeting.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ABSENCES },
    properties: {
      Name: {
        "title": [{ "text": { "content": name } }],
      },
      "Type of Meeting": {
        rich_text: [{
          text: {
            content: meetingType
          }
        }]
      },
      "Reason For Missing Meeting": {
        rich_text: [{
          text: {
            content: reason
          }
        }]
      }
    }
  });

  return res.json({ msg: "Success" });


})

//clears the present/absences data on the members overview database
//primarily for debugging purposes
app.post('/clear', async (req, res) => {
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      const pageId = obj.pageid;
      const response = await notion.pages.update({
        page_id: pageId,
        properties: {
          "Unexcused Absences": 0,
          "Total Meetings Attended": 0,
          "Excused Absences": 0,
          "Currently Checked-in": false,
          "Tardies": 0
        },
      });
    }
  }
  return res.json({
    msg: "Cleared"
  })

})
app.listen(PORT, console.log(`Server started on port ${PORT}`))


//gets the number of members in each team
const getNumMembers = async (type) => {
  const members = await getMembers();
  if (type === 'General') {
    return members.length;
  } else {
    var result = 0;
    for (var i = 0; i < members.length; i++) {
      var obj = members[i];
      if (obj.team == type) {
        result++;
      }
    }
    return result;
  }
}

const updateMeetingHistory = async (meetingType, meetingNum) => {
  const meetingHistory = await getMeetingHistory();
  for (var j = 0; j < meetingHistory.length; j++) {
    var entry = meetingHistory[j];
    if (entry.meetingType == meetingType && entry.meetingNumber == meetingNum.number - 1) {
      //found the entry, update it
      const notionMeeting = new Client({ auth: process.env.NOTION_MEETINGHISTORY_TOKEN });
      const response = await notionMeeting.pages.update({
        page_id: entry.pageid,
        properties: {
          "Attended": entry.numAttended + 1,
          "# Unexcused Absences": entry.numAbsent - 1
        },
      });
    }
  }
}

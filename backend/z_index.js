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
app.get('/meetingHistory', async (req,res) => {
  const meetingHist = await getMeetingHistory();
  res.json(meetingHist);
})

app.get('/MeetingBarData', async (req, res) => {
  var type = req.query.type;
  const meetingHist = await getMeetingHistory();
  const result = meetingHist.filter(x => x.meetingType == type);
  result.sort(function(a, b) {
    return parseFloat(a.meetingNumber) - parseFloat(b.meetingNumber);
  });
  res.json(result);
  
})

app.get('/DonutData', async (req, res) => {
  var type = req.query.type;
  var lastMeetingNum = req.query.last;
  const meetingHist = await getMeetingHistory();
  const result = meetingHist.filter(x => x.meetingType === type && x.meetingNumber == lastMeetingNum);
  res.json(result);
  
})

app.get('/BarChartHorizData', async (req, res) => {
  const meetingHist = await getMeetingHistory();
  //find most recent meeting for each (meeting number sent as parameter)
  var lastGen = req.query.lastGen;
  var lastEng = req.query.lastEng;
  var lastDes = req.query.lastDes;
  var lastProd = req.query.lastProd;
  var result = meetingHist.filter(x => (x.meetingType === 'Product' && x.meetingNumber == lastProd)||(x.meetingType === 'Engineering' && x.meetingNumber == lastEng) || (x.meetingType === 'General' && x.meetingNumber == lastGen) || (x.meetingType === 'Design' && x.meetingNumber == lastDes));
  result.sort(function(a, b) {
    return parseFloat(a.meetingType) - parseFloat(b.meetingType);
  });
  res.json(result);
  
})
app.get('/meetinginfo/:meetingtype', async (req, res) => {
  const meetingType = req.params.meetingType
  if (meetingType == "engineering") {
    const pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
  }
  else if (meetingType == "general") {
    const pageId = process.env.NOTION_GENERAL_MEETING_INFO;
  }
  else if (meetingType == "product") {
    const pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
  }
  else if (meetingType == "design") {
    const pageId = process.env.NOTION_DESIGN_MEETING_INFO;
  }
  const response = await notion.pages.retrieve({ page_id: pageId });
  return res.json({
    msg: "This is the meeting info",
    data: {
      start: response.properties['Start Time'],
      end: response.properties['End Time'],
      type: response.properties['Meeting Type'].select,
      code: response.properties['Meeting Code'],
      codeTitle: response.properties['Meeting Code'].title
    }
  })
});
app.get('/meeting/:meetingtype', async (req, res) => {
  const meetingType = req.params.meetingType
  var pageId = '';
  var propertyType = '';
  if (meetingType == "engineering") {
    pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "general") {
    pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    propertyType = "General Meeting Number"
  }
  else if (meetingType == "product") {
    pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    propertyType = "Product Meeting Number"
  }
  else if (meetingType == "design") {
    pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    propertyType = "Design Meeting Number"
  }
  const response = await notion.pages.retrieve({ page_id: pageId });
  var activeMeeting = false;
  // is an empty array if manually deleted otherwise an empty string
  if (response.properties['Meeting Code'].title.length && response.properties['Meeting Code'].title[0].plain_text !== '') {
    activeMeeting = true;
  }
  let number = response.properties[propertyType].number
  return res.json({
    msg: "Home page opened",
    data: {
      activeMeeting,
      number
    }
  })
});

//cancel meeting
app.put('/cancel', async (req, res) => {
  const body = req.body
  var pageId = '';
  var propertyType = '';
  const meetingType = req.query.meetingType
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
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Meeting Type': {
        select: null
      },
      'Meeting Code': {
        title: [{
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
              "Unexcused Absences": obj.unexcused - 1
            },
          });
        }
      }
    }
  return res.json({
    msg: "Cancelled"
  })
});
//call update members data when timer ends
app.put('/update/:meetingType', async (req, res) => {
  const body = req.body
  const meetingType = req.params.meetingType
  if (meetingType == "engineering") {
    const pageId = process.env.NOTION_ENGINEERING_MEETING_INFO;
    const propertyType = "Engineering Meeting Number"
  }
  else if (meetingType == "general") {
    const pageId = process.env.NOTION_GENERAL_MEETING_INFO;
    const propertyType = "General Meeting Number"
  }
  else if (meetingType == "product") {
    const pageId = process.env.NOTION_PRODUCT_MEETING_INFO;
    const propertyType = "Product Meeting Number"
  }
  else if (meetingType == "design") {
    const pageId = process.env.NOTION_DESIGN_MEETING_INFO;
    const propertyType = "Design Meeting Number"
  }
  const retrieveInfo = await notion.pages.retrieve({ page_id: pageId });
  let meetingNumber = parseInt(retrieveInfo.properties['General Meeting Number'].number)
  let newMeetingNumber = parseInt(retrieveInfo.properties['General Meeting Number'].number + 1)
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Meeting Type': {
        select: null
      },
      'Meeting Code': {
        title: [{
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
  await updateMembersData();
  return res.json({
    msg: "Meeting Ended and entries updated"
  })
});

//endpoint for receiving meeting info and updating database with it
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
  //const meetingNumber = properties[propertyType].number;
  console.log(pageId);
  const retrieveInfo = await notion.pages.retrieve({ page_id: pageId });
  let meetingNumber = parseInt(retrieveInfo.properties[propertyType].number)
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Meeting Code': {
        title: [{
          text: {
            content: body.code
          },
          plain_text: body.code
        }
        ]
      },
      'Start Time': {
        number: body.startTime
      },
      'End Time': {
        number: body.startTime
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
          "Unexcused Absences": obj.unexcused + 1
        },
          });
        }
      }
        
  }
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
  const name= body.name
  const meetingType = body.type
  const code= body.code
  var pageId = "";
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
  if (response.properties['Meeting Code'].title.length && response.properties['Meeting Code'].title[0].plain_text !== '') {
    activeMeeting = true;
  }
  if (!activeMeeting) {
    return res.json({msg: 'Meeting is not active'});
  } 
  //check if meeting code is correct
  if (response.properties['Meeting Code'].title[0].plain_text !== code) {
    return res.json({msg: 'incorrect code'});
  }

  //if reached here, the code is right & meeting is active -> check if correct team -> update database
  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      if (obj.name === name) {
        //ensures only general and team-specific meetings counted for attendance
        if (obj.team != meetingType && obj.team != 'General') {
          return res.json({msg: 'you cannot sign in for this type of meetting based on your team'});
        } else {
          const pageId = obj.pageid;
          const response = await notion.pages.update({
            page_id: pageId,
            properties: {
              "Total Meetings Attended": obj.total + 1,
              "Unexcused Absences": obj.unexcused - 1
            },
          });
          return res.json({msg: 'success'});
        }
      }
    }
  }
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
          return res.json({msg: 'you cannot submit an absence from for this type of meetting based on your team'});
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
  const notionMeeting = new Client({ auth: process.env.NOTION_TOKEN_ABSENCES});
  notionMeeting.pages.create({
    parent: {database_id: process.env.NOTION_DATABASE_ABSENCES},
    properties: {
      Name: {
        "title": [{"text": {"content": name}}],
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

  return res.json({msg: "Success"});


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
            "Excused Absences": 0
        },
          });
        }
  }
  return res.json({
    msg: "Cleared"
  })

})
app.listen(PORT, console.log(`Server started on port ${PORT}`))


const updateMembersData = async (meetingType,  meetingNumber) => {

  const absences = await getAbsenceForms();
  const present = await getForms();

  constAbsencesSet = new Set();
  if (absences) {
    for (var i = 0; i < absences.length; i++) {
      var obj = absences[i];
      if (obj != undefined) {
        constAbsencesSet.add(obj.name);
      }
    }
  }
  constPresentSet = new Set();
  if (present) {
    for (var i = 0; i < present.length; i++) {
      var obj = present[i];
      if (obj != undefined) {
        constPresentSet.add(obj.name);
        attended++;
      }
    }
  }

  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    if (obj != undefined) {
      //ensures only general and team-specific meetings counted for attendance
      if (meetingType === "General" || obj.team === meetingType) {
        if (constPresentSet.has(obj.name)) {
          //function that updates members data base with 1 more meeting attended
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Total Meetings Attended": obj.total + 1
              },
            });
        }
        else if (constAbsencesSet.has(obj.name)) {
          //console.log("excused " + obj.name);
          //function that updates members data base with 1 more excused absence
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Excused Absences": obj.excused + 1
              },
            });
        } else {
          //function that updates members data base with 1 more unexcused absence
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Unexcused Absences": obj.unexcused + 1
              },
            });
          unexcused++;
        }
      }
    }
  }
  //add this meeting info to Meeting History Database
  const notionMeeting = new Client({ auth: process.env.NOTION_MEETINGHISTORY_TOKEN});
  notionMeeting.pages.create({
    parent: {database_id: process.env.NOTION_MEETINGHISTORY_ID},
    properties: {
      "title": [{"text": {"content": meetingType}}],
      "Meeting #": meetingNumber,
      "Attended": attended,
      "# Unexcused Absences": unexcused,
    }
  });
  return {type: meetingType, unexcused: unexcused, attended: attended};
}

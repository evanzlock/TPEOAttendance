const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const express = require('express')
const PORT = process.env.PORT || 5000
const router = express.Router();
const cors = require("cors");
const app = express();
<<<<<<< HEAD
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY });
=======
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
//middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());
<<<<<<< HEAD
// test endpoints for notion databases 
app.get('/members', async (req, res) => {
  const members = await getMembers()
  res.json(members)
})
=======
//global variables that are sent in from frontendfor verification
var meetingNumber = 1;
var code = "";
var duration = null;
var meetingType = "";
var active = false;
// test endpoints for notion databases 
// app.get('/members', async (req, res) => {
//   const members = await getMembers()
//   res.json(members)
// })
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
// app.get('/forms', async (req, res) => {
//   const forms = await getForms()
//   res.json(forms)
// })
// app.get('/absences', async (req, res) => {
//   const absences = await getAbsenceForms();
//   res.json(absences);
// })
<<<<<<< HEAD
// `/${meetingTypePage}
app.get('/info', async (req, res) => {
  const pageId = process.env.NOTION_MEETING_INFO;
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
app.get('/general', async (req, res) => {
  const pageId = process.env.NOTION_MEETING_INFO;
  const response = await notion.pages.retrieve({ page_id: pageId });
  var activeMeeting = false;
  // is an empty array if manually deleted otherwise an empty string
  if (response.properties['Meeting Code'].title.length && response.properties['Meeting Code'].title[0].plain_text !== '') {
    activeMeeting = true;
  }
  let number = response.properties['General Meeting Number'].number
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
  const pageId = process.env.NOTION_MEETING_INFO;
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
  return res.json({
    msg: "Cancelled"
  })
});
//call update members data when timer ends
app.put('/update', async (req, res) => {
  const body = req.body
  const pageId = process.env.NOTION_MEETING_INFO;
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
//endpoint for receiving meeting info
app.post('/meeting', async (req, res) => {
  const body = req.body
  const pageId = process.env.NOTION_MEETING_INFO;
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      'Meeting Type': {
        select: {
          name: body.type
        }
      },
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
      }
      //this should be updated in endpoint for ending meetings
      // 'Product Meeting Number': {

      // },
      // 'General Meeting Number': {

      // },
      // 'Engineering Meeting Number': {

      // },
      // 'Design Meeting Number': {

      // }
    },
  });
  return res.json({
    msg: "Success",
    data: {
      body
    }
  });
})
=======
//cancel meeting
app.put('/cancel', (req, res) => {
  code = "";
  duration = null;
  meetingType = "";
  active = false;
  return res.json({
    msg: "Meeting cancelled",
    data: {
      code,
      duration,
      meetingType
    }
  })
})
//call update members data when timer ends
app.put('update', (req, res) => {
  return res.json({
    msg: "Sucess: Updated Notion Database"
  })
})
//endpoint for receiving meeting info
app.post('/meeting', (req, res) => {
  const body = req.body
  if (body.code == "" || body.duration == "" || body.type == "") {
    return res.status(400).json({
      msg: "Error: parameter not defined",
      data: {}
    });
  }
  if (code != "") {
    return res.json({
      msg: "Meeting currently active. Cancel other meeting before starting new one",
      data: { code }
    })
  }
  code = body.code;
  duration = body.duration;
  meetingType = body.type;
  active = true;
  return res.json({
    msg: "Success",
    data: {
      code,
      duration,
      meetingType
    }
  });
});
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
app.listen(PORT, console.log(`Server started on port ${PORT}`))


const updateMembersData = async () => {
<<<<<<< HEAD
  //TODO: MAKE MORE EFFICIENT- should only do this computation
=======
  const { Client } = require('@notionhq/client');
  const notion = new Client({ auth: process.env.NOTION_KEY });

  //TODO: MAKE MORE EFFICIENT- should only do this computation 
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c
  //once and figure out how to store it
  const absences = await getAbsenceForms(meetingNumber, meetingType);
  const present = await getForms(meetingNumber, meetingType, code);

  constAbsencesSet = new Set();
  for (var i = 0; i < absences.length; i++) {
    var obj = absences[i];
    if (obj != undefined) {
      constAbsencesSet.add(obj.name);
    }
  }
  //console.log(constAbsencesSet);
  constPresentSet = new Set();
  for (var i = 0; i < present.length; i++) {
    var obj = present[i];
    if (obj != undefined) {
      constPresentSet.add(obj.name);
    }
  }
  //console.log(constPresentSet);

  const members = await getMembers();
  for (var i = 0; i < members.length; i++) {
    var obj = members[i];
    //console.log(obj);
    if (obj != undefined) {
      //ensures only general and team-specific meetings counted for attendance
      if (meetingType === "General" || obj.team === meetingType) {
        if (constPresentSet.has(obj.name)) {
          //console.log("present " + obj.name);
          //function that updates members data base with 1 more meeting attended
          (async () => {
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Total Meetings Attended": obj.total + 1
              },
            });
            //console.log(response);
          })();
        }
        else if (constAbsencesSet.has(obj.name)) {
          //console.log("excused " + obj.name);
          //function that updates members data base with 1 more excused absence
          (async () => {
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Excused Absences": obj.excused + 1
              },
            });
            //console.log(response);
          })();
        } else {
          //console.log("unexcused " + obj.name);
          //function that updates members data base with 1 more unexcused absence
          (async () => {
            const pageId = obj.pageid;
            const response = await notion.pages.update({
              page_id: pageId,
              properties: {
                "Unexcused Absences": obj.unexcused + 1
              },
            });
            //console.log(response);
          })();
        }
      }


    }
  }

}
//TODO: call updateMembersData() when meeting timer ends on frontend
<<<<<<< HEAD
//updateMembersData();
=======
updateMembersData();
>>>>>>> e6cb0a28f6f775d09ad5bbc11a282585fecb214c

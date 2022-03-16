const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const express = require('express')
const PORT = process.env.PORT || 5000
const router = express.Router();
const cors = require("cors");
const app = express();
//middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());
//global variables that are sent in from frontendfor verification
var meetingNumber = 1;
var code = "";
var duration = null;
var meetingType = "";
var active = false;
//endpoints 
app.get('/members', async (req, res) => {
  const members = await getMembers()
  res.json(members)
})
app.get('/forms', async (req, res) => {
  const forms = await getForms()
  res.json(forms)
})
app.get('/absences', async (req, res) => {
  const absences = await getAbsenceForms();
  res.json(absences);
})
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
      type
    }
  })
})
//endpoint for receiving meeting info
app.post('/meeting', (req, res) => {
  const body = req.body
  if (body.code == "" || body.duration == "" || body.type == "") {
    return res.json({
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
  console.log(body);
  code = body.code;
  duration = body.duration;
  type = body.type;
  active = true;
  console.log(code);
  console.log(duration);
  return res.json({
    msg: "Success",
    data: {
      code,
      duration,
      type
    }
  });
});
app.listen(PORT, console.log(`Server started on port ${PORT}`))


const updateMembersData = async () => {
  const { Client } = require('@notionhq/client');
  const notion = new Client({ auth: process.env.NOTION_KEY });

  //TODO: MAKE MORE EFFICIENT- should only do this computation 
  //once and figure out how to store it
  const absences = await getAbsenceForms(meetingNumber, meetingType, code);
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
updateMembersData();
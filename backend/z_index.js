const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const express = require('express')
const PORT = process.env.PORT || 5000
const router = express.Router();
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { request } = require('http');
//middleware
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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
app.post('/meeting', (req, res) => {
  console.log(req.body);
  res.send("Success" + req.body);
});
app.listen(PORT, console.log(`Server started on port ${PORT}`))

//variables that will be sent in from frontend (hardcoded for now)
var meetingType = "Engineering";

const updateMembersData = async () => {
  const { Client } = require('@notionhq/client');
  const notion = new Client({ auth: process.env.NOTION_KEY });

  //TODO: MAKE MORE EFFICIENT- should only do this computation 
  //once and figure out how to store it
  const absences = await getAbsenceForms();
  const present = await getForms();

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

updateMembersData();
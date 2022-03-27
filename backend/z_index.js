const getMembers = require('./services/z_notion')
const getForms = require('./services/z_forms')
const getAbsenceForms = require('./services/z_absences');
const getMeetingHistory = require('./services/meetingHistory');
const express = require('express')
const PORT = process.env.PORT || 5000
const router = express.Router();
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { request } = require('http');
//middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json());
//app.use(express.static('public'))
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
var code = "";
var duration = null;
//endpoints 
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
app.get('/forms', async (req, res) => {
  const forms = await getForms()
  res.json(forms)
})
app.get('/absences', async (req, res) => {
  const absences = await getAbsenceForms();
  res.json(absences);
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

app.post('/updateDatabases', (req, res) => {
  if (req.body == undefined) {
    return res.json({
      msg: "Error: parameter not defined",
      data: {}
    });
  }
  const body = req.body;
  const meetingType = body.type;
  const meetingNumber = body.number;
  updateMembersData(meetingType, meetingNumber);
  return res.json ({
    msg: "success",
    data: {}
  })
})
app.post('/meeting', (req, res) => {
  if (req.body == undefined) {
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
  const body = req.body
  console.log(body);
  code = body.code;
  duration = body.duration;
  console.log(code);
  console.log(duration);
  return res.json({
    msg: "Success",
    data: {
      code,
      duration
    }
  });
});
app.listen(PORT, console.log(`Server started on port ${PORT}`))

//variables that will be sent in from frontend (hardcoded for now)
//var meetingType = "Engineering";
//var meetingNumber= 1;

const updateMembersData = async (meetingType,  meetingNumber) => {
  const { Client } = require('@notionhq/client');
  const notion = new Client({ auth: process.env.NOTION_KEY });
  var unexcused = 0;
  var attended = 0;

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
import React from 'react'
import CreateMeeting from '../components/CreateMeeting';

import MeetingBarChart from '../components/MeetingBarChart';

import MemberTable from '../components/MemberTable';
import DonutChart from '../components/DonutChart';

import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import './teamPage.css';
import { useEffect } from 'react';
const TeamPage = (props) => {
  const { type } = useParams();
  useEffect(() => {
    if (type) {
      // Perform rest api call and response handling
    }
  }, [type]);
  var color = '';
  if (type === "General") {
    color = '#FFD5B8'
  }
  else if (type === "Engineering") {
    color = '#FFC4DC'
  }
  else if (type === "Product") {
    color = "#B2D1FF"
  }
  else if (type === "Design") {
    color = "#E6CDFF"
  }
  return (
    <div>
      <div className="flex-container">
        <Navbar></Navbar>
        <div className="flex-container-column">
          <div className="team">
            <div className="title">
              {type} Meetings
            </div>
            <div className="flex3">
              <CreateMeeting type={type} color={color}></CreateMeeting>
            </div>
            <div className="flex-container-row">
              <div className="flex1">
                <DonutChart type={type} color={color} />
              </div>
              <div className="flex2">
                <Card border="light">
                  <Card.Body >
                    <MeetingBarChart type={type} color={color} />
                  </Card.Body>
                </Card>
              </div>
            </div>
            <MemberTable type={type} />
          </div>

        </div>


      </div>
    </div>
  )
}

export default TeamPage;

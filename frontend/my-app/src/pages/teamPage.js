import React from 'react'
import CreateMeeting from '../components/CreateMeeting';

import MeetingBarChart from '../components/MeetingBarChart';

import MemberTable from '../components/MemberTable';
import DonutChart from '../components/DonutChart';

import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import './teamPage.css';

const TeamPage = (props) => {
  let { type } = useParams();
  return (
    <div className="flex-team">
      <div className="navBar">
        <Navbar></Navbar>
      </div>
      <div className="meetingcharts">
        <h5> {type} Meetings </h5>
        <div className="meetingbutton">
          <CreateMeeting color={props.color} type={type} />
        </div>
        <div className="charts">
          <div className="flex1">
            <DonutChart type={type} color={props.color} />
          </div>
          <div className="flex2">
            <Card border="light">
              <Card.Body >
                <MeetingBarChart type={type} color={props.color} />
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="table">
          <MemberTable type={type} />
        </div>
      </div>
    </div>
  )
}

export default TeamPage;

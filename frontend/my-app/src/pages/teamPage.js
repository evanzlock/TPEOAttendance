import React from 'react'
import CreateMeeting from '../components/CreateMeeting';

import MeetingBarChart from '../components/MeetingBarChart';

import MemberTable from '../components/MemberTable';
import DonutChart from '../components/DonutChart';

import {Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';


import './teamPage.css';

const TeamPage = (props) => {
  return (
    <div className = "team">
      <CreateMeeting/>
      <div className="flex-container">
        <div className="flex1">
          <Card border="light">
            <Card.Body >
              <DonutChart type = {props.type} color = {props.color}/>
            </Card.Body>
          </Card>
        </div>
        <div className="flex2">
          <Card border="light">
            <Card.Body >
            <MeetingBarChart type = {props.type} color = {props.color}/>
            </Card.Body>
          </Card>
        </div>
      </div>
      <MemberTable type = {props.type}/>
    </div>
  )
}

export default TeamPage;

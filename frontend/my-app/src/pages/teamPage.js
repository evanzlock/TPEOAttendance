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
    <div>

      

    <div className = "team">
    <div className="title">
      <h5> {props.type} Meetings </h5>
      </div>

      <div className="flex-container-column">
        <div className = "button">
            <CreateMeeting color = {props.color}/>
        </div>
        <div className="flex-container-row">
          <div className="flex1">
            <DonutChart type = {props.type} color = {props.color}/>
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
      
      
      
      
    </div>
    </div>
  )
}

export default TeamPage;

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
    <div>
      <div className="team">
        <Navbar></Navbar>
        <div className="title">
          <h5> {type} Meetings </h5>
        </div>

        <div className="flex-container-column">
          <div className="button">
            <CreateMeeting color={props.color} type={type} />
          </div>
          <div className="flex-container-row">
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
          <MemberTable type={type} />
        </div>




      </div>
    </div>
  )
}

export default TeamPage;

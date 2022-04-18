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
  var color = '';
  if (type === 'Engineering') {
    color = '#FFC4DC'
  }
  if (type === 'General') {
    color = '#FFD588'
  }
  if (type === 'Design') {
    color = '#E6CDFF'
  }
  if (type === 'Product') {
    color = '#B2D1FF'
  }
  return (
    <div className="flex-team">
      <div className="navBar">
        <Navbar></Navbar>
      </div>
      <div className="meetingcharts">
        <h1> {type} Meetings </h1>
        <div className="meetingbutton">
          <CreateMeeting color={color} type={type} />
        </div>
        <div className="charts">
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
        <div className="table">
          <MemberTable type={type} />
        </div>
      </div>
    </div>
  )
}

export default TeamPage;

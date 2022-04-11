import React from 'react'
import CreateMeeting from '../components/CreateMeeting';
import LineChartDashboard from '../components/LineChartDashboard';
import BarChartHorizontalDashboard from '../components/BarChartHorizontalDashboard';
import MemberTable from '../components/MemberTable';
import Navbar from '../commponents/Navbar';
import './Dashboard.css'
import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const dashboard = () => {
  return (
    <div className="dash">
      <div className="title">
        <h2> Dashboard </h2>
      </div>
      <div className="flex-container">
        <div className="flex-child1">
          <Navbar></Navbar>
          <Card border="light">
            <Card.Body >
              <LineChartDashboard />
            </Card.Body>
          </Card>
        </div>
        <div className="flex-child2">
          <Card border="light">
            <Card.Body >
              <BarChartHorizontalDashboard />
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="table">
        <Card border="light">
          <Card.Body >

            <MemberTable type='General' />

          </Card.Body>
        </Card>
      </div>


    </div>
  )
}

export default dashboard;

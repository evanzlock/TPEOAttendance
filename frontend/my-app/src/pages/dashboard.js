import React from 'react'
import CreateMeeting from '../components/CreateMeeting';
import LineChartDashboard from '../components/LineChartDashboard';
import BarChartHorizontalDashboard from '../components/BarChartHorizontalDashboard';
import MemberTable from '../components/MemberTable';
import './Dashboard.css'
import {Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const dashboard = () => {
  return (
    <div class="dash">
      <CreateMeeting/>
      <div class="flex-container">
        <div class="flex-child1">
          <Card border="light">
            <Card.Body >
              <LineChartDashboard/>
            </Card.Body>
          </Card>
        </div>
        <div class="flex-child2">
        <Card border="light">
            <Card.Body >
              <BarChartHorizontalDashboard/>
            </Card.Body>
        </Card>
        </div>
      </div>
      <div class="table">
      <Card border="light">
            <Card.Body >
            
              <MemberTable type = 'General'/>
            
            </Card.Body>
        </Card>
        </div>
      
      
    </div>
  )
}

export default dashboard;

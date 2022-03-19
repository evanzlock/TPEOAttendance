import React from 'react'
import CreateMeeting from '../components/CreateMeeting';
import LineChartDashboard from '../components/LineChartDashboard';
import BarChartHorizontalDashboard from '../components/BarChartHorizontalDashboard';
import MemberTable from '../components/MemberTable';
import './Dashboard.css'

const dashboard = () => {
  return (
    <div>
      <CreateMeeting/>
      <div class="flex-container">
        <div class="flex-child">
          <LineChartDashboard/>
        </div>
        <div class="flex-child">
          <BarChartHorizontalDashboard/>
        </div>
      </div>
      <MemberTable type = 'General'/>
    </div>
  )
}

export default dashboard;

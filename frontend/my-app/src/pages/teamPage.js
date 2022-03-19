import React from 'react'
import CreateMeeting from '../components/CreateMeeting';

import MeetingBarChart from '../components/MeetingBarChart';

import MemberTable from '../components/MemberTable';
import DonutChart from '../components/DonutChart';

import './teamPage.css';

const TeamPage = (props) => {
  return (
    <div>
      <CreateMeeting/>
      <div class="flex-container">
        <div class="flex-child">
          <DonutChart type = {props.type} color = {props.color}/>
        </div>
        <div class="flex-child">
          <MeetingBarChart type = {props.type} color = {props.color}/>
        </div>
      </div>
      <MemberTable type = {props.type}/>
    </div>
  )
}

export default TeamPage;

import './App.css';
import CreateMeeting from './components/CreateMeeting';
import LineChartDashboard from './components/LineChartDashboard';
import BarChartHorizontalDashboard from './components/BarChartHorizontalDashboard';
import GenMeetingBarChart from './components/GenMeetingBarChart';
import GenMeetingDonutChart from './components/GenMeetingDonutChart';
import MemberTable from './components/MemberTable';

function App() {
  return (
    <div className="App">
      <CreateMeeting>
      </CreateMeeting>

      <div style={{ width: 700 }}>
      <LineChartDashboard/>
    </div>

    <div style={{ width: 700 }}>
      <BarChartHorizontalDashboard/>
    </div>
    <div style={{ width: 700 }}>
      <GenMeetingBarChart/>
    </div>
    <div style={{ width: 700 }}>
      <GenMeetingDonutChart/>
    </div>
    
    <div>
    <MemberTable/>
    </div>
      

    </div>
  );
}

export default App;


import CheckinForm from './pages/CheckinForm'
import ExcusedAbsenceForm from './pages/ExcusedAbsenceForm';
import React, {Component} from 'react';
import './style.css';
import MemberTable from './pages/MemberTable';

class App extends Component {
  render() {
    return (
    <div className="App">
      <div className = "form">
      <CheckinForm/>
      
       
      </div>
      
      {/* <ExcusedAbsenceForm/>
      <MemberTable/>*/}
    </div>
    )
  };
}

export default App;

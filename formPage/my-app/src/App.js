
import './App.css';
import CheckinForm from './CheckinForm'
import ExcusedAbsenceForm from './ExcusedAbsenceForm';
import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
    <div className="App">
      <h1>Member Check-in Form</h1>
      <CheckinForm/>
      <h1>Excused Absence Form</h1>
      <ExcusedAbsenceForm/>
    </div>
    )
  };
}

export default App;

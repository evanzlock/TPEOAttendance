
import CheckinForm from './pages/CheckinForm'
import ExcusedAbsenceForm from './pages/ExcusedAbsenceForm';
import React, {Component} from 'react';
import './style.css';

class App extends Component {
  render() {
    return (
    <div className="App">
      <div className = "form">
      <ExcusedAbsenceForm/>
       
      </div>
      
      {/* <CheckinForm/>*/}
    </div>
    )
  };
}

export default App;

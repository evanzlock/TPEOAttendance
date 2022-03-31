
import './App.css';
import CheckinForm from './CheckinForm'
import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
    <div className="App">
      <h1>Member Check-in Form</h1>
      <CheckinForm/>
    </div>
    )
  };
}

export default App;

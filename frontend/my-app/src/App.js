import './App.css';

import Dashboard from './pages/dashboard';
import TeamPage from './pages/teamPage';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <TeamPage type='Engineering' color='#FFC4DC' />


      {/*
      //TODO: with navbar update with routing
      <Dashboard/>
      
      <TeamPage type='General' color = '#FFD5B8'/>
      <TeamPage type='Product' color = '#B2D1FF'/>
      <TeamPage type='Design' color = '#E6CDFF'/>
      
      */}
    </div>
  );
}

export default App;

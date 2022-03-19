import './App.css';

import Dashboard from './pages/dashboard';
import TeamPage from './pages/teamPage';

function App() {
  return (
    <div className="App">
      <TeamPage type='General' color = '#FFD5B8'/>
      {/*
      <Dashboard/>
      
      <TeamPage type='Product' color = '#B2D1FF'/>
      <TeamPage type='Design' color = '#E6CDFF'/>
      <TeamPage type='Engineering' color = '#FFC4DC'/>
      */}
    </div>
  );
}

export default App;

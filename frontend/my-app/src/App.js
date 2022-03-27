import './App.css';

import Dashboard from './pages/dashboard';
import TeamPage from './pages/teamPage';

function App() {
  return (
    <div className="App">
      <Dashboard/>
    
      {/*
      //TODO: with navbar update with routing
      
     
       <TeamPage type='Engineering' color = '#FFC4DC'/>
      <TeamPage type='General' color = '#FFD5B8'/>
      <TeamPage type='Product' color = '#B2D1FF'/>
      <TeamPage type='Design' color = '#E6CDFF'/>
      
      */}
    </div>
  );
}

export default App;

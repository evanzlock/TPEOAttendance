import './App.css';

import Dashboard from './pages/dashboard';
import TeamPage from './pages/teamPage';
import { URLs } from './configurl.json'
function App() {
  console.log('sgaefaf');
  console.log(URLs.ASSETS_BASED_URL);
  return (
    <div className="App">

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

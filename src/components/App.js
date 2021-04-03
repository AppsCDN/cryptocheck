import '../styles/style.scss';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CheckPage from './pages/checkPage/CheckPage';
import HomePage from './pages/home/Home';
import Navigation from './shared/Navigation';

import { TickersProvider } from './context/TickersContext';

function App() {
  return (
    <div className='container'>
      <TickersProvider>
        <Router>
          <Navigation />
          <Switch>
            <Route path='/' exact>
              <HomePage />
            </Route>
            <Route path='/check'>
              <CheckPage />
            </Route>
          </Switch>
        </Router>
      </TickersProvider>
    </div>
  );
}

export default App;

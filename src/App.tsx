import React from 'react';
import './App.css';
import { RequestProvider } from './lib/contexts/request.context';

function App() {
  return (
    <RequestProvider baseUrl={'/'}>
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </RequestProvider>
  );
}

export default App;

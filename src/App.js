import React from 'react';
import './App.css';
import About from './components/About';
import Canvas from './components/Canvas';
import Rules from './components/Rules';

function App() {
  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <div className="middle">
        <Canvas />
        <Rules />
      </div>
      <About />
    </div>
  );
}

export default App;

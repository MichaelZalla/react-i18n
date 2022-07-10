import React from 'react';

import './App.css';

function App() {

  const [username] = React.useState('Cassidy')

  return (
    <div className="App">
      {/* @TODO Localize me! */}
      <h1>Hello, {username}!</h1>
    </div>
  )

}

export default App;

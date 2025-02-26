import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('Nothing')
  const [oscarText, setOscarText] = useState('Nothing')

  useEffect(() => {
    console.log("useEffect called");
    fetch(`https://swapi.dev/api/people/1/`)
      .then((response) => response.json())
      .then((data) => setText(data));
  }, []);

  useEffect(() => {
    console.log("useEffect called for Oscar");
    fetch(`http://localhost:8000/clothing_app/`)
      .then((response) => response.json())
      .then((data) => setOscarText(data));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>
          Call to api returned: {JSON.stringify(text, null, 2)}
        </p>
        <p>
          Call to Oscar's api returned: {JSON.stringify(oscarText, null, 2)}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
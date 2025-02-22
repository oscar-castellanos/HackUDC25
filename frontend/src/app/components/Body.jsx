import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Home } from '../../home';
import { CompareCloths, PromptSearch } from '../../compare';
import Favorites from './Favorites';
import Historial from './Historial';

const Body = () => {

  const [imageURL, setImageURL] = useState(null);
  const [userName, setUserName] = useState("Oscar");
  const [prompt, setPrompt] = useState("");

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home imageURL={imageURL} setImageURL={setImageURL} userName={userName} prompt={prompt} setPrompt={setPrompt}/>} />
        <Route path="/compare" element={<CompareCloths clothImageURL={imageURL}/>} />
        <Route path="/promptSearch" element={<PromptSearch prompt={prompt}/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/historial" element={<Historial/>} />
      </Routes>
    </main>
  );
}

export default Body;
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Home } from '../../home';
import { CompareCloths } from '../../compare';
import Favorites from './Favorites';
import Historial from './Historial';

const Body = () => {

  const [imageURL, setImageURL] = useState(null);
  const [userName, setUserName] = useState("Oscar");

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home imageURL={imageURL} setImageURL={setImageURL} userName={userName}/>} />
        <Route path="/compare" element={<CompareCloths clothImageURL={imageURL}/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/historial" element={<Historial/>} />
      </Routes>
    </main>
  );
}

export default Body;
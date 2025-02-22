import Button from 'react-bootstrap/Button'
import { Route, Routes } from 'react-router-dom';

import {Home} from '../../home';
import Favorites from './Favorites';
import Historial from './Historial';

const Body = () => {

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/historial" element={<Historial/>} />
      </Routes>
    </main>
  );
}

export default Body;
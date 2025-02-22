import { Route, BrowserRouter as Router } from "react-router-dom";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Body />
        <Footer />
      </Router>
    </>
  );
}

export default App;
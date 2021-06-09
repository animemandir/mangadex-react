import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Home.js';
import About from './pages/About.js';
import Login from './pages/Login.js';
import Error404 from './pages/Error404.js';


export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/" exact={true}>
                    <Home />
                </Route>
                <Route path="*">
                    <Error404 />
                </Route>                
            </Switch>
        </Router>
    );
}


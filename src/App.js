import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Home from './pages/Home.js';
import About from './pages/About.js';
import Login from './pages/Login.js';
import Title from './pages/Title.js';
import Chapter from './pages/Chapter.js';
import Settings from './pages/Settings.js';
import Follow from './pages/Follow.js';
import Search from './pages/Search.js';
import Group from './pages/Group.js';
import User from './pages/User.js';
import Author from './pages/Author.js';
import Error404 from './pages/Error404.js';


export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/chapter/:id/:page">
                    <Chapter />
                </Route>
                <Route path="/title/:id">
                    <Title />
                </Route>
                <Route path="/author/:id">
                    <Author />
                </Route>
                <Route path="/user/:id">
                    <User />
                </Route>
                <Route path="/group/:id">
                    <Group />
                </Route>
                <Route path="/search">
                    <Search />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
                <Route path="/follow">
                    <Follow />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="*">
                    <Error404 />
                </Route>                
            </Switch>
        </Router>
    );
}


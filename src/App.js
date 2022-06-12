import React from "react";
import { useCallback, useEffect } from 'react';
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
import ReadingList from './pages/ReadingList.js';
import FollowGroup from './pages/FollowGroup.js';
import Search from './pages/Search.js';
import SearchChapter from './pages/SearchChapter.js';
import Group from './pages/Group.js';
import User from './pages/User.js';
import Author from './pages/Author.js';
import History from './pages/History.js';
import Error404 from './pages/Error404.js';


export default function App() {
    const handleKeyPress = useCallback((e) => {
        if(e.key === "F5"){
            window.location.reload();
        }
        if(e.ctrlKey === true){
            if(e.key === "r"){
                window.location.reload();
            }
        }
    },[]);

    useEffect(() => {
        document.addEventListener('keydown',handleKeyPress);
        return () => {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[handleKeyPress]);

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
                <Route path="/search_chapter">
                    <SearchChapter />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
                <Route path="/follow">
                    <Follow />
                </Route>
                <Route path="/follow_group">
                    <FollowGroup />
                </Route>
                <Route path="/reading_list">
                    <ReadingList />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/history">
                    <History />
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


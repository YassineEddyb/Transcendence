import React from 'react'
import ChatLayout from './Pages/Chat/ChatLayout'
import Home from './Pages/Home/Home'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Sign from './Pages/Sign/Sign'
import Game from './Pages/Game/Game'
import Settings from './Pages/Settings/Settings'
import MainLayout from './Layout/MainLayout'
import AuthRequired from './Layout/AuthRequired'


import './scss/main.scss'
import './scss/utils.scss'
import './scss/app.css'
import Prompt from './Pages/Prompt/Prompt'
import Profile from './Pages/Profile/Profile'
import Friends from './Pages/Friends/Friends'
import ChatDmInit from './Pages/Chat/ChatDmInit'

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign" element={<Sign />} />
        <Route element={<AuthRequired />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />}/>
            <Route path="/chat" element={<ChatLayout />}>
                <Route index element={<ChatDmInit /> }/>
            </Route>
            <Route path="/game" element={<Game />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/info" element={<Prompt />} />
            <Route path="/profile" element={<Profile />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import React from 'react';
import {BrowserRouter,Route, Routes} from 'react-router-dom';

import AdvertList from "./components/AdvertList";
import AdvertDetail from "./components/AdvertDetail";
import {LoginPage} from "./components/LoginPage";
import {RequireAuth} from "./hogs/RequireAuth";
import {AuthProvider} from "./hogs/AuthProvider";
import AdvertCreate from "./components/AdvertCreate";
import Tokens from "./components/Home";
import UserProfile from "./components/UserProfile";
import UserAdverts from "./components/UserAdverts";
import CategoryAdvertList from "./components/CategoryAdvertList";
import SearchAdverts from "./components/SearchAdverts";
import AdvertUpdate from "./components/AdvertUpdate";
import Top from "./components/Top";


function BaseLayout() {

    return (
        <div className="wrapper">
            <Top/>
            <header>
                <div className='presentation'></div>
            </header>
            <div className="content">
                <Routes>
                    <Route path='/' element={<AdvertList/>}/>
                    <Route path='/adverts/:id' element={<AdvertDetail/>}/>
                    <Route path='category/:slug' element={<CategoryAdvertList/>}/>
                    <Route path='search' element={<SearchAdverts/>}/>
                    <Route path='tokens' element={<Tokens/>}/>
                    <Route path='advert-create' element={
                        <RequireAuth>
                            <AdvertCreate/>
                        </RequireAuth>}/>
                    <Route path='advert-update/:id' element={
                        <RequireAuth>
                            <AdvertUpdate/>
                        </RequireAuth>}/>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='profile/:id' element={
                        <RequireAuth>
                            <UserProfile/>
                        </RequireAuth>}/>
                    <Route path='profile/adverts' element={
                        <RequireAuth>
                            <UserAdverts/>
                        </RequireAuth>}/>
                </Routes>
            </div>
            <footer>
                Все права защищены &copy;
            </footer>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <BaseLayout/>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

import React from 'react';
import {BrowserRouter,Route, Routes} from 'react-router-dom';

import AdvertList from "./components/AdvertList";
import AdvertDetail from "./components/AdvertDetail";
import {LoginPage} from "./components/LoginPage";
import {RequireAuth} from "./hogs/RequireAuth";
import {AuthProvider} from "./hogs/AuthProvider";
import Tokens from "./components/Home";
import UserProfile from "./components/UserProfile";
import UserAdverts from "./components/UserAdverts";
import CategoryAdvertList from "./components/CategoryAdvertList";
import SearchAdverts from "./components/SearchAdverts";
import Top from "./components/Top";
import Registration from "./components/Registration";
import ProfileUpdate from "./components/ProfileUpdate";
import AdvertCreateUpdate from "./components/AdvertCreateUpdate";
import SellerAdverts from "./components/SellerAdverts";


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
                    <Route path='/adverts/seller/:id' element={<SellerAdverts/>}/>
                    <Route path='category/:slug' element={<CategoryAdvertList/>}/>
                    <Route path='search' element={<SearchAdverts/>}/>
                    <Route path='registration' element={<Registration/>}/>
                    <Route path='tokens' element={<Tokens/>}/>
                    <Route path='advert-create' element={
                        <RequireAuth>
                            <AdvertCreateUpdate/>
                        </RequireAuth>}/>
                    <Route path='advert-update/:id' element={
                        <RequireAuth>
                            <AdvertCreateUpdate/>
                        </RequireAuth>}/>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='profile-update/:id' element={
                        <RequireAuth>
                            <ProfileUpdate/>
                        </RequireAuth>}/>
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

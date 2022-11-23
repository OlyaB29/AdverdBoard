import React, {useEffect, useState} from 'react';
import {Route, useNavigate} from 'react-router-dom';
import {FaSearch, FaUserAlt} from "react-icons/fa";

import {useAuth} from "../hook/useAuth";
import AdvertBoardService from "./AdvertBoardService";
import SearchAdverts from "./SearchAdverts";

const advertBoardService = new AdvertBoardService();


export default function Top() {

    const user = localStorage.getItem('user')
    const {signOut} = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([])

    useEffect(() => {
        advertBoardService.getCategories().then(function (result) {
            console.log(result.data);
            setCategories(result.data)
        })
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const query = form.search.value;
        navigate('/search', {state: {query: query}})
    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top">
            <div className="container-fluid">
                <a className='logo' href='/'>
                    <span>Купи & Продай КА</span>
                </a>
                <form className="d-flex" role="search" onSubmit={handleSubmit}>
                    <input className="form-control me-2 col-md-12" type="search" name="search" placeholder="Поиск"
                           aria-label="Search"/>
                    <button className="btn btn-success" type="submit"><FaSearch/></button>
                </form>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="dropdown">
                            <a className="nav-link active" aria-current="page" href="#">Категории</a>
                            <div className="dropdown-content">
                                {categories.filter(category => category.parent === null).map(category =>
                                    <div className="drop" key={category.id}>
                                        <a className="dropright" href={`/category/${category.slug}`}>{category.name}</a>
                                        {category.children.length > 0 &&
                                            <div className="dropright-content">
                                                {category.children.map(child =>
                                                    <div className="drop-ch" key={child.id}>
                                                        <a className="dropright-ch"
                                                           href={`/category/${child.slug}`}>{child.name}</a>
                                                        {child.children.length > 0 &&
                                                            <div className="dropright-content-ch">
                                                                {child.children.map(ch =>
                                                                    <a key={ch.id}
                                                                       href={`/category/${ch.slug}`}>{ch.name}</a>)}
                                                            </div>
                                                        }
                                                    </div>)}
                                            </div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                    <li className="nav-item-advert">
                        <a className="nav-link active" aria-current="page" href="/advert-create">Подать
                            объявление</a>
                    </li>
                    {user
                        ? <div className='options'>
                            <li className="nav-item">
                                <div className="dropdown">
                                    <FaUserAlt className='user-icon'/>
                                    <div className="dropdown-content">
                                        <a href={`/profile/${localStorage.getItem('userId')}`}>Мой профиль</a>
                                        <a href="/profile/adverts">Мои объявления</a>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active"
                                   style={{color: "#90EE90", fontWeight: 'bold'}}>{user}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href='#'
                                   onClick={() => signOut(() => navigate('/', {replace: true}))}>Выйти</a>
                            </li>
                        </div>
                        : <div className='options'>
                            <li className="nav-item">
                                <a className="nav-link active" href="/registration">Регистрация</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/login">Войти</a>
                            </li>
                        </div>
                    }
                </ul>
            </div>
        </nav>
    )
}
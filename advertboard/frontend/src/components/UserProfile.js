import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';

const advertBoardService = new AdvertBoardService();


function UserProfile() {

    const [profile, setProfile] = useState({user: {username: null, email: null}});
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));

    // useEffect(() => {
    //     advertBoardService.getProfile(id, access).then(function (result) {
    //         console.log(result);
    //         setProfile(result)
    //     }).catch((error) => {
    //         error.response.data.detail === "Given token not valid for any token type"
    //             ? setRefreshRequired(true) : console.log(error)
    //     })
    // }, [id, access]);

    useEffect(() => {
        advertBoardService.getProfile(id, access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    setProfile(result)
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        })
    }, [id, access]);

    // useEffect(() => {
    //     if (refreshRequired) {
    //     const refresh = localStorage.getItem('refreshToken');
    //     advertBoardService.getRefresh(refresh).then(function (result) {
    //         console.log(result);
    //         localStorage.setItem('accessToken', result.access);
    //         setAccess(result.access);
    //         localStorage.setItem('refreshToken', result.refresh);
    //     }).catch((error)=>{error.response.data.detail==="Token is invalid or expired"
    //         ? navigate('/login',{replace: true, state: {from: location}})
    //         : alert("Произошла ошибка")})
    //     }
    // }, [refreshRequired]);

    return (
        <div>
            <div className='profile'>
                <h2>Ваши данные профиля</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className='avatar'>
                            {profile.avatar
                                ? <img width={150} height={100} src={profile.avatar} className="img-fluid rounded-start"
                                       alt="..."/>
                                : <img width={150} height={100} src="/img/No_photo.png"
                                       className="img-fluid rounded-start"
                                       alt="..."/>}
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className='description'>
                            <p><i>Ваше имя: </i> {profile.name}</p>
                            <p><i>Имя пользователя: </i>{profile.user.username}</p>
                            <p><i>E-mail: </i>{profile.user.email}</p>
                            <p><i>Телефон: </i>{profile.phone}</p>
                            <br/>
                            <p><small>Дата регистрации: {profile.date}</small></p>
                            <button className='btn btn-success-outline'
                                    onClick={() => navigate(`/profile-update/${id}`)}>Редактировать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
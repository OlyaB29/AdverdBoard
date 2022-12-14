import React, {useEffect, useState} from 'react';
import AdvertBoardService from './AdvertBoardService';
import {useLocation, useNavigate, useParams} from "react-router-dom";

const advertBoardService = new AdvertBoardService();

function MessToSeller() {

    const {id} = useParams();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        advertBoardService.getUserChats(access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    const existChat = result.find(chat => chat.advert.id === Number(id));
                    if (existChat) {
                        advertBoardService.getFreeProfile(existChat.advert.user).then(function (res) {
                            existChat['companion'] = res;
                            navigate('/messages', {replace: true, state: {selChat: existChat}});
                        })
                    } else {
                        navigate(`/adverts/${id}`, {replace: true, state: {isShowCreate: true}})
                    }
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        })
    }, [access]);

}

export default MessToSeller;

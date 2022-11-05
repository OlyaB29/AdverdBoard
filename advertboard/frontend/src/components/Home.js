import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';

const advertBoardService = new AdvertBoardService();


export default function Tokens() {
    const [access, setAccess] = useState(localStorage.getItem('accessToken'))
    const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
    const user = localStorage.getItem('user')


    useEffect(() => {
        advertBoardService.getTokens(user, 'panterka').then(function (result) {
            console.log(result);
            localStorage.setItem('accessToken', result.access)
            localStorage.setItem('refreshToken', result.refresh)
        })
    }, [user]);

    return (
        <div>
            <h1>Ура</h1>
            <h1>{localStorage.getItem('accessToken')}</h1>
            <h1>{localStorage.getItem('refreshToken')}</h1>

        </div>
    );
}
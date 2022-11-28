import React, {useEffect, useState} from 'react';
import AdvertBoardService from './AdvertBoardService';
import OutputAdverts from "./OutputAdverts";
import {useLocation, useNavigate} from "react-router-dom";


const advertBoardService = new AdvertBoardService();

function UserAdverts() {

    const [adverts, setAdverts] = useState([])
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        advertBoardService.getUserAdverts(access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                   setAdverts(result)
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        });
    }, [access]);


    return (
        <div className="advert_list">
			<OutputAdverts adverts={adverts} isModeration={true}/>
		</div>
    )
}
export default UserAdverts;
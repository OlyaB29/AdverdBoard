import React, {useEffect, useState} from 'react';
import AdvertBoardService from './AdvertBoardService';
import OutputAdverts from "./OutputAdverts";
import {useParams} from "react-router-dom";

const advertBoardService = new AdvertBoardService();

function SellerAdverts() {

    const [adverts, setAdverts] = useState([]);
    const {id} = useParams();
    const [seller, setSeller] = useState({})


    useEffect(() => {
        advertBoardService.getAdverts().then(function (result) {
            setAdverts(result.filter(advert => advert.user === Number(id)));
            advertBoardService.getFreeProfile(id).then(function (res) {
            console.log(res);
            setSeller(res);
            })
        });
    }, [id]);


    return (
        <div className="advert_list">
            <div className="row" >
                 <div className="col-md-3">
                    <div className='description'>
                        <p><i>Имя: </i> {seller.name ? seller.name : "Пользователь"}</p>
                        <p><i>Имя пользователя: </i>{seller.user && seller.user.username}</p>
                        <p><small>Дата регистрации: {seller.date}</small></p>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className='avatar'>
                        {seller.avatar
                            ? <img src={seller.avatar} className="img-fluid rounded-start"
                                   alt="..."/>
                            : <img width={100} height={70} src="/img/No_photo.png" className="img-fluid rounded-start"
                                   alt="..."/>}
                    </div>
                </div>
            </div>
            {adverts.length
                ? <h1>Все объявления продавца</h1>
                : <h3 className='sell'>У продавца нет актуальных объявлений</h3>
            }
            <OutputAdverts adverts={adverts}/>
        </div>
    );
}

export default SellerAdverts;

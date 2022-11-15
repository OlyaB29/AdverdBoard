import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';
import AdvertUpdate from "./AdvertUpdate";

const advertBoardService = new AdvertBoardService();


function AdvertDetail() {

    const [advert, setAdvert] = useState({gallery: {photos: [{image: null}, {image: null}, {image: null}]},
        category: {id: null, name: null, parent: {id: null, name: null, parent: null}, slug: null}});

    const {id} = useParams();
    const navigate = useNavigate();
    const [isShowPhones, setIsShowPhones] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);

    useEffect(() => {
        advertBoardService.getAdvert(id).then(function (result) {
            console.log(result);
            setAdvert(result);
        })
    }, [id]);

    const togglePhones = () => {
        setIsShowPhones(!isShowPhones);
    }

    if (isShowPhones) {
        var phones = <h5>{advert.phone_1}<br/>{advert.phone_2}</h5>;
    }

    const modal = () => {
        setIsShowModal(!isShowModal);
    }

    const deleteAdvert = () => {
        const access = localStorage.getItem('accessToken')
        advertBoardService.deleteAdvert(id, access).then(() => {
            navigate('/profile/adverts', {replace: true})
        });
    }


    return (
        <div className='advert-detail' key={advert.id}>
            <p className='date'>{!advert.moderation && <text>На модерации</text>}{advert.date}</p>
            <h1 className='advert-title'>{advert.title}</h1>
            <div className="row">
                <div className="col-md-5">
                    <nav className='advert-images'>
                        <a className='img' href="#img-1">1</a>
                        <a className='img' href="#img-2">2</a>
                        <a className='img' href="#img-3">3</a>
                    </nav>
                    {/*{advert.gallery.photos.length>0*/}
                    {/*<scroll-container>*/}
                    {/*    <scroll-img id="img-1"><img width={250} height={250} src={advert.gallery.photos[0].image} className="img-fluid rounded-start" alt="..."/></scroll-img>*/}
                    {/*    <scroll-img id="img-2">2</scroll-img>*/}
                    {/*    <scroll-img id="img-3">3</scroll-img>*/}
                    {/*</scroll-container>*/}
                    <scroll-container>
                        <scroll-img id="img-1">{advert.gallery.photos[0]
                            ? <img width={250} height={250} src={advert.gallery.photos[0].image}
                                   className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start"
                                   alt="..."/>}
                        </scroll-img>
                        <scroll-img id="img-2">{advert.gallery.photos[1]
                            ? <img width={250} height={250} src={advert.gallery.photos[1].image}
                                   className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start"
                                   alt="..."/>}
                        </scroll-img>
                        <scroll-img id="img-3">{advert.gallery.photos[2]
                            ? <img width={250} height={250} src={advert.gallery.photos[2].image}
                                   className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start"
                                   alt="..."/>}
                        </scroll-img>
                    </scroll-container>
                </div>
                <div className="col-md-7">
                    <div className='description'>
                        <h2>{advert.price} р.</h2>
                        <p>{advert.category.parent.name} > {advert.category.name}</p>
                        <p>{advert.region}, {advert.place}</p>
                        <p>Состояние: {advert.is_new === "1" ? "новое" : "б/у"}</p>
                        {advert.charvalues &&
                            <>
                                <h5>Характеристики:</h5>
                                <ul>{advert.charvalues.map(charvalue =>
                                    <li key={charvalue.id}>{charvalue.characteristic.name}: {charvalue.val}</li>)}
                                </ul>
                            </>
                        }
                        <h5>Описание:</h5>
                        <p>{advert.description}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="phones">
                    <div className="col-md-5">
                        {phones}
                        <button className='btn btn-success-outline' onClick={togglePhones}>Связаться</button>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className='advert-user'>
                        {advert.user === localStorage.getItem('user')
                            ? <div className="advert-button">
                                <button className='btn btn-success-outline'
                                        onClick={() => navigate(`/advert-update/${advert.id}`)}>Изменить
                                </button>
                                <button className='second-btn btn-success' onClick={modal}>Удалить</button>
                            </div>
                            : <p><a href='#'>Продавец: {advert.user}</a></p>}
                    </div>
                </div>
            </div>
            {isShowModal &&
            <div className="modal d-block py-5">
                <div className="modal-content rounded-3 shadow">
                    <div className="modal-body p-4 text-center">
                        <h5 className="mb-0">Вы уверены, что хотите удалить это объявление?</h5>
                    </div>
                    <div className="modal-footer flex-nowrap p-0">
                        <button type="button" className="btn btn-lg col-6 m-0" style={{borderBottomLeftRadius: 25}} onClick={deleteAdvert}>
                            <strong>Да, удалить</strong></button>
                        <button type="button" className="btn btn-lg col-6" style={{borderBottomRightRadius: 25}} onClick={modal}>
                            <strong>Нет, спасибо</strong></button>
                    </div>
                </div>
            </div>}

        </div>

    );
}

export default AdvertDetail;

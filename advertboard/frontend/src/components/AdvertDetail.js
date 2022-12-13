import React, {useEffect, useState} from 'react';
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';
import {useForm} from "react-hook-form";

const advertBoardService = new AdvertBoardService();


function AdvertDetail(props) {

    const [advert, setAdvert] = useState({
        gallery: {photos: []},
        category: {id: null, name: null, parent: {id: null, name: null, parent: null}, slug: null}
    });
    const {id} = useParams();
    const navigate = useNavigate()
    const location = useLocation();
    const [isShowPhones, setIsShowPhones] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowCreate, setIsShowCreate] = useState(location.state?.isShowCreate ? location.state.isShowCreate : false);
    const [seller, setSeller] = useState({});
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const [isDelete, setIsDelete] = useState(false);
    const {register, formState: {errors, isValid}, handleSubmit, reset} = useForm({mode: "onBlur"});
    const [isSend, setIsSend] = useState(false);
    const [data, setData] = useState({});


    useEffect(() => {
        advertBoardService.getAdvert(id).then(function (result) {
            console.log(result);
            setAdvert(result);
            advertBoardService.getFreeProfile(result.user).then(function (res) {
                console.log(res);
                setSeller(res);
                if (res.user.username === localStorage.getItem('user')) {
                    setIsShowPhones(true);
                }
            })
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

    const modalCreate = () => {
        setIsShowCreate(!isShowCreate);
    }

    useEffect(() => {
        if (isDelete) {
            advertBoardService.deleteAdvert(id, access).then(function (result) {
                if (result) {
                    if (result.access) {
                        console.log(result)
                        localStorage.setItem('accessToken', result.access);
                        setAccess(result.access);
                        localStorage.setItem('refreshToken', result.refresh);
                    } else {
                        navigate('/profile/adverts', {replace: true})
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
    }, [isDelete, access])

    const deleteAdvert = () => {
        setIsDelete(true)
    }

    useEffect(() => {
        if (isSend) {
            const chat = {'advert': id, 'seller': advert.user};
            advertBoardService.createChat(chat, access).then(function (res) {
                if (res) {
                    if (res.access) {
                        console.log(res)
                        localStorage.setItem('accessToken', res.access);
                        setAccess(res.access);
                        localStorage.setItem('refreshToken', res.refresh);
                    } else {
                        advertBoardService.getUserChats(access).then(function (result) {
                            if (result) {
                                if (result.access) {
                                    localStorage.setItem('accessToken', res.access);
                                    setAccess(res.access);
                                    localStorage.setItem('refreshToken', res.refresh);
                                } else {
                                    const lastChat = result.sort((a, b) => b.id > a.id ? 1 : -1)[0];
                                    data['chat'] = lastChat.id;
                                    advertBoardService.createMessage(data, access).then(function (r) {
                                        if (r) {
                                            if (r.access) {
                                                console.log(r)
                                                localStorage.setItem('accessToken', r.access);
                                                setAccess(r.access);
                                                localStorage.setItem('refreshToken', r.refresh);
                                            } else {
                                                setIsSend(false);
                                                alert('Сообщение отправлено');
                                            }
                                        } else {
                                            navigate('/login', {replace: true, state: {from: location}});
                                        }
                                    });
                                }
                            } else {
                                navigate('/login', {replace: true, state: {from: location}});
                            }
                        })
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
    }, [isSend, access, data])

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
        setIsSend(true);
        setData(data);
        setIsShowCreate(false);
    }

    return (
        <div className='advert-detail' key={advert.id}>
            <p className='date'>{!advert.moderation && <text>На модерации</text>}{advert.date}</p>
            <h1 className='advert-title'>{advert.title}</h1>
            <div className="row">
                {advert.gallery.photos.length > 1
                    ? <div className="col-md-5">
                        <nav className='advert-images'>
                            {advert.gallery.photos.map((photo, index) =>
                                <a className='img' key={index} href={`#img-${index}`}>{index + 1}</a>)}
                        </nav>
                        <scroll-container>
                            {advert.gallery.photos.map((photo, index) =>
                                <scroll-img key={index} id={`img-${index}`}>
                                    <img width={250} height={250} src={photo.image}
                                         className="img-fluid rounded-start" alt="..."/>
                                </scroll-img>)}
                        </scroll-container>
                    </div>
                    : <div className="col-md-5">
                        <scroll-img>
                            <img width={250} height={250}
                                 src={advert.gallery.photos.length === 1 ? advert.gallery.photos[0].image : "/img/No_photo.png"}
                                 className="img-fluid rounded-start" alt="..."/>
                        </scroll-img>
                    </div>}

                <div className="col-md-7">
                    <div className='description'>
                        {advert.price
                            ? <h2>{advert.price} р.</h2>
                            : <h4>Бесплатно</h4>}
                        <p>{advert.category.parent && `${advert.category.parent.name} > `} {advert.category.name}</p>
                        <p>{advert.region && advert.region.title}, {advert.place && advert.place.city}</p>
                        <p><i>Состояние:</i> {advert.is_new === "1" ? "новое" : "б/у"}</p>
                        {advert.charvalues && advert.charvalues.length ?
                            <>
                                <h5>Характеристики:</h5>
                                <ul>{advert.charvalues.map(charvalue =>
                                    <li key={charvalue.id}><i>{charvalue.characteristic.name}:</i> {charvalue.val}
                                    </li>)}
                                </ul>
                            </> : <></>
                        }
                        <h5>Описание:</h5>
                        <p>{advert.description}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <div className="phones">
                        {phones}
                        {seller.user && seller.user.username !== localStorage.getItem('user') && <>
                            <button className='btn btn-success-outline' onClick={togglePhones}>Позвонить</button>
                            <button className='btn btn-success-outline'
                                    onClick={() => navigate(`/mess-to-seller/${advert.id}`)}>Написать
                            </button>
                        </>}
                    </div>
                </div>
                <div className="col-md-7">
                    <div className='advert-user'>
                        {seller.user && seller.user.username === localStorage.getItem('user')
                            ? <div className="advert-button">
                                <button className='btn btn-success-outline'
                                        onClick={() => navigate(`/advert-update/${advert.id}`)}>Изменить
                                </button>
                                <button className='second-btn btn-success' onClick={modal}>Удалить</button>
                            </div>
                            : <p><a
                                href={`/adverts/seller/${advert.user}`}><i>Продавец:</i> {seller.name ? seller.name : (seller.user && seller.user.username)}
                            </a></p>}
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
                            <button type="button" className="btn btn-lg col-6 m-0"
                                    style={{borderBottomLeftRadius: 25}}
                                    onClick={deleteAdvert}>
                                <strong>Да, удалить</strong></button>
                            <button type="button" className="btn btn-lg col-6" style={{borderBottomRightRadius: 25}}
                                    onClick={modal}>
                                <strong>Нет, спасибо</strong></button>
                        </div>
                    </div>
                </div>}
            {isShowCreate &&
                <div className="modal d-block py-5">
                    <div className="modal-content-mess rounded-3 shadow">
                        <div>
                            <a href={`/adverts/seller/${advert.user}`}> {seller.name ? seller.name : (seller.user && seller.user.username)}</a>
                        </div>
                        <form className="advert-mess-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body">
                                <textarea placeholder="Напишите сообщение" {...register("text", {
                                    required: true,
                                    maxLength: {value: 5000, message: "Максимум 5000 символов"}
                                })}/>
                                {errors?.text?.message &&
                                    <div className="error">
                                        <p>{errors.text.message}</p>
                                    </div>}
                            </div>
                            <div className="modal-footer flex-nowrap p-0">
                                <button type="submit" className="btn btn-lg col-5">
                                    <strong>Отправить</strong></button>
                                <button type="button" className="btn-2 btn-lg col-5" onClick={modalCreate}>
                                    <strong>Закрыть</strong></button>
                            </div>
                        </form>
                    </div>
                </div>}
        </div>
    );
}

export default AdvertDetail;

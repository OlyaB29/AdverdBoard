import React, {useEffect, useState} from 'react';
import AdvertBoardService from './AdvertBoardService';
import {useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {BsXOctagon} from "react-icons/bs";

const advertBoardService = new AdvertBoardService();


function Messages() {

    const navigate = useNavigate();
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [isSelect, setIsSelect] = useState(!!location.state?.selChat);
    const [chatId, setChatId] = useState(location.state?.selChat ? location.state.selChat.id : null);
    const [selChat, setSelChat] = useState(location.state?.selChat ? location.state.selChat : {});
    const [isShowModal, setIsShowModal] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [messages, setMessages] = useState([]);
    const [isShow, setIsShow] = useState([]);
    const now = new Date();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const {register, formState: {errors, isValid}, handleSubmit, reset} = useForm({mode: "onBlur"});
    const [isSend, setIsSend] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        setIsUpdate(false);
        advertBoardService.getUserChats(access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    let chatsComp = Object.assign([], chats);
                    chatsComp.length = 0;
                    result.map((r, index) => {
                        r['new_mess'] = r.messages.filter(mess => (mess.author !== Number(localStorage.getItem('userId')) && !mess.is_readed)).length;
                        advertBoardService.getFreeProfile(r.buyer !== Number(localStorage.getItem('userId'))
                            ? r.buyer : r.seller).then(function (res) {
                            r['companion'] = res;
                            chatsComp[index] = r;
                            if (chatsComp.filter(c => c !== undefined).length === result.length) {
                                setChats(chatsComp);
                                if (!isSelect) {
                                    setSelChat(chatsComp[0]);
                                    setChatId(chatsComp[0].id);
                                    setIsSelect(true);
                                    document.getElementById(chatsComp[0].id).style.backgroundColor='rgba(211, 188, 208, 0.7)';
                                } else {document.getElementById(chatId).style.backgroundColor='rgba(211, 188, 208, 0.7)';}
                            }
                        });
                    })
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        })
    }, [access, chatId, isUpdate]);

    useEffect(() => {
        setIsUpdate(false);
        if (isSelect) {
            advertBoardService.getChatMessages(chatId, access).then(function (result) {
                console.log(result);
                if (result) {
                    if (result.access) {
                        localStorage.setItem('accessToken', result.access);
                        setAccess(result.access);
                        localStorage.setItem('refreshToken', result.refresh);
                    } else {
                        setMessages(result);
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            })
        }
    }, [isSelect, chatId, access, isUpdate]);

    const selectChat = (id) => {
        setIsSelect(true);
        setChatId(id);
        setSelChat(chats.find(chat => chat.id === id));
        chats.map((chat)=>document.getElementById(chat.id).style.backgroundColor='');
        document.getElementById(id).style.backgroundColor='rgba(211, 188, 208, 0.7)';
    }

    const modal = (id) => {
        setIsShowModal(!isShowModal);
        id ? setDeleteId(id) : setDeleteId(null);
    }

    useEffect(() => {
        if (isDelete) {
            alert(deleteId);
            alert(chatId);
            advertBoardService.deleteChat(deleteId, access).then(function (result) {
                if (result) {
                    if (result.access) {
                        console.log(result)
                        localStorage.setItem('accessToken', result.access);
                        setAccess(result.access);
                        localStorage.setItem('refreshToken', result.refresh);
                    } else {
                        deleteId === chatId && setIsSelect(false);
                        setIsUpdate(true);
                        setIsDelete(false);
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
    }, [isDelete, access])

    const deleteChat = () => {
        setIsDelete(true);
        setIsShowModal(!isShowModal);
    }

    const changeShow = (index) => {
        setIsShow([...isShow.slice(0, index), !isShow[index], ...isShow.slice(index + 1)]);
    }

    useEffect(() => {
        if (isSend) {
            advertBoardService.createMessage(data, access).then(function (r) {
                if (r) {
                    if (r.access) {
                        console.log(r)
                        localStorage.setItem('accessToken', r.access);
                        setAccess(r.access);
                        localStorage.setItem('refreshToken', r.refresh);
                    } else {
                        reset();
                        setIsUpdate(true);
                        setIsSend(false);
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
    }, [isSend, access, data])

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
        data['chat'] = chatId;
        setIsSend(true);
        setData(data);
    }

    return (
        chats.length
            ? <div className="row-chats">
                <div className="chats">
                    <div className="top-chats">
                        <p>Выберите чат для общения</p>
                    </div>
                    <div className="scroll-chats" id='scroll'>
                        {chats.map(chat =>
                            <div className="chat-detail" id={chat.id} key={chat.id} onClick={() => selectChat(chat.id)}>
                                <div className="row">
                                    <div className="col-md-3">
                                        {chat.advert
                                            ? (chat.advert.gallery.photos.length > 0
                                                ? <img width={60} height={60} src={chat.advert.gallery.photos[0].image}
                                                       className="img-fluid rounded-start" alt="..."/>
                                                : <img width={60} height={60} src="/img/No_photo.png"
                                                       className="img-fluid rounded-start" alt="..."/>)
                                            : <img width={60} height={60} src="/img/No_photo.png"
                                                   className="img-fluid rounded-start" alt="..."/>
                                        }
                                    </div>
                                    <div className="col-md-9">
                                        <div>
                                            <p>{chat.companion?.name ? chat.companion.name : "Пользователь"}<br/>
                                                <small style={{fontSize: 14}}>
                                                    {chat.advert
                                                        ? (chat.advert.title.length > 22 ? `${chat.advert.title.slice(0, 22)}...` : chat.advert.title)
                                                        : "Объявление недоступно"}</small></p>
                                            <p className="card-text">
                                                {/*<small className="text-muted">*/}
                                                {/*    {chat.messages && `${chat.messages[chat.messages.length - 1].pub_date.slice(0, 5)} - */}
                                                {/*${chat.messages[chat.messages.length - 1].text.length > 19*/}
                                                {/*        ? `${chat.messages[chat.messages.length - 1].text.slice(0, 19)}...`*/}
                                                {/*        : chat.messages[chat.messages.length - 1].text}`}*/}
                                                {/*</small>*/}
                                                <small className="text-muted">
                                                    {chat.messages && `${chat.last_message_date.slice(0, 5)} - 
                                                ${chat.last_message_text.length > 19
                                                        ? `${chat.last_message_text.slice(0, 19)}...`
                                                        : chat.last_message_text}`}
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <BsXOctagon className="delete-chat" onClick={(event) => {
                                    event.stopPropagation();
                                    modal(chat.id);
                                }}/>
                                {chat.new_mess > 0 &&
                                    <small className="new-count">{chat.new_mess}</small>
                                }
                            </div>)}
                    </div>
                </div>
                <div className="messages">
                    <div className="top-mess">
                        <div className="row">
                            <div className='companion'>
                                <p><b>
                                    <a href={`/adverts/seller/${selChat.companion?.user.id}`}>
                                        {selChat.companion?.name ? selChat.companion.name : "Пользователь"}
                                    </a></b></p>

                            </div>
                            {selChat.advert
                                ? <div className='advert'>
                                    <a className='mess-advert' href={`/adverts/${selChat.advert.id}`}>
                                        <ul>
                                            <li><b>{selChat.advert.title}</b></li>
                                            <li>{selChat.advert.price ? `${selChat.advert.price} р.` : "бесплатно"}</li>
                                        </ul>
                                        <img width={50} height={40} className="img-fluid rounded-start" alt="..."
                                             src={selChat.advert.gallery.photos ? selChat.advert.gallery.photos[0].image : "/img/No_photo.png"}
                                        />
                                    </a>
                                </div>
                                : <div className='not-advert'>
                                    <ul>
                                        <li><b>Объявление недоступно</b></li>
                                    </ul>
                                    <img width={50} height={40} className="img-fluid rounded-start" alt="..."
                                         src="/img/No_photo.png"/>
                                </div>}
                        </div>
                    </div>
                    {messages.length &&
                        <div className="scroll-messages">
                            {messages.map((mess, index) =>
                                <div className="message-block" key={mess.id}>
                                    <div
                                        className={mess.author === Number(localStorage.getItem('userId')) ? "my-message" : "companion-message"}>
                                        {((index && messages[index - 1].pub_date.slice(0, 10) !== mess.pub_date.slice(0, 10)) || !index || isShow[index]) &&
                                            <small className="text-muted">
                                                {now.getFullYear() === Number(mess.pub_date.slice(6, 10))
                                                    ? ((now.getMonth() === Number(mess.pub_date.slice(3, 5)) - 1 && now.getDate() === Number(mess.pub_date.slice(0, 2)))
                                                        ? `Сегодня${mess.pub_date.slice(10, 17)}`
                                                        : mess.pub_date.slice(0, 5) + mess.pub_date.slice(10, 17))
                                                    : mess.pub_date}</small>}
                                        <div className="mess-text" onClick={() => changeShow(index)}>
                                            <small style={{fontSize: 15}}>{mess.text}</small>
                                        </div>
                                        {(mess.author === Number(localStorage.getItem('userId')) && (index === messages.length - 1 || isShow[index])) &&
                                            <small className="text-muted"
                                                   style={{float: "right"}}>{mess.is_readed ? "Прочитано" : "Доставлено"}</small>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>}
                    <form className="mess-form" onSubmit={handleSubmit(onSubmit)}>
                        <input placeholder="Напишите сообщение" {...register("text", {
                            required: true,
                            maxLength: {value: 5000, message: "Максимум 5000 символов"}
                        })}/>
                        <button className="btn btn-success" type="submit" disabled={!isValid}>Отправить</button>
                        {errors?.text?.message &&
                            <div className="error">
                                <p>{errors.text.message}</p>
                            </div>}
                    </form>
                </div>
                {isShowModal &&
                    <div className="modal d-block py-5">
                        <div className="modal-content rounded-3 shadow">
                            <div className="modal-body p-4 text-center">
                                <h5 className="mb-0">Вы уверены, что хотите удалить этот чат?</h5>
                            </div>
                            <div className="modal-footer flex-nowrap p-0">
                                <button type="button" className="btn btn-lg col-6 m-0"
                                        style={{borderBottomLeftRadius: 25}}
                                        onClick={() => deleteChat()}>
                                    <strong>Да, удалить</strong></button>
                                <button type="button" className="btn btn-lg col-6"
                                        style={{borderBottomRightRadius: 25}}
                                        onClick={modal}>
                                    <strong>Нет, спасибо</strong></button>
                            </div>
                        </div>
                    </div>}
            </div>
            : <h4>На данный момент у Вас нет бесед</h4>
    )
}

export default Messages;
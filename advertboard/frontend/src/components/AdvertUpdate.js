import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';

const advertBoardService = new AdvertBoardService();


function AdvertUpdate() {

    const [advert, setAdvert] = useState({gallery:{photos:[{image:null},{image:null},{image:null}]}, category:{}});

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        advertBoardService.getAdvert(id).then(function (result) {
            console.log(result);
            setAdvert(result)
        })
    }, [id]);


    const deleteAdvert = () => {
        const access = localStorage.getItem('accessToken')
        advertBoardService.deleteAdvert(id, access).then(() => {
            navigate('/profile/adverts',{replace: true})
        });
    }

    return (
        <div className='advert-detail'>
            <h1 className='advert-title'>{advert.title}</h1>
            <div className="row">
                <div className="col-md-6">
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
                            ? <img width={250} height={250} src={advert.gallery.photos[0].image} className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start" alt="..."/>}
                        </scroll-img>
                        <scroll-img id="img-2">{advert.gallery.photos[1]
                            ? <img width={250} height={250} src={advert.gallery.photos[1].image} className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start" alt="..."/>}
                        </scroll-img>
                        <scroll-img id="img-3">{advert.gallery.photos[2]
                            ? <img width={250} height={250} src={advert.gallery.photos[2].image} className="img-fluid rounded-start" alt="..."/>
                            : <img width={250} height={250} src="/img/No_photo.png" className="img-fluid rounded-start" alt="..."/>}
                        </scroll-img>
                    </scroll-container>
                </div>
                <div className="col-md-6">
                    <div className='form-control'  key={advert.id}>
                        <label>Заголовок:</label>
                        <imput name="title" value={advert.title}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="phones">

                </div>

                <div className="col-md-6">
                    <div className='advert-user'>

                        <div className="advert-button">
                             <button className='btn btn-success-outline'>Подтвердить</button>
                        </div>

                    </div>
                </div>
            </div>

        </div>

    );
}

export default AdvertUpdate;

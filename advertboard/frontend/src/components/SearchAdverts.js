import React, {useEffect, useState} from 'react';
import {useSearchParams, useLocation} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';

const advertBoardService = new AdvertBoardService();


function SearchAdverts() {

    const [adverts, setAdverts] = useState([]);
    // const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    console.log(location)
    // setSearchParams({'advert':location.state.query})
    // const advQuery = searchParams.get('advert') || '';
    const advQuery = location.state.query || '';

    useEffect(() => {
        advertBoardService.getAdverts().then(function (result) {
            const res=result.filter(advert => advert.title.toLowerCase().includes(advQuery));
		    console.log(res);
            console.log(advQuery);
            setAdverts(res);
        })
    }, [advQuery]);

    return (
		<div className="advert_list">
			{adverts.map(advert  =>
				<div className="card mb-3" key={advert.id}>
					<a className='card-link' href={`/adverts/${advert.id}`}>
					    <div className="row">
                            <div className="col-md-3">
								{advert.gallery.photos.length>0
								?	<img width={150} height={150} src={advert.gallery.photos[0].image} className="img-fluid rounded-start" alt="..."/>
								:   <img width={150} height={150} src="/img/No_photo.png"	className="img-fluid rounded-start" alt="..."/>
								}
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{advert.title}</h5>
								    <p className="card-text">{advert.price} р.</p>
                                    <p className="card-text"><small className="text-muted">{advert.category.name}</small></p>
								    <ul>
                                        <li><small className="text-muted">{advert.is_new==="1" ? "Новое" : "Б/у"}, {advert.region}, {advert.place}</small></li>
                                        <li className='date float-right'>{advert.date}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
					</a>
				</div>)}
		</div>
	);

}

export default SearchAdverts;
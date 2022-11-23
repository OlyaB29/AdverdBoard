import React from "react";

export default function OutputAdverts (props) {

    return (
		<>
			{props.adverts.map(advert  =>
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
									<ul>
										<li><h5 className="card-title">{advert.title}</h5></li>
									    {props.isModeration && !advert.moderation &&
										<li className='mode float-right'>На модерации</li>}
									</ul>
								    <p className="card-text">{advert.price} р.</p>
                                    <p className="card-text"><small className="text-muted">{advert.category.parent.name} > {advert.category.name}</small></p>
								    <ul>
                                        <li><small className="text-muted">{advert.is_new==="1" ? "Новое" : "Б/у"}, {advert.region}, {advert.place}</small></li>
                                        <li className='date float-right'>{advert.date}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
					</a>
				</div>)
			}
		</>
	);
}

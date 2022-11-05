import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import AdvertBoardService from './AdvertBoardService';
import OutputAdverts from "./OutputAdverts";

const advertBoardService = new AdvertBoardService();

function CategoryAdvertList() {

    const [adverts, setAdverts] = useState([])
    const {slug} = useParams();


    useEffect(() => {
        advertBoardService.getCategories().then(function (response) {
            const category = response.data.filter(cat => cat.slug === slug)[0];
            console.log(category);
            const numbers = [category.id];
            category.children.map(child =>{
                numbers.push(child.id);
                child.children.map(ch =>
                    numbers.push(ch.id))});
            console.log(numbers);
            advertBoardService.getAdverts().then(function (result) {
		        const res = result.filter(advert => numbers.includes(advert.category.id));
                console.log(res)
                setAdverts(res);
                console.log(adverts)});
        })
    }, [slug, adverts]);


    return (
        <div className="advert_list">
			<OutputAdverts adverts={adverts}/>
		</div>
    )
}
export default CategoryAdvertList;
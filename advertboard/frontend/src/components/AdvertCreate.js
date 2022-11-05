import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import Select from 'react-select'
import {useEffect, useState} from "react";
import AdvertBoardService from "./AdvertBoardService";
// import useAxios from 'axios-hooks';

const advertBoardService = new AdvertBoardService();

const CustomSelect = ({id, options, onChange}) => {
    return (
        <select className="custom-select" id={id} onChange={onChange}>
            {options.length === 0
            ? <option>Вариантов нет</option>
            : options.map((option, index) =>
                <option key={id + index} value={option.id}>
                    {id === 'category' &&
                        (option.parent ? `${option.parent.name} > ${option.name}` : option.name)}
                    {id === 'region' && option.title}
                    {id === 'place' && option.city}
                </option>
            )}
        </select>
    )
}

export default function AdvertCreate() {
    // const navigate = useNavigate()
    // const user = localStorage.getItem('user')
    // const access  = localStorage.getItem('accessToken');
    // const refresh  = localStorage.getItem('refreshToken');
    const {register, control} = useForm()
    const [catSelect, setCatSelect] = useState({})
    const [options, setOptions] = useState([])
    const [categories, setCategories] = useState([])
    const [allCharValues, setAllCharValues] = useState([])
    const [charValues, setCharValues] = useState([])
    const [regions, setRegions] = useState([])
    const [places, setPlaces] = useState([])
    const [selValuesId, setSelValuesId] = useState([])

    // const [{ data, loading, error}, refetchRegions] = useAxios(`${API_URL}/api/regions/`)
    const getOptions=(data) =>{
        const options =
        data.length === 0
        ? [{value: 0, label: "Нет вариантов"}]
        : data.map(d => ({
            value: d.id,
            label: `${d.characteristic.name} -- ${d.val}`
        }));
        console.log(options);
        setOptions(options)
    }

    useEffect(()  => {
        advertBoardService.getRegions().then((result)=> {
            console.log(result.data);
            setRegions(result.data);
            setPlaces(result.data[0].places);
            }
        );
        // refetchRegions().then((result)=> {
        //     console.log(result.data);
        //     setRegions(result.data);
        //     setPlaces(result.data[0].places);
        //     console.log(regions)}
        // );
        advertBoardService.getCategories().then(function (response) {
            const catResult = response.data.filter(cat => cat.children.length === 0);
            setCategories(catResult);
            advertBoardService.getCharValues().then(function (result) {
                setAllCharValues(result.data);
                const valResult = result.data.filter(val => (val.characteristic.categories.includes(catResult[0].id)));
                console.log(valResult);
                setCharValues(valResult);
                getOptions(valResult);
            });
        });
    }, []);


    const onCategorySelectChange = (e) => {
        const selCategoryID = e.target.value;
        setCharValues(allCharValues.filter(val => (val.characteristic.categories.includes(Number(selCategoryID)))));
        getOptions(allCharValues.filter(val => (val.characteristic.categories.includes(Number(selCategoryID)))));
    }

    const getValue = () => {
        console.log(selValuesId);
        console.log(options);
        if (selValuesId.length > 0) {
            return options.filter(option => selValuesId.indexOf(option.value) >= 0)
        }
        else {return []}
    }

    const onCharValueSelectChange = (event) => {
        event.map((e) => console.log(e.value));
        setSelValuesId(event.map((e) => e.value));
        console.log(selValuesId)
    }

    const onRegionSelectChange = (e) => {
        const selRegionID = e.target.value;
        const region = regions.find(item => item.id === Number(selRegionID));
        setPlaces(region.places);
    }

    const onPlaceSelectChange = (e) => {
        const selPlaceID = e.target.value;
    }

    return (
        <div>
            <h1>Создание объявления</h1>
            <div className="container mt-5">
                <form>
                <CustomSelect id="category" options={categories} onChange={onCategorySelectChange}/>
                <Select className="multi-select" options={options} value={getValue()} onChange={onCharValueSelectChange}
                        isMulti={true} placeholder="Выберите характеристики"/>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="region" style={{fontWeight:"bolder"}}>Регионы</label>
                        <CustomSelect id="region" options={regions} onChange={onRegionSelectChange}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="place" style={{fontWeight:"bolder"}}>Города/районы</label>
                        <CustomSelect id="place" options={places} onChange={onPlaceSelectChange}/>
                    </div>
                </div>
                </form>
            </div>

        </div>

    )
}
// placeholder={options.length===0 ? '' : options[0].label}
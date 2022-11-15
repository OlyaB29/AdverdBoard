import {useNavigate} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import Select from 'react-select'
import React, {useEffect, useRef, useState} from "react";
import AdvertBoardService from "./AdvertBoardService";
import {BsPlusCircle, BsXOctagon} from "react-icons/bs";


const advertBoardService = new AdvertBoardService();

const CustomSelect = ({id, options, onChange, placeholder}) => {

    return (
        <select className="custom-select" id={id} onChange={onChange} placeholder={placeholder}>
            <option>Выберите...</option>
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
    const access = localStorage.getItem('accessToken');
    // const refresh  = localStorage.getItem('refreshToken');
    const {register, formState: {errors, isValid}, handleSubmit, reset, control, setValue} = useForm({mode: "onBlur"})
    const [options, setOptions] = useState([])
    const [categories, setCategories] = useState([])
    const [allCharValues, setAllCharValues] = useState([])
    const [charValues, setCharValues] = useState([])
    const [regions, setRegions] = useState([])
    const [places, setPlaces] = useState([])
    const [selValuesId, setSelValuesId] = useState([])
    const [isShowInputPhone, setIsShowInputPhone] = useState(false)


    const getOptions = (data) => {
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

    useEffect(() => {
        advertBoardService.getRegions().then((result) => {
                console.log(result.data);
                setRegions(result.data);
                setPlaces(result.data[0].places);
            }
        );
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
        advertBoardService.getProfile(localStorage.getItem('userId'), access).then(
            function (result) {
                setValue("phone_1", result.phone)
            })
    }, []);


    // const onCategorySelectChange = (e) => {
    //     const selCategoryID = e.target.value;
    //     console.log(selCategoryID);
    //     setCharValues(allCharValues.filter(val => (val.characteristic.categories.includes(Number(selCategoryID)))));
    //     getOptions(allCharValues.filter(val => (val.characteristic.categories.includes(Number(selCategoryID)))));
    // }

    const onCategorySelectChange = (e) => {
        setCharValues(allCharValues.filter(val => (val.characteristic.categories.includes(Number(e)))));
        getOptions(allCharValues.filter(val => (val.characteristic.categories.includes(Number(e)))));
    }

    // const getValue = () => {
    //     console.log(selValuesId);
    //     console.log(options);
    //     if (selValuesId.length > 0) {
    //         // if (value.length > 0) {
    //         return options.filter(option => selValuesId.indexOf(option.value) >= 0)
    //         // return options.filter(option => value.indexOf(option.value) >= 0)
    //     } else {
    //         return []
    //     }
    // }

    const getValue = (value) => {
        console.log(selValuesId);
        console.log(options);
        if (value) {
            return options.filter(option => value.indexOf(option.value) >= 0)
        } else {
            return []
        }
    }

    const onCharValueSelectChange = (event) => {
        event.map((e) => console.log(e.value));
        setSelValuesId(event.map((e) => e.value));
        console.log(selValuesId)
    }

    const onRegionSelectChange = (e) => {
        // const selRegionID = e.target.value;
        const region = regions.find(item => item.id === Number(e));
        setPlaces(region.places);
    }

    const onPlaceSelectChange = (e) => {
        const selPlaceID = e.target.value;
    }

    const showInput = () => {
        setIsShowInputPhone(!isShowInputPhone);
    }

    // const [files, setFiles] = useState([]);
    const [photos, setPhotos] = useState([]);
    const img = []
    img[0] = useRef()
    img[1] = useRef()
    img[2] = useRef()
    img[3] = useRef()
    img[4] = useRef()
    img[5] = useRef()
    img[6] = useRef()
    img[7] = useRef()
    img[8] = useRef()
    img[9] = useRef()
    const selFile = useRef()

    const[output,SetOutput] = useState(<p>Добавлено 0 фото из 10</p>)

    const selectFiles = () => {
        selFile.current.click();
    }

    const renderPhoto = (photos) => {
        const empty = [0,1,2,3,4,5,6,7,8,9];
        photos.map((photo, index) => {
            const reader = new FileReader();
            console.log(index);
            console.log(photo.name);
            reader.onload = function () {
                img[index].current.src = reader.result;
            };
            reader.readAsDataURL(photo);
            delete empty[index];
        });
        if (empty.length) {
            empty.map((em)=>
            img[em].current.src = "/img/No_photo.png")}

        SetOutput(<p>Добавлено {photos.length} фото из 10</p>)


    }

    const addPhoto = (event) => {

        const target = event.target;

        if (!FileReader) {
            alert('FileReader не поддерживается — облом');
            return;
        }
        if (!target.files.length) {
            alert('Ничего не загружено');
            return;
        }

        const files = Array.from(target.files || []).slice(0, (10-photos.length));
        const allPhotos = photos.concat(files);
        setPhotos(allPhotos);

        renderPhoto(allPhotos);

        // allPhotos.map((photo, index) => {
        //     const reader = new FileReader();
        //     console.log(index);
        //     console.log(photo.name);
        //     reader.onload = function () {
        //         img[index].current.src = reader.result;
        //     };
        //     reader.readAsDataURL(photo);
        //     delete empty[0];
        // });
        // if (empty.length) {
        //     empty.map((em) => {
        //         img[em].current.src = "/img/No_photo.png"
        //     });
        // }
    }

    const deletePhoto = (index) => {
        photos.splice(index,1);
        setPhotos(photos);
        renderPhoto(photos);
    }

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
        console.log(data);
        advertBoardService.createAdvert(data, access).then(r => {
            advertBoardService.getUserAdverts(access).then(function (result) {
                const lastAdvert = result.sort((a, b) => b.id > a.id ? 1 : -1)[0];
                const lastAdvertId = lastAdvert.id;
                const lastGalleryId = lastAdvert.gallery.id;
                console.log(lastGalleryId);
                console.log(access);
                // advertBoardService.updateGalleryAdvert(lastAdvertId, formData, access).then(function (result) {
                //     alert('Фото добавлены');
                //     console.log(result.config)
                // });
                const formData = new FormData();
                // formData.append('gallery', lastGalleryId);
                // files.map((file) => {
                //     formData.set('image', file);
                //     advertBoardService.createPhoto(formData, access).then(function (result) {
                //         alert('Фото добавлены');
                //     });
                // });
                // formData.set('image', files[0]);
                // advertBoardService.updatePhoto(13,formData, access).then(function (result) {
                //         alert('Фото изменено');
                //     });
                // advertBoardService.deletePhoto(15, access).then(function (result) {
                //         alert('Фото удалено');
                //     });
            });
            reset()
        });
    }

    return (
        <div className="add-advert">
            <div className="container mt-5" style={{width: 900}}>
                <h1>Подача объявления</h1>
                <form className='photos' style={{marginTop: 30}} onClick={selectFiles}>
                    {/*{img.map((index)=>*/}
                    {/*<img src="/img/No_photo.png" alt="" ref={img[index]} style={{margin:7}} width={160} height={160}/>)}*/}
                    <div className="selected-photo" >
                        <img src="/img/No_photo.png" alt="" ref={img[0]} />
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(0)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[1]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(1)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[2]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(2)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[3]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(3)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[4]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(4)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[5]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(5)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[6]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(6)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[7]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(7)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[8]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(8)}}/>
                    </div>
                     <div className="selected-photo">
                        <img src="/img/No_photo.png" alt="" ref={img[9]}/>
                        <BsXOctagon className="delete-photo" onClick={(event)=>{event.stopPropagation();deletePhoto(9)}}/>
                    </div>
                    <input className="hidden" type="file" ref={selFile} multiple onChange={addPhoto}
                           accept="image/*,.png,.jpg,.gif"/>
                    {output}
                </form>

                <form onSubmit={handleSubmit(onSubmit)} style={{marginTop: 20}}>
                    <label style={{width: 870}}>
                        Заголовок:
                        <input className="form-control" style={{marginTop: 10}}
                               {...register("title", {
                                   required: "Поле обязательно к заполнению",
                                   maxLength: {value: 30, message: "Максимум 30 символов"}
                               })}
                        />
                        {errors?.title &&
                            <div className="error">
                                <p>{errors.title.message}</p>
                            </div>}
                    </label>
                    <label style={{width: 870, marginTop: 15}}>
                        Категория:
                        <Controller
                            control={control}
                            name="category"
                            rules={{required: "Необходимо выбрать категорию"}}
                            render={({field: {onChange}, fieldState: {error}}) => (
                                <div>
                                    <CustomSelect id="category" options={categories} placeholder="Выберите..."
                                                  onChange={(newValue) => {
                                                      onChange(Number(newValue.target.value));
                                                      onCategorySelectChange(newValue.target.value)
                                                  }}/>
                                    {error &&
                                        <div className="error">
                                            <p>{error.message}</p>
                                        </div>}
                                </div>
                            )}
                        />
                    </label>
                    <label style={{width: 870, marginTop: 15}}>
                        Характеристики:
                        <Controller
                            control={control}
                            name="charvalues"
                            rules={{required: options.length > 1 && "Необходимо выбрать характеристики"}}
                            render={({field: {onChange, value}, fieldState: {error}}) => (
                                <div>
                                    <Select classNamePrefix="multi-select"
                                            options={options}
                                            value={getValue(value)}
                                            onChange={(newValue) => {
                                                onChange(newValue.map((v) => v.value))
                                            }}
                                            isMulti={true}
                                            placeholder="Выберите..."/>
                                    {/*    <Select classNamePrefix="multi-select" options={options} value={getValue()}*/}
                                    {/*onChange={onCharValueSelectChange} isMulti={true}*/}
                                    {/*placeholder="Выберите характеристики"/>*/}
                                    {error &&
                                        <div className="error">
                                            <p>{error.message}</p>
                                        </div>}
                                </div>
                            )}
                        />
                    </label>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label style={{width: 415, marginTop: 10}} htmlFor="radio-group">Состояние:
                                <div className="radio-group" id="radio-group" style={{marginTop: 10}}>
                                    <div className="radio">
                                        <label className="radio-label" htmlFor="radio-1"
                                               style={{marginRight: 10}}>Новое</label>
                                        <input type="radio" name="radio" id="radio-1"
                                               value="1" {...register("is_new", {required: "Укажите состояние"})}/>
                                    </div>
                                    <div className="radio">
                                        <label htmlFor="radio-2" style={{marginRight: 10, marginLeft: 15}}>Б/у</label>
                                        <input type="radio" name="radio" id="radio-2"
                                               value="2" {...register("is_new", {required: "Укажите состояние"})} />
                                    </div>
                                </div>
                            </label>
                            {errors?.is_new &&
                                <div className="error">
                                    <p>{errors.is_new.message}</p>
                                </div>}
                        </div>
                        <div className="form-group col-md-6">
                            <label style={{width: 300, marginTop: 10}}>Цена в рублях:
                                <input className="form-control" type="number"
                                       {...register("price")} style={{marginTop: 10}}/>
                            </label>
                        </div>
                    </div>
                    <label style={{width: 870, marginBottom: 20}}>
                        Описание:
                        <textarea className="form-control" style={{marginTop: 10, marginBottom: 10, height: 150}}
                                  {...register("description", {
                                      required: "Поле обязательно к заполнению",
                                      maxLength: {value: 4000, message: "Максимум 4000 символов"},
                                      minLength: {value: 20, message: "Минимум 20 символов"}
                                  })}/>
                        {errors?.description &&
                            <div className="error">
                                <p>{errors.description.message}</p>
                            </div>}
                    </label>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label style={{width: 415}} htmlFor="region">
                                Регион:
                                <Controller
                                    control={control}
                                    name="region"
                                    rules={{required: "Необходимо выбрать регион"}}
                                    render={({field: {onChange}, fieldState: {error}}) => (
                                        <div>
                                            <CustomSelect id="region" options={regions} placeholder="Выберите регион"
                                                          onChange={(newValue) => {
                                                              onChange(Number(newValue.target.value));
                                                              onRegionSelectChange(newValue.target.value)
                                                          }}/>
                                            {error &&
                                                <div className="error">
                                                    <p>{error.message}</p>
                                                </div>}
                                        </div>
                                    )}
                                />
                            </label>
                        </div>
                        <div className="form-group col-md-6">
                            <label style={{width: 415}} htmlFor="place">
                                Город/район:
                                <Controller
                                    control={control}
                                    name="place"
                                    rules={{required: "Необходимо выбрать город или район города Минска"}}
                                    render={({field: {onChange}, fieldState: {error}}) => (
                                        <div>
                                            <CustomSelect id="place" options={places}
                                                          placeholder="Выберите город или район"
                                                          onChange={(newValue) => {
                                                              onChange(Number(newValue.target.value))
                                                          }}/>
                                            {error &&
                                                <div className="error">
                                                    <p>{error.message}</p>
                                                </div>}
                                        </div>
                                    )}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label style={{width: 415}}>
                                Телефон 1:
                                <input className="form-control" style={{marginTop: 10, marginBottom: 10}}
                                       {...register("phone_1", {
                                           pattern: {
                                               value: /(?:\+375|80)\s?\(?\d\d\)?\s?\d\d(?:\d[\-\s]\d\d[\-\s]\d\d|[\-\s]\d\d[\-\s]\d\d\d|\d{5})/,
                                               message: "Некорректное значение"
                                           }
                                       })}
                                />
                                {errors?.phone_1 &&
                                    <div className="error">
                                        <p>{errors.phone_1.message}</p>
                                    </div>}
                            </label>
                        </div>
                        <div className="form-group col-md-6">
                            {!isShowInputPhone
                                ? <div style={{width: 415}}>
                                    <button className='btn-phone' onClick={showInput}><BsPlusCircle
                                        style={{width: 30, height: 30, marginRight: 10}}/>Добавить номер
                                    </button>
                                </div>
                                : <label style={{width: 415}}>
                                    Телефон 2:
                                    <input className="form-control" style={{marginTop: 10, marginBottom: 10}}
                                           {...register("phone_2", {
                                               pattern: {
                                                   value: /(?:\+375|80)\s?\(?\d\d\)?\s?\d\d(?:\d[\-\s]\d\d[\-\s]\d\d|[\-\s]\d\d[\-\s]\d\d\d|\d{5})/,
                                                   message: "Некорректное значение"
                                               }
                                           })}
                                    />
                                    {errors?.phone_2 &&
                                        <div className="error">
                                            <p>{errors.phone_2.message}</p>
                                        </div>}
                                </label>
                            }
                        </div>
                    </div>
                    <button className="w-50 btn" type='submit'>Подать объявление</button>
                </form>
            </div>
        </div>
)
}
// disabled=
//     {
//         !isValid
//     }


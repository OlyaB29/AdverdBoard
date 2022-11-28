import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import Select from 'react-select'
import React, {useEffect, useRef, useState} from "react";
import AdvertBoardService from "./AdvertBoardService";
import {BsPlusCircle, BsXOctagon} from "react-icons/bs";

const advertBoardService = new AdvertBoardService();

const CustomSelect = ({id, options, value, onChange, placeholder}) => {

    return (
        <select className="custom-select" id={id} value={value} onChange={onChange} placeholder={placeholder}>
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


export default function AdvertCreateUpdate() {
    const navigate = useNavigate();
    const location = useLocation();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    // const refresh  = localStorage.getItem('refreshToken');
    const {id} = useParams();
    const {register, formState: {errors, isValid}, handleSubmit, reset, control, setValue} = useForm({mode: "onBlur"});
    const [options, setOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allCharValues, setAllCharValues] = useState([]);
    const [regions, setRegions] = useState([]);
    const [places, setPlaces] = useState([]);
    const [isShowInputPhone, setIsShowInputPhone] = useState(false);
    const [indexes, setIndexes] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [advert, setAdvert] = useState({});
    const [oldPhotos, setOldPhotos] = useState([]);
    const [idForDelete, setIdForDelete] = useState([]);
    const [photos, setPhotos] = useState([]);
    const selFile = useRef();
    const [refe, setRefe] = useState([]);
    let copy = Object.assign([], refe);
    const [output, SetOutput] = useState(<p>Добавлено 0 фото из 10</p>);
    const [isCreate, setIsCreate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [data, setData] = useState({});
    const [isShowModal, setIsShowModal] = useState(false);


    const getOptions = (data) => {
        console.log(data)
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
                result.data.map((r) => r.places.map((p) => places.push(p)));
                console.log(places);
                setRegions(result.data);
                setPlaces(places);
            }
        );
        advertBoardService.getCategories().then(function (response) {
            const catResult = response.data.filter(cat => cat.children.length === 0);
            setCategories(catResult);
            advertBoardService.getCharValues().then(function (result) {
                setAllCharValues(result.data);
                if (!id) {getOptions(result.data)}
            });
        });
        advertBoardService.getProfile(localStorage.getItem('userId'), access).then(
            function (result) {
                if (result) {
                    if (result.access) {
                        localStorage.setItem('accessToken', result.access);
                        setAccess(result.access);
                        localStorage.setItem('refreshToken', result.refresh);
                    } else {
                        setValue("phone_1", result.phone)
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }, [access]);

    useEffect(() => {
        if (id) {
            console.log(allCharValues)
            advertBoardService.getAdvert(id).then(function (result) {
                console.log(result);
                setAdvert(result);
                setValue("title", result.title);
                setValue("category", result.category.id);
                setValue("charvalues", result.charvalues.map((ch) => ch.id));
                console.log(result.charvalues);
                setValue("is_new", result.is_new);
                setValue("price", result.price);
                setValue("description", result.description);
                setValue("region", result.region.id);
                setValue("place", result.place.id);
                setValue("phone_1", result.phone_1);
                setValue("phone_2", result.phone_2);
                if (result.gallery.photos) {
                    setOldPhotos(result.gallery.photos);
                    console.log(result.gallery.photos);
                    setRefe(result.gallery.photos.map((ph) => ph.image));
                    SetOutput(<p>Добавлено {result.gallery.photos.length} фото из 10</p>)
                }
                if (!result.charvalues.length) {getOptions(result.charvalues)}
                else {getOptions(allCharValues.filter(val => (val.characteristic.categories.includes(result.category.id))))}
            })
        }
    }, [id,allCharValues]);

    const onCategorySelectChange = (e) => {
        getOptions(allCharValues.filter(val => (val.characteristic.categories.includes(Number(e)))));
    }

    const getValue = (value) => {
        console.log(options);
        console.log(value);
        if (value) {
            return options.filter(option => value.indexOf(option.value) >= 0)
        } else {
            return []
        }
    }

    const onRegionSelectChange = (e) => {
        const region = regions.find(item => item.id === Number(e));
        setPlaces(region.places);
    }

    const showInput = () => {
        setIsShowInputPhone(!isShowInputPhone);
    }


    const selectFiles = () => {
        selFile.current.click();
    }

    const renderPhoto = (photos) => {
        // copy.length=0;
        console.log(oldPhotos.length);
        copy = copy.slice(0, oldPhotos.length)
        console.log(copy);
        !photos.length && setRefe(copy);
        photos.map((photo, index) => {
            const reader = new FileReader();
            console.log(index);
            console.log(photo.name);
            reader.onload = function () {
                // img[index].current.src = reader.result;
                copy.push(reader.result);
                setRefe(copy);
            };
            reader.readAsDataURL(photo);
        });

        SetOutput(<p>Добавлено {oldPhotos.length + photos.length} фото из 10</p>)
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
        const files = Array.from(target.files || []).slice(0, (10 - photos.length));
        const allPhotos = photos.concat(files);
        setPhotos(allPhotos);
        renderPhoto(allPhotos);
    }

    const deletePhoto = (index) => {
        if (index >= oldPhotos.length) {
            photos.splice(index - oldPhotos.length, 1);
            setPhotos(photos);
        } else {
            idForDelete.push(oldPhotos[index].id);
            setIdForDelete(idForDelete);
            oldPhotos.splice(index, 1);
            setOldPhotos(oldPhotos);
            copy.splice(index, 1);
        }
        renderPhoto(photos);
    }

    const modal = () => {
        setIsShowModal(!isShowModal);
    }

    useEffect(() => {
        if (isCreate) {
            advertBoardService.createAdvert(data, access).then(function (r) {
                if (r) {
                    if (r.access) {
                        console.log(r)
                        localStorage.setItem('accessToken', r.access);
                        setAccess(r.access);
                        localStorage.setItem('refreshToken', r.refresh);
                    } else {
                        {photos.length
                        ? advertBoardService.getUserAdverts(access).then(function (result) {
                            const lastAdvert = result.sort((a, b) => b.id > a.id ? 1 : -1)[0];
                            const lastGalleryId = lastAdvert.gallery.id;
                            console.log(lastGalleryId);
                            const formData = new FormData();
                            formData.append('gallery', lastGalleryId);
                            photos.map((photo) => {
                                formData.set('image', photo);
                                advertBoardService.createPhoto(formData, access);
                            });
                        }).then(r => setIsShowModal(true))
                        : setIsShowModal(true)}
                        reset();
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
        if (isUpdate) {
            advertBoardService.updateAdvert(id, data, access).then(function (r) {
                if (r) {
                    if (r.access) {
                        console.log(r)
                        localStorage.setItem('accessToken', r.access);
                        setAccess(r.access);
                        localStorage.setItem('refreshToken', r.refresh);
                    } else {
                        idForDelete.map((id) => advertBoardService.deletePhoto(id, access));
                        const formData = new FormData();
                        formData.append('gallery', advert.gallery.id);
                        {photos.length &&
                        photos.map((photo) => {
                            formData.set('image', photo);
                            advertBoardService.createPhoto(formData, access);
                        })}
                        setIsShowModal(true);
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            });
        }
    }, [isCreate, isUpdate, access, data])

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
        if (!id) {
            setIsCreate(true);
        } else {
            data['moderation'] = "False";
            setIsUpdate(true);
        }
        setData(data);
    }

    return (
        <div className="add-advert">
            <div className="container mt-5" style={{width: 900}}>
                <h1>{id ? "Редактирование" : "Подача"} объявления</h1>
                <form className='photos' style={{marginTop: 30}} onClick={selectFiles}>
                    {indexes.map((index) =>
                        <div className="selected-photo">
                            {refe[index]
                                ? <img src={refe[index]} alt=""/>
                                : <img src="/img/No_photo.png" alt=""/>}
                            <BsXOctagon className="delete-photo" onClick={(event) => {
                                event.stopPropagation();
                                deletePhoto(index)
                            }}/>
                        </div>
                    )}
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
                                   maxLength: {value: 100, message: "Максимум 100 символов"}
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
                            render={({field: {onChange, value}, fieldState: {error}}) => (
                                <div>
                                    <CustomSelect id="category" options={categories} placeholder="Выберите..."
                                                  value={value}
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
                                        <label htmlFor="radio-2"
                                               style={{marginRight: 10, marginLeft: 15}}>Б/у</label>
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
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <div>
                                            <CustomSelect id="region" options={regions}
                                                          placeholder="Выберите регион"
                                                          value={value}
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
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <div>
                                            <CustomSelect id="place" options={places}
                                                          placeholder="Выберите город или район"
                                                          value={value}
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
                    <button className="w-50 btn" type='submit' disabled={!isValid}>
                        {id ? "Сохранить изменения" : "Подать объявление"}</button>
                </form>
            </div>
            {isShowModal &&
                <div className="modal d-block py-5">
                    <div className="modal-content-moder rounded-3 shadow">
                        <div className="modal-body text-center">
                            <h5 className="mb-0">Объявление отправлено на модерацию</h5>
                        </div>
                        <div className="modal-footer flex-nowrap p-0">
                            <button type="button" className="btn" onClick={modal}>
                                <strong>OK</strong></button>
                        </div>
                    </div>
                </div>}

        </div>
    )
}



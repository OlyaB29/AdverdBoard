import axios from 'axios';
import useAxios from "axios-hooks";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import Select from "react-select";
const API_URL = 'http://localhost:8000';

export default class AdvertBoardService{

	getAdverts() {
		const url = `${API_URL}/api/`;
		return axios.get(url).then(response => response.data);
	}
	// getCustomersByURL(link){
	// 	const url = `${API_URL}${link}`;
	// 	return axios.get(url).then(response => response.data);
	// }
	getAdvert(pk) {
		const url = `${API_URL}/api/adverts/${pk}`;
		return axios.get(url).then(response => response.data);
	}

	getCategories() {
		const url = `${API_URL}/api/categories/`;
		return axios.get(url);
	}

	getCharValues() {
		const url = `${API_URL}/api/values/`;
		return axios.get(url);
	}

	getRegions() {
		const url = `${API_URL}/api/regions/`;
		return axios.get(url);
	}

	getTokens(username, password) {
		const url = `${API_URL}/auth/jwt/create`;
		return axios.post(url,{username:username,password:password}).then(response => response.data);
	}

	getUser(access) {
		const url = `${API_URL}/auth/users/me`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data);
	}

	getProfile(pk, access) {
		const url = `${API_URL}/api/user_profile/${pk}`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data);
	}

	getUserAdverts(access) {
		const url = `${API_URL}/api/adverts`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data);
	}

	deleteAdvert(pk, access) {
		const url = `${API_URL}/api/delete-advert/${pk}`;
		return axios.delete(url, { headers: {"Authorization" : `JWT ${access}`}});
	}

	createCustomer(customer) {
		const url = `${API_URL}/api/customers/`;
		return axios.post(url,customer);
	}


	updateAdvert(advert, access) {
		const url = `${API_URL}/api/update-advert/${advert.pk}`;
		return axios.put(url, {advert},{ headers: {"Authorization" : `JWT ${access}`}});
	}
}


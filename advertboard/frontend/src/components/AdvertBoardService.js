import axios from 'axios';
const API_URL = 'http://localhost:8000';



export default class AdvertBoardService {

	getAdverts() {
		const url = `${API_URL}/api/`;
		return axios.get(url).then(response => response.data);
	}
	// getAdvertsByURL(link){
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

	getRefresh(refresh) {
		const url = `${API_URL}/auth/jwt/refresh`;
        return axios.post(url,{refresh:refresh}).then(response => response.data);
	}

	createUser(user) {
		const url = `${API_URL}/auth/users/`;
		return axios.post(url, user);
	}

	errorHandler(err) {
		return (
		err.response.data.detail === "Given token not valid for any token type"
				? this.getRefresh(localStorage.getItem('refreshToken')).then((r)=>r).catch(
					(error)=>error.response.data.detail==="Token is invalid or expired"
						? localStorage.removeItem('user')
						: alert("Произошла ошибка"))
				: alert(err))
	}

	getUser(access) {
		const url = `${API_URL}/auth/users/me`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data).catch((error)=>this.errorHandler(error));
	}

	getProfile(pk, access) {
		const url = `${API_URL}/api/user_profile/${pk}`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data).catch((error)=>this.errorHandler(error));
	}

	getSeller(pk) {
		const url = `${API_URL}/api/user_profile/free/${pk}`;
		return axios.get(url).then(response => response.data);
	}

	getUserAdverts(access) {
		const url = `${API_URL}/api/adverts`;
		return axios.get(url,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => response.data).catch((error)=>this.errorHandler(error));
	}

	deleteAdvert(pk, access) {
		const url = `${API_URL}/api/delete-advert/${pk}`;
		return axios.delete(url, { headers: {"Authorization" : `JWT ${access}`}}).then(response => "ok").catch((error)=>this.errorHandler(error));
	}

	createAdvert(advert, access) {
		const url = `${API_URL}/api/create/`;
		return axios.post(url, advert, { headers: {"Authorization" : `JWT ${access}`}}).then(response => "ok").catch((error)=>this.errorHandler(error));
	}

	createPhoto(photo, access) {
		const url = `${API_URL}/api/create-photo/`;
		return axios.post(url, photo, { headers: {"Authorization" : `JWT ${access}`}});
	}

	// updatePhoto(pk, image, access) {
	// 	const url = `${API_URL}/api/update-photo/${pk}`;
	// 	return axios.patch(url, image, { headers: {"Authorization" : `JWT ${access}`}});
	// }

	deletePhoto(pk, access) {
		const url = `${API_URL}/api/delete-photo/${pk}`;
		return axios.delete(url,{ headers: {"Authorization" : `JWT ${access}`}});
	}

	updateAdvert(pk, advert, access) {
		const url = `${API_URL}/api/update-advert/${pk}`;
		return axios.put(url, advert,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => "ok").catch((error)=>this.errorHandler(error));
	}

	updateProfile(pk, profile, access) {
		const url = `${API_URL}/api/user_profile/update/${pk}/`;
		return axios.patch(url, profile,{ headers: {"Authorization" : `JWT ${access}`}}).then(response => "ok").catch((error)=>this.errorHandler(error));
	}
}


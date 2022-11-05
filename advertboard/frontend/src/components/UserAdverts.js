import  React, { Component } from  'react';
import  AdvertBoardService  from  './AdvertBoardService';
import OutputAdverts from "./OutputAdverts";

const  advertBoardService  =  new  AdvertBoardService();

class  UserAdverts  extends  Component {

constructor(props) {
	super(props);
	this.state  = {
		adverts: [],
		access: localStorage.getItem('accessToken')
	};

}

componentDidMount() {
	const self = this;
	advertBoardService.getUserAdverts(this.state.access).then(function (result) {
		console.log(result);
		self.setState({ adverts:  result})
	});
}

render() {
	return (
		<div className="advert_list">
		    <OutputAdverts adverts={this.state.adverts}/>
		</div>
	    );
    }
}
export  default  UserAdverts;

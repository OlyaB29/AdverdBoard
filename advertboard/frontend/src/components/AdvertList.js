import  React, { Component } from  'react';
import  AdvertBoardService  from  './AdvertBoardService';
import OutputAdverts from "./OutputAdverts";

const  advertBoardService  =  new  AdvertBoardService();

class  AdvertList  extends  Component {

constructor(props) {
	super(props);
	this.state  = {
		adverts: []
	};
}

componentDidMount() {
	const self = this;
	advertBoardService.getAdverts().then(function (result) {
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
export  default  AdvertList;


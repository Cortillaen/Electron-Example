//######################################## VIEWMODEL ########################################

function Viewmodel() {
	/*
	Author: Trenton Nale
	Description: Implements Knockout.js data bindings.
	Input: N/A
	Output: N/A
	Notes: N/A
	*/
	//================================== Data Structures ====================================
	

};

//##################################### Document-Level js ###################################

$(document).ready(function(){
	/*
	Discription: This function specifies the behaviour of the program when the user starts the application.
	Inputs: an event related to the application opening
	Outputs: N\A
	Notes: This program sets up the knockout bindings and starts the python subprocess
	       that houses the Twisted Client.
	*/
	//Apply knockout data-bindings
	ko.applyBindings(new Viewmodel());
});
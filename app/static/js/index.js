//######################################## VIEWMODEL ########################################

function Viewmodel() {
	/*
	Author: Trenton Nale
	Description: Implements Knockout.js data bindings.
	Input: N/A
	Output: N/A
	Notes: N/A
	*/
	var self = this;

	function Note() {
		this.title = ko.observable("");
		this.content = ko.observable("");
	}

	self.notes = ko.observableArray([]);

	self.selectedNote = ko.observable(null);

	self.addNote = function() {
		self.notes.push();
		self.selectedNote(self.notes.slice(-1)[0]);
	}

	self.deleteNote = function() {
		if(self.notes.length() > 1)
			self.selectedNote(self.notes.slice(0,1)[0]);
		else
			self.selectedNote(null);
		self.notes.remove(self.selectedNote());
	}
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
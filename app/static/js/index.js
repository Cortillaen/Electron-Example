const electron = require('electron');
const path = require('path');
const fs = require('fs');
var viewmodel;

//######################################## VIEWMODEL ########################################

function Viewmodel() {
	/*
	Author: Trenton Nale
	Description: Implements Knockout.js data bindings.
	Input: N/A
	Output: N/A
	Notes: N/A
	*/
	function Note() {
		this.title = ko.observable("Note Title");
		this.content = ko.observable("Write contents here.");

		this.isActive = function() {
			if(this == self.selectedNote())
				return true;
			else
				return false;
		}
	}

	var self = this;
	self.path = path.join(electron.remote.app.getPath('userData'), 'noter_data.json');
	self.notes = ko.observableArray([]);
	self.selectedNote = ko.observable(null);

	self.addNote = function() {
		self.notes.push(new Note());
		self.selectedNote(self.notes.slice(-1)[0]);
	}

	self.deleteNote = function() {
		if(self.selectedNote() != null) {
			var temp = ko.observable(self.selectedNote());
			if(self.notes().length > 1)
				self.selectedNote(self.notes.slice(0,1)[0]);
			else
				self.selectedNote(null);
			self.notes.remove(temp());
		}
	}

	self.saveNotes = function() {
		fs.writeFileSync(self.path, ko.toJSON(self.notes));
	}

	self.loadNotes = function() {
		var info;
		try {
			info = JSON.parse(fs.readFileSync(self.path));
		} catch(error) {
			alert("No note data found.\n\nIf this is not your first time running Noter,\nyour data may have been lost or corrupted.")
		}
		for(var note in info) {
			self.notes.push(new Note());
			self.notes().slice(-1)[0].title(info[note]["title"]);
			self.notes().slice(-1)[0].content(info[note]["content"]);
		}
		if(self.notes().length > 0) self.selectedNote(self.notes().slice(0, 1)[0]);
		else alert("short");
	}

	self.loadNotes();
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
	viewmodel = new Viewmodel();
	ko.applyBindings(viewmodel);
});

window.onbeforeunload = function() {
	viewmodel.saveNotes();
}
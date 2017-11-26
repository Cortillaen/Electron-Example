//these static objects offer various functionality we will use below
const electron = require('electron');
const path = require('path');
const fs = require('fs');
//we need the viewmodel to be accessible from outside in order to save our notes on close
var viewmodel;

//######################################## VIEWMODEL ########################################

function Viewmodel() {
	/*
	Author: Trenton Nale
	Description: A class to hold our Knockout.js data and methods.
	Input: N/A
	Output: N/A
	Notes: N/A
	*/

	function Note() {
		/*
		Author: Trenton Nale
		Description: This is the data structure we will use for a note.
		Input: N/A
		Output: N/A
		Notes: N/A
		*/
		this.title = ko.observable("Note Title");
		this.content = ko.observable("Write contents here.");

		this.isActive = function() {
			/*
			Author: Trenton Nale
			Description: This simply returns whether a particular Note instance is the selected
				note in the app.
			Input: N/A
			Output: N/A
			Notes: Having a function to return this boolean value makes it easier to use in the
				Knockout.js parts of index.html.
			*/
			if(this == self.selectedNote())
				return true;
			else
				return false;
		}
	}

	//this is a standard convention for having access to the Viewmodel object inside other objects
	var self = this;
	//we create the path to where user data is stored so we can load and save notes
	self.path = path.join(electron.remote.app.getPath('userData'), 'noter_data.json');
	//this is the array storing our notes in the format Knockout.js requires to watch the array
	self.notes = ko.observableArray([]);
	/*Knockout.js does not allow changing data bindings once set, so we need a way to change what
	  note is selected for editing.  This separate observable is the only one that gets bound to
	  to the editing elements of the page, but we can change which note is loaded into it.
	*/
	self.selectedNote = ko.observable(null);

	self.addNote = function() {
		/*
		Author: Trenton Nale
		Description: Adds a new note to our list and selects it
		Input: N/A
		Output: N/A
		Notes: N/A
		*/
		self.notes.push(new Note());
		self.selectedNote(self.notes.slice(-1)[0]);
	}

	self.deleteNote = function() {
		/*
		Author: Trenton Nale
		Description: Deletes the currently-selected note and selects the first note if possible
		Input: N/A
		Output: N/A
		Notes: Because elements of our page are bound to selectedNote, we cannot delete it first.
			Instead, we store it, select either the first note in our list or a null to clear the
			selectedNote, and then delete the stored note from our list.
		*/
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
		/*
		Author: Trenton Nale
		Description: Writes a JSON representation of our list of notes to a local file.
		Input: N/A
		Output: N/A
		Notes: N/A
		*/
		fs.writeFileSync(self.path, ko.toJSON(self.notes));
	}

	self.loadNotes = function() {
		/*
		Author: Trenton Nale
		Description: Attempts to load notes from a local file.
		Input: N/A
		Output: N/A
		Notes: If no note data is found, displays a message to that effect.  
		*/
		var info;
		try {
			info = JSON.parse(fs.readFileSync(self.path));
		} catch(error) {
			alert("No note data found.\n\nIf this is not your first time running Noter, \
				\nyour data may have been lost or corrupted.")
		}
		for(var note in info) {
			//for each read note, we add a note to our list and populate its title and content
			self.notes.push(new Note());
			self.notes().slice(-1)[0].title(info[note]["title"]);
			self.notes().slice(-1)[0].content(info[note]["content"]);
		}
		//if notes were loaded, start the app with the first note selected
		if(self.notes().length > 0) self.selectedNote(self.notes().slice(0, 1)[0]);
	}

	self.loadNotes(); //now that everything is prepared, attempt to load notes
};

//##################################### Document-Level js ###################################

$(document).ready(function(){
	/*
	Discription: This function specifies the behaviour of the program when the user starts the application.
	Inputs: The function to execute when this page of the application is loaded
	Outputs: N/A
	Notes: N/A
	*/
	//Apply Knockout.js data bindings
	viewmodel = new Viewmodel();
	ko.applyBindings(viewmodel);
});

window.onbeforeunload = function() {
	/*
	Discription: This function specifies the behaviour of the program when the user closes the application.
	Inputs: The function to execute just before the application is closed
	Outputs: N/A
	Notes: N/A
	*/
	viewmodel.saveNotes();
}
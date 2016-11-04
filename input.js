var mouseX = 0;
var mouseY = 0;

function keyPressed(e) {
	
	// Left Arrow
	if (e.keyCode == 37) {
		var size = spaceBetweenBars;
		if (newOffset <= -size) {
			newOffset = newOffset + size;
		}
	}
	
	// Right Arrow
	if (e.keyCode == 39) {
		var size = spaceBetweenBars;
		newOffset = newOffset - size;
	}
	
	// 'Key' selection via keyboard keys
	for (var i = 0; i < NoteMap.length; i++) {
		var note = NoteMap[i];
		if (e.keyCode == note.code) {
			currentNote = note.note;
			lastKeyCode = e.keyCode;
			if (noteHighlighted) {
				synth.triggerAttackRelease(currentNote, '8n');
			}
		}
	}
	
	// Spacebar builds and plays the song
	if (e.keyCode == 32) {
		buildSong();
	}
	
	// P will pause everything right now
	if (e.keyCode == 80) {
		if (paused) {
			paused = false;
		} else {
			paused = true;
		}
	}
	
	if (e.keyCode == 219) {
		if (BPM >= 21) BPM -= 20;
	}
	
	if (e.keyCode == 221) {
		BPM += 20;
	}
	
	if (e.keyCode == 81) {
		if (octave >= 1) octave--;
		loadNoteMap();
	}
	
	if (e.keyCode == 69) {
		octave++;
		loadNoteMap();
	}
	
	if (e.keyCode == 192) {
		var obj = {"vars": [{"size": unitSize, "bpm": BPM}], "notes": notes};
		//console.log('Window Size: ' + obj["vars"][0].size);
		var jsonObj = JSON.stringify(obj, null, 2);
		if (DEBUG) console.log('Song Saved To JSON\n' + jsonObj);
	}
	
	if (e.keyCode == 76) {
		if (loopPattern) {
			loopPattern = false;
		} else {
			loopPattern = true;
		}
	}
	
	if (e.keyCode == 8) {
		if (pattern != null) pattern.stop();
		if (DEBUG) console.log('function keyPressed() .. Backspace stops Pattern');
	}
		
}

function keyReleased(e) {
	
}

function mouseMove(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
}

function mousePressed(e) {
	
	// If the left button is clicked
	if (e.button == 0) {
		
		// If you click Clear All Notes, reset the notes array
		if (mouseX > menuCenterX - unitSize * 4 && menuCenterX + unitSize * 4 > mouseX && mouseY > unitSize * 14 && unitSize * 15.5 > mouseY) {
			notes = [];
			return;
		}
	
		// Get mouse coordinates from mouse event
		var x = e.pageX;
		var y = e.pageY;
		
		// The area 'around' the bar that will still accept mouse clicks
		var buffer = unitSize;
		
		// For every bar, check if the mouse click causes an intersection and if so
		// as long as the currentNote has been changed from the default 'None' add
		// the note to the sequence
		for (var i = 0; i < bars.length; i++) {
			var bar = bars[i];
			if (x - buffer < bar.pos && bar.pos < x + buffer && y > endBarTop && y < endBarBottom) {
				console.log(bar.bar);
				if (currentNote != 'None') {
					notes.push( {bar: bar.bar, note: currentNote, renderPosition: y } );
					synth.triggerAttackRelease(currentNote, '8n');
				}
			}
		}
	
	}
	
	// If the middle button is clicked
	if (e.button == 1) {
		
		// Get mouse coordinates from mouse event taking the roll offset into account
		var x = e.pageX - offset;
		var y = e.pageY;
		
		var barClicked = Math.round(x / spaceBetweenBars) - 1;
		if (DEBUG) console.log('function mousePressed() .. Bar clicked: ' + barClicked);
		
		// The area 'around' the bar that will still accept mouse clicks
		var buffer = unitSize / 2;
		
		// Check each note's rendered position and if the click is on a note, delete it from the note array
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			if (barClicked == note.bar) {
				if (y - buffer < note.renderPosition && note.renderPosition < y + buffer) {
					notes.splice(i, 1);
				}
			}
		}
		
	}
}

function mousewheel(e) {
	
	// If the mouse is over the roll, mouse wheel will scroll through it
	if (mouseX > endBarLeftX && endBarRightX > mouseX) {
		var delta = e.deltaY;
		if (delta > 0) {
			var size = spaceBetweenBars;
			newOffset = newOffset - size;
		} else {
			var size = spaceBetweenBars;
			if (newOffset <= -size) {
				newOffset = newOffset + size;
			}
		}
	}
	
	if (noteHighlighted) {
		var delta = e.deltaY;
		if (delta > 0) {
			octave++;
		} else {
			if (octave >= 1) octave--;
		}
		loadNoteMap();
	}
	
	if (bpmHighlighted) {
		BPM += e.deltaY;
	}
}
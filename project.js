// Editable Variables
var FPS = 60;
var NUMBER_OF_BARS_SHOWN = 16;
var BPM = 240;
var DEBUG = true;

// Canvas Variables
var canvas;
var ctx;
var unitSize;

// Other stuff
var synth;
var octave = 4;
var loopPattern = false;
var pattern;
 
// Drawing stuff
var barOffset = 0;
var spaceBetweenBars = 0;
var offset = 0;
var newOffset = 0;
var bars = [];
var lastKeyCode = 0;
var currentNote = 'None';
var notes = [];
var paused = false;

// Menu Variables
var menuCenterX = 0;
var noteHighlighted = false;
var bpmHighlighted = false;

// Roll Variables
var endBarLeftX = 0;
var endBarRightX = 0;
var endBarTop = 0;
var endBarBottom = 0;

// Color Rendering Variables
var color_BPM = '#000000';
var color_CAN = '#000000';

// 'Keyboard' notes
var NoteMap = [];

var tips = ['Welcome, tips will be displayed here.',
			'Change the Current Note with the Keyboard keys Z, S, X, D, C, V, G, B, H, N, J, M, \',\'.',
			'Hovering over the Current Note while changing the note will allow you to hear the note.',
			'You can change the song\'s BPM by hovering over the BPM value and scrolling your mousewheel.',
			'Hovering over the Current Note and scrolling the mousewheel allows you to change the octave of the key.',
			'You can use the Left and Right arrow keys to scroll through the song'
			];
var tipsIndex = 0;
var tipsTimer = 0;
var tipsUpdateTimeSeconds = 7;

$(document).ready(function() {
	
	document.addEventListener('keydown', keyPressed, true);
	document.addEventListener('keyup', keyReleased, true);
	document.addEventListener('mousedown', mousePressed, true);
	document.addEventListener('mousemove', mouseMove, true);
	$(document).on('mousewheel', mousewheel);
	
	canvas = $('#canvas')[0];
	ctx = canvas.getContext('2d');
	
	resizeCanvas();
	window.onresize = resizeCanvas;
	
	loadNoteMap();
	
	synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
	synth.voices[0].oscillator.type = 'sawtooth';
	synth.voices[1].oscillator.type = 'sawtooth';
	synth.voices[2].oscillator.type = 'sawtooth';
	
	var song = '{"vars":[{"size":34.1875,"bpm":750}],"notes":[{"bar":1,"note":"A3","renderPosition":625},{"bar":1,"note":"D4","renderPosition":508},{"bar":1,"note":"F4","renderPosition":402},{"bar":1,"note":"A4","renderPosition":329},{"bar":1,"note":"D5","renderPosition":288},{"bar":1,"note":"F5","renderPosition":245},{"bar":1,"note":"A5","renderPosition":190},{"bar":5,"note":"A3","renderPosition":606},{"bar":6,"note":"D4","renderPosition":513},{"bar":7,"note":"F4","renderPosition":423},{"bar":8,"note":"A4","renderPosition":331},{"bar":9,"note":"D5","renderPosition":270},{"bar":10,"note":"F5","renderPosition":208},{"bar":11,"note":"A5","renderPosition":162},{"bar":12,"note":"F5","renderPosition":215},{"bar":13,"note":"D5","renderPosition":281},{"bar":15,"note":"A#3","renderPosition":586},{"bar":15,"note":"D4","renderPosition":476},{"bar":15,"note":"F4","renderPosition":416},{"bar":15,"note":"A#4","renderPosition":317},{"bar":15,"note":"D5","renderPosition":259},{"bar":15,"note":"F5","renderPosition":212},{"bar":15,"note":"A#5","renderPosition":155},{"bar":19,"note":"A#3","renderPosition":581},{"bar":20,"note":"D4","renderPosition":481},{"bar":21,"note":"F4","renderPosition":416},{"bar":22,"note":"A#4","renderPosition":340},{"bar":23,"note":"D5","renderPosition":281},{"bar":24,"note":"F5","renderPosition":232},{"bar":25,"note":"A#5","renderPosition":166},{"bar":26,"note":"F5","renderPosition":225},{"bar":27,"note":"D5","renderPosition":289},{"bar":29,"note":"C4","renderPosition":575},{"bar":29,"note":"F4","renderPosition":473},{"bar":29,"note":"A4","renderPosition":388},{"bar":29,"note":"C5","renderPosition":300},{"bar":29,"note":"F5","renderPosition":231},{"bar":29,"note":"A5","renderPosition":189},{"bar":33,"note":"C4","renderPosition":570},{"bar":37,"note":"C4","renderPosition":568},{"bar":41,"note":"C4","renderPosition":557},{"bar":33,"note":"F4","renderPosition":476},{"bar":37,"note":"F4","renderPosition":461},{"bar":41,"note":"F4","renderPosition":460},{"bar":41,"note":"A4","renderPosition":368},{"bar":37,"note":"A4","renderPosition":376},{"bar":33,"note":"A4","renderPosition":378},{"bar":33,"note":"C5","renderPosition":299},{"bar":37,"note":"C5","renderPosition":292},{"bar":41,"note":"C5","renderPosition":280},{"bar":33,"note":"F5","renderPosition":211},{"bar":37,"note":"F5","renderPosition":229},{"bar":41,"note":"F5","renderPosition":224},{"bar":41,"note":"A5","renderPosition":170},{"bar":37,"note":"A5","renderPosition":171},{"bar":33,"note":"A5","renderPosition":169},{"bar":43,"note":"C4","renderPosition":565},{"bar":43,"note":"E4","renderPosition":461},{"bar":43,"note":"G4","renderPosition":373},{"bar":43,"note":"C5","renderPosition":296},{"bar":43,"note":"E5","renderPosition":244},{"bar":43,"note":"G5","renderPosition":177},{"bar":1,"note":"A1","renderPosition":861},{"bar":1,"note":"A2","renderPosition":814},{"bar":15,"note":"A#1","renderPosition":859},{"bar":15,"note":"A#2","renderPosition":806},{"bar":29,"note":"A2","renderPosition":855},{"bar":33,"note":"A2","renderPosition":832},{"bar":37,"note":"A2","renderPosition":823},{"bar":41,"note":"A2","renderPosition":804},{"bar":43,"note":"G2","renderPosition":798},{"bar":29,"note":"A1","renderPosition":892},{"bar":33,"note":"A1","renderPosition":871},{"bar":37,"note":"A1","renderPosition":858},{"bar":41,"note":"A1","renderPosition":849},{"bar":43,"note":"G1","renderPosition":848},{"bar":57,"note":"G3","renderPosition":641},{"bar":57,"note":"A#3","renderPosition":587},{"bar":57,"note":"D4","renderPosition":521},{"bar":57,"note":"G4","renderPosition":441},{"bar":57,"note":"A#4","renderPosition":361},{"bar":57,"note":"D5","renderPosition":278},{"bar":57,"note":"G5","renderPosition":192},{"bar":57,"note":"G1","renderPosition":871},{"bar":57,"note":"G2","renderPosition":812},{"bar":71,"note":"A3","renderPosition":605},{"bar":71,"note":"D4","renderPosition":514},{"bar":71,"note":"F4","renderPosition":445},{"bar":71,"note":"A2","renderPosition":738},{"bar":71,"note":"A1","renderPosition":812},{"bar":71,"note":"A4","renderPosition":365},{"bar":71,"note":"D5","renderPosition":290},{"bar":71,"note":"F5","renderPosition":233},{"bar":71,"note":"A5","renderPosition":192},{"bar":85,"note":"A3","renderPosition":587},{"bar":85,"note":"A1","renderPosition":798},{"bar":85,"note":"A2","renderPosition":727},{"bar":85,"note":"E4","renderPosition":383},{"bar":85,"note":"C#4","renderPosition":484},{"bar":85,"note":"A4","renderPosition":313},{"bar":85,"note":"C#5","renderPosition":250},{"bar":85,"note":"E5","renderPosition":194},{"bar":85,"note":"A5","renderPosition":152},{"bar":89,"note":"F4","renderPosition":380},{"bar":95,"note":"E4","renderPosition":375},{"bar":95,"note":"A3","renderPosition":560},{"bar":89,"note":"A3","renderPosition":574},{"bar":89,"note":"A4","renderPosition":317},{"bar":95,"note":"A4","renderPosition":304},{"bar":98,"note":"A4","renderPosition":315},{"bar":89,"note":"D4","renderPosition":485},{"bar":95,"note":"C#4","renderPosition":472},{"bar":89,"note":"D4","renderPosition":252},{"bar":89,"note":"F5","renderPosition":199},{"bar":89,"note":"A5","renderPosition":156},{"bar":95,"note":"A5","renderPosition":142},{"bar":89,"note":"A1","renderPosition":800},{"bar":89,"note":"A2","renderPosition":735},{"bar":95,"note":"A1","renderPosition":788},{"bar":95,"note":"A2","renderPosition":718},{"bar":98,"note":"A1","renderPosition":793},{"bar":98,"note":"A2","renderPosition":727},{"bar":95,"note":"C#5","renderPosition":229},{"bar":95,"note":"E5","renderPosition":179},{"bar":98,"note":"D4","renderPosition":205},{"bar":98,"note":"D4","renderPosition":394},{"bar":98,"note":"D3","renderPosition":560},{"bar":98,"note":"A3","renderPosition":488}]}';
	var js = JSON.parse(song);
	notes = js["notes"];
	BPM = js["vars"][0].bpm;
	
	run();
});

function loadNoteMap() {
	NoteMap = [
		{code: 90, note: 'C' + octave},
		{code: 83, note: 'C#' + octave},
		{code: 88, note: 'D' + octave},
		{code: 68, note: 'D#' + octave},
		{code: 67, note: 'E' + octave},
		{code: 86, note: 'F' + octave},
		{code: 71, note: 'F#' + octave},
		{code: 66, note: 'G' + octave},
		{code: 72, note: 'G#' + octave},
		{code: 78, note: 'A' + octave},
		{code: 74, note: 'A#' + octave},
		{code: 77, note: 'B' + octave},
		{code: 188, note: 'C' + (octave + 1)},
	];
	// 'Key' selection via keyboard keys
	for (var i = 0; i < NoteMap.length; i++) {
		var note = NoteMap[i];
		if (lastKeyCode == note.code) {
			currentNote = note.note;
			if (noteHighlighted) {
				synth.triggerAttackRelease(currentNote, '8n');
			}
		}
	}
}

function resizeCanvas() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
	
	if (canvas.width > canvas.height) {
    	unitSize = canvas.height / 32;
    } else {
    	unitSize = canvas.width / 32;
    }
	
	// reset the offset for now
	offset = newOffset = 0;
}

function run() {
	
	setInterval(function() {
		
		if (!paused) {
		
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			drawRoll();
			drawMenu();
		
		}
		
	}, 1000 / FPS);
	
};

function drawRoll() {
	
	// Lerping for the arrow keys (smooth transition movement)
	var lerp = 95;
	var bottom = offset;
	var distance = offset - newOffset;
	var position = (newOffset) + ((lerp / 100) * distance);
	offset = position;
	
	// Calculate end bar positions
	endBarLeftX = unitSize * 2;
	endBarRightX = canvas.width * 0.75;
	endBarTop = unitSize * 3;
	endBarBottom = canvas.height - unitSize * 3;
	
	// Canvas Context variables
	ctx.strokeStyle = '#BBBBBB';
	ctx.fillStyle = '#000000';
	ctx.lineWidth = 1;
	
	// Reset the bars array
	bars = [];
	
	// Calculate space between the side bars and divide that area into a number of equal segments
	spaceBetweenBars = endBarRightX - endBarLeftX;
	spaceBetweenBars /= NUMBER_OF_BARS_SHOWN;
	
	barOffset = Math.floor(Math.abs(offset / spaceBetweenBars));
	
	var visualOffset = offset % spaceBetweenBars;
	for (var i = 0; i < (NUMBER_OF_BARS_SHOWN + 1); i++) {
		var x = unitSize * 2 + (i * spaceBetweenBars) + visualOffset;
		
		// If the bar's x position is within the end bars
		if (x > endBarLeftX + 1 && x < endBarRightX - 1) {
			
			// Add the bar to the array of bars
			bars.push({bar: (i + barOffset), pos: x});
			
			// Draw the bar
			ctx.beginPath();
			ctx.moveTo(x, unitSize * 3);
			ctx.lineTo(x, canvas.height - unitSize * 3);
			ctx.closePath();
			ctx.stroke();
			
			// Draw bar # above the bar
			ctx.textAlign = 'center';
			ctx.font = unitSize / 2 + 'pt Monospace';
			ctx.fillText(i + barOffset, x, unitSize * 2);
		}
	}
	
	// Draw the note(s) attached to a bar if that bar is shown
	ctx.textBaseline = "middle"; 
	for (var i = 0; i < notes.length; i++) {
		var note = notes[i];
		for (var k = 0; k < bars.length; k++) {
			var bar = bars[k];
			if (note.bar == bar.bar) {
				ctx.fillText(note.note, bar.pos, note.renderPosition);
			}
		}
	}
	ctx.textBaseline = "alphabetic";
	
	// Actually draw the end bars so that they overlap the small bars
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = Math.round(unitSize / 3);
	ctx.beginPath();
	ctx.moveTo(endBarLeftX, endBarTop);
	ctx.lineTo(endBarLeftX, endBarBottom);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(endBarRightX, endBarTop);
	ctx.lineTo(endBarRightX, endBarBottom);
	ctx.closePath();
	ctx.stroke();
}

function buildSong() {
	if (notes.length > 0) {
	
		// Set the BPM
		Tone.Transport.bpm.value = BPM;
			
		// Calculate the end of the song
		var furthestBar = 0;
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			if (note.bar > furthestBar) furthestBar = note.bar;
		}
		
		// Build an empty array of that length
		var allNotes = new Array(furthestBar);
		for (var i = 0; i < allNotes.length; i++) {
			allNotes[i] = [];
		}
		
		// Loop through all of the added notes and add them at their bar's index in the array
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			console.log(note.bar);
			allNotes[note.bar - 1].push(note.note);
		}

		// Play them as a pattern
		pattern = new Tone.Pattern(function(time, note){
			synth.triggerAttackRelease(note, '8n');
		}, allNotes);
		if (!loopPattern) {
			pattern.iterations = pattern.values.length; // only play once
		}
		pattern.start();
		Tone.Transport.start();
	}
}

function drawMenu() {
	
	// Set-up variables
	menuCenterX = (canvas.width / 2) + (canvas.width * 0.375)
	ctx.textAlign = 'center';
	ctx.fillStyle = '#000000';
	ctx.strokeStyle = '#000000'
	ctx.lineWidth = 1;
	
	// Draw 'Current Note'
	ctx.font = unitSize / 2 + 'pt Monospace';
	ctx.fillText('Current Note', menuCenterX, unitSize * 3);
	var textWidth = ctx.measureText('Current Note').width;
	ctx.beginPath();
	ctx.moveTo(menuCenterX - textWidth / 2, unitSize * 3.25);
	ctx.lineTo(menuCenterX + textWidth / 2, unitSize * 3.25);
	ctx.closePath();
	ctx.stroke();
	ctx.font = unitSize * 2 + 'pt Monospace';
	var textWidth = ctx.measureText(currentNote).width;
	if (mouseX > menuCenterX - textWidth / 2 && mouseX < menuCenterX + textWidth / 2 && mouseY > unitSize * 4 && mouseY < unitSize * 7) {
		ctx.fillStyle = '#DD2200';
		noteHighlighted = true;
	} else {
		ctx.fillStyle = '#000000';
		noteHighlighted = false;
	}
	ctx.fillText(currentNote, menuCenterX, unitSize * 6.5);

	
	// Draw 'BPM'
	ctx.font = unitSize / 2 + 'pt Monospace';
	ctx.fillStyle = '#000000';
	ctx.fillText('BPM', menuCenterX, unitSize * 8.75);
	var textWidth = ctx.measureText('BPM').width;
	ctx.beginPath();
	ctx.moveTo(menuCenterX - textWidth / 2, unitSize * 9);
	ctx.lineTo(menuCenterX + textWidth / 2, unitSize * 9);
	ctx.closePath();
	ctx.stroke();
	ctx.font = unitSize * 2 + 'pt Monospace';
	// If mouse is hovering over BPM number then highlight it in red
	if (mouseX > menuCenterX - unitSize * 4 && menuCenterX + unitSize * 4 > mouseX && mouseY > unitSize * 10 && unitSize * 13 > mouseY) {
		color_BPM = '#DD2200';
		bpmHighlighted = true;
	} else {
		color_BPM = '#000000';
		bpmHighlighted = false;
	}
	ctx.fillStyle = color_BPM;
	ctx.fillText(BPM, menuCenterX, unitSize * 12.25);
	
	// Draw 'Clear All Notes'
	// If mouse is hovering over C.A.N. then highlight it in red
	if (mouseX > menuCenterX - unitSize * 4 && menuCenterX + unitSize * 4 > mouseX && mouseY > unitSize * 14 && unitSize * 15.5 > mouseY) {
		color_CAN = '#DD2200';
	} else {
		color_CAN = '#000000';
	}
	ctx.fillStyle = color_CAN;
	ctx.font = unitSize / 2 + 'pt Monospace';
	ctx.fillText('Clear All Notes', menuCenterX, unitSize * 15);
	
	// Draw tips at the bottom of the screen
	tipsTimer++;
	if (tipsTimer > tipsUpdateTimeSeconds * FPS) {
		tipsTimer = 0;
		tipsIndex++;
		tipsIndex %= tips.length;
	}
	ctx.fillStyle = '#BBBBBB';
	ctx.fillText(tips[tipsIndex], canvas.width / 2, canvas.height - unitSize);
}
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

// Part 1: https://youtu.be/c6y21FkaUqw
// Part 2: https://youtu.be/tRA6tqgJBc
// Part 3: https://youtu.be/3lvj9jvERvs
// Part 4: https://youtu.be/HrvNpbnjEG8
// Part 5: https://youtu.be/U9wiMM3BqLU


const STATES = {
	NORMAL: {ordinal:0,name:"NORMAL"},
	PLAYBACK: {oridinal:1,name:"PLAYBACK"},
	PAUSED: {ordinal:2,name:"PAUSED"},
	RESET: {ordinal:3,name:"RESET"}
};

class SaveState{
	constructor(){
		this.savedBirds = birds;
		this.savedCounter = counter;
		this.savedPipes = pipes;
	}
	load(){
		birds = this.savedBirds;
		counter = this.savedCounter;
		pipes = this.savedPipes;
	}
};


const TOTAL = 500;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let bestBird;
let playbackSaveState;
let state;
let prevState;
function keyPressed() {
  if (key === 'S') {
    let bird = bestBird;
    let jsonStr = bird.brain.serialize();
	setCookie("bestBird",jsonStr,5);
  }else if(key === 'P'&&state!=States.PAUSED){
		prevState = state;
	  state = States.PAUSED;
  }else if(key === 'P'&&state==States.PAUSED){
		state = prevState;
	}else if(key === 'L'&&state!=States.PLAYBACK){
		let jsonStr = getCookie("bestBird");
		if(!jsonStr||jsonStr.length()<=0)
			return;
		local brain = bestBird.brain.copy();
		playback(new Bird(brain));
	}
}

function playback(bird){
	playbackSaveState = new SaveState();
	birds= [bird];
	state = States.PLAYBACK;
}

function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 10, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
	let jsonStr = getCookie("bestBird");
	if(!jsonStr||jsonStr.length()<=0)
		bestBird = birds[0];
  else
		bestBird = new Bird(NeuralNetwork.deserialize(jsonStr));
  state = States.NORMAL;
}

function draw() {
	if(state!=States.PAUSED&&state!=States.RESET)
		for (let n = 0; n < slider.value(); n++) {
			if (counter % 75 == 0) {
				pipes.push(new Pipe());
			}
			for (let i = birds.length - 1; i >= 0; i--) {
				if(counter%100 == 0){
				 if(bestBird.score<bird.score)
					 bestBird = bird;
				}
			}
			counter++;

			for (let i = pipes.length - 1; i >= 0; i--) {
				pipes[i].update();

				for (let j = birds.length - 1; j >= 0; j--) {
					if (pipes[i].hits(birds[j])) {
						savedBirds.push(birds.splice(j, 1)[0]);
					}
				}

				if (pipes[i].offscreen()) {
					pipes.splice(i, 1);
				}
			}

			for (let i = birds.length - 1; i >= 0; i--) {
				if (birds[i].offScreen()) {
					savedBirds.push(birds.splice(i, 1)[0]);
				}
			}

			for (let bird of birds) {
				bird.think(pipes);
				bird.update();
			}

			if (birds.length === 0) {
				if(state==States.PLAYBACK){
					state = States.PAUSED;
					playbackSavedState.load();
				}else{
					counter = 0;
					nextGeneration();
					pipes = [];
				}
			}
		}

  // All the drawing stuff
  background(0);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }
}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }

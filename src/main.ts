import './reset.css';
import * as Tone from 'tone';

let body = document.querySelector('body') as HTMLBodyElement;
let canvas = document.querySelector('#canvas') as HTMLCanvasElement;
let options = document.querySelector('#options') as HTMLDivElement;
let keys: NodeListOf<HTMLButtonElement>;

const ctx = canvas.getContext('2d');

let currentKey = 0;
let currentAnimationID = 0;

//#region Window Setup

window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  reset();
  generateKeys();
  generateAnims();

  ctx!.save();
  ctx!.translate(canvas.width / 2 - 75, canvas.height / 2);
  titleLoop();
};

function generateKeys() {
  chars.forEach((element) => {
    charSelect.innerHTML += `<button class="keys" value="${element}">${element.toUpperCase()}</button>`;
  });
  setKeys();
}

function setKeys() {
  keys = document.querySelectorAll('.keys');

  keys.forEach((element) => {
    element.addEventListener('click', switchKey);
  });
}

function generateAnims() {
  anims.forEach((func) => {
    const name = func.name.substring(2);
    let option = document.createElement('option');

    option.value = func.name;
    option.className = 'animOption';
    option.innerHTML = name;

    animSelect.appendChild(option);
  });
}

let hueSet = document.querySelector('#hue') as HTMLInputElement;
let satSet = document.querySelector('#saturation') as HTMLInputElement;
let lightSet = document.querySelector('#lightness') as HTMLInputElement;

function colorSet() {
  hueSet.value = color.hue.toString();
  satSet.value = color.sat.toString();
  lightSet.value = color.light[0].toString();
}

function switchKey(this: HTMLButtonElement) {
  keys.forEach((element) => {
    element.style.backgroundColor = `rgba(0, 0, 0, 0.5)`;
  });

  this.style.backgroundColor = `rgba(64, 64, 64, 0.5)`;
  currentKey = chars.indexOf(this.value);

  let soundEffect = soundEffects[currentKey];
  let length = soundEffect.note.length;

  sfxNotes.innerHTML = '';

  for (let i = 0; i < length; i++) {
    sfxNotes.innerHTML += `<div class="noteCreator">
    <select class="letterSelect"></select>
    <select class="numberSelect"></select>
    <select class="durationSelect"></select>
    <input type="number" class="delaySelect" value="0" inputmode="numeric" step="0.01" min="0" max="10"></input>
    <button class="removeNote">X</button></div>`;
  }

  let count = 0;
  document.querySelectorAll('.letterSelect').forEach((select) => {
    notesLetters.forEach((element) => {
      if (element == soundEffect.note[count][0]) {
        select.innerHTML += `<option value='${element}' selected>${element}</option>`;
      } else {
        select.innerHTML += `<option value='${element}'>${element}</option>`;
      }
    });

    count++;
  });

  count = 0;
  document.querySelectorAll('.numberSelect').forEach((select) => {
    notesNumbers.forEach((element) => {
      if (element == soundEffect.note[count][1]) {
        select.innerHTML += `<option value='${element}' selected>${element}</option>`;
      } else {
        select.innerHTML += `<option value='${element}'>${element}</option>`;
      }
    });

    count++;
  });

  count = 0;
  document.querySelectorAll('.durationSelect').forEach((select) => {
    durations.forEach((element) => {
      if (element == soundEffect.duration[count]) {
        select.innerHTML += `<option value='${element}' selected>${element}</option>`;
      } else {
        select.innerHTML += `<option value='${element}'>${element}</option>`;
      }
    });

    count++;
  });

  let delays: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.delaySelect');
  count = 0;

  delays.forEach((select) => {
    select.value = soundEffect.delay[count];
    count++;
  });

  addRemoveButton();

  let anim = charAnimPairs[currentKey].anim;
  let animOptions: NodeListOf<HTMLOptionElement> =
    document.querySelectorAll('.animOption');

  animOptions.forEach((option) => {
    if (option.value == anim.name) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });
}

function addRemoveButton() {
  let removes: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll('.removeNote');

  removes.forEach((element) => {
    element.addEventListener('click', () => {
      element.parentElement!.remove();
    });
  });
}

//#endregion

//#region Input Handling

function reset() {
  color.hue = Math.floor(Math.random() * 360);
  ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

  body.style.backgroundColor = `hsl(${color.hue}, ${color.sat}%, ${color.light[0]}%)`;
  colorSet();
}

let sfxNotes = document.querySelector('#sfxNotes') as HTMLDivElement;
let charSelect = document.querySelector('#charSelect') as HTMLDivElement;
let setNote = document.querySelector('#notesSet') as HTMLButtonElement;
let animSelect = document.querySelector('#animSet') as HTMLSelectElement;

setNote.addEventListener('click', () => {
  let soundEffect = soundEffects[currentKey];

  soundEffect.note.splice(0, soundEffect.note.length);
  soundEffect.duration.splice(0, soundEffect.duration.length);
  soundEffect.delay.splice(0, soundEffect.delay.length);

  let strings: NodeListOf<HTMLSelectElement> =
    document.querySelectorAll('.letterSelect');
  let octaves: NodeListOf<HTMLSelectElement> =
    document.querySelectorAll('.numberSelect');
  let durations: NodeListOf<HTMLSelectElement> =
    document.querySelectorAll('.durationSelect');
  let delays: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.delaySelect');

  for (let i = 0; i < strings.length; i++) {
    soundEffect.note.push(strings[i].value.concat(octaves[i].value));
    soundEffect.duration.push(durations[i].value);
    soundEffect.delay.push(delays[i].value);
  }

  anims.forEach((element) => {
    if (animSelect.value == element.name)
      charAnimPairs[currentKey].anim = element;
  });

  body.style.backgroundColor = `hsl(${Number(hueSet.value)}, ${Number(satSet.value)}%, ${Number(lightSet.value)}%)`;
});

window.addEventListener('keydown', function (e) {
  playSound(e.key);
  if (e.key == ' ') {
    this.cancelAnimationFrame(currentAnimationID);
    ctx!.restore();
    reset();
    animationLoop();
    Tone.start();
  }
  if (e.key == 'Shift') {
    if (options.style.display == 'none') {
      options.style.display = 'grid';
    } else {
      options.style.display = 'none';
    }
  }
});

let addButton = document.querySelector('#addButton') as HTMLButtonElement;

addButton.addEventListener('click', () => {
  let parentSection = document.createElement('div');
  parentSection.className = 'noteCreator';

  let string: string = '';

  let letters = document.createElement('select');
  letters.className = 'letterSelect';
  notesLetters.forEach((element) => {
    string += `<option value='${element}'>${element}</option>`;
  });
  letters.innerHTML = string;
  parentSection.appendChild(letters);

  string = '';
  let numbers = document.createElement('select');
  numbers.className = 'numberSelect';
  notesNumbers.forEach((element) => {
    string += `<option value='${element}'>${element}</option>`;
  });
  numbers.innerHTML = string;
  parentSection.appendChild(numbers);

  string = '';
  let _durations = document.createElement('select');
  _durations.className = 'durationSelect';
  durations.forEach((element) => {
    string += `<option value='${element}'>${element}</option>`;
  });
  _durations.innerHTML = string;
  parentSection.appendChild(_durations);

  parentSection.innerHTML += `<input type="number" class="delaySelect" value="0" inputmode="numeric" step="0.01" min="0" max="10"></input>`;
  parentSection.innerHTML += `<button class="removeNote">X</button>`;

  sfxNotes.appendChild(parentSection);
  addRemoveButton();
});

//#endregion

//#region Color

interface Color {
  sat: number;
  light: number[];
  hue: number;
}

let color: Color = {
  sat: 90,
  light: [80, 95, 5],
  hue: 0,
};

//#endregion

//#region SFXs

//Synth Types
const synth = new Tone.Synth().toDestination();
const amSynth = new Tone.AMSynth().toDestination();
const fmSynth = new Tone.FMSynth().toDestination();
const duoSynth = new Tone.DuoSynth().toDestination();
const memSynth = new Tone.MembraneSynth().toDestination();

let chars: string[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

let notesLetters: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

let notesNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7'];

let durations: string[] = ['1n', '2n', '4n', '8n', '16n'];

interface SFX {
  note: string[];
  duration: string[];
  delay: string[];
}

let soundEffects: SFX[] = [
  { note: ['A2'], duration: ['4n'], delay: ['0'] },
  { note: ['B2'], duration: ['4n'], delay: ['0'] },
  { note: ['C3'], duration: ['4n'], delay: ['0'] },
  { note: ['D3'], duration: ['4n'], delay: ['0'] },
  { note: ['E3'], duration: ['4n'], delay: ['0'] },
  { note: ['F3'], duration: ['4n'], delay: ['0'] },
  { note: ['G3'], duration: ['4n'], delay: ['0'] },
  { note: ['A3'], duration: ['4n'], delay: ['0'] },
  { note: ['B3'], duration: ['4n'], delay: ['0'] },
  { note: ['C4'], duration: ['4n'], delay: ['0'] },
  { note: ['D4'], duration: ['4n'], delay: ['0'] },
  { note: ['E4'], duration: ['4n'], delay: ['0'] },
  { note: ['F4'], duration: ['4n'], delay: ['0'] },
  { note: ['G4'], duration: ['4n'], delay: ['0'] },
  { note: ['A4'], duration: ['4n'], delay: ['0'] },
  { note: ['B4'], duration: ['4n'], delay: ['0'] },
  { note: ['C5'], duration: ['4n'], delay: ['0'] },
  { note: ['D5'], duration: ['4n'], delay: ['0'] },
  { note: ['E5'], duration: ['4n'], delay: ['0'] },
  { note: ['F5'], duration: ['4n'], delay: ['0'] },
  { note: ['G5'], duration: ['4n'], delay: ['0'] },
  { note: ['A5'], duration: ['4n'], delay: ['0'] },
  { note: ['B5'], duration: ['4n'], delay: ['0'] },
  { note: ['C6'], duration: ['4n'], delay: ['0'] },
  { note: ['D6'], duration: ['4n'], delay: ['0'] },
  { note: ['E6'], duration: ['4n'], delay: ['0'] },
];

function playSound(char: string) {
  if (!chars.includes(char)) {
    return;
  }

  const index = chars.indexOf(char);

  charAnimPairs[index].anim();

  const now = Tone.now();
  const soundEffect = soundEffects[index];
  for (let i = 0; i < soundEffect.note.length; i++) {
    synth.triggerAttackRelease(
      soundEffect.note[i],
      soundEffect.duration[i],
      now + Number(soundEffect.delay[i]),
    );
  }
}

//#endregion

//#region Animation

let angle = 0;
let speed = 9000;
let clockwise = true;

function titleLoop() {
  currentAnimationID = requestAnimationFrame(titleLoop);

  ctx!.fillStyle = `${body.style.backgroundColor}`;
  ctx!.fillRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height,
  );

  ctx!.shadowColor = 'black';
  ctx!.shadowBlur = 100;
  ctx!.lineWidth = 3;

  ctx!.moveTo(0, -canvas.height / 2);
  ctx!.lineTo(-240, 100);
  ctx!.strokeStyle = `hsla(${color.hue}, ${color.sat}%, ${color.light[2]}%, 0.005)`;
  ctx!.fillStyle = 'none';
  ctx!.stroke();

  ctx!.moveTo(60, -canvas.height / 2);
  ctx!.lineTo(320, 128);
  ctx!.strokeStyle = `hsla(${color.hue}, ${color.sat}%, ${color.light[2]}%, 0.02)`;
  ctx!.fillStyle = 'none';
  ctx!.stroke();

  ctx!.fillStyle = `hsla(${color.hue}, ${color.sat}%, ${color.light[2]}%, 0.02)`;
  ctx!.font = `144px sans-serif`;
  ctx!.fillText('Rolodope', -260, 202);

  ctx!.shadowBlur = 0;

  ctx!.beginPath();
  ctx!.moveTo(-30, -canvas.height / 2);
  ctx!.lineTo(-280, 80);
  ctx!.strokeStyle = 'white';
  ctx!.fillStyle = 'none';
  ctx!.stroke();

  ctx!.moveTo(30, -canvas.height / 2);
  ctx!.lineTo(280, 100);
  ctx!.strokeStyle = 'white';
  ctx!.fillStyle = 'none';
  ctx!.stroke();

  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.font = `144px sans-serif`;
  ctx!.fillText('Rolodope', -300, 172);

  ctx!.font = `26px sans-serif`;
  ctx!.fillText('Press', -canvas.width / 4 + 45, -canvas.height / 4 - 35);

  ctx!.font = `32px sans-serif`;
  ctx!.fillText('SHIFT', -canvas.width / 4, -canvas.height / 4);

  ctx!.font = `26px sans-serif`;
  ctx!.fillText('for Options', -canvas.width / 4 - 45, -canvas.height / 4 + 30);

  ctx!.font = `26px sans-serif`;
  ctx!.fillText('Press', canvas.width / 4 - 30, -canvas.height / 4 - 35);

  ctx!.font = `32px sans-serif`;
  ctx!.fillText('SPACE', canvas.width / 4, -canvas.height / 4);

  ctx!.font = `26px sans-serif`;
  ctx!.fillText('to Start', canvas.width / 4 + 30, -canvas.height / 4 + 30);

  if (angle > Math.PI / 40) {
    clockwise = false;
  }
  if (angle < -(Math.PI / 40)) {
    clockwise = true;
  }

  let ease = BezierCurve(Math.abs((angle / speed) * 20000) + 1);
  let rotation = clockwise ? Math.PI / speed : -(Math.PI / speed);
  let shift = clockwise ? -1 * ease : 1 * ease;

  ctx!.translate(shift, 0);
  ctx!.rotate(rotation);

  angle += rotation;
}

//found on stack overflow: https://stackoverflow.com/questions/13462001/ease-in-and-ease-out-animation-formula
let BezierCurve = (t: number) => {
  return t * t * (3.0 - 2.0 * t);
};

let anims: Function[] = [
  C_Spots,
  C_Flicker,
  C_RightSwoosh,
  C_LeftSwoosh,
  C_Swoosh,
  C_Eclipse,
  C_CircleSkew,
];

interface AnimPairs {
  char: string;
  anim: Function;
}

let charAnimPairs: AnimPairs[] = [
  { char: chars[0], anim: anims[0] },
  { char: chars[1], anim: anims[1] },
  { char: chars[2], anim: anims[2] },
  { char: chars[3], anim: anims[3] },
  { char: chars[4], anim: anims[4] },
  { char: chars[5], anim: anims[5] },
  { char: chars[6], anim: anims[6] },
  { char: chars[7], anim: anims[1] },
  { char: chars[8], anim: anims[2] },
  { char: chars[9], anim: anims[3] },
  { char: chars[10], anim: anims[4] },
  { char: chars[11], anim: anims[5] },
  { char: chars[12], anim: anims[6] },
  { char: chars[13], anim: anims[1] },
  { char: chars[14], anim: anims[2] },
  { char: chars[15], anim: anims[3] },
  { char: chars[16], anim: anims[4] },
  { char: chars[17], anim: anims[5] },
  { char: chars[18], anim: anims[6] },
  { char: chars[19], anim: anims[1] },
  { char: chars[20], anim: anims[2] },
  { char: chars[21], anim: anims[3] },
  { char: chars[22], anim: anims[4] },
  { char: chars[23], anim: anims[5] },
  { char: chars[24], anim: anims[6] },
  { char: chars[25], anim: anims[0] },
];

function animationLoop() {
  requestAnimationFrame(animationLoop);

  ctx!.fillStyle = `${body.style.backgroundColor}`;
  ctx!.fillRect(0, 0, canvas.width, canvas.height);

  for (let anim of activeAnims) {
    if (anim.duration == 0) {
      activeAnims.splice(activeAnims.indexOf(anim), 1);
      return;
    }

    anim.anim(anim.params);
    anim.duration--;
  }
}

interface ActiveAnims<T = any> {
  anim: Function;
  duration: number;
  params: T;
}

let activeAnims: ActiveAnims[] = [];

//#endregion

//Animations
//C describes a constructor, I describes an interface, A describes the function for the Animation

//#region Spots

function C_Spots() {
  let _xList = [];
  let _yList = [];
  let _duration = 30;

  for (let i = 0; i < 10; i++) {
    _xList.push(Math.floor(Math.random() * canvas.width));
    _yList.push(Math.floor(Math.random() * canvas.height));
  }

  let _params: I_Spots = {
    xList: _xList,
    yList: _yList,
  };

  activeAnims.push({
    anim: A_Spots,
    duration: _duration,
    params: _params,
  });
}

interface I_Spots {
  xList: number[];
  yList: number[];
}

function A_Spots(param: I_Spots) {
  for (let i = 0; i < 10; i++) {
    ctx!.beginPath();
    ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
    ctx!.arc(param.xList[i], param.yList[i], 10, 0, 2 * Math.PI);
    ctx!.fill();
  }
}

//#endregion

//#region Flicker

function C_Flicker() {
  let _flick = `hsl(${color.hue + 50}, ${color.sat}%, ${color.light[0]}%)`;
  let _duration = 45;

  let _params: I_Flicker = {
    flick: _flick,
    switch: 5,
  };

  activeAnims.push({
    anim: A_Flicker,
    duration: _duration,
    params: _params,
  });
}

interface I_Flicker {
  flick: string;
  switch: number;
}

function A_Flicker(param: I_Flicker) {
  if (param.switch == 0) {
    let temp = body.style.backgroundColor;
    body.style.backgroundColor = param.flick;
    param.flick = temp;
    param.switch = 7;
  }
  param.switch--;
}

//#endregion

//#region Swoosh

function C_Swoosh() {
  let _leftSide = 0;
  let _rightSide = 0;
  let _currentFrame = 0;
  let _duration = 7;

  let _params: I_Swoosh = {
    leftSide: _leftSide,
    rightSide: _rightSide,
    currentFrame: _currentFrame,
  };

  activeAnims.push({
    anim: A_Swoosh,
    duration: _duration,
    params: _params,
  });
}

function C_LeftSwoosh() {
  let _leftSide = 0;
  let _rightSide = 0;
  let _currentFrame = 0;
  let _duration = 30;

  let _params: I_Swoosh = {
    leftSide: _leftSide,
    rightSide: _rightSide,
    currentFrame: _currentFrame,
  };

  activeAnims.push({
    anim: A_LeftSwoosh,
    duration: _duration,
    params: _params,
  });
}

function C_RightSwoosh() {
  let _leftSide = 0;
  let _rightSide = 0;
  let _currentFrame = 0;
  let _duration = 30;

  let _params: I_Swoosh = {
    leftSide: _leftSide,
    rightSide: _rightSide,
    currentFrame: _currentFrame,
  };

  activeAnims.push({
    anim: A_RightSwoosh,
    duration: _duration,
    params: _params,
  });
}

interface I_Swoosh {
  leftSide: number;
  rightSide: number;
  currentFrame: number;
}

function A_Swoosh(param: I_Swoosh) {
  param.leftSide += Math.pow(2, param.currentFrame);
  param.rightSide += Math.pow(2, 7 - param.currentFrame / 30);

  ctx!.beginPath();
  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.rect(
    canvas.width / 5 + param.leftSide,
    canvas.height / 4,
    param.rightSide,
    canvas.height / 2,
  );
  ctx!.fill();
  param.currentFrame++;
}

function A_LeftSwoosh(param: I_Swoosh) {
  param.leftSide += Math.pow(2, param.currentFrame);

  ctx!.beginPath();
  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.rect(
    0,
    canvas.height / 4,
    (canvas.width / 4) * 3 - param.leftSide,
    canvas.height / 2,
  );
  ctx!.fill();
  param.currentFrame++;
}

function A_RightSwoosh(param: I_Swoosh) {
  param.leftSide += Math.pow(2, param.currentFrame);
  param.rightSide += Math.pow(2, 30 - param.currentFrame);

  ctx!.beginPath();
  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.rect(
    canvas.width / 4 + param.leftSide,
    canvas.height / 4,
    param.rightSide,
    canvas.height / 2,
  );
  ctx!.fill();
  param.currentFrame++;
}

//#endregion

//#region Eclipse

let firstStart = [canvas.width / 2, canvas.height / 2];
let firstGoal = [canvas.width, 0];
let secondStart = [0, canvas.height];
let secondGoal = [canvas.width / 2, canvas.height / 2];

function C_Eclipse() {
  let _firstCircle = firstStart;
  let _secondCircle = secondStart;
  let _duration = 75;

  let _params: I_Eclipse = {
    firstCircle: _firstCircle,
    secondCircle: _secondCircle,
    duration: _duration,
  };

  activeAnims.push({
    anim: A_Eclipse,
    duration: _duration,
    params: _params,
  });
}

interface I_Eclipse {
  firstCircle: number[];
  secondCircle: number[];
  duration: number;
}

//e key Patatap
function A_Eclipse(param: I_Eclipse) {
  ctx!.beginPath();

  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 8,
    0,
    2 * Math.PI,
  );
  ctx!.fill();

  ctx!.beginPath();
  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[0]}%)`;
  ctx!.arc(
    param.firstCircle[0],
    param.firstCircle[1],
    canvas.width / 8,
    0,
    2 * Math.PI,
  );
  ctx!.fill();

  ctx!.arc(
    param.secondCircle[0],
    param.secondCircle[1],
    canvas.width / 8,
    0,
    2 * Math.PI,
  );
  ctx!.fill();

  let moveX = canvas.width / 2;
  let moveY = canvas.height / 2;

  param.duration--;

  moveX = moveX / param.duration;
  moveY = moveY / param.duration;

  param.firstCircle = [
    param.firstCircle[0] + moveX,
    param.firstCircle[1] + moveY,
  ];

  moveX = moveX / param.duration;
  moveY = moveY / param.duration;

  param.secondCircle = [
    param.secondCircle[0] + moveX,
    param.secondCircle[1] + moveY,
  ];

  // function A_Eclipse(param: I_Eclipse) {
  //   ctx!.beginPath();

  //   ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  //   ctx!.arc(
  //     canvas.width / 2,
  //     canvas.height / 2,
  //     canvas.width / 4,
  //     0,
  //     2 * Math.PI,
  //   );
  //   ctx!.fill();

  //   ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[0]}%)`;
  //   ctx!.arc(
  //     param.firstCircle[0],
  //     param.firstCircle[1],
  //     canvas.width / 4,
  //     0,
  //     2 * Math.PI,
  //   );

  //   ctx!.arc(
  //     param.secondCircle[0],
  //     param.secondCircle[1],
  //     canvas.width / 4,
  //     0,
  //     2 * Math.PI,
  //   );
  //   ctx!.fill();

  //   let moveX = canvas.width / 2;
  //   let moveY = canvas.height / 2;

  //   param.duration--;

  //   moveX = moveX / param.duration;
  //   moveY = moveY / param.duration;

  //   param.firstCircle = [
  //     param.firstCircle[0] + moveX,
  //     param.firstCircle[1] + moveY,
  //   ];

  //   moveX = moveX / param.duration;
  //   moveY = moveY / param.duration;

  //   param.secondCircle = [
  //     param.secondCircle[0] + moveX,
  //     param.secondCircle[1] + moveY,
  //   ];
}

//#endregion

//#region Circle Skew

function C_CircleSkew() {
  let _duration = 30;

  let x = Math.floor(Math.random() * 2);
  let y = Math.floor(Math.random() * 2);

  let _params: I_CircleSkew = {
    position: [canvas.width * x, canvas.height * y],
    matrix: [1, 0, 0, 1, 0, 0],
  };

  activeAnims.push({
    anim: A_CircleSkew,
    duration: _duration,
    params: _params,
  });
}

interface I_CircleSkew {
  position: number[];
  matrix: number[];
}

function A_CircleSkew(param: I_CircleSkew) {
  param.matrix.forEach((element) => {
    element += Math.random() * 10;
    console.log(element);
  });

  ctx!.save();

  ctx!.beginPath();
  ctx!.fillStyle = `hsl(${color.hue}, ${color.sat}%, ${color.light[1]}%)`;
  ctx!.arc(
    param.position[0],
    param.position[1],
    canvas.height / 2,
    0,
    2 * Math.PI,
  );
  ctx!.fill();
  ctx!.transform(
    param.matrix[0],
    param.matrix[1],
    param.matrix[2],
    param.matrix[3],
    param.matrix[4],
    param.matrix[5],
  );

  ctx!.restore();
}
//#endregion

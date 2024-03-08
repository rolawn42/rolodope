import './reset.css';
import * as Tone from 'tone';

let body = document.querySelector('body') as HTMLBodyElement;
let canvas = document.querySelector('#canvas') as HTMLCanvasElement;
let options = document.querySelector('#options') as HTMLDivElement;

let sfxNotes = document.querySelector('#sfxNotes') as HTMLDivElement;
let charSelect = document.querySelector('#charSelect') as HTMLDivElement;
let setNote = document.querySelector('#notesSet') as HTMLButtonElement;
let addButton = document.querySelector('#addButton') as HTMLButtonElement;

let currentKey = 0;

const synth = new Tone.Synth().toDestination();
const ctx = canvas.getContext('2d');

//#region Window Setup

window.onload = () => {
  reset();
  generateKeys();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

function reset() {
  color.hue = Math.floor(Math.random() * 360);
  ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

  body.style.backgroundColor = `hsl(${color.hue}, ${color.sat}%, ${color.light[0]}%)`;
}

function generateKeys() {
  chars.forEach((element) => {
    charSelect.innerHTML += `<button class="keys" value="${element}">${element.toUpperCase()}</button>`;
  });
  setKeys();
}

function setKeys() {
  let keys = document.querySelectorAll('.keys');

  keys.forEach((element) => {
    element.addEventListener('click', switchKey);
  });
}

//prettier-ignore
setNote.addEventListener("click", () => {
    let soundEffect = soundEffects[currentKey];

    soundEffect.note.splice(0, soundEffect.note.length);
    soundEffect.duration.splice(0, soundEffect.duration.length);
    soundEffect.delay.splice(0, soundEffect.delay.length);

    let strings: NodeListOf<HTMLSelectElement> = document.querySelectorAll(".letterSelect");
    let octaves: NodeListOf<HTMLSelectElement> = document.querySelectorAll(".numberSelect");
    let durations: NodeListOf<HTMLSelectElement> = document.querySelectorAll(".durationSelect");
    let delays: NodeListOf<HTMLInputElement> = document.querySelectorAll(".delaySelect");

    for(let i = 0; i < strings.length; i++) {
        soundEffect.note.push(strings[i].value.concat(octaves[i].value));
        soundEffect.duration.push(durations[i].value);
        console.log(delays[i].value);
        soundEffect.delay.push(delays[i].value);
    }
});

function switchKey(this: HTMLButtonElement) {
  currentKey = chars.indexOf(this.value);

  let soundEffect = soundEffects[currentKey];
  let length = soundEffect.note.length;

  sfxNotes.innerHTML = '';

  for (let i = 0; i < length; i++) {
    sfxNotes.innerHTML += `<div class="noteCreator">
    <select class="letterSelect"></select>
    <select class="numberSelect"></select>
    <select class="durationSelect"></select>
    <input type="number" class="delaySelect" value="0" inputmode="numeric" step="0.01" min="0" max="10"></input></div>`;
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
}

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

  sfxNotes.appendChild(parentSection);
});

//#endregion

window.addEventListener('keydown', function (e) {
  playSound(e.key);
  if (e.key == ' ') {
    reset();
    animationLoop();
    Tone.start();
  }
  if (e.key == 'Shift') {
    if (options.style.display == 'none') {
      options.style.display = 'flex';
    } else {
      options.style.display = 'none';
    }
  }
});

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

let anims: Function[] = [C_Spots];

interface AnimPairs {
  char: string;
  anim: Function;
}

let charAnimPairs: AnimPairs[] = [
  { char: chars[0], anim: anims[0] },
  { char: chars[1], anim: anims[0] },
  { char: chars[2], anim: anims[0] },
  { char: chars[3], anim: anims[0] },
  { char: chars[4], anim: anims[0] },
  { char: chars[5], anim: anims[0] },
  { char: chars[6], anim: anims[0] },
  { char: chars[7], anim: anims[0] },
  { char: chars[8], anim: anims[0] },
  { char: chars[9], anim: anims[0] },
  { char: chars[10], anim: anims[0] },
  { char: chars[11], anim: anims[0] },
  { char: chars[12], anim: anims[0] },
  { char: chars[13], anim: anims[0] },
  { char: chars[14], anim: anims[0] },
  { char: chars[15], anim: anims[0] },
  { char: chars[16], anim: anims[0] },
  { char: chars[17], anim: anims[0] },
  { char: chars[18], anim: anims[0] },
  { char: chars[19], anim: anims[0] },
  { char: chars[20], anim: anims[0] },
  { char: chars[21], anim: anims[0] },
  { char: chars[22], anim: anims[0] },
  { char: chars[23], anim: anims[0] },
  { char: chars[24], anim: anims[0] },
  { char: chars[25], anim: anims[0] },
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

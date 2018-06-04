import average from 'analyser-frequency-average';

// bubbles
const layer1 = new Audio();
layer1.src = 'src/static/bubbles.wav';

const ctx1 = new AudioContext();
const source1 = ctx1.createMediaElementSource(layer1);
const analyser1 = ctx1.createAnalyser();
source1.connect(analyser1);
analyser1.connect(ctx1.destination);

const freq1 = new Uint8Array(analyser1.frequencyBinCount);
requestAnimationFrame(update);

var bands1 = {
  bubbles: {
    from: 140,
    to: 909
  }
};

export { analyser1, freq1, bands1 };

// feathers
const layer2 = new Audio();
layer2.src = 'src/static/feathers.wav';

const ctx2 = new AudioContext();
const source2 = ctx2.createMediaElementSource(layer2);
const analyser2 = ctx2.createAnalyser();
source2.connect(analyser2);
analyser2.connect(ctx2.destination);

const freq2 = new Uint8Array(analyser2.frequencyBinCount);
requestAnimationFrame(update);

var bands2 = {
  feathers: {
    from: 0,
    to: 9999
  }
};

export { analyser2, freq2, bands2 };

// bubbles_high
const layer3 = new Audio();
layer3.src = 'src/static/bubbles_high.wav';

const ctx3 = new AudioContext();
const source3 = ctx3.createMediaElementSource(layer3);
const analyser3 = ctx3.createAnalyser();
source3.connect(analyser3);
analyser3.connect(ctx3.destination);

const freq3 = new Uint8Array(analyser3.frequencyBinCount);
requestAnimationFrame(update);

var bands3 = {
  bubbles_high: {
    from: 350,
    to: 2060
  }
};

export { analyser3, freq3, bands3 };

// bass
const layer4 = new Audio();
layer4.src = 'src/static/bass.wav';

const ctx4 = new AudioContext();
const source4 = ctx4.createMediaElementSource(layer4);
const analyser4 = ctx4.createAnalyser();
source4.connect(analyser4);
analyser4.connect(ctx4.destination);

const freq4 = new Uint8Array(analyser4.frequencyBinCount);
requestAnimationFrame(update);

var bands4 = {
  bass: {
    from: 0,
    to: 700
  }
};

export { analyser4, freq4, bands4 };

// kick
const layer5 = new Audio();
layer5.src = 'src/static/kick.wav';

const ctx5 = new AudioContext();
const source5 = ctx5.createMediaElementSource(layer5);
const analyser5 = ctx5.createAnalyser();
source5.connect(analyser5);
analyser5.connect(ctx5.destination);

const freq5 = new Uint8Array(analyser5.frequencyBinCount);
requestAnimationFrame(update);

var bands5 = {
  kick: {
    from: 0,
    to: 300
  }
};

export { analyser5, freq5, bands5 };

// pad
const layer6 = new Audio();
layer6.src = 'src/static/pad.wav';

const ctx6 = new AudioContext();
const source6 = ctx6.createMediaElementSource(layer6);
const analyser6 = ctx6.createAnalyser();
source6.connect(analyser6);
analyser6.connect(ctx6.destination);

const freq6 = new Uint8Array(analyser6.frequencyBinCount);
requestAnimationFrame(update);

var bands6 = {
  pad: {
    from: 0,
    to: 1300
  }
};

export { analyser6, freq6, bands6 };

// texture
const layer7 = new Audio();
layer7.src = 'src/static/texture.wav';

const ctx7 = new AudioContext();
const source7 = ctx7.createMediaElementSource(layer7);
const analyser7 = ctx7.createAnalyser();
source7.connect(analyser7);
analyser7.connect(ctx7.destination);

const freq7 = new Uint8Array(analyser7.frequencyBinCount);
requestAnimationFrame(update);

var bands7 = {
  texture: {
    from: 0,
    to: 9999
  }
};

export { analyser7, freq7, bands7 };

/* run the project */
let button = document.querySelector('.fadeButton');
function once() {
  console.log('Done.');
  button.removeEventListener('click', once);
  layer1.play();
  layer2.play();
  layer3.play();
  layer4.play();
  layer5.play();
  layer6.play();
  layer7.play();
}
button.addEventListener('click', once);

let btn = document.querySelector('.fadeButton');
let content = document.querySelector('.content');

let reset = document.querySelector('.resetButton');

btn.addEventListener('click', function() {
  btn.classList.add('fadeOut');
  content.classList.add('fadeOut');

  reset.classList.add('fadeIn');

  console.log('clicked');
});

/* update data stream  */
function update() {
  requestAnimationFrame(update);

  analyser1.getByteFrequencyData(freq1);
  analyser2.getByteFrequencyData(freq2);
  analyser3.getByteFrequencyData(freq3);
  analyser4.getByteFrequencyData(freq4);
  analyser5.getByteFrequencyData(freq5);
  analyser6.getByteFrequencyData(freq6);
  analyser7.getByteFrequencyData(freq7);
}

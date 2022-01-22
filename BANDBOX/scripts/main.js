console.clear();

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

// create a start button 
const startButton = document.querySelector('#startbutton');
console.log(startButton);

// console.log all tracks
const trackEls = document.querySelectorAll('div');
console.log(trackEls);



// function for fetching and decoding audio file
async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// function to call each file and return an array of decoded files
async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}

let offset = 0;

// function for creating a buffer, connect data and play 
function playTrack(audioBuffer) {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(audioCtx.destination)

  if (offset == 0) {
    trackSource.start();
    offset = audioCtx.currentTime;
  } else {
    trackSource.start(0, audioCtx.currentTime - offset);
  }

  return trackSource;
}


startButton.addEventListener('click', () => {
  if (audioCtx != null) {
    return;
  }

  audioCtx = new AudioContext();

  document.querySelector("#startbutton").hidden = true;

  trackEls.forEach((el, i) => {


    const anchor = el.querySelector('a');
    const loadText = el.querySelector('p');
    const playButton = el.querySelector('.playbutton');

    // load file
    loadFile(anchor.href).then((track) => {

      // set loading to false
      el.dataset.loading = 'false';

      // hide loading text
      loadText.style.display = 'none';

      // show button
      playButton.style.display = 'inline-block';

      // allow play on click
      playButton.addEventListener('click', function() {

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        playTrack(track);
        playButton.dataset.playing = true;
      })
    })
  })
});




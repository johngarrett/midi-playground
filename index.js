var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}

function midiNumberToNote(number) {
    function getOctave(number) {
        console.warn(number / (number % 12))
    }
    /*
      {
        note: '',
        isSharp: '',
        octave: #,
        velocity: #,
      }
     */
    console.log(number / (number % 12))
    switch (number % 12) {
        case 0:
            return 'C'
        case 1:
            return 'C#/Db'
        case 2:
            return 'D'
        case 3:
            return 'D#/Eb'
        case 4:
            return 'E'
        case 5: 
            return 'F'
        case 6:
            return 'F#/Gb'
        case 7:
            return 'G'
        case 8: 
            return 'G#/Ab'
        case 9:
            return 'A'
        case 10:
            return 'A#/Bb'
        case 11:
            return 'B'
    }
}

function onMIDISuccess(midiAccess) {
        for (var input of midiAccess.inputs.values()) {
                input.onmidimessage = getMIDIMessage;
        }
}

var dataList = document.querySelector('#midi-data ul')
function getMIDIMessage(midiMessage) {
    console.log(midiMessage.data[1], midiMessage.data[2]);
    let note = midiNumberToNote(midiMessage.data[1])
    colorKey(note)
    displayNote(note)
}

function colorKey(note) {
    let key = document.getElementById('key-'+note)
    if (!key) {
        console.log('no box found')
        let newBox = document.createElement("button");
        newBox.innerHTML = index;
        newBox.setAttribute('id', 'midi-boxes-'+index)
        document.getElementById("midi-boxes").appendChild(newBox)
    }
    key.classList.add('selected')
    setInterval(function() {
        key.classList.remove('selected')
    }, 500)
}

function displayNote(note) {
    document.getElementById('current-note').textContent = note;
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

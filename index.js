var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}

function midiNumberToNote(number) {
    /*
      {
        note: '',
        isSharp: '',
        octave: #,
        velocity: #,
      }
     */
    const octave = Math.floor((number- 24) / 12);
    console.log(octave)
    switch (number % 12) {
        case 0:
            return {
                note: 'C',
                isSharp: false,
                octave
            }
        case 1:
            return {
                note: 'C#/Db',
                isSharp: true,
                octave
            }
        case 2:
            return {
                note: 'D',
                isSharp: false,
                octave
            }
        case 3:
            return {
                note: 'D#/Eb',
                isSharp: true,
                octave
            }
        case 4:
            return {
                note: 'E',
                isSharp: false,
                octave
            }
        case 5: 
            return {
                note: 'F',
                isSharp: false,
                octave
            }
        case 6:
            return {
                note: 'F#/Gb',
                isSharp: true,
                octave
            }
        case 7:
            return {
                note: 'G',
                isSharp: false,
                octave
            }
        case 8: 
            return {
                note: 'G#/Ab',
                isSharp: true,
                octave
            }
        case 9:
            return {
                note: 'A',
                isSharp: false,
                octave
            }
        case 10:
            return {
                note: 'A#/Bb',
                isSharp: true,
                octave
            }
        case 11:
            return {
                note: 'B',
                isSharp: false,
                octave
            }
    }
}

function onMIDISuccess(midiAccess) {
        for (var input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
            if (input.state == 'connected') {
                displayMidiDevice(input)
            }
        }
}

var dataList = document.querySelector('#midi-data ul')
function getMIDIMessage(midiMessage) {
    let note = midiNumberToNote(midiMessage.data[1])
    colorKey(midiMessage.data)
    displayNote(note)
}

function colorKey(data) {
    let note = midiNumberToNote(data[1])
    let depressed = data[2]
    let key = document.getElementById('key-'+note.note + note.octave)
    if (note.isSharp) {
        // hacky, i know, i'm sorry
        key = document.getElementById('key-'+note.note.split('/')[0] + note.octave)
    }
    if (!key) {
        console.log('no box found')
        let newBox = document.createElement("button");
        newBox.innerHTML = index;
        newBox.setAttribute('id', 'midi-boxes-'+index)
        document.getElementById("midi-boxes").appendChild(newBox)
    }
    if (depressed) {
        key.classList.add('selected')
    } else {
        key.classList.remove('selected')
    }
}

function displayNote(note) {
    document.getElementById('current-note').textContent = note.note;
}

function displayMidiDevice(device) {
    document.getElementById('connection-status').textContent = device.manufacturer + ', ' + device.name
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

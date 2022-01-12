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
    //console.log(octave)
    switch (number % 12) {
        case 0:
            return {
                note: 'C',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 1:
            return {
                note: 'C#/Db',
                isSharp: true,
                noteValue: number,
                octave
            }
        case 2:
            return {
                note: 'D',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 3:
            return {
                note: 'D#/Eb',
                isSharp: true,
                noteValue: number,
                octave
            }
        case 4:
            return {
                note: 'E',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 5: 
            return {
                note: 'F',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 6:
            return {
                note: 'F#/Gb',
                isSharp: true,
                noteValue: number,
                octave
            }
        case 7:
            return {
                note: 'G',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 8: 
            return {
                note: 'G#/Ab',
                isSharp: true,
                noteValue: number,
                octave
            }
        case 9:
            return {
                note: 'A',
                isSharp: false,
                noteValue: number,
                octave
            }
        case 10:
            return {
                note: 'A#/Bb',
                isSharp: true,
                noteValue: number,
                octave
            }
        case 11:
            return {
                note: 'B',
                isSharp: false,
                noteValue: number,
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

function handleMidiMessage(data) {
    let note = midiNumberToNote(data[1])
    let depressed = data[2]
    colorKey(note, depressed)
}

function clearKeys() {
    let whiteKeys = document.getElementsByClassName('white-key');
    let blackKeys = document.getElementsByClassName('black-key');
    for (let i of whiteKeys) {
        i.classList.remove('selected')
    }
    for (let i of blackKeys) {
        i.classList.remove('selected')
    }
}

function colorKey(note, depressed) {
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
        document.getElementById("midi-boxes").pushChild(newBox)
    }
    if (depressed) {
        key.classList.add('selected')
    } else {
        key.classList.remove('selected')
    }
}

var prevKey = null
function displayNote(note) {
    document.getElementById('current-note').textContent = note.note + note.octave;
}

function displayMidiDevice(device) {
    document.getElementById('connection-status').textContent = device.manufacturer + ', ' + device.name
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

function getAscendingMajorScale(note) {
    let scaleNoteNumbers = []
    for (let i = 1; i <= 2; i++) {
        scaleNoteNumbers.push(note.noteValue + i*2)
    }
    scaleNoteNumbers.push(note.noteValue + 5)
    for (let i = 1; i <= 3; i++) {
        scaleNoteNumbers.push(note.noteValue + 5 + i*2)
    }

    let scaleNotes = []
    for (let i = 0; i < scaleNoteNumbers.length; i++) {
        scaleNotes.push(midiNumberToNote(scaleNoteNumbers[i]))
    }

    return scaleNotes
}

function getAscendingNaturalMinorScale(root) {
    let scaleNoteNumbers = []
    scaleNoteNumbers.push(note.noteValue + 2)
    scaleNoteNumbers.push(note.noteValue + 3)
    for (let i = 1; i <= 2; i++) {
        scaleNoteNumbers.push(note.noteValue + 3 + i*2)
    }
    scaleNoteNumbers.push(note.noteValue + 8)
    for (let i = 1; i <= 2; i++) {
        scaleNoteNumbers.push(note.noteValue + 8 + i*2)
    }

    let scaleNotes = []
    for (let i = 0; i < scaleNoteNumbers.length; i++) {
        scaleNotes.push(midiNumberToNote(scaleNoteNumbers[i]))
    }

    return scaleNotes
}

function showScale(root, mode) {
    let scaleNotes = getAscendingMajorScale(root)
    switch (mode) {
        case "natural":
            scaleNotes = getAscendingNaturalMinorScale(root)
            break;

        case "ionian":
        default:
            // use major scale
            break;
    }
    clearKeys()
    for (let note of scaleNotes) {
        console.log(note)
        colorKey(note, true)
    }
}

function pressRandomKey() {
    note = midiNumberToNote(Math.floor(Math.random() * 12) + 48)
    showScale(note, "natural")
    displayNote(note)
    if (prevKey) {
        colorKey(prevKey, false)
    }
    colorKey(note, true)
    prevKey = note
}

setInterval(pressRandomKey, 5000)

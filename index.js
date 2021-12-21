var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}


function onMIDISuccess(midiAccess) {
        for (var input of midiAccess.inputs.values()) {
                input.onmidimessage = getMIDIMessage;
        }
}

var dataList = document.querySelector('#midi-data ul')
function getMIDIMessage(midiMessage) {
    console.log(midiMessage.data[1], midiMessage.data[2]);
    colorBox(midiMessage.data[1])
    //var newItem = document.createElement('li');
    //newItem.appendChild(document.createTextNode(midiMessage.data));
    //dataList.appendChild(newItem);
}

function colorBox(index) {
    let box = document.querySelector('#midi-boxes-'+index)
    if (!box) {
        console.log('no box found')
        let newBox = document.createElement("button");
        newBox.innerHTML = index;
        newBox.setAttribute('id', 'midi-boxes-'+index)
        document.getElementById("midi-boxes").appendChild(newBox)
    }
    $("#midi-boxes-"+index).animate({
        opacity: 0.5
    },
    300)
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

export function AudioPlayer(context) {
  this.context = context;
  this.source = context.createBufferSource();
  //this.source.looping = true;
  //this.analyser = context.createAnalyser();
  this.stopped = true;
  this.new_buffer = true;
  this.volume = 1.0;
}

AudioPlayer.prototype.setBuffer = function(buffer) {
  this.source = this.context.createBufferSource();
  //this.source.looping = true;
  this.source.buffer = buffer;
  this.source.looping = true;
  this.new_buffer = true;
};

AudioPlayer.prototype.play = function(loop=false) {
  //this.source.connect(this.analyser);
  //this.analyser.connect(this.context.destination);
  this.source.loop = loop;
  this.source.connect(this.context.destination);
  //this.source.noteOn(0);
  this.source.start();
  this.stopped = false;
};

AudioPlayer.prototype.stop = function() {
  //this.analyser.disconnect();
  this.source.disconnect();
  this.stopped = true;
  this.new_buffer = false;
};


export function createSound (id, url) {
    const sound = document.createElement('audio');

    sound.id = id; // set ID of sound to use as a key for global obj
    sound.src = url; // set source to locally stored file
    sound.crossOrigin = "anonymous"; // avoid a CORS error
    //sound.loop = "true"; // sounds need to loop to the beginning after they end
    sound.dataset.action = "off"; // for pausing feature
    document.getElementById("audio-container").appendChild(sound); // append sound to HTML container
    allSoundsById[sound.id] = sound; // add to global object for later use

    //Add sound to creature_sounds_ctx

    return sound; // return sound to parent function
}

export function createAudioContextiObj (sound) {
    // initialize new audio context
    const audioContext = new AudioContext();

    // create new audio context with given sound
    const src = audioContext.createMediaElementSource(sound);

    // create analyser (gets lots o data bout audio)
    const analyser = audioContext.createAnalyser();

    // connect audio source to analyser to get data for the sound
    src.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512; // set the bin size to condense amount of data

    // array limited to unsigned int values 0-255
    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);


    audioContextObj = {
        freqData, // note: at this time, this area is unpopulated!
        analyser
    }

    return audioContextObj;
}

//Add a sound once and store it inside sound_dict
export function addSound(id, sound_dict, sound_ctx, source){
    //Audio contexts
    var audioSource = sound_ctx.createBufferSource();
    return fetch(source)
    .then( resp => resp.arrayBuffer() )
    .then( buf => sound_ctx.decodeAudioData( buf ) )
    .then( audioBuffer => {
      audioSource.buffer = audioBuffer;
      console.log("Audio " + id + " loaded!");
      //audioSource.loop = true;
      sound_dict[id] = {"ctx": sound_ctx, "src": audioSource};
      document.getElementsByClassName("load_text")[0].innerHTML = "Loading audio";
    })
    .catch( console.error );
}

export function stopSound(source, context){

}

export function playSound(source, context, duration=0, loop=false, vol=1) {

    //source.buffer = buffer;                   // tell the source which sound to play
    var clone_src = context.createBufferSource(); //create new buffer node
    clone_src.buffer = source.buffer; //Copy buffer from original source
    clone_src.connect(context.destination);       // connect the source to the context's destination (the speakers)
    clone_src.loop = loop;
    var currentTime = context.currentTime;

    //Stop and disconnect from context once finished
    if (loop == false){
        clone_src.onended = function(){
            if(this.stop)this.stop();
            if(this.disconnect)this.disconnect();
        }
    }

    if (duration == 0){
        clone_src.start();
    } else {
        clone_src.start(currentTime, 0, duration);                          // play the source now
    }
    return clone_src;
}

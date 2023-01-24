export async function loadAudioBuffer(audioContext, url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
export function makePromise() {
  let accept, reject;
  const p = new Promise((a, r) => {
    accept = a;
    reject = r;
  });
  p.accept = accept;
  p.reject = reject;
  return p;
}
export const selectVoice = (voicer) => {
  const weightedRandom = (weights) => {
    let totalWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    let random = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }
      random -= weights[i];
    }

    return -1;
  };
  // the weight of each voice is proportional to the inverse of the number of times it has been used
  const maxNonce = voicer.reduce((max, voice) => Math.max(max, voice.nonce), 0);
  const weights = voicer.map(({nonce}) => {
    return 1 - nonce / (maxNonce + 1);
  });
  const selectionIndex = weightedRandom(weights);
  const voiceSpec = voicer[selectionIndex];
  voiceSpec.nonce++;
  while (voicer.every((voice) => voice.nonce > 0)) {
    for (const voiceSpec of voicer) {
      voiceSpec.nonce--;
    }
  }
  return voiceSpec;
};
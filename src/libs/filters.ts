import { FilterOptions } from 'shoukaku';

const audioEffects: {
  key: string;
  value: FilterOptions;
}[] = [
  { key: 'clear', value: {} },
  { key: 'eightD', value: { rotation: { rotationHz: 0.2 } } },
  { key: 'soft', value: { lowPass: { smoothing: 20 } } },
  { key: 'speed', value: { timescale: { speed: 1.501, pitch: 1.245, rate: 1.921 } } },
  { key: 'karaoke', value: { karaoke: { level: 1, monoLevel: 1, filterBand: 220, filterWidth: 100 } } },
  { key: 'nightcore', value: { timescale: { speed: 1.3, pitch: 1.3 } } },
  {
    key: 'pop',
    value: {
      equalizer: [
        { band: 0, gain: -0.25 },
        { band: 1, gain: 0.48 },
        { band: 2, gain: 0.59 },
        { band: 3, gain: 0.72 },
        { band: 4, gain: 0.56 },
        { band: 6, gain: -0.24 },
        { band: 8, gain: -0.16 },
      ],
    },
  },
  {
    key: 'vaporwave',
    value: {
      equalizer: [
        { band: 1, gain: 0.3 },
        { band: 0, gain: 0.3 },
      ],
      timescale: { pitch: 0.5 },
      tremolo: { depth: 0.3, frequency: 14 },
    },
  },
  {
    key: 'bass',
    value: {
      equalizer: [
        { band: 0, gain: 0.1 },
        { band: 1, gain: 0.1 },
        { band: 2, gain: 0.05 },
        { band: 3, gain: 0.05 },
        { band: 4, gain: -0.05 },
        { band: 5, gain: -0.05 },
        { band: 6, gain: 0 },
        { band: 7, gain: -0.05 },
        { band: 8, gain: -0.05 },
        { band: 9, gain: 0 },
        { band: 10, gain: 0.05 },
        { band: 11, gain: 0.05 },
        { band: 12, gain: 0.1 },
        { band: 13, gain: 0.1 },
      ],
    },
  },
  {
    key: 'party',
    value: {
      equalizer: [
        { band: 0, gain: -1.16 },
        { band: 1, gain: 0.28 },
        { band: 2, gain: 0.42 },
        { band: 3, gain: 0.5 },
        { band: 4, gain: 0.36 },
        { band: 5, gain: 0 },
        { band: 6, gain: -0.3 },
        { band: 7, gain: -0.21 },
        { band: 8, gain: -0.21 },
      ],
    },
  },
  {
    key: 'earrape',
    value: {
      equalizer: [
        { band: 0, gain: 0.25 },
        { band: 1, gain: 0.5 },
        { band: 2, gain: -0.5 },
        { band: 3, gain: -0.25 },
        { band: 4, gain: 0 },
        { band: 6, gain: -0.025 },
        { band: 7, gain: -0.0175 },
        { band: 8, gain: 0 },
        { band: 9, gain: 0 },
        { band: 10, gain: 0.0125 },
        { band: 11, gain: 0.025 },
        { band: 12, gain: 0.375 },
        { band: 13, gain: 0.125 },
        { band: 14, gain: 0.125 },
      ],
    },
  },
  {
    key: 'equalizer',
    value: {
      equalizer: [
        { band: 0, gain: 0.375 },
        { band: 1, gain: 0.35 },
        { band: 2, gain: 0.125 },
        { band: 5, gain: -0.125 },
        { band: 6, gain: -0.125 },
        { band: 8, gain: 0.25 },
        { band: 9, gain: 0.125 },
        { band: 10, gain: 0.15 },
        { band: 11, gain: 0.2 },
        { band: 12, gain: 0.25 },
        { band: 13, gain: 0.35 },
        { band: 14, gain: 0.4 },
      ],
    },
  },
  {
    key: 'electronic',
    value: {
      equalizer: [
        { band: 0, gain: 0.375 },
        { band: 1, gain: 0.35 },
        { band: 2, gain: 0.125 },
        { band: 5, gain: -0.125 },
        { band: 6, gain: -0.125 },
        { band: 8, gain: 0.25 },
        { band: 9, gain: 0.125 },
        { band: 10, gain: 0.15 },
        { band: 11, gain: 0.2 },
        { band: 12, gain: 0.25 },
        { band: 13, gain: 0.35 },
        { band: 14, gain: 0.4 },
      ],
    },
  },
  {
    key: 'radio',
    value: {
      equalizer: [
        { band: 0, gain: -0.25 },
        { band: 1, gain: 0.48 },
        { band: 2, gain: 0.59 },
        { band: 3, gain: 0.72 },
        { band: 4, gain: 0.56 },
        { band: 6, gain: -0.24 },
        { band: 8, gain: -0.16 },
      ],
    },
  },
  { key: 'tremolo', value: { tremolo: { depth: 0.3, frequency: 14 } } },
  {
    key: 'treblebass',
    value: {
      equalizer: [
        { band: 0, gain: 0.6 },
        { band: 1, gain: 0.67 },
        { band: 2, gain: 0.67 },
        { band: 3, gain: 0 },
        { band: 4, gain: -0.5 },
        { band: 5, gain: 0.15 },
        { band: 6, gain: -0.45 },
        { band: 7, gain: 0.23 },
        { band: 8, gain: 0.35 },
        { band: 9, gain: 0.45 },
        { band: 10, gain: 0.55 },
        { band: 11, gain: 0.6 },
        { band: 12, gain: 0.55 },
      ],
    },
  },
  { key: 'vibrato', value: { vibrato: { depth: 0.3, frequency: 14 } } },
  { key: 'china', value: { timescale: { speed: 0.75, pitch: 1.25, rate: 1.25 } } },
  { key: 'chimpunk', value: { timescale: { speed: 1.05, pitch: 1.35, rate: 1.25 } } },
  { key: 'darthvader', value: { timescale: { speed: 0.975, pitch: 0.5, rate: 0.8 } } },
  {
    key: 'daycore',
    value: {
      equalizer: [
        { band: 0, gain: 0 },
        { band: 1, gain: 0 },
        { band: 2, gain: 0 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: 0 },
        { band: 6, gain: 0 },
        { band: 7, gain: 0 },
        { band: 8, gain: -0.25 },
        { band: 9, gain: -0.25 },
        { band: 10, gain: -0.25 },
        { band: 11, gain: -0.25 },
        { band: 12, gain: -0.25 },
        { band: 13, gain: -0.25 },
      ],
      timescale: { pitch: 0.63, rate: 1.05 },
    },
  },
  { key: 'doubletime', value: { timescale: { speed: 1.165 } } },
  { key: 'pitch', value: { timescale: { pitch: 3 } } },
  { key: 'rate', value: { timescale: { rate: 2 } } },
  { key: 'slow', value: { timescale: { speed: 0.5, pitch: 1, rate: 0.8 } } },
];

export default audioEffects;

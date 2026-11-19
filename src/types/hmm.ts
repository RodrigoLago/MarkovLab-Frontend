export type Nucleotide = 0 | 1 | 2 | 3;

export interface HmmState { id: string; name: string; initialProbability: number; }
export interface HmmTransition { fromStateId: string; toStateId: string; probability: number; }
export interface HmmEmission { stateId: string; nucleotide: Nucleotide; probability: number; }
export interface HiddenMarkovModel {
  id: string;
  name: string;
  states: HmmState[];
  transitions: HmmTransition[];
  emissions: HmmEmission[];
}

export interface ViterbiCandidate {
  previousStateId: string | null;
  previousProbability: number | null;
  transitionProbability: number | null;
  initialProbability: number | null;
  emissionProbability: number;
  probability: number;
  logProbability: number | null;
}
export interface ViterbiStep {
  position: number;
  nucleotide: Nucleotide;
  stateId: string;
  candidates: ViterbiCandidate[];
  selectedPreviousStateId: string | null;
  probability: number;
  logProbability: number | null;
}
export interface ViterbiResult {
  statePath: string[];
  probability: number;
  logProbability: number | null;
  steps: ViterbiStep[];
}

export const sampleModel: HiddenMarkovModel = {
  id: 'dna-example',
  name: 'Promotor / Background',
  states: [
    { id: 'P', name: 'Promotor', initialProbability: 0.5 },
    { id: 'B', name: 'Background', initialProbability: 0.5 },
  ],
  transitions: [
    { fromStateId: 'P', toStateId: 'P', probability: 0.9 },
    { fromStateId: 'P', toStateId: 'B', probability: 0.1 },
    { fromStateId: 'B', toStateId: 'P', probability: 0.05 },
    { fromStateId: 'B', toStateId: 'B', probability: 0.95 },
  ],
  emissions: [
    { stateId: 'P', nucleotide: 0, probability: 0.1 },
    { stateId: 'P', nucleotide: 1, probability: 0.4 },
    { stateId: 'P', nucleotide: 2, probability: 0.4 },
    { stateId: 'P', nucleotide: 3, probability: 0.1 },
    { stateId: 'B', nucleotide: 0, probability: 0.25 },
    { stateId: 'B', nucleotide: 1, probability: 0.25 },
    { stateId: 'B', nucleotide: 2, probability: 0.25 },
    { stateId: 'B', nucleotide: 3, probability: 0.25 },
  ],
};

export const nucleotideLabel = (value: Nucleotide) => 'ACGT'[value];
export const formatProbability = (value: number) =>
  value === 0 ? '0' : value < 0.0001 ? value.toExponential(3) : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

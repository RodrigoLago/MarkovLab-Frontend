import type { HiddenMarkovModel, ViterbiResult } from '../types/hmm';

export async function executeViterbi(model: HiddenMarkovModel, sequence: string): Promise<ViterbiResult> {
  const response = await fetch('/api/hmm/viterbi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, sequence }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`La API devolvió ${response.status}: ${detail}`);
  }

  return (await response.json()) as ViterbiResult;
}

import { useMemo, useState } from 'react';
import { HmmFlow } from './components/HmmFlow';
import { TrellisFlow } from './components/TrellisFlow';
import { executeViterbi } from './api/hmmApi';
import { formatProbability, sampleModel, type HiddenMarkovModel, type Nucleotide, type ViterbiResult } from './types/hmm';

function FinalProbability({ value }: { value: number }) {
  if (value === 0 || value >= 0.0001)
    return <>{formatProbability(value).replace('.', ',')}</>;

  const [coefficient, exponent] = value.toExponential(3).split('e');

  return <>{coefficient.replace('.', ',')} × 10<sup>{Number(exponent)}</sup></>;
}

type ModelSettings = {
  initialPromoter: number;
  stayPromoter: number;
  stayBackground: number;
  promoterGc: number;
  backgroundGc: number;
};

const initialSettings: ModelSettings = {
  initialPromoter: 0.5,
  stayPromoter: 0.9,
  stayBackground: 0.95,
  promoterGc: 0.8,
  backgroundGc: 0.5,
};

function buildModel(settings: ModelSettings): HiddenMarkovModel {
  const emissions = (stateId: string, gc: number) =>
    ([0, 1, 2, 3] as Nucleotide[]).map(nucleotide => ({
      stateId,
      nucleotide,
      probability: nucleotide === 1 || nucleotide === 2 ? gc / 2 : (1 - gc) / 2,
    }));

  return {
    ...sampleModel,
    states: [
      { id: 'P', name: 'Promotor', initialProbability: settings.initialPromoter },
      { id: 'B', name: 'Background', initialProbability: 1 - settings.initialPromoter },
    ],
    transitions: [
      { fromStateId: 'P', toStateId: 'P', probability: settings.stayPromoter },
      { fromStateId: 'P', toStateId: 'B', probability: 1 - settings.stayPromoter },
      { fromStateId: 'B', toStateId: 'P', probability: 1 - settings.stayBackground },
      { fromStateId: 'B', toStateId: 'B', probability: settings.stayBackground },
    ],
    emissions: [...emissions('P', settings.promoterGc), ...emissions('B', settings.backgroundGc)],
  };
}

export default function App() {
  const [sequence, setSequence] = useState('ACGCGTAC');
  const [view, setView] = useState<'model' | 'trellis'>('trellis');
  const [result, setResult] = useState<ViterbiResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<ModelSettings>(initialSettings);
  const model = useMemo(() => buildModel(settings), [settings]);

  function updateSetting(key: keyof ModelSettings, value: number) {
    setSettings(current => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
  }

  async function runViterbi() {
    setBusy(true);
    setError('');
    setResult(null);

    try {
      const data = await executeViterbi(model, sequence);
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo ejecutar Viterbi.');
    } finally {
      setBusy(false);
    }
  }

  function changeSequence(value: string) {
    setSequence(value.toUpperCase().replace(/[^ACGT]/g, ''));
    setResult(null);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-icon">◈</span><div><strong>MARKOV<span>LAB</span></strong></div></div>
      </header>

      <section className="heading">
        <div><p className="eyebrow">LABORATORIO INTERACTIVO / 01</p><h1>Descubrí los estados <em>ocultos.</em></h1><p className="subtitle">Explorá cómo Viterbi reconstruye el camino más probable detrás de una secuencia de ADN.</p></div>
      </section>

      <section className="settings-panel panel">
        <div className="panel-heading"><h2>Probabilidades del modelo</h2><button className="reset-button" onClick={() => { setSettings(initialSettings); setResult(null); setError(''); }}>RESTABLECER</button></div>
        <p className="settings-intro">Mové los controles y volvé a ejecutar Viterbi. Las probabilidades complementarias se ajustan automáticamente para que siempre sumen 100 %.</p>
        <div className="settings-grid">
          {([
            { key: 'initialPromoter', label: 'Probabilidad inicial de Promotor', hint: 'La probabilidad de empezar en Promotor.' },
            { key: 'stayPromoter', label: 'Permanecer en Promotor', hint: 'Probabilidad de pasar de P a P.' },
            { key: 'stayBackground', label: 'Permanecer en Background', hint: 'Probabilidad de pasar de B a B.' },
            { key: 'promoterGc', label: 'C o G en Promotor', hint: 'Las emisiones C y G se reparten este porcentaje por igual.' },
            { key: 'backgroundGc', label: 'C o G en Background', hint: 'Las emisiones C y G se reparten este porcentaje por igual.' },
          ] as const).map(item => (
            <label key={item.key} className="setting-field">
              <span className="setting-title">{item.label}<strong>{Math.round(settings[item.key] * 100)} %</strong></span>
              <input type="range" min="0" max="100" step="5" value={settings[item.key] * 100} onChange={event => updateSetting(item.key, Number(event.target.value) / 100)} />
              <small>{item.hint}</small>
            </label>
          ))}
        </div>
      </section>

      <div className="workspace">
        <section className="graph-panel panel">
          <div className="panel-heading">
            <div><p className="eyebrow">MODELO DE MARKOV OCULTO</p><h2>{view === 'model' ? model.name : 'Ejecución de Viterbi'}</h2></div>
            <div className="view-tabs" role="group" aria-label="Tipo de visualización">
              <button className={view === 'model' ? 'selected' : ''} onClick={() => setView('model')}>Modelo</button>
              <button className={view === 'trellis' ? 'selected' : ''} onClick={() => setView('trellis')}>Ejecución</button>
            </div>
          </div>
          {view === 'model'
            ? <HmmFlow model={model} result={result} />
            : <TrellisFlow model={model} sequence={sequence} result={result} />}
          <div className="graph-footer"><span><i className="legend-dot violet-dot" /> Promotor</span><span><i className="legend-dot cyan-dot" /> Background</span><span className="graph-footer-note">{view === 'trellis' ? 'Columnas = nucleótidos · Filas = estados' : 'Probabilidades de transición en las flechas'}</span></div>
        </section>

        <aside className="side-panel panel">
          <div className="panel-heading"><div><p className="eyebrow">CONTROLES</p><h2>Simulación</h2></div><span className="status-indicator">● LISTO</span></div>
          <label htmlFor="sequence" className="field-label">SECUENCIA DE ADN</label>
          <input id="sequence" className="sequence-input" value={sequence} onChange={event => changeSequence(event.target.value)} spellCheck={false} placeholder="ACGCGTAC" />
          <p className="helper">Usá únicamente los nucleótidos A, C, G y T.</p>
          <button className="primary-button" disabled={busy || sequence.length === 0} onClick={runViterbi}>{busy ? 'EJECUTANDO…' : '▶  EJECUTAR VITERBI'}</button>
          {error && <p className="error-message" role="alert">{error}</p>}

          <div className="section-rule" />
          <p className="eyebrow">RESULTADO DEL ALGORITMO</p>
          {result ? (
            <div className="result-summary">
              <span className="result-label">PROBABILIDAD FINAL DEL CAMINO</span>
              <strong className="result-number"><FinalProbability value={result.probability} /></strong>
            </div>
          ) : <div className="empty-message">Ejecutá Viterbi para descubrir el camino más probable.</div>}

        </aside>
      </div>

      <section className="sequence-panel panel">
        <div className="panel-heading"><div><p className="eyebrow">RECONSTRUCCIÓN</p><h2>Camino más probable</h2></div><span className="panel-tag">{sequence.length} NUCLEÓTIDOS</span></div>
        <div className="sequence-strip">{sequence.split('').map((nucleotide, index) => (
          <div key={`${index}-${nucleotide}`} className="sequence-column">
            <div className={`nucleotide n-${nucleotide}`}>{nucleotide}</div>
            <div className={`path-state ${result?.statePath[index] === 'P' ? 'path-p' : result?.statePath[index] === 'B' ? 'path-b' : ''}`}>{result?.statePath[index] ?? '·'}</div>
            <span className="sequence-index">{index + 1}</span>
          </div>
        ))}</div>
        <p className="footnote">La primera fila es el ADN observado. La segunda muestra el camino oculto reconstruido por Viterbi.</p>
      </section>
      <footer className="footer">MARKOVLAB · EXPLORACIÓN DIDÁCTICA DE HMM <span>Desarrollado por Lago Rodrigo Iván · React Flow / ASP.NET Core</span></footer>
    </main>
  );
}

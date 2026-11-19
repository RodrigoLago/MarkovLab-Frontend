# MarkovLab Frontend

Aplicación web interactiva desarrollada para visualizar modelos ocultos de Markov (HMM) y comprender el algoritmo de Viterbi aplicado a secuencias de ADN.

El proyecto tiene fines educativos y permite experimentar con diferentes probabilidades para observar cómo influyen en la determinación del camino de estados ocultos más probable.

## Funcionalidades

- Visualización gráfica de modelos ocultos de Markov.
- Representación de estados y probabilidades de transición.
- Configuración interactiva de probabilidades iniciales.
- Modificación de probabilidades de transición y emisión.
- Ingreso de secuencias de ADN.
- Ejecución del algoritmo de Viterbi.
- Visualización del camino más probable mediante un diagrama Trellis.
- Visualización de la probabilidad final del camino obtenido.

## Modelo de ejemplo

La aplicación utiliza un HMM con dos estados ocultos:

- Promotor (P): representa una posible región promotora del ADN.
- Background (B): representa el ADN de fondo.

Cada estado tiene probabilidades de transición y emisión configurables.

El modelo constituye una simplificación didáctica y no representa un predictor biológico validado de regiones promotoras.

## Tecnologías

- React
- TypeScript
- React Flow
- Vite
- CSS

## Requisitos

- Node.js
- npm
- MarkovLab Backend API

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/RodrigoLago/MarkovLab-Frontend.git
```

Acceder al directorio:

```bash
cd MarkovLab-Frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en la dirección local indicada por Vite.

## Conexión con el backend

El frontend consume una API REST desarrollada en ASP.NET Core.

Endpoint:

POST /api/hmm/viterbi

Durante el desarrollo, Vite utiliza un proxy configurado en vite.config.ts para comunicarse con:

https://localhost:7259

La API debe encontrarse en ejecución para poder utilizar el algoritmo de Viterbi.

## Proyectos relacionados

- Librería NuGet: https://github.com/RodrigoLago/MarkovLab
- Backend: https://github.com/RodrigoLago/MarkovLab-Backend

## Autor

Lago Rodrigo Iván

## Licencia

MIT
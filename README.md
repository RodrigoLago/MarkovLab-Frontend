# MarkovLab 2.5D – Modelo + Trellis Viterbi

Actualización del frontend de MarkovLab. Incluye dos pestañas: Modelo y Ejecución. La vista Ejecución visualiza un nodo por estado y nucleótido, transiciones posibles y camino óptimo final. Utiliza la respuesta real del endpoint POST /api/hmm/viterbi.

## Instalación sobre tu proyecto actual

1. Copiar la carpeta `src` de este ZIP sobre la carpeta `src` existente, reemplazando los archivos correspondientes (conservá el resto de archivos de tu proyecto).
2. Copiar `vite.config.ts` a la raíz (el proxy ya apunta a https://localhost:7259).
3. Desde la carpeta que contiene package.json, ejecutar `npm.cmd install @xyflow/react` si falta, luego `npm.cmd run dev`.
4. Mantener la API .NET ejecutándose en https://localhost:7259.

No hace falta cambiar el backend.

Nota: se entregan archivos de la app React, no node_modules ni package.json; conservar el package.json que ya generaste con Vite.

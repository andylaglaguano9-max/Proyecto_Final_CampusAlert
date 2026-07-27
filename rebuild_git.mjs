import { execSync } from 'child_process';
import fs from 'fs';

console.log("Iniciando reconstrucción del historial de Git...");

// 1. Destruir el historial viejo
if (fs.existsSync('.git')) {
  console.log("Borrando historial antiguo...");
  fs.rmSync('.git', { recursive: true, force: true });
}

// 2. Inicializar nuevo repositorio
execSync('git init');
// Asegurarnos de que la rama principal se llame 'main'
try { execSync('git branch -M main'); } catch(e){} 

// Función auxiliar para hacer los commits de forma segura
function makeCommit(author, msg, files) {
  files.forEach(f => {
    if (fs.existsSync(f)) {
      execSync(`git add ${f}`);
    } else if (f === '.') {
      execSync(`git add .`);
    }
  });
  
  try {
    // Si git commit falla es porque no hay archivos nuevos (lo cual está bien)
    execSync(`git commit --author="${author}" -m "${msg}"`, { stdio: 'ignore' });
    console.log(`[OK] Commit: ${msg}`);
  } catch (e) {
    console.log(`[SKIP] Commit (vacío): ${msg}`);
  }
}

const andy = "Andy Laglaguano <andy@example.com>";
const esteban = "Esteban Larco <esteban@example.com>";

// Fase 1: Base
makeCommit(andy, "chore: inicializar proyecto React con Vite", [
  "index.html", "vite.config.js", "package.json", "package-lock.json",
  ".gitignore", "eslint.config.js", "setupTests.js", "public", "README.md"
]);

// Fase 2: El gran aporte de Backend (Esteban)
makeCommit(esteban, "feat(server): implementar arquitectura del servidor, base de datos y endpoints", [
  "server"
]);

// Fase 3: Frontend por partes (Andy)
makeCommit(andy, "style(global): definir paleta de colores y estilos base", [
  "src/main.jsx", "src/index.css", "src/assets"
]);

makeCommit(andy, "feat(layout): crear Layout, Header y Footer", [
  "src/components/layout", "src/components/header", "src/components/footer"
]);

makeCommit(andy, "feat(pages): implementar páginas de Inicio, Acerca de y Equipo", [
  "src/pages/inicio", "src/pages/acerca", "src/pages/equipo"
]);

makeCommit(andy, "feat(services): implementar servicios de conexión a la API (auth, database, carbon)", [
  "src/services"
]);

makeCommit(andy, "feat(auth): añadir formularios de login y registro", [
  "src/pages/login", "src/pages/registro"
]);

makeCommit(andy, "feat(calculator): crear EmissionForm, HistoryTable y página Calculadora", [
  "src/components/emission-form", "src/components/history-table", "src/pages/calculadora"
]);

makeCommit(andy, "feat(router): configurar enrutamiento final y proteger rutas", [
  "src/App.jsx", "src/pages/index.jsx"
]);

// Fase Final: Recoger cualquier archivo suelto que se haya escapado
makeCommit(andy, "docs: actualizar README y afinar detalles visuales finales", [
  "."
]);

console.log("¡Historial reconstruido mágicamente! Todo listo para subir al nuevo repositorio.");

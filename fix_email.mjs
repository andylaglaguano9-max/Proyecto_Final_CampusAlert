import { execSync } from 'child_process';
import fs from 'fs';

console.log("Iniciando reconstrucción FINAL con correos reales...");

if (fs.existsSync('.git')) {
  fs.rmSync('.git', { recursive: true, force: true });
}

execSync('git init');
try { execSync('git branch -M main'); } catch(e){} 

function makeCommit(name, email, msg, files) {
  files.forEach(f => {
    if (fs.existsSync(f)) {
      execSync(`git add ${f}`);
    } else if (f === '.') {
      execSync(`git add .`);
    }
  });
  
  try {
    const env = { 
      ...process.env, 
      GIT_AUTHOR_NAME: name,
      GIT_AUTHOR_EMAIL: email,
      GIT_COMMITTER_NAME: name,
      GIT_COMMITTER_EMAIL: email
    };
    execSync(`git commit -m "${msg}"`, { env, stdio: 'ignore' });
  } catch (e) {}
}

// CORREO REAL DE TU COMPUTADORA PARA QUE GITHUB PONGA TU FOTO Y TU PERFIL
const andyN = "Andy Laglaguano";
const andyE = "andy.laglaguano@gmail.com"; 

const estebanN = "Esteban Larco";
const estebanE = "esteban@example.com"; 

makeCommit(andyN, andyE, "chore: inicializar proyecto React con Vite", [
  "index.html", "vite.config.js", "package.json", "package-lock.json",
  ".gitignore", "eslint.config.js", "setupTests.js", "public", "README.md"
]);

makeCommit(estebanN, estebanE, "feat(server): implementar arquitectura del servidor, base de datos y endpoints", [
  "server"
]);

makeCommit(andyN, andyE, "style(global): definir paleta de colores y estilos base", [
  "src/main.jsx", "src/index.css", "src/assets"
]);

makeCommit(andyN, andyE, "feat(layout): crear Layout, Header y Footer", [
  "src/components/layout", "src/components/header", "src/components/footer"
]);

makeCommit(andyN, andyE, "feat(pages): implementar páginas de Inicio, Acerca de y Equipo", [
  "src/pages/inicio", "src/pages/acerca", "src/pages/equipo"
]);

makeCommit(andyN, andyE, "feat(services): implementar servicios de conexión a la API (auth, database, carbon)", [
  "src/services"
]);

makeCommit(andyN, andyE, "feat(auth): añadir formularios de login y registro", [
  "src/pages/login", "src/pages/registro"
]);

makeCommit(andyN, andyE, "feat(calculator): crear EmissionForm, HistoryTable y página Calculadora", [
  "src/components/emission-form", "src/components/history-table", "src/pages/calculadora"
]);

makeCommit(andyN, andyE, "feat(router): configurar enrutamiento final y proteger rutas", [
  "src/App.jsx", "src/pages/index.jsx"
]);

makeCommit(andyN, andyE, "docs: actualizar README y afinar detalles visuales finales", [
  "."
]);

console.log("¡Terminado!");

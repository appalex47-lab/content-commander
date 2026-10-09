const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"), css=read("styles.css"), app=read("src/app.js");
const storage=read("src/storage.js"), nav=read("src/navigation.js"), learning=read("src/learning.js"), forms=read("src/forms.js");
const checks = [
 ["Spanish document and viewport", /<html lang="es">/.test(html) && /name="viewport"/.test(html)],
 ["Main views retained", ["inicio","empresa","estrategia","contenidos","calendario","aprendizaje","ajustes"].every(v=>html.includes(`id="view-${v}"`))],
 ["Lesson 01 objectives/example/exercise/quiz retained", html.includes("Al terminar podrás") && html.includes("EJEMPLO APLICADO") && html.includes('id="brief-form"') && html.includes('id="quiz-form"')],
 ["Separate navigation module", nav.includes("window.AppNavigation")],
 ["Separate forms module", forms.includes("window.AppForms")],
 ["Separate learning module", learning.includes("window.AppLearning")],
 ["Separate storage boundary", storage.includes("window.AppStorage")],
 ["Versioned persistence envelope", storage.includes("schemaVersion: 1")],
 ["Corrupt storage handled", storage.includes("JSON.parse") && storage.includes("catch")],
 ["Write failure handled", storage.includes("No se pudo guardar")],
 ["Quiz requires 4/5", learning.includes("score >= 4")],
 ["No hardcoded API key", !/(sk-[A-Za-z0-9]{20,}|COHERE_API_KEY\s*=\s*["'][^"']+)/.test(html+app+storage+nav+learning+forms)],
 ["Responsive breakpoint exists", /max-width:760px/.test(css)],
 ["Reduced motion supported", /prefers-reduced-motion:reduce/.test(css)],
 ["Status announcements present", /aria-live="polite"/.test(html)],
 ["Scripts loaded in dependency order", html.indexOf('src="src/storage.js"') < html.indexOf('src="src/navigation.js"') && html.indexOf('src="src/forms.js"') < html.indexOf('src="src/app.js"')]
];
let failures=0;
for(const [label,ok] of checks){console.log(`${ok?"PASS":"FAIL"} — ${label}`);if(!ok)failures++;}
console.log(`\n${checks.length-failures}/${checks.length} smoke tests passed.`);
if(failures)process.exit(1);

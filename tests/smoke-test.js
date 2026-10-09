const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"), css=read("styles.css"), app=read("src/app.js");
const storage=read("src/storage.js"), nav=read("src/navigation.js"), learning=read("src/learning.js"), forms=read("src/forms.js"), backup=read("src/backup.js");
const checks = [
 ["Spanish document and viewport", /<html lang="es">/.test(html) && /name="viewport"/.test(html)],
 ["Main views retained", ["inicio","empresa","estrategia","contenidos","calendario","aprendizaje","ajustes"].every(v=>html.includes(`id="view-${v}"`))],
 ["Lesson 01 objectives/example/exercise/quiz retained", html.includes("Al terminar podrás") && html.includes("EJEMPLO APLICADO") && html.includes('id="brief-form"') && html.includes('id="quiz-form"')],
 ["Separate navigation/forms/learning modules", nav.includes("window.AppNavigation") && forms.includes("window.AppForms") && learning.includes("window.AppLearning")],
 ["IndexedDB is the primary storage", storage.includes("indexedDB.open(DB_NAME, DB_VERSION)") && storage.includes("objectStore(STORE)")],
 ["Legacy localStorage migration retains source copy", storage.includes("migrateLegacy") && storage.includes("copia original se conserva")],
 ["Versioned JSON backup", storage.includes("backupVersion: BACKUP_VERSION") && storage.includes("schemaVersion: DB_VERSION")],
 ["Backup format validation", storage.includes("function validateBackup") && storage.includes("payload.app !== \"Content Commander\"")],
 ["API keys stripped on import", storage.includes("delete data.cohereApiKey") && storage.includes("delete data.apiKey") && storage.includes("delete data.apiKeys")],
 ["Replace and merge modes supported", storage.includes('mode !== "replace" && mode !== "merge"') && storage.includes("...existing.data, ...checked.data")],
 ["Import preview before enabling import", backup.includes("validate-backup") && backup.includes('disabled=true') && backup.includes("renderPreview")],
 ["File-size limit and JSON file picker", backup.includes("10 * 1024 * 1024") && html.includes('accept=".json,application/json"')],
 ["Export uses a JSON Blob download", backup.includes("new Blob([content]") && backup.includes("URL.createObjectURL")],
 ["Progress counter matches five criteria", html.includes("0 de 5 pasos") && learning.includes("steps.length")],
 ["Quiz requires 4/5", learning.includes("score >= 4")],
 ["No hardcoded API key", !/(sk-[A-Za-z0-9]{20,}|COHERE_API_KEY\s*=\s*["'][^"']+)/.test(html+app+storage+nav+learning+forms+backup)],
 ["Responsive breakpoint and reduced motion retained", /max-width:760px/.test(css) && /prefers-reduced-motion:reduce/.test(css)],
 ["Accessible status messages present", /aria-live="polite"/.test(html)],
 ["Storage-dependent scripts load before app", html.indexOf('src="src/storage.js"') < html.indexOf('src="src/backup.js"') && html.indexOf('src="src/backup.js"') < html.indexOf('src="src/app.js"')]
];
let failures=0;
for(const [label,ok] of checks){console.log(`${ok?"PASS":"FAIL"} — ${label}`);if(!ok)failures++;}
console.log(`\n${checks.length-failures}/${checks.length} smoke tests passed.`);
if(failures)process.exit(1);
// Phase 3 assertions (static checks; these do not contact Cohere).
const cohereSource = read('src/cohere.js');
const phase3Html = html;
const phase3Checks = [
  ['Cohere v2 Chat endpoint configured', cohereSource.includes('https://api.cohere.com/v2/chat')],
  ['Bearer authentication header configured', cohereSource.includes('Authorization') && cohereSource.includes('Bearer ${apiKey}')],
  ['Model allowlist includes four requested models', ['command-a-plus-05-2026','command-a-reasoning-08-2025','command-a-03-2025','command-r7b-12-2024'].every(m => cohereSource.includes(m))],
  ['API key stored outside IndexedDB backup data', cohereSource.includes('content-commander-cohere-config-v1') && !cohereSource.includes('data.cohereApiKey =')],
  ['Error paths for unauthorized and rate-limited requests', cohereSource.includes('status === 401') && cohereSource.includes('status === 429')],
  ['Content generation enforces fact-check and no invention', cohereSource.includes('No inventes hechos') && cohereSource.includes('[POR VALIDAR]')],
  ['Drafts remain pending human review', cohereSource.includes('pending-human-review') && cohereSource.includes('approved: false')],
  ['Drafts persist in IndexedDB workspace', cohereSource.includes('data.contentDrafts') && cohereSource.includes('AppStorage.write(data)')],
  ['Generated text rendered as textContent', cohereSource.includes('element.textContent = value') && cohereSource.includes('draft-result'),],
  ['Settings expose save/test/delete actions', ['cohere-settings-form','test-cohere','clear-cohere'].every(id => phase3Html.includes(id))],
  ['Generation form includes content type, network, goal and topic', ['content-type','content-network','content-goal','content-topic'].every(id => phase3Html.includes(id))],
  ['Cohere module loads before app initialization', phase3Html.indexOf('src/cohere.js') < phase3Html.indexOf('src/app.js')],
  ['Privacy notice discloses browser-local API key risk', phase3Html.toLowerCase().includes('no es un secreto seguro en una aplicación estática')],
  ['No API key is hardcoded in source', !/sk-[A-Za-z0-9]{20,}/.test(cohereSource + phase3Html)]
];
let phase3Passed = 0;
for (const [name, ok] of phase3Checks) { if (ok) { phase3Passed++; console.log(`PASS — ${name}`); } else console.error(`FAIL — ${name}`); }
console.log(`${phase3Passed}/${phase3Checks.length} phase 3 checks passed.`);
if (phase3Passed !== phase3Checks.length) process.exitCode = 1;

// Phase 4 assertions: master company profile and context passed to Cohere.
const phase4Checks = [
  ['Master profile fields are present', ['mission','vision','values','valueProposition','difference','audience','tone','personality','evidence','restrictions','notes'].every(id => html.includes(`id="${id}"`))],
  ['Required minimum company fields are validated', html.includes('id="company"') && html.includes('id="offer"') && html.includes('required') && forms.includes('!$("#company").value.trim() || !$("#offer").value.trim()')],
  ['Company profile completeness feedback exists', html.includes('id="company-completeness"') && forms.includes('updateCompanyCompleteness')],
  ['Expanded fields are persisted and restored', forms.includes('"mission","vision","values","valueProposition"') && forms.includes('data[section + "UpdatedAt"]')],
  ['Cohere prompt uses mission, vision and values', ['company.mission','company.vision','company.values'].every(v => cohereSource.includes(v))],
  ['Cohere prompt uses positioning and audience', cohereSource.includes('company.valueProposition') && cohereSource.includes('company.audience')],
  ['Cohere prompt includes evidence and restrictions', cohereSource.includes('company.evidence') && cohereSource.includes('company.restrictions')],
  ['No unsupported promise of automated fact verification', html.includes('La IA necesita contexto') && cohereSource.includes('No inventes hechos')],
  ['Backup mechanism remains compatible with expanded profile', storage.includes('const payload = { app: "Content Commander"') && backup.includes('AppStorage.importBackup')],
  ['Profile supports partial knowledge without requiring every field', html.includes('Los campos sin información no se inventan') && !/id="(mission|vision|values|valueProposition|difference|audience|tone|personality|evidence|restrictions|notes)"[^>]*required/.test(html)]
];
let phase4Passed = 0;
for (const [name, ok] of phase4Checks) { if (ok) { phase4Passed++; console.log(`PASS — ${name}`); } else console.error(`FAIL — ${name}`); }
console.log(`${phase4Passed}/${phase4Checks.length} phase 4 checks passed.`);
if (phase4Passed !== phase4Checks.length) process.exitCode = 1;

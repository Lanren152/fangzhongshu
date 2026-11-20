const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/懒人/Desktop/古代房中术_看板.html';
const ROOT = path.resolve(__dirname, '..');

const html = fs.readFileSync(SRC, 'utf8');
let out = html;

// ---- 1. CSS -> src/css/main.css, art images -> assets/img/art/ ----
const styleMatch = out.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error('style block not found');
let css = styleMatch[1];
const artDir = path.join(ROOT, 'assets/img/art');
let artCount = 0;
css = css.replace(/\.art-([a-z0-9]+)\{--art:url\("data:image\/(webp|png);base64,([^"]+)"\)\}/g,
  (full, name, ext, b64) => {
    const file = `art-${name}.${ext}`;
    fs.writeFileSync(path.join(artDir, file), Buffer.from(b64, 'base64'));
    artCount++;
    return `.art-${name}{--art:url("../assets/img/art/${file}")}`;
  });
console.log('art images extracted:', artCount);

// ---- 2. main script -> src/js/app.js, POSE_IMAGES -> local file ----
const scriptRe = /<script>([\s\S]*?)<\/script>/g;
const scripts = [];
let m;
while ((m = scriptRe.exec(out))) scripts.push({ full: m[0], body: m[1], index: m.index });
if (scripts.length !== 2) throw new Error('expected 2 script blocks, got ' + scripts.length);
const themeScript = scripts[0];
const mainScript = scripts[1];

let app = mainScript.body;
const poseStart = app.indexOf('var POSE_IMAGES = {');
if (poseStart === -1) throw new Error('POSE_IMAGES not found');
const poseEnd = app.indexOf('};', poseStart);
if (poseEnd === -1) throw new Error('POSE_IMAGES end not found');
const poseBlock = app.slice(poseStart, poseEnd + 2);
const poseKeys = (poseBlock.match(/'(?:[a-z0-9_]+)':'data:image/g) || []).length;
console.log('pose images extracted:', poseKeys);

const poseLocal = poseBlock.replace('var POSE_IMAGES = ', 'window.__POSE_IMAGES_LOCAL__ = ');
fs.writeFileSync(path.join(ROOT, 'src/js/pose-images.local.js'), poseLocal + '\n');
fs.writeFileSync(path.join(ROOT, 'src/js/pose-images.js'),
  '// Local override slot. Put licensed pose images in pose-images.local.js (gitignored).\n' +
  '// Shape: window.__POSE_IMAGES_LOCAL__ = { "file_key": "data:image/webp;base64,..." };\n' +
  'window.__POSE_IMAGES_LOCAL__ = window.__POSE_IMAGES_LOCAL__ || {};\n');

app = app.slice(0, poseStart) + 'var POSE_IMAGES = window.__POSE_IMAGES_LOCAL__ || {};' + app.slice(poseEnd + 2);
fs.writeFileSync(path.join(ROOT, 'src/js/app.js'), app);
fs.writeFileSync(path.join(ROOT, 'src/css/main.css'), css);

// ---- 3. build src/index.html ----
let doc = out;
doc = doc.replace(styleMatch[0], '<link rel="stylesheet" href="css/main.css">');
const mainTag = scripts[1].full;
doc = doc.replace(mainTag,
  '<script src="js/pose-images.js"></script>\n<script src="js/pose-images.local.js"></script>\n<script src="js/app.js"></script>');
fs.writeFileSync(path.join(ROOT, 'src/index.html'), doc);

// ---- 4. leftover checks ----
const leftImgs = (doc.match(/data:image\/[a-z+]+;base64,/g) || []).length;
console.log('leftover inline images in src/index.html:', leftImgs);
console.log('src/index.html bytes:', doc.length);
console.log('app.js bytes:', app.length);
console.log('local poses bytes:', poseLocal.length);
console.log('css bytes:', css.length);

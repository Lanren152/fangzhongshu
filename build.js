const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const b64 = f => fs.readFileSync(path.join(ROOT, f)).toString('base64');

let css = read('src/css/main.css');
css = css.replace(/url\("(\.\.\/assets\/img\/art\/[^"]+)"\)/g, (m, p) => {
  const file = p.replace('../', '');
  const ext = path.extname(file).slice(1);
  return 'url("data:image/' + (ext === 'png' ? 'png' : 'webp') + ';base64,' + b64(file) + '")';
});

let html = read('src/index.html');
html = html.replace('<link rel="stylesheet" href="css/main.css">', () => '<style>' + css + '</style>');

const localPath = path.join(ROOT, 'src/js/pose-images.local.js');
const hasLocal = fs.existsSync(localPath);
const parts = [];
if (hasLocal) parts.push(read('src/js/pose-images.local.js'));
parts.push(read('src/js/pose-images.js'));
parts.push(read('src/js/app.js'));
html = html.replace(
  /<script src="js\/pose-images\.js"><\/script>\s*<script src="js\/pose-images\.local\.js"><\/script>\s*<script src="js\/app\.js"><\/script>/,
  () => '<script>\n' + parts.join('\n') + '\n</script>'
);

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist/index.html'), html);
console.log('built dist/index.html:', html.length, 'chars, local poses included:', hasLocal);

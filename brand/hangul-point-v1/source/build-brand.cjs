const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const green = '#17683A', ink = '#153B2B';
const generated = [];
const sources = {};
for (const name of ['hangul-point-symbol', 'hangul-point-micro', 'wordmark-ko', 'wordmark-en']) {
  const raw = fs.readFileSync(path.join(__dirname, name + '.svg'), 'utf8');
  const viewBox = raw.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const body = raw.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<(title|desc)\b[^>]*>[\s\S]*?<\/\1>/g, '').replace(/\s+id="[^"]*"/g, '');
  sources[name] = { raw, viewBox, body };
}
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function svg(title, width, height, body, color = green) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="currentColor" color="${color}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${body}</svg>`;
}
function place(name, x, y, width, color) {
  const a = sources[name], [vx, vy, vw] = a.viewBox;
  return `<g transform="translate(${x} ${y}) scale(${width / vw}) translate(${-vx} ${-vy})" color="${color}" fill="${color}">${a.body}</g>`;
}
function symbol(x, y, width, color = green, micro = false) {
  return place(micro ? 'hangul-point-micro' : 'hangul-point-symbol', x, y, width, color);
}
function lockup(locale, inverse = false) {
  const word = sources['wordmark-' + locale];
  const wordWidth = 176 * word.viewBox[2] / word.viewBox[3];
  return { width: Math.ceil(290 + wordWidth + 4), height: 232,
    body: symbol(0, 4, 256, inverse ? '#FFFFFF' : green) + place('wordmark-' + locale, 290, 28, wordWidth, inverse ? '#FFFFFF' : ink) };
}
function icon(x, y, size, radius = 0, color = green, micro = false) {
  const scale = size / 1024;
  const mark = micro ? symbol(12, 48, 1000, '#FFFFFF', true) : symbol(150, 203.734375, 724, '#FFFFFF');
  return `<g transform="translate(${x} ${y}) scale(${scale})"><rect width="1024" height="1024" rx="${radius / scale}" fill="${color}"/>${mark}</g>`;
}
function text(label, x, y, size, color = ink, weight = 400) {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" font-family="Malgun Gothic, sans-serif" fill="${color}">${esc(label)}</text>`;
}
function write(relative, value) {
  const full = path.join(root, relative);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, value);
  generated.push(relative);
}
async function png(relative, input, width, height, opaque = false) {
  const full = path.join(root, relative);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  let img = sharp(Buffer.from(input)).resize(width, height);
  if (opaque) img = img.flatten({ background: green }).removeAlpha();
  await img.png().toFile(full);
  generated.push(relative);
}
async function main() {
  for (const [name, color] of [['green', green], ['white', '#FFFFFF'], ['black', '#000000']]) {
    const asset = svg('급똥 Hangul Point symbol / ' + name, 256, 224, symbol(0, 0, 256, color), color);
    write(`svg/symbol-${name}.svg`, asset);
    await png(`png/symbol-${name}-1024.png`, asset, 1024, 896);
  }
  write('svg/symbol-currentcolor.svg', sources['hangul-point-symbol'].raw.replace(' color="#17683A"', ''));
  write('svg/symbol-micro.svg', sources['hangul-point-micro'].raw);
  for (const locale of ['ko', 'en']) {
    write(`svg/wordmark-${locale}.svg`, sources['wordmark-' + locale].raw);
    for (const inverse of [false, true]) {
      const a = lockup(locale, inverse), name = `lockup-${locale}${inverse ? '-white' : ''}`;
      const asset = svg('급똥 ' + locale + ' brand lockup', a.width, a.height, a.body);
      write('svg/' + name + '.svg', asset);
      await png('png/' + name + '.png', asset, a.width * 3, a.height * 3);
    }
  }
  const app = svg('급똥 app icon master', 1024, 1024, icon(0, 0, 1024));
  write('svg/app-icon-square.svg', app);
  await png('png/app-icon-1024.png', app, 1024, 1024, true);
  await png('png/avatar-1080.png', app, 1080, 1080, true);
  const favicon = svg('급똥 favicon optical master', 256, 256, icon(0, 0, 256, 0, green, true));
  write('svg/favicon-micro.svg', favicon);
  for (const size of [16, 24, 32, 48, 64]) {
    await png(`png/favicon-${size}.png`, favicon, size, size, true);
  }
  const boardWidth = 1640, boardHeight = 1110;
  let board = `<rect width="${boardWidth}" height="${boardHeight}" fill="#F6F8F5"/>`;
  board += text('급똥', 66, 84, 37, green, 700) + text('HANGUL POINT · 원본 v1', 183, 81, 23);
  board += text('2026.09.27', 1427, 79, 17, '#667B6C');
  board += `<path d="M66 116H1574" stroke="#D9E2D8"/>`;
  board += text('심볼', 66, 160, 16, '#667B6C');
  board += symbol(102, 203, 380);
  board += `<path d="M580 166V564" stroke="#D9E2D8"/>`;
  const ko = lockup('ko'), en = lockup('en');
  board += text('한국어 · 심볼 + 급똥', 652, 173, 18, '#667B6C');
  board += `<g transform="translate(630 198) scale(1.18)">${ko.body}</g>`;
  board += text('다국어 · 기존 GEUP / DDONG 유지', 652, 482, 18, '#667B6C');
  board += `<g transform="translate(636 502) scale(.63)">${en.body}</g>`;
  board += `<path d="M66 696H1574" stroke="#D9E2D8"/>`;
  board += text('앱 아이콘', 66, 741, 18, '#667B6C');
  board += icon(66, 770, 216, 48);
  board += `<defs><clipPath id="round-avatar"><circle cx="398" cy="878" r="108"/></clipPath></defs><g clip-path="url(#round-avatar)">${icon(290,770,216)}</g>`;
  board += text('마스크 미리보기 · 원본은 정사각형', 66, 1023, 16, '#667B6C');
  board += text('반전 · 단색', 587, 741, 18, '#667B6C');
  board += `<rect x="587" y="770" width="206" height="216" rx="20" fill="${ink}"/>` + symbol(610, 807, 160, '#FFFFFF');
  board += symbol(827, 807, 160, '#000000');
  board += text('작은 크기 · 간격 보정', 1060, 741, 18, '#667B6C');
  let sx = 1060;
  for (const size of [16,24,32,48,64]) {
    board += icon(sx, 823 + (64-size)/2, size, size*.21, green, true);
    board += text(String(size), sx, 928, 14, '#667B6C');
    sx += size + 24;
  }
  board += text('독립 SVG · 실제 투명 PNG · 동일한 브랜드 원본', 66, 1080, 16, '#667B6C');
  const boardSvg = svg('급똥 로고 원본 v1 구성', boardWidth, boardHeight, board);
  write('preview/brand-board.svg', boardSvg);
  await png('preview/brand-board.png', boardSvg, boardWidth, boardHeight);

  let small = '<rect width="1200" height="750" fill="#F6F8F5"/>';
  small += text('Hangul Point · small-size review', 42, 52, 24);
  small += text('Standard symbol',42,111,18) + text('Micro optical variant',42,268,18) + text('Favicon family',42,433,18) + text('App launcher · 48px+',42,610,18);
  for(const [i, size] of [16,24,32,48,64,96].entries()) {
    const x = 320 + i * 133;
    small += symbol(x, 90, size) + symbol(x, 247, size, green, true) + icon(x, 405, size, size*.2, green, true);
    if(size>=48)small += icon(x, 584, size, size*.2);
    small += text(size+' px',x,724,14,'#667B6C');
  }
  const smallSvg = svg('Small size visual review', 1200, 750, small);
  write('preview/small-size-check.svg',smallSvg);
  await png('preview/small-size-check.png',smallSvg,1200,750);

  const proof = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>급똥 로고 원본 v1</title><style>*{box-sizing:border-box}body{margin:0;background:#F6F8F5;color:#153B2B;font:15px/1.6 "Malgun Gothic",sans-serif}main{max-width:1080px;margin:auto;padding:32px 24px}header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #D9E2D8;padding-bottom:20px}h1{margin:0;font-size:23px}h2{font-size:16px;font-weight:500;margin:24px 0 12px}button,a{font:inherit;color:inherit}button{background:#fff;border:1px solid #C7D5C9;border-radius:8px;padding:8px 12px;cursor:pointer}.layout{display:grid;grid-template-columns:1fr 1.55fr;gap:28px;align-items:center;padding:40px 0}.surface{background:#fff;border-radius:24px;padding:30px;min-height:280px;display:grid;place-items:center}.symbol{width:260px;max-width:100%}.lockups{display:grid;gap:36px}.lockups img{width:100%;max-width:520px}.icons{display:flex;align-items:center;gap:32px;flex-wrap:wrap}.app{width:144px;display:block;border-radius:22.2%}.circle{border-radius:50%}.sizes{display:flex;align-items:center;gap:28px;flex-wrap:wrap}.sizes figure{margin:0;text-align:center}.sizes img{display:block;border-radius:21%;margin-bottom:8px}.files{display:flex;gap:20px;flex-wrap:wrap;margin-top:26px}.dark{background:#112B20;color:#fff}.dark .surface{background:#214335}.dark header{border-color:#3A5A45}.dark button{background:#214335;color:#fff;border-color:#3A5A45}.dark .symbol{content:url('../svg/symbol-white.svg')}.dark .ko{content:url('../svg/lockup-ko-white.svg')}.dark .en{content:url('../svg/lockup-en-white.svg')}@media(max-width:650px){.layout{grid-template-columns:1fr}.surface{min-height:230px}.symbol{width:210px}.app{width:108px}.icons{gap:18px}}
</style></head><body><main><header><h1>급똥 · Hangul Point 원본 v1</h1><button id="appearance" type="button" aria-pressed="false">어두운 배경</button></header><div class="layout"><div class="surface"><img class="symbol" src="../svg/symbol-green.svg" alt="ㄸ, 원점, 위치 포인트를 결합한 급똥 심볼"></div><div class="lockups"><img class="ko" src="../svg/lockup-ko.svg" alt="심볼과 급똥 한글 로고"><img class="en" src="../svg/lockup-en.svg" alt="심볼과 기존 GEUP DDONG 영문 로고"></div></div><h2>앱 아이콘 · 원형 프로필</h2><div class="icons"><img class="app" src="../png/app-icon-1024.png" alt="둥근 사각형 앱 아이콘"><img class="app circle" src="../png/avatar-1080.png" alt="원형 프로필 아이콘"></div><h2>작은 크기</h2><div class="sizes">${[16,24,32,48,64].map(s=>`<figure><img src="../png/favicon-${s}.png" width="${s}" height="${s}" alt="${s}픽셀 로고"><figcaption>${s}px</figcaption></figure>`).join('')}</div><div class="files"><a href="../svg/symbol-green.svg" download>심볼 SVG</a><a href="../svg/lockup-ko.svg" download>한글 SVG</a><a href="../svg/lockup-en.svg" download>영문 SVG</a><a href="../png/app-icon-1024.png" download>앱 아이콘 PNG</a></div></main><script>document.getElementById('appearance').addEventListener('click',function(){const dark=document.body.classList.toggle('dark');this.setAttribute('aria-pressed',String(dark));this.textContent=dark?'밝은 배경':'어두운 배경'});</script></body></html>`;
  write('preview/index.html', proof);

  const entries=[];
  for(const file of generated.filter(x=>/\.(svg|png)$/.test(x))) {
    const full=path.join(root,file),bytes=fs.readFileSync(full);
    const record={file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
    if(file.endsWith('.png')) {const m=await sharp(full).metadata();record.width=m.width;record.height=m.height;record.hasAlpha=m.hasAlpha;}
    entries.push(record);
  }
  write('brand-manifest.json',JSON.stringify({id:'geupddong-hangul-point',version:'1.0.0',created:'2026-09-27',status:'Approved master artwork for the Hangul Point v1 rollout',selectedConcept:'Initial C / HANGUL POINT, paired ㄷ + dot + right location point',colors:{green,ink,white:'#FFFFFF',black:'#000000'},master:'source/hangul-point-symbol.svg',micro:'source/hangul-point-micro.svg',normalViewBox:[0,0,256,224],smallSizeRule:'Use micro optical mark at 16–32px; normal mark at 48px and above; inspect 33–47px at actual size. Favicon family uses the micro layout consistently at every exported size.',locales:{ko:'symbol + custom outlined 급똥',nonKo:'symbol + existing Jua GEUP / DDONG left-aligned two-line wordmark'},fontSource:{family:'Jua Regular',sha256:'769677aef240bfc3b9965f2b50748075bff885e6c6992fc591a3fb268279f898',license:'licenses/Jua-OFL.txt'},exports:entries},null,2));
  console.log(JSON.stringify({root,generated:generated.length,board:'preview/brand-board.png'}));
}
main().catch(e=>{console.error(e);process.exitCode=1});

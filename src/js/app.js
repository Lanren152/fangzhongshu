
// ===== NAVIGATION =====
const pageScroll = {};
function showPage(pageName, resetScroll) {
  const _curPage = document.querySelector('.page.active');
  if (_curPage && _curPage.id !== 'page-' + pageName) pageScroll[_curPage.id.replace('page-','')] = window.scrollY;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageName).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b,i) => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  const btns = document.querySelectorAll('.nav-btn');
  const pages = ['overview','techniques','readher','health','herb','references'];
  const idx = pages.indexOf(pageName);
  if (idx >= 0 && idx < btns.length) { btns[idx].classList.add('active'); btns[idx].setAttribute('aria-current','page'); }
  // Reset sub-tabs when switching pages
  if (pageName === 'readher') {
    document.querySelectorAll('#page-readher .health-section').forEach(s => s.classList.remove('active'));
    var fp = document.getElementById('readher-foreplay');
    if (fp) fp.classList.add('active');
    document.querySelectorAll('#page-readher .health-tab').forEach((b,i) => {
      b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) { b.classList.add('active'); b.setAttribute('aria-current','page'); }
    });
  }
  if (pageName === 'health') {
    document.querySelectorAll('#page-health .health-section').forEach(s => s.classList.remove('active'));
    var hp = document.getElementById('health-practice');
    if (hp) hp.classList.add('active');
    document.querySelectorAll('#page-health .health-tab').forEach((b,i) => {
      b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) { b.classList.add('active'); b.setAttribute('aria-current','page'); }
    });
  }
  if (pageName === 'references') {
    document.querySelectorAll('#page-references .health-section').forEach(s => s.classList.remove('active'));
    var rf = document.getElementById('ref-figures');
    if (rf) rf.classList.add('active');
    document.querySelectorAll('#page-references .health-tab').forEach((b,i) => {
      b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) { b.classList.add('active'); b.setAttribute('aria-current','page'); }
    });
  }
  if (pageName === 'herb') {
    document.querySelectorAll('#page-herb .herb-section').forEach(s => s.classList.remove('active'));
    var hf = document.getElementById('herb-formula');
    if (hf) hf.classList.add('active');
    document.querySelectorAll('#page-herb .herb-tab').forEach((b,i) => {
      b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) { b.classList.add('active'); b.setAttribute('aria-current','page'); }
    });
  }
  // Scroll reveal: register targets on the newly active page
  var newPage = document.getElementById('page-' + pageName);
  if (newPage) srScan(newPage);
  const _y = resetScroll ? 0 : (pageScroll[pageName] || 0);
  if (resetScroll) pageScroll[pageName] = 0;
  try { window.scrollTo({ top: _y, behavior: 'instant' }); } catch (e) { window.scrollTo(0, _y); }
  if (newPage) srSync(newPage);
}
function clearEntranceStyles(el, delay) {
  setTimeout(function() {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  }, delay);
}
function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  const btn = document.querySelector('.nav-hamburger');
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}
function closeMobileNav() {
  document.querySelector('.nav-links').classList.remove('open');
  document.querySelector('.nav-hamburger').setAttribute('aria-expanded', 'false');
}
function toggleMobileSearch() {
  var wrap = document.getElementById('search-wrap');
  var input = document.getElementById('global-search');
  wrap.classList.toggle('expanded');
  if (wrap.classList.contains('expanded')) { input.focus(); }
}
function switchHealthTab(tab, btn) {
  document.querySelectorAll('#page-health .health-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#page-health .health-tab').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected','false'); });
  document.getElementById('health-' + tab).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-current', 'page');
  btn.setAttribute('aria-selected', 'true');
  // Scroll reveal: sync newly active section
  var sec = document.getElementById('health-' + tab);
  if (sec) { srScan(sec); srSync(sec); }
}
function switchReferencesTab(tab, btn) {
  document.querySelectorAll('#page-references .health-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#page-references .health-tab').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected','false'); });
  document.getElementById('ref-' + tab).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-current', 'page');
  btn.setAttribute('aria-selected', 'true');
  var sec = document.getElementById('ref-' + tab);
  if (sec) { srScan(sec); srSync(sec); }
}
function filterReadher(cat, btn) {
  document.querySelectorAll('#readher-filter .filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  var section = document.getElementById('readher-foreplay');
  var currentH = section.offsetHeight;
  section.style.minHeight = currentH + 'px';
  // Fade out all content
  var allEls = section.querySelectorAll('[data-cat], h3, p.section-intro, p.section-desc, .card-grid');
  allEls.forEach(function(el) {
    if (el.closest('.sr')) return;
    el.style.transition = 'opacity 0.1s ease'; el.style.opacity = '0';
  });
  setTimeout(function() {
    document.querySelectorAll('#readher-foreplay [data-cat]').forEach(function(el) {
      el.style.display = (cat === 'all' || el.dataset.cat === cat) ? '' : 'none';
    });
    if (cat !== 'all') {
      document.querySelectorAll('#readher-foreplay > h3:not([data-cat]), #readher-foreplay > p.section-desc:not([data-cat])').forEach(function(el) {
        el.style.display = 'none';
      });
    } else {
      document.querySelectorAll('#readher-foreplay > h3, #readher-foreplay > p.section-desc').forEach(function(el) {
        el.style.display = '';
      });
    }
    // Stagger fade in visible elements
    var visible = section.querySelectorAll('[data-cat]:not([style*="display: none"])');
    visible.forEach(function(el, i) {
      if (el.classList.contains('sr')) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)';
      setTimeout(function() {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 24 + i * 24);
      clearEntranceStyles(el, 320 + i * 24);
    });
    section.querySelectorAll(':scope > h3, :scope > p.section-desc, :scope > p.section-intro').forEach(function(el) {
      el.style.opacity = ''; el.style.transition = '';
    });
    srSync(section);
    setTimeout(function() { section.style.minHeight = ''; }, 300);
  }, 110);
}
function switchReadherTab(tab, btn) {
  document.querySelectorAll('#page-readher .health-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#page-readher .health-tab').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected','false'); });
  document.getElementById('readher-' + tab).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-current', 'page');
  btn.setAttribute('aria-selected', 'true');
  // Scroll reveal: sync newly active section
  var sec = document.getElementById('readher-' + tab);
  if (sec) { srScan(sec); srSync(sec); }
}


function switchHerbTab(tab, btn) {
  document.querySelectorAll('#page-herb .herb-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#page-herb .herb-tab').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); b.setAttribute('aria-selected','false'); });
  document.getElementById('herb-' + tab).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-current', 'page');
  btn.setAttribute('aria-selected', 'true');
  var sec = document.getElementById('herb-' + tab);
  if (sec) { srScan(sec); srSync(sec); }
}

function filterFormula(cat, btn) {
  document.querySelectorAll('#formula-filter .filter-chip').forEach(c => { c.classList.remove('active'); });
  btn.classList.add('active');
  var items = document.querySelectorAll('#herb-formula .card[data-tags], #herb-formula .filterable-group[data-tags]');
  items.forEach(function(el) {
    if (el.classList.contains('sr')) return;
    el.style.transition = 'opacity 180ms var(--ease-out), transform 180ms var(--ease-out)';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
  });
  setTimeout(function() {
    items.forEach(function(el) {
      var shouldShow = (cat === 'all' || (el.dataset.tags || '').split(',').includes(cat));
      el.style.display = shouldShow ? '' : 'none';
      if (!shouldShow) { el.style.opacity = ''; el.style.transform = ''; }
    });
    var visible = [];
    items.forEach(function(el) { if (el.style.display !== 'none') visible.push(el); });
    visible.forEach(function(el, i) {
      if (el.classList.contains('sr')) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)';
      setTimeout(function() { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 24 + i * 24);
      clearEntranceStyles(el, 320 + i * 24);
    });
    srSync(document.getElementById('herb-formula'));
  }, 130);
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// ===== SEARCH =====
const searchIndex = [];
function buildSearchIndex() {
  techniques.forEach(t => searchIndex.push({type:'体位',title:t.name,desc:t.desc,tags:[t.source,t.type,...(t.tags||[])],target:'techniques',filter:t.source}));
  figures.forEach(f => searchIndex.push({type:'人物',title:f.name,desc:f.desc,tags:[f.era,f.role],target:'references',subtab:'figures'}));
  textData.forEach(t => searchIndex.push({type:'古文',title:t.original.slice(0,40)+'…',desc:t.vernacular.slice(0,60)+'…',tags:[t.source],target:'references',subtab:'texts',filter:t.source}));
  bayiData.forEach(b => searchIndex.push({type:'处方',title:'八益·'+b.name,desc:b.pos+' '+b.num+' '+b.effect,tags:['八益','处方'],target:'health'}));
  searchIndex.push({type:'药方',title:'秃鸡散',desc:'洞玄子方，治阴痿不起',tags:['方剂','yang'],target:'herb',subtab:'formula'});
  searchIndex.push({type:'药方',title:'鹿角散',desc:'洞玄子方，治临事不成',tags:['方剂','yang','sejing'],target:'herb',subtab:'formula'});
  searchIndex.push({type:'药方',title:'三子丹',desc:'千金方三味种子药，治阳不起',tags:['方剂','yang'],target:'herb',subtab:'formula'});
  searchIndex.push({type:'药方',title:'金锁固精丸',desc:'补肾涩精治遗精滑泄',tags:['方剂','sejing'],target:'herb',subtab:'formula'});
  searchIndex.push({type:'中药',title:'淫羊藿',desc:'仙灵脾，房中术媚药之王',tags:['中药','补阳'],target:'herb',subtab:'herb'});
  searchIndex.push({type:'中药',title:'肉苁蓉',desc:'补肾阳益精血之润药',tags:['中药','补阳'],target:'herb',subtab:'herb'});
  searchIndex.push({type:'现代药',title:'西地那非',desc:'万艾可，PDE5抑制剂',tags:['现代','ED'],target:'herb',subtab:'modern'});
  searchIndex.push({type:'现代药',title:'他达拉非',desc:'希爱力，36小时超长效',tags:['现代','ED'],target:'herb',subtab:'modern'});
  searchIndex.push({type:'现代药',title:'达泊西汀',desc:'必利劲，按需服用早泄药',tags:['现代','早泄'],target:'herb',subtab:'modern'});
  indexDomCards('herb-formula', 'formula', '药方');
  indexDomCards('herb-herb', 'herb', '中药');
  indexDomCards('herb-modern', 'modern', '现代药');
}
function indexDomCards(tabId, subtab, type) {
  document.querySelectorAll('#' + tabId + ' .card').forEach(function(card) {
    var titleEl = card.querySelector('.card-title');
    if (!titleEl) return;
    var title = titleEl.textContent.trim();
    var existing = searchIndex.find(function(x){ return x.target === 'herb' && x.title === title; });
    if (existing) { if (!existing.cardTitle) existing.cardTitle = title; return; }
    var bodyEl = card.querySelector('.card-body');
    searchIndex.push({
      type: type, title: title,
      desc: bodyEl ? bodyEl.textContent.trim().slice(0, 60) : '',
      tags: [type, '药石'],
      target: 'herb', subtab: subtab, cardTitle: title
    });
  });
}
function doSearch(query) {
  const results = document.getElementById('search-results');
  if (!query || query.length < 1) { results.classList.remove('show'); const _si=document.getElementById('global-search'); if(_si){_si.setAttribute('aria-expanded','false');_si.removeAttribute('aria-activedescendant');} return; }
  if (searchIndex.length === 0) buildSearchIndex();
  const q = query.toLowerCase();
  const scored = [];
  searchIndex.forEach(function(item, i) {
    const title = (item.title || '').toLowerCase();
    let s = 0;
    if (title === q) s = 4;
    else if (title.indexOf(q) >= 0) s = 3;
    else if ((item.tags || []).some(function(t) { return t.toLowerCase().indexOf(q) >= 0; })) s = 2;
    else if ((item.desc || '').toLowerCase().indexOf(q) >= 0) s = 1;
    if (s > 0) scored.push({ item: item, s: s, i: i });
  });
  scored.sort(function(a, b) { return b.s - a.s || a.i - b.i; });
  const matches = scored.slice(0, 12).map(function(x) { return x.item; });
  if (matches.length === 0) {
    results.innerHTML = '<div class="search-no-results">没有找到匹配的结果</div>';
  } else {
    results.innerHTML = matches.map((m,i) => `
      <div class="search-result-item" role="option" id="search-opt-${i}" aria-selected="false" onclick="navigateFromSearch('${m.target}','${m.filter||''}','${m.subtab||''}','${(m.cardTitle||'').replace(/'/g,'')}')">
        <span class="sr-tag tag-type">${m.type}</span>
        <span class="sr-title">${m.title}</span>
        <div class="sr-desc">${m.desc}</div>
      </div>
    `).join('');
  }
  results.classList.add('show');
  const _sinput=document.getElementById('global-search');
  if(_sinput) _sinput.setAttribute('aria-expanded','true');
}
function searchKeydown(e) {
  const input = e.currentTarget || document.getElementById('global-search');
  const results = document.getElementById('search-results');
  const items = Array.from(results.querySelectorAll('.search-result-item'));
  if (e.key === 'Escape') {
    results.classList.remove('show');
    if (input) { input.value = ''; input.setAttribute('aria-expanded','false'); input.removeAttribute('aria-activedescendant'); }
    return;
  }
  if (!results.classList.contains('show') || !items.length) return;
  let idx = items.findIndex(function(it) { return it.classList.contains('kbd-active'); });
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (e.key === 'ArrowDown') idx = idx < 0 ? 0 : Math.min(idx + 1, items.length - 1);
    else idx = idx <= 0 ? 0 : idx - 1;
    items.forEach(function(it, i) {
      const on = i === idx;
      it.classList.toggle('kbd-active', on);
      it.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (input) input.setAttribute('aria-activedescendant', items[idx].id);
    items[idx].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    (items[idx >= 0 ? idx : 0]).click();
  }
}
function navigateFromSearch(target, filter, subtab, cardTitle) {
  document.getElementById('search-results').classList.remove('show');
  document.getElementById('global-search').value = '';
  showPage(target, true);
  if (filter && target === 'techniques') {
    setTimeout(() => {
      const chip = Array.from(document.querySelectorAll('#page-techniques .filter-chip')).find(c => c.textContent === filter);
      if (chip) chip.click();
    }, 100);
  }
  if (subtab && target === 'references') {
    setTimeout(() => {
      const btn = Array.from(document.querySelectorAll('#page-references .health-tab')).find(b => {
        return (subtab === 'figures' && b.textContent === '人物志') || (subtab === 'texts' && b.textContent === '古文引文');
      });
      if (btn) btn.click();
      if (filter && subtab === 'texts') {
        setTimeout(() => {
          const chip = Array.from(document.querySelectorAll('#text-source-filter .filter-chip')).find(c => c.textContent === filter);
          if (chip) chip.click();
        }, 100);
      }
    }, 100);
  }
  if (subtab && target === 'herb') {
    setTimeout(() => {
      const tabs = {'formula':'经典方剂','herb':'单味药解','modern':'现代药物'};
      const btn = Array.from(document.querySelectorAll('#page-herb .herb-tab')).find(b => b.textContent === tabs[subtab]);
      if (btn) btn.click();
      if (cardTitle) setTimeout(() => selectHerbByTitle(subtab, cardTitle), 180);
    }, 100);
  }
}

// ===== TECHNIQUE DATA =====
const techniques = [
  // 九法
  {id:'longfan',featured:true,name:'龙翻',source:'九法',animal:'龙',depth:3,clit:1,energy:'中/低',type:'男上',tags:['基础','入门首选'],desc:'女子仰卧，男子伏其上。八浅二深，死往生返。最基础的体位，所有时代最常用。',ancient:'令女正偃卧向上，男伏其上，隐於床。女举其阴以受玉茎，刺其谷实，又攻其上。疏缓动摇，八浅二深，死往生返，势壮且强，女则烦悦，其乐如倡，致自闭固，百病消亡。',effect:'最基础安全的体位，适合日常习练。八浅二深的节奏控制本身是射精管理训练。对脊椎和关节无额外负担。',tip:'初学者从龙翻入门。先把八浅二深节奏跑顺。腰部力量不够可将部分体重交给女方。龙翻弱点在阴蒂刺激不够，需要手来补。　最基础、最安全的体位，脊椎和关节无额外负担，适合日常习练和初学者入门。腰部力量不够的男方可用前臂代替手掌撑体，省力得多。弱点是阴蒂刺激不足，需要手来做辅助。女方…', naming:'九法之首，不叫"正常位"也不叫"传教士位"，叫龙翻。男人两膝两手撑床，腰背弓起又落下，反复起伏如游龙翻腾。"翻"是龙的动作，腾挪翻转，不是静止的，古人用一个"翻"字把静态体位写成了动态画面。龙是神物，吉祥尊贵的象征——用龙来命名最基础的体位，和西方人叫它"爱神正看式"是同一个意思：最值得推崇的姿势，排第一位。名实相符，你摆出这个姿势来看', detail:'女子仰卧，双腿分开。男子伏于其上，双膝双手撑床，身体悬空。先以龟头轻触阴蒂及小阴唇，揉圈或上下摩擦，等女方呼吸变急、阴部泛潮、自然上迎时，再徐徐纳入。纳入后行八浅二深：浅插八次，龟头在阴道前三分之一处贴着前壁慢慢推入再慢慢抽出——这一段神经末梢最密，G点就在此处——深插两次，一插到底撞击宫颈口周围。浅要"磨"不要"捅"，深要到底。节奏宜疏缓，最忌猴急。"死往生返"是核心：阳具充血坚挺时主动抽出，在略微回软的临界点再纳入，反复练习对射精阈值的控制会越来越好。', sensory:'浅的时候阴道口被龟头撑开又合拢，那个位置的神经末梢最密，每一下摩擦都像指腹划过湿绸缎——清晰、锐利、集中在一点。深的时候整根没入，龟头碾过前壁的粗糙区域撞进最深处，酸胀感从宫颈口往小腹蔓延，像一颗石头沉入温水，荡开的涟漪久久不散。'},
  {id:'hubu',name:'虎步',source:'九法',animal:'虎',depth:4,clit:2,energy:'中/中',type:'背入',tags:['G点','后入式','双手自由'],desc:'女子俯卧，臀抬高。男子跪其后，从后方进入。后入式的原始版本，G点刺激强。',ancient:'令女俯伏，尻仰首伏。男跪其後，抱其腹，乃内玉茎，剌其中极。务令深密，进退相薄。行五八之数，其度自得。女阴闭张，精液外溢，华而休息，百病不发，男益盛。',effect:'后入式对男子腰肾锻炼直接。女子深处刺激强烈，G点受压集中，高潮更快更猛。双手自由是最大优势，可同时操控三个刺激点。',tip:'必须用手先确认位置再进入。女子臀下垫枕高度决定插入角度，垫越高G点刺激越强。男子膝下垫软垫。　G点刺激强度在九法中排前列，综合刺激能力比龙翻更强。入门门槛也更高——需要男方的协调能力和体力同时在线。膝盖下必须垫软垫。男方必须用手先确认阴道口位置再插入，兴…', naming:'猫科动物蹲在猎物后方准备扑击的姿态——后腿弯曲、前爪按地、身体压低、眼神锁定。男人跪在女方臀后、双手抱腹，和猛虎扑食前蹲踞的架势一模一样。"步"字更有讲究，虎行不叫跑叫"步"，步步为营，稳扎稳打。从演化史看，后入式是所有哺乳动物最原始的性交方式，人类的近亲大猩猩、黑猩猩全部用这个姿势。人类发展出面对面的龙翻是后来的事。当伴侣尝试虎步时', detail:'女子俯卧，面朝下，胸腹贴床，臀部垫高（骨盆下可垫枕头）。男子跪于其后，双手环抱女腰腹。从后方进入，角度让龟头每一下都精准刮过G点区域。"务令深密"——每次都往深处探，进退之间要紧贴阴道壁，做"相薄"之功：抽送时龟头始终不离开阴道壁，保持持续的摩擦压力。行五八之数（四十次），看女方反应，"女阴闭张，精液外溢"是终止信号。双手自由是虎步最大的武器：一手揉乳，一手拨弄阴蒂，阳具负责深处撞击——九法中唯一能同时操控三个刺激点的体位。', sensory:'龟头每一下刮过阴道前壁的G点区域，感觉像用指腹按住一块湿滑的橡皮来回推——不离、不脱、不松。持续的压力和摩擦，与龙翻的浅深交替是完全不同的体感。从后方看去，女子的圆肩、润背、细腰、丰臀构成一条流畅的双S曲线，双手从上往下抚摩，从肩胛到腰窝再到臀峰，触感层次分明。'},
  {id:'yuanbo',name:'猿搏',source:'九法',animal:'猿',depth:5,clit:1,energy:'高/中',type:'男上变体',tags:['深度','柔韧','春宫图最爱'],desc:'女子仰卧双腿高举，男子肩担其腿。角度深入，视觉冲击力强。',ancient:'令女偃卧，男担其股，腹还通胸，尻背俱举。乃内玉茎，刺其臭鼠。女烦劝摇，精液如雨。男深按之，极壮且怒。女快乃止，百病自愈。',effect:'对女方盆底肌被动锻炼效果显著，等同于高强度凯格尔运动。深按不动的技巧让身体自己完成高潮的最后一步。',tip:'女方柔韧性是前提。只能架一条腿也可。女方腰部有旧伤的慎用。男方矮胖+女方窈窕的体型互补绝配。　女方髋关节柔韧性是前提。柔韧性不够的可以只架一条腿在肩上，另一腿自然弯曲。体重差距大的伴侣，胖子腹围大会影响正面交合，猿搏从后上方进入恰好绕开腹部障碍。女方腰椎…', naming:'"担其股"三个字是关键——男方把女方的腿扛在肩膀上，和猿猴攀树时手脚并用、身体悬空的姿态非常像。"搏"字比"翻"和"步"都要激烈，搏是搏斗、搏击，带着一股子用劲儿的劲头。猿搏对男方的体力要求确实比前两法都高：肩膀扛腿、跪姿发力、腰臀前后推送，全身都在动。古人起名不含糊，龙翻是游龙翻腾，虎步是猛虎伺机，猿搏就是猿猴在树枝间搏击跳跃', detail:'女子仰卧，双腿高举。男子面向女子，跪于其后，将女方双腿担于双肩之上。臀部因腿位抬高而悬空突出，阴道缩短、入口朝上，阳具可以触及平时难以到达的深处。入阴后刺其臭鼠（俞鼠，即阴蒂），因臀部抬高，龟头自然压迫阴道上壁，深处的撞击会间接刺激到阴蒂的内部结构。女方快感累积到"烦劝摇"时——身体不由自主地摆动——此时男子停止抽送，改为"深按之"：将阳具深深按入不动，龟头持续抵住最深处。这是猿搏最精妙的一招：快到了的时候不加速反而停住，让女方的身体自己完成最后一步。', sensory:'女方双腿被高高架起，整个阴户完全暴露在男方视线里，毫无遮挡——这种视觉冲击力在平时很难获得。深处被反复撞击时，一种沉闷的、从盆腔深处往外扩散的酸胀感。当男子停止抽送改为深按时，静止中的压迫感反而被放大：龟头像一颗按在最深处的按钮，阴道壁在不自主地节律性收缩，一圈一圈地挤压、包裹。'},
  {id:'chanfu',name:'蝉附',source:'九法',animal:'蝉',depth:3,clit:1,energy:'低/极低',type:'背入',tags:['省力','放松','情绪病'],desc:'女子平趴，男子伏其后如蝉附枝。九法中最放松的体位。',ancient:'令女伏卧，直伸其躯。男伏其後，深内玉茎，小举其尻，以扣其赤珠。行六九之数，女烦精流，阴里动，外为开舒，女快乃止，七伤自除。',effect:'全身平趴无需肌肉支撑，副交感神经充分激活。对失眠、焦虑、情绪郁结有帮助。九法中最放松的体位，次数最多（五十四次），追求持续稳定的节律。',tip:'最大问题是男方体重，务必用肘和膝撑体，"附"非"压"。体重差大的用侧卧蝉附变式。　女方身体最放松的体位——平趴不需要任何肌肉支撑，对失眠、焦虑、情绪郁结的人效果显著。男方务必要用双肘和膝盖撑起身体，"附"而非"压"——女方反馈胸闷气短说明压得…', naming:'蝉停在树干上时是轻轻贴着的，六条腿抓牢树皮，身体悬空或微微接触，绝不会把全身重量压在树枝上。古人用"附"而不用"压"或"伏"，一字之差意思完全不同。"附"是贴靠，"压"是施重。这个字在提醒男方：你的身体是"附"在女方背上的，不是压在上面的。如果把全身重量压上去，女方胸闷气短，别说快感，连呼吸都困难。双肘撑体重、双脚踏实床面', detail:'女子俯卧，全身伸直平趴于床面。男子伏于其后，双肘撑体重，双脚分踏床面，身体悬浮。插入角度贴合阴道的自然弧度，阳具顺着阴道方向水平进入，刺激集中在阴道深处和后壁。"小举其尻"——用手掌从下方轻抬女方臀部，使阴户略高于水平面。然后以龟头扣击赤珠（小阴唇及阴蒂区域）。关键在于研磨而非活塞：耻骨压住会阴，龟头在深处搅动，不走直线进出，打着圈儿研磨。行六九之数（五十四次），九法中次数最多，追求的是持续稳定的节律刺激，像一首没有变奏的慢板乐曲。', sensory:'女方全身平趴在床面上，全身的重量都被床接住了，不需要任何肌肉支撑。只剩阴道壁在暗中一寸一寸地感知那股慢腾腾的、闷闷的力道。不是尖锐的快感，是一种沉闷的、弥漫性的充实感。耻骨压住会阴，龟头在深处打圈搅动，一圈，又一圈，阴道壁的每一道褶皱在持续的研磨中慢慢充血胀大。'},
  {id:'guiteng',name:'龟腾',source:'九法',animal:'龟',depth:5,clit:1,energy:'高/中',type:'男上变体',tags:['极深','蜷曲','穹窿'],desc:'女子仰卧屈膝至胸，如龟缩壳。阴道大幅缩短，可触及平时难到的深处。',ancient:'令女正卧，屈其两膝。男乃推之其足至乳，深内玉茎，刺婴女。深浅以度，令中其实。女则感悦，躯自摇举，精液流溢。乃深极内，女快乃止，行之勿失，精力百倍。',effect:'被动蜷缩拉伸腰背和髋部屈肌群，类似瑜伽仰卧抱膝式。对久坐办公人群的腰背酸痛和髋部紧张有被动拉伸的缓解作用。',tip:'膝盖不必强求贴胸。男方推腿是"推"不是"压"。女方觉得呼吸不畅可间歇松开双腿。　女方柔韧性决定蜷曲程度——膝盖能贴胸最好，做不到不必强求。男方推腿时力度要适中，是"推"不是"压"，以女方不痛为准。对男方膝盖压力较大，膝下必须垫软垫，重心略向…', naming:'龟遇到危险时会把头尾四肢全部缩进壳里，整个身体蜷成一个球。女方双腿折到胸前、膝盖贴乳，活脱脱就是一只缩壳的龟。"腾"字说的是女方快感来临时"躯自摇举"——身体不受控制地扭动上挺，像乌龟在水中突然翻身腾跃。一个"缩"一个"腾"，先蜷后翻，动静对比极强。古人观察得很细：他们发现这个体位', detail:'女子仰卧，双膝弯曲提起，尽量贴近胸前。男子跪姿面对女方，双手推女方双腿使膝盖接近乳房。臀部自然抬离床面，阴道口朝上充分暴露。双腿蜷曲压迫下腹，盆腔空间被压缩，子宫和宫颈位置上移，阴道大幅缩短，阳具可以触及子宫颈周围的穹窿区域——平时根本碰不到的深度。入阴后刺其婴女（宫颈口周围穹窿敏感区），深浅交替，让龟头反复进出宫颈口区域。女方快感来临时"躯自摇举"——身体不受控制地扭动上挺，男子此时"深极内"，一插到底保持不动，让龟头持续压迫最深处。', sensory:'女方的身体在极度蜷曲中，阴道大幅缩短，每一次深入都触到平时碰不到的地方——宫颈口周围的穹窿区域。那里被触及时，有人感到一阵强烈的电流从脊柱底端窜上后脑，有人则感到一种酸胀的、近乎排尿的冲动感从小腹往外扩散。高潮来临时，她整'},
  {id:'fengxiang',name:'凤翔',source:'九法',animal:'凤',depth:3,clit:2,energy:'中/中',type:'男上',tags:['大面积贴合','催产素','女性主动'],desc:'男子双肘撑地跪姿低伏，胸腹与女方大面积贴合。九法中肌肤接触最多的正面位。',ancient:'令女正卧，自举其脚。男跪其股间，两手处席。深内玉茎，剌其昆石。坚热内交，令女动作，行三八之数。尻急相薄，女阴开舒，自吐精液，女快乃止，百病消减。',effect:'大面积肌肤接触促进催产素分泌，降低皮质醇。对伴侣关系紧张、日常缺乏肢体接触的人尤其有价值。九法中肌肤接触最多的正面体位。',tip:'女方在腰下垫小枕提供支撑。男方双肘撑地不压女方身体两侧。如果体重大用前臂撑而非双肘。　大面积肌肤接触催产素分泌最强——适合伴侣关系紧张、日常缺乏肢体接触的人。女方需要核心力量做仰卧位的主动摆动，腰酸的可以在腰下垫小枕头。男方双肘撑地时不要把前臂压…', naming:'"凤凰于飞"四个字出自《左传》，专门形容婚姻甜蜜、形影不离。"凤翔"取的是双凤展翅时那种低掠贴地的姿态——凤凰展翅但不离地，男方展臂但不撑高。和凤凰高高在上的威严无关。"翔"是滑翔不是高飞——凤凰贴着水面掠过，男方贴着女方身体伏低。这个体位的整体气质就是低伏、贴合、大面积接触。九法中龙翻和凤翔最像，但龙翻有空间有距离，凤翔是几乎贴上去的', detail:'女子仰卧，双脚弯曲自行打开。男子跪俯于女方两腿之间，双肘撑地——比龙翻的手掌撑体更低，胸腹与女方身体大面积贴合。骨盆角度更低更平，插入时龟头自然上翘，沿着阴道前壁滑入，精准刺激G点（昆石）。"坚热内交"：阳具必须充血充分、温度上来后再插入——充分充血的龟头棱线更分明，温度高的龟头接触阴道壁时，温差本身就是一种刺激。插入后由女方主动摆动二十四次（三八之数），仰卧位的主动运动全靠腰臀做小幅度上下或旋转。男方保持不动，感受女方阴道壁的包裹和节律性收缩。"尻急相薄"——臀部急促贴合，到女方阴户大开、"自吐精液"时，高潮到了。', sensory:'充分充血、温度上来了的龟头，冠状沟棱线分明，每一下刮过G点都有钝刀划过粗砂纸的颗粒感——女方会不自觉地收紧小腹，呼吸变短。胸膛大面积贴着乳房，每一次呼吸乳头都在对方胸膛上摩擦。皮肤是人体最大的感觉器官，胸腹相贴、耻骨相抵、手臂环绕，催产素在持续的肌肤接触中大量分泌。'},
  {id:'tushunhao',name:'兔吮毫',source:'九法',animal:'兔',depth:3,clit:2,energy:'低/中',type:'女上',tags:['女上位','反向','慢节奏'],desc:'男子仰卧，女子反向跨坐面朝男方脚部。如白兔低头舔梳细毛，慢、细、轻、柔。',ancient:'男正反卧，宜伸脚。女跨其上，膝在外边。女背头向足，处席俯头。乃内玉茎，刺其琴弦。女快，精液流出如泉，欣喜和乐，动其神形。女快乃止，百病不生。',effect:'对女方盆底肌、大腿肌群和核心力量极好锻炼。男方被动仰躺全身放松，适合体力偏弱时。女方从被动变主动，角色翻转本身就是一种释放。',tip:'女方初次可能找不到入口（方向反了），先让男方用手引导。腿力不足可改为跪坐仅以腰臀做前后摇摆或画圆。男方千万不要突然从下方往上顶。　女方主导体位——上下骑乘相当于低强度深蹲加平板支撑，对盆底肌、大腿肌群和核心力量都是极好的锻炼。男方被动仰躺全身放松，适合体力偏弱或当天疲惫的一方。心理上女方从…', naming:'养过白兔的人知道，兔子清洁自己时低头俯身，用舌头细细舔梳腹部和腿部的毛发，动作极其细致温柔，一丝一缕不急不躁。女方跨坐在男方身上、面朝脚部、低头俯身的姿态，和白兔舔毛的姿态一模一样。"吮毫"是舔细毛——精细到毛发级别的细致动作。这个名字在暗示此法的核心气质：慢、细、轻、柔。王羲之论书法说"兔毫无优劣，管手有巧拙"', detail:'男子仰卧，双腿伸直。女子跨坐其上，面朝男方脚部方向（反向骑跨）。双膝跪于男方身体两侧，双手扶地或扶床，头部略低俯。精髓在一个"反"字：反向朝向让阴道前壁（G点侧）自然朝向男方耻骨方向，每一次坐下的动作都产生精准的G点压迫。阳具纳入后刺其琴弦——古人管阴蒂叫琴弦，因为拨弄它时女方的反应像琴弦被拨动，身体会震颤。女方以膝盖和双手为支撑做上下骑乘，坐下时阴道缓缓吞入阳具，抬起时缓缓吐出——节奏宜缓不宜急，快了容易滑脱，慢了才有那种一寸一寸吞吐的细腻体感。深浅全在女方掌控。', sensory:'阴道口含住龟头慢慢坐下去，黏膜与黏膜之间几乎感受不到摩擦力，只有一股温热从入口往深处蔓延，像把一块融化的黄油缓缓推进去。抬起来的时候龟头冠状沟刮过阴道口，那一圈凸起翻过括约肌的瞬间，一股电流从脊柱底端弹上来。浅可以只含住龟'},
  {id:'yujielin',name:'鱼接鳞',source:'九法',animal:'鱼',depth:1,clit:2,energy:'极低/中',type:'女上',tags:['浅入','面对面','最温和'],desc:'男子仰卧，女子面对面跨坐。九法中唯一明确要求浅插的体位，如鱼鳞轻触。',ancient:'男正偃卧，女跨其上，两股向前。安徐向之，微入便止，才授勿深，如儿含乳。使女独摇，务令持久。女快男退，治诸结聚。',effect:'九法中最温和的体位。浅入不伤宫颈，女方全程可控，男方完全放松。对有阴道痉挛、宫颈敏感或性交疼痛的女性来说风险最低。',tip:'女方可用手抵住男方小腹作为物理刹车防止坐太深。节奏极慢适合前戏到正式交合的过渡。　九法中最温和的体位——浅入不伤宫颈，女方全程可控，男方完全放松。对有阴道痉挛、宫颈敏感或性交疼痛的女性来说，风险最低。"治诸结聚"——身体紧、心理堵的人，浅入慢…', naming:'两条鱼并排游的时候，鳞片偶尔轻轻碰触又分开——有距离，若即若离，不是紧紧贴在一起的。这个体位要求"微入便止，才授勿深"，阳具只在阴道口浅浅含住，不深入。像两条鱼的鳞片一样，碰一碰就分开。"接"是接触——轻触即止，不是咬合。古人用鱼鳞相接来形容浅入，比直接说"插得浅"优雅得太多。"鱼水之欢"这个成语出自《管子》，专门比喻夫妻恩爱', detail:'男子仰卧，双腿伸直。女子跨坐其上，面朝男方（面对面）。入阴后"微入便止，切勿深"——龟头仅在阴道口三分之一处来回摩擦，像婴儿含着母亲乳头一般，不吞不吐，浅浅含住，偶尔轻轻一吮再松开。"如儿含乳"这个比喻极其精准：婴儿含着奶头时不会使劲咬，是用嘴唇轻轻包裹、舌头偶尔舔舐、间歇性地轻轻一吮。九法中唯一明确要求浅插的体位。男方完全不动，"使女独摇"——女方做小幅度的前后摇摆或画圆运动。浅入加女方主动加小幅度，快感累积缓慢但层层叠叠，"务令持久"。男方双手最佳去处是双乳——阴道浅层摩擦加双手揉乳，双管齐下。', sensory:'龟头冠状沟——龟头与茎体交界处那圈凸起——反复进出阴道口时，产生一种类似"翻边"的摩擦感。阴道口三分之一处是神经末梢最密集的区域，也是紧握感最强的部位，括约肌紧紧箍住茎体，压力集中。这种刺激是深插体会不到的——深插时龟头在'},
  {id:'hejiaojing',name:'鹤交颈',source:'九法',animal:'鹤',depth:3,clit:2,energy:'低/低',type:'坐位',tags:['情感','坐姿','全身贴合'],desc:'男女面对面坐拥，如双鹤交颈缠绵。九法收尾之作，落在情感上而非技巧上。',ancient:'男正箕座，女跨其股，手抱男颈。内玉茎，剌麦齿中其实。男抱女尻，助其摇举。女自感快，精液流溢。女快乃止，七伤自愈。',effect:'颈项交缠触发深层信任感。催产素大量分泌，坐姿对脊椎零压力，适合各年龄段。九法收尾之作，落在情感上而非技巧上。',tip:'身高差大的坐沙发边缘或床沿，女方脚下垫矮凳。不必追求高潮，就这样抱着也是一次完整的交合。　脊椎零压力——坐姿适合各年龄段，尤其腰背不便的人。身高差大的坐沙发边缘或床沿，女方脚下垫矮凳调整高度。男方手臂力量不够的可以靠在床头或墙上借力。此法体力消耗最低…', naming:'鹤是长寿的象征，也是忠贞的象征——鹤一旦配对，终生不换。两只鹤表达亲密的方式很特别：面对面伸长脖子，颈项交缠，互相用喙轻触对方的羽毛。不拥抱，不并排。这个动作和鹤交颈体位中男女面对面坐拥、面颊相贴、脖颈交缠的姿态完全吻合。古人形容男女燕好，不用"交尾"而用"交颈"——"交尾"是动物行为，"交颈"是情感行为。九法的最后一法，落在"交颈"上', detail:'男子正坐，双膝打开。女子跨坐其上，面朝男方，双脚分置于男方身体两侧，双手环抱男方脖颈。男方双手捧抱女方臀部。九法中唯一双方同时坐起的体位，不追求深度、不讲技巧、不要求次数，追求的是全身贴合。入阴时刺麦齿（阴道内壁褶皱区域），坐姿角度让阳具沿着阴道后壁滑入，龟头正对后穹窿（宫颈后方凹陷区域），同时耻骨相抵，阴蒂受到持续的挤压摩擦。男方双手捧抱女臀，协助她做上下摇摆——以手臂力量托举和放下，像荡秋千一样。女子则双手环颈，上身紧贴男方胸膛，面颊相贴。全身贴合：胸腹相贴、面颊相贴、腹部相贴、性器相连，身体接触面积是九法之最。', sensory:'高潮时，全身被紧抱，身体反应无处释放——只能化为更紧的拥抱和更急促的呼吸。这种被"兜住"的感觉，比任何技巧都强。两个人的脖子交缠在一起，颈动脉就在皮肤下方跳动，彼此的脉搏、体温、呼吸都完全暴露在对方的感知中——这是最深层的信任姿态。'},
{id:'bayi_gujing',featured:true, name:'固精', source:'八益', animal:'', depth:2, clit:2, energy:'极低/低', type:'侧卧', tags:['固精','止漏','入门','侧卧'], desc:'男女面对面侧卧，节制抽送18次，固摄精关', ancient:'', op:'男女面对面侧卧。女子侧卧张开两腿，上方腿略弯曲抬起使骨盆微开、阴道口自然暴露。男子同样侧卧面朝女子，身体位于女子两腿之间，阳具与阴道口角度对齐。插入后连续抽送十八次，动作宜缓不宜急，侧卧位重心稳定体力消耗极小。浅入为主、深插为辅，保持龟头与阴道壁持续接触但不追求撞击感，到点即停，不以泄精为目的。', effect:'固摄男子精液，使精质浓厚不散。十八次浅抽深控训练的是"到点就停"的纪律，重建大脑对射精阈值的判断力。兼治女子月经过多。', tip:'八益法入门首关，抽送次数最少（18次），每日频次最低（2次），疗程适中（15天）。此关训练的是"到点就停"的纪律——十八次抽送完毕必须停止，不可贪多。很多早泄者的问题不是太敏感，是不知道什么时候该停。', naming:'"固精"的"固"是固摄、守住，"精"是男子的精液和精力。"固精"就是固摄精关、使精气不妄泄。中医讲肾主封藏、开窍于二阴，固精法的十八次浅抽深控训练的目标不是让人憋着不射，而是重建大脑对射精阈值的判断力——知道什么时候该停，停得住。所以"固精"二字讲的是功效本源：通过节律性的、可控的、点到即停的性交练习，恢复肾的封藏功能，让精关从"被动失控"回到"主动把守"的状态。', detail:'男女面对面侧卧。女子侧卧、张开两腿、上方腿略弯曲抬起，骨盆微微打开使阴道口自然暴露。男子同样侧卧面朝女子，身体位于女子两腿之间，进入后连抽十八次。动作宜缓不宜急，侧卧位重心低而稳，男方无需用手臂支撑，体力消耗极小。抽送以浅入为主、深插为辅，保持龟头与阴道壁持续接触但不追求撞击感。十八次抽送完毕必须停止，不以泄精为目的。每日两次，连续十五天。核心纪律：到点就停，不能贪多。', sensory:'侧卧对向的姿态让双方呼吸可闻、表情尽收眼底，身体放松程度极高。男性在十八次有限抽送中注意力完全集中在控制射精的时刻判断上，龟头的触感变得格外清晰——阴道壁的每一次贴合和滑动都像在提醒"此刻离阈值还有多远"。女性感受偏温和，十八次的量不会带来强烈的累积刺激，更多是舒缓的充盈感。双腿张开的角度让阴道口保持适度的松弛感，不存在紧张的防御性收缩。'},
{id:'bayi_anqi', name:'安气', source:'八益', animal:'', depth:3, clit:2, energy:'低/低', type:'正面位', tags:['安气','暖宫','调气','正面位'], desc:'女仰高枕男跪腿间，27次中幅推进和脉安气', ancient:'', op:'女子仰面正躺，头部垫高枕使上身微微仰起，整个躯干形成微仰角度，骨盆随之倾斜、气血下行更为顺畅。双腿向两侧平伸打开，自然放松。男子跪在女子双腿之间，双膝撑地，双掌分别置于女子两臂外侧支撑身体。阳具插入后以腰腹为动力源，骨盆前后推送为主导动作，动作幅度适中，二十七次。高枕垫头让骨盆自然微倾，阴道轴线略有改变，插入角度比正常仰卧位更贴合阴道前壁。', effect:'使人心境平和，气脉爽畅。高枕垫头让骨盆自然微倾，插入角度更贴合阴道前壁，持续刺激改善局部微循环。兼治女子阴门寒冷症。', tip:'枕头高度要适中：太高女子颈部不适，太低则骨盆倾斜不够。以女子感觉舒适、骨盆自然微倾为准。二十天疗程，每天三次，持续血流刺激逐步改善局部微循环。"安气"二字说的就是气顺则血行、血行则温通的道理。', naming:'"安气"的"安"是安定、和顺，"气"是人体正气的运行通道。中医讲肺主气、司呼吸，气顺则血行、血行则温通。安气法的设计思路很直接——用一种特定的体位让气脉运行恢复通畅：女子仰卧垫高枕、双腿平伸打开、男子跪姿进入，这个姿态让气血下行无阻，同时阴茎沿阴道前壁（血流最丰富的区域）反复摩擦。"安气"说白了就是通过反复的局部刺激让血流重新灌注到原来气血不通的地方，气到了，寒就散了。', detail:'女子仰面正躺，头部垫高枕使上身微仰、骨盆自然微倾、气血下行顺畅，双腿向两侧平伸打开自然放松。男子跪于女子双腿之间，双膝撑地、双掌分置女子两臂外侧支撑身体。进入后以骨盆前后推送为主导动作，腰腹发力，幅度适中，不做大幅起落。抽送二十七次，动作平稳连贯。每日三次，连续二十天。男子跪姿的优势在于髋关节活动度大，推送节奏稳定不受支撑力限制。', sensory:'女子仰卧垫枕角度让整个身体有种轻微的倾斜感——头高脚低，呼吸更通畅，胸腔和腹腔的界限感变弱。阴茎沿前壁反复滑行时，女性感受到的是一种从耻骨到深处被温热地来回抚摸的感觉，不是撞击感而是贴合的熨烫感。持续二十个疗程日后，阴门区域的血流改善会带来温度逐渐回升的主观感受。男性跪姿的稳定下身让注意力可以完全放在推送节奏上，不会因为手臂酸或膝盖疼而分心。'},
{id:'bayi_licang', name:'利藏', source:'八益', animal:'', depth:4, clit:1, energy:'低/低', type:'侧卧背入', tags:['利藏','驱寒','背入式','兴欲'], desc:'女侧卧屈膝男背后侧卧，36次后入治冷感', ancient:'', op:'女子侧卧弯曲双腿，膝盖略收向胸前，使臀股向后突出。男子同样侧卧，位于女子身后，从背后进入。阳具从后方插入阴道后抽送三十六次。女子双腿弯曲后骨盆自然后倾，臀部突出，阴道角度发生变化，与面对面的插入角度截然不同。女子弯曲双腿的程度可自行调节：弯曲越多臀部越突出、插入角度越深；弯曲越少角度越浅。以不泄精为原则。', effect:'使人心气平和。背入式对阴道深处刺激比正面位强，更有效激活盆腔血流。女方在背入式中身体最容易放松，没有面对面的心理压力。兼治女子冷感症。', tip:'从适中弯曲开始，根据身体感受逐步调整。此法是八益法中第一个背向体位，背入式对阴道深处刺激比正面位强，更有效激活盆腔血流。女方在背入式中身体最容易放松，没有面对面的心理压力。日频次升至四次、连续二十天。', naming:'"利藏"的"利"是利于、有益于，"藏"指五脏的收藏功能——肾藏精、肝藏血、心藏神、肺藏气、脾藏营。利藏法选的是侧卧背入式：女子弯曲双腿膝盖收向胸前、男子从背后侧卧进入。古人认为"冷感"（性欲低下）的根子是五脏收藏功能失调，性欲的物质基础不够。所以"利藏"不是利某一个脏器，是通过背入式的体位设计同时调动盆腔血流和五脏气机的运转，恢复整个身体"藏"的能力。藏得住精血，才有余力输出性欲。', detail:'女子侧卧，弯曲双腿、膝盖略收向胸前使臀股向后突出。男子同样侧卧，位于女子身后从背后进入。抽送三十六次，每日四次，连续二十天。女子弯曲双腿的程度可自行调节：弯曲越多臀部越突出、插入角度越深；弯曲越少角度越浅。建议从适中弯曲开始，根据身体感受逐步调整。男子以侧卧背入，不承受体重，体力消耗极低，适合每日四次的高频次施行。抽送节奏均匀，不以泄精为目的。', sensory:'背后侧卧的姿势让女方身体完全放松——背靠男性的胸膛形成一种被托住的安全感，不需要用任何肌肉去维持姿势。阴道深处的刺激比正面位更集中，背入角度天然让龟头倾向于阴道后壁和深处区域，盆腔血流的温感在连续多天后会逐渐明显。女性在这个被动放松状态下更容易进入不需要"表现"的松弛感受。男方的感觉偏于稳定和持续，侧卧背入的角度让阴茎受到的包裹力均匀分布，不存在某个点摩擦过强导致早泄的风险。'},
{id:'bayi_qianggu', name:'强骨', source:'八益', animal:'', depth:4, clit:2, energy:'中/中', type:'侧卧（不对称）', tags:['强骨','通经','不对称','关节'], desc:'女侧卧左膝弯右腿直，男趴伏侧入45次通利关节', ancient:'', op:'女子侧卧，左膝弯曲向胸部收拢，右腿保持伸直，造成骨盆两侧角度不对称。男子趴伏在女子身上，面朝女子身体，从侧面进入。阳具插入阴道后抽送四十五次。此法的体位要点在于女子的不对称姿势——左腿屈、右腿直，骨盆两侧角度不同，阴道壁因此受力不均，刺激面比双腿同屈或同直的姿势更广泛。男子趴伏位重心低而稳，不需要用手臂大幅支撑，腰腹发力即可完成动作。', effect:'使男女关节灵活调和，身体轻快。不对称体位让骨盆两侧受力不均，骶髂关节和腰椎在非对称状态下工作，等同于关节活动度训练。兼治女子月经久闭。', tip:'十天短疗程，每天五次高频次，短时间内用大量重复动作"打通"淤滞的气血。女子左膝弯曲时注意不要过度挤压腹部，以舒适为度。不对称姿势对腰椎和骶髂关节等同于关节活动度训练。', naming:'"强骨"的"强"是强壮、增强，"骨"是骨骼和关节系统。但强骨的"骨"不只是解剖学上的206块骨头，中医说的骨包含了"骨髓-骨骼-关节-筋腱"的整个支撑系统，这个系统的根基是肾气。强骨法的独特之处在于它用了不对称体位——女子侧卧、左膝弯曲向胸、右腿伸直——这种一侧屈一侧伸的姿态让骨盆两侧受力不均，骶髂关节和腰椎被迫在非对称状态下工作，恰好是一种关节活动度的训练。"强骨"不是一个静态的补益，是让骨骼在运动中变强。', detail:'女子侧卧，左膝弯曲向胸部收拢，右腿保持伸直，造成骨盆两侧角度不对称。男子趴伏在女子身上，面朝女子身体，从侧面进入。抽送四十五次，每日五次，连续十天。女子左膝屈收时注意不要过度挤压腹部，以舒适为度。男子趴伏位重心低而稳，腰腹发力即可完成动作，不需要手臂大幅支撑。疗程虽短（10天）但日频次高（5次），强度在八益中属于中等偏上。', sensory:'不对称的腿姿是强骨法最鲜明的感受特征——左腿屈、右腿伸让骨盆内部产生一种"拧着"的张力感，阴道壁受力不均，刺激面比双腿同时屈或同时伸的姿势更宽阔、更丰富。骶髂关节和腰椎在这种非对称位置下获得轻度的、被动的活动度训练，连续十天后整个腰胯区域的灵活度和轻松感会有可感知的提升。男性的趴伏姿态让他几乎不需要消耗体力来维持姿势，注意力可以完全集中在推送的节奏和深度的控制上。'},
{id:'bayi_tiaomai', name:'调脉', source:'八益', animal:'', depth:4, clit:2, energy:'中/中', type:'侧卧（不对称）', tags:['调脉','解痉','脱敏','左右交替'], desc:'同强骨唯换弯右膝，54次小幅度温和解痉挛', ancient:'', op:'女子侧卧向右，右膝弯曲向胸部收拢，左腿保持伸直。男子趴伏在女子身上，面朝女子身体，从侧面进入。阳具插入后抽送五十四次。此法与强骨的体位结构完全对称，区别只有一点：强骨弯左腿，调脉弯右腿。左右交替使两侧的筋骨、经络、关节都得到均衡锻炼。抽送动作应缓慢平稳，切忌急促粗暴，否则反而加重痉挛。男子趴伏位的优势在于动作幅度天然受限，不容易失控。', effect:'使人气脉通畅。左右交替与强骨法配合，两侧均衡。原理类似脱敏疗法——用反复温和可控的刺激，让紧张的肌肉慢慢松弛。兼治女子阴道痉挛。', tip:'治疗原理类似于脱敏疗法：用反复的、温和的、可控的刺激，让紧张的肌肉慢慢松弛下来。男方耐心比体力重要得多。二十天疗程，每天六次，是系统性脱敏的标准配置。左右交替与强骨法配合使用，两侧均衡。', naming:'"调脉"的"调"是调和、梳理，"脉"既指经脉和血脉，也暗指阴道内的肌肉纹理。调脉法本质上是一套"阴道脱敏疗法"——通过反复的、温和的、可控的侧卧位刺激，让紧张痉挛的阴道壁肌肉慢慢松下来。痉挛的肌肉像一根绷紧的弦，不能硬拉开，只能用持续的、温和的、不给力度的重复触压让它自己软掉。"调脉"两个字精确概括了这个过程：把你的"脉"（肌肉脉络）从失控的痉挛状态调回到正常的松弛节律。', detail:'女子侧卧向右，右膝弯曲向胸部收拢，左腿保持伸直。此姿势与第四益强骨完全对称——强骨弯左腿、调脉弯右腿，左右交替使两侧筋骨经络得到均衡锻炼。男子趴伏在女子身上，面朝女子身体，从侧面进入。抽送五十四次，动作需缓慢平稳，切忌急促粗暴——粗暴反而会加重痉挛。每日六次，连续二十天。男子趴伏位的天然优势在于动作幅度受限，不容易失控做出大起大落的猛烈推送。核心要求是耐心，不是力量。', sensory:'阴道痉挛的女性在这个体位中的初始感受可能带有一些不适感甚至轻微的疼痛——但侧卧位和趴伏姿天然限制了男性的动作幅度，推送的力度被控制在"温和"的范围内，不会触发剧烈的痉挛反射。持续多天的规律刺激会让阴道壁从最初的防御性紧张逐渐过渡到习惯性的松弛。女性感受到的不再是"有东西要进来了快收紧"的恐慌式反射，而是"有东西在温和地来回，不用紧张"的习惯性接受。男子的体力消耗极低，需要付出的是耐心和节奏控制力。'},
{id:'bayi_xuxue', name:'蓄血', source:'八益', animal:'', depth:3, clit:3, energy:'极低/高', type:'女上位', tags:['蓄血','女上位','盆底肌','调经'], desc:'男仰躺女跨跪骑乘主动上下，63次蓄血调经', ancient:'', op:'男子正面仰躺，全身放松，采取完全被动的姿势。女子跨跪在男子胯部上方，双膝分别跪在男子臀部两侧，调整位置使阴户正对阳具。女子主动下沉身体使阴户吞没阳具，然后以上下运动为主，让阳具在阴道内反复抽送六十三次。女子全程掌控插入的深度、角度和节奏，骨盆底肌群（PC肌、提肛肌等）全程主动收缩发力，兼具锻炼盆底肌的效果。', effect:'使男子气强力壮。女上位骑乘运动相当于中等强度凯格尔运动，盆底肌群全程主动收缩发力。主被动彻底翻转，女方掌控节奏。兼治女子月经不调。', tip:'八益法中第一个女上位体位，主被动彻底翻转。女子骑乘运动相当于中等强度的凯格尔运动。节奏上先慢后快、先浅后深，不必从头到尾保持同一速度。男子仰躺即使每天七次也不会过度疲劳，但女子每次之间需充分休息。十天疗程。', naming:'"蓄血"的"蓄"是蓄养、储存，"血"是女子的经血和男子的精血。蓄血法是八益中第一道分水岭——前五益男子是主动方，从蓄血开始主被动翻转，女子跨坐上位、完全掌握节奏。"蓄"的动作是女方的主动运动，盆底肌群反复收缩，促进了盆腔区域的血液循环；"血"的获益是双向的——女方蓄养经血、改善月经，"蓄"好了的血才能按时按量排出；男方蓄养精血，在被动仰躺的放松状态下接受持续的阴茎包裹和挤压。"蓄血"的字面是补血养血，但它的意思更接近"让闲置的血活起来"。', detail:'男子正面仰躺，全身放松采取完全被动姿势。女子跨跪在男子胯部上方，双膝分跪在男子臀部两侧，调整位置使阴户正对阳具。女子主动下沉使阴户吞没阳具，然后以上下运动为主，让阳具在阴道内反复抽送。抽送六十三次，每日七次，连续十天。女子掌控插入的深度、角度和节奏。盆底肌群（PC肌、提肛肌等）在上下运动中全程主动收缩发力，兼具锻炼效果。节奏建议先慢后快、先浅后深，不必从头到尾同一速度。', sensory:'女子主动运动带来的掌控感是蓄血法最独特的心理感受——想深就深、想浅就浅、想快就快、想慢就慢，身体和节奏都在自己的掌控之中，这种主导感本身就能增强性快感。盆底肌群在六十三次的骑乘运动中反复收缩放松，连续十天之后女方能明显感觉到阴道收紧的力量在增强。男子仰躺被动，完全不需要消耗体力，阴茎感受到的是一种持续的、不费我力的温暖包裹，放松程度是所有八益体位中最高的。女方的体力消耗在八益中偏大，每次做完大腿内侧和臀部会有明显的发热疲劳感。'},
{id:'bayi_yiye', name:'益液', source:'八益', animal:'', depth:5, clit:1, energy:'高/中', type:'后入式（垫高）', tags:['益液','壮骨','后入式','深层'], desc:'女俯腹胯垫高枕臀翘，男跪姿后入深插72次充髓', ancient:'', op:'女子俯趴向下，面朝床面，在腹胯下方垫一个高枕，使臀部大幅度抬高、阴户充分凸出暴露。男子以双膝和双掌撑地，双膝跨在女子双腿两侧，身体位于女子后方上方。阳具从后方插入阴户，抽送七十二次。垫高枕是此法的关键——女子骨盆角度大幅抬高，阴道轴线接近垂直方向，男子从后方进入时插入角度深且直，与普通后入式有明显区别。男子跪姿后入，以腰臀发力为主，双掌分撑可以调节身体前倾或后仰的角度。', effect:'使人骨质坚实，骨骼充盈。垫高后入的极深体位、七十二次最大抽送量、最高日频次，三管齐下把盆腔血流刺激推到八益峰值。益液重点在骨髓——肾主骨生髓，髓液充实则骨骼强健。', tip:'腹胯下垫枕的高度需要调试：太高女子腰部悬空时间长会酸痛，太低则臀部抬升不够角度不佳。以女子腹部贴床、臀部自然翘起、腰部无明显不适为准。七十二次是八益中最大抽送量，强度为八益之巅，适合有基础的人。从治疗级刺激升级到深层激活级。', naming:'"益液"的"益"是增益、补充，"液"特指骨髓中的液态活性物质——中医讲"肾主骨、生髓"，骨髓是骨骼内部最柔软最有活力的部分，是骨质的活水源头。第四益已经用了"强骨"，"益液"的名字有意避开了"骨"字，把焦点从坚硬的骨骼外壳转移到内部流动的髓液。益液法用垫高后入的极深体位、七十二次的最大抽送量、推测八次/日的最高频次，三管齐下把盆腔血流的刺激推到八益的峰值。"益液"说的是：当滋养骨骼的髓液被充分激活，骨骼的坚固就是自然而然的结果。', detail:'女子俯趴向下，面朝床面，在腹胯下方垫一个高枕使臀部大幅度抬高、阴户充分凸出暴露。男子以双膝和双掌撑地，双膝跨在女子双腿两侧，身体位于女子后方上方。从后方进入后，垫高枕让女子骨盆角度大幅抬高、阴道轴线接近垂直方向，插入角度深且直。抽送七十二次，每日推测八次（据前六益递增规律推算），连续十天。男子腰臀发力为主，双掌分撑可调节身体前倾或后仰的角度。垫枕高度以女子腹部贴床、臀部自然翘起、腰部无不适为准。', sensory:'垫高后入的角度让龟头直抵阴道深处的后穹窿——刺激的强度、面积和深度与之前六益的温和侧卧完全是两个级别，从治疗级刺激跳跃到了深层激活级。女方感受到的是一种从盆腔深处向外扩散的充胀和温热感，不在表浅的阴道口而是从身体中心往外辐射。连续十天、每天八次、每次七十二次推送的强度确实高，身体会有一种"被用透了"的深度疲劳但又舒畅的矛盾感。男子的体位消耗也比前几益大，跪姿加腰臀推送需要持续的肌肉输出，属于八益中体力要求最高的一个。'},
{id:'ssf_xuchoumou',featured:true, name:'叙绸缪', source:'三十法', animal:'', depth:1, clit:0, energy:'极低/极低', type:'前戏', tags:['前戏','拥抱','温存','诗经'], desc:'两人面对面胸腹相贴，互相抚摸温存', ancient:'「绸缪束薪，三星在天。」——出自《诗经·豳风》', op:'两人面对面拥抱，胸腹相贴，互相抚摸温存。此为四步前戏的第一步，不急脱衣，先建立身体的包裹感。把两个赤裸的身体比作两捆紧紧捆在一起的柴薪，重在全身大面积接触，营造安全感和亲密氛围，让身体从日常状态切换到亲密状态。', effect:'以全身包裹感唤起情欲，为后续逐步聚焦打下基础。大面积肌肤接触促进催产素分泌，从生理到心理完成状态切换。三十法起手式，适合所有人。', tip:'这是三十法的起手式，不急进入。前戏第一步时间不宜短，充分享受拥抱的温存和肌肤的大面积接触。古人连前戏都要引《诗经》，讲究的是用经典给本能穿衣服。'
    ,naming:'「绸缪」出自《诗经·豳风》：「绸缪束薪，三星在天。」原意是紧紧捆扎柴薪，引申为情意缠绵。古人谈情，起手先引一句《诗经》，把两个赤裸的身体比作两捆紧紧捆在一起的柴薪。三十法以《诗经》开篇，从最雅的意象起笔，为后面从麒麟到驴狗的审美递进定下基调。',sensory:'全身皮肤大面积接触，胸膛贴着胸膛、腹部贴着腹部，体温在两层皮肤之间缓慢传递。两个人的心跳隔着胸腔互相传导，呼吸从各自独立逐渐同步，整个人像被裹进一层温热的茧里。'
  },
{id:'ssf_shenqianquan', name:'申缱绻', source:'三十法', animal:'', depth:1, clit:0, energy:'极低/极低', type:'前戏', tags:['前戏','握手','触觉','聚焦'], desc:'双手交握十指紧扣以手传情，从全身到局部', ancient:'', op:'男女双手交握，十指紧扣，以手传情。四步前戏的第二步，从全身拥抱过渡到手指的交扣确认。注意力从大面积的温热感缩小到指尖的触觉，感官在逐层聚焦。十指交扣时注意力度变化——轻握转紧握、松握转揉握，用触觉变化传递情绪。', effect:'通过手部的细腻触觉进一步唤起情欲，加深亲密连接。与现代性学提倡的"感官聚焦训练"同思路。', tip:'从全身包裹（第一步）过渡到指尖确认（第二步），古人把爱抚拆成两步的节奏很讲究：先全身再局部，先大面积温热再精准触觉。注意节奏不要太快，每一步给足时间。'
    ,naming:'「缱绻」也是缠绵难舍之意，与「绸缪」一前一后，先抱后握，从全身到局部逐步聚焦。十指交扣是两具身体之间最小面积的精确连接。',sensory:'十指交扣时，指腹能清晰感知对方指纹的纹路、指关节的骨节、掌心的温度和湿度。注意力从全身的大面积温热缩小到十根手指的精准触觉，指尖的敏感度在聚焦后被放大。'
  },
{id:'ssf_pusaiyu', name:'曝鳃鱼', source:'三十法', animal:'鱼', depth:1, clit:5, energy:'极低/极低', type:'前戏', tags:['前戏','唤起','女方先行','观察'], desc:'女子情动阴部充血翕张，如鱼鳃外露挣扎', ancient:'', op:'四步前戏的第三步，女方先行反应。女子情动后阴部充血微张，如鱼离水、鳃部外露挣扎之态——湿润、翕张、略带急迫。男方此时应观察女方的生理信号：阴唇充血外翻、阴道分泌物增多、整体唤起充分。确认女方已经充分唤起后再进入下一步。', effect:'确认女方性唤起充分，为后续交合奠定生理基础。女方先兴奋才是正常顺序——古人认为男方等女方准备好了再就位才是正道。', tip:'"曝鳃"二字精准捕捉了女性性唤起时阴唇充血外翻的视觉形态，这种观察精度放在唐代相当了不起。古人认为女方先兴奋是正常顺序，男方等女方准备好了再就位——反过来男方先硬了才去挑逗女方才是本末倒置。'
    ,naming:'「曝鳃」取鱼离水后鳃部外露挣扎的意象。古人把女性兴奋时阴唇充血外翻的视觉形态比作鱼鳃暴露在空气中，用动物本能写人体本能。',sensory:'阴唇充血后明显膨胀、颜色加深，小阴唇从紧闭状态微微张开，整体泛潮、温热。男方用手指轻触时，女方的身体会有不自觉的上迎反应。'
  },
{id:'ssf_qilinjiao', name:'麒麟角', source:'三十法', animal:'麒麟', depth:1, clit:0, energy:'极低/极低', type:'前戏', tags:['前戏','勃起','就绪','四步完结'], desc:'男子勃起坚挺如麒麟独角昂然挺立，就绪入题', ancient:'', op:'四步前戏的第四步，男方就绪。男子勃起坚挺，如麒麟头上独角昂然挺立。此时女方已充分唤起（曝鳃鱼），男方完全勃起（麒麟角），四步前戏结束，方可正式进入交合体位。麒麟是瑞兽，独角为其标识，用此比喻既避了直说的粗俗，又暗示此物珍贵、不可多得。', effect:'确认男方勃起充分，双方均已就绪。四步层层递进：拥抱→握手→女方先反应→男方就位，节奏感极好。', tip:'注意这个顺序不可反：先曝鳃鱼（女方先反应），再麒麟角（男方后就位）。古人把这个认知编进了标准操作流程，非常正确。前四步走完才算"前戏"正式结束。'
    ,naming:'麒麟是瑞兽，独角为其标识。古人用麒麟独角比喻阴茎勃起——既避了直说的粗俗，又暗示此物珍贵、祥瑞。四步前戏走到第四步男方才就绪。',sensory:'充分勃起后阴茎充血发胀，温度比体温高出一截。用手握住时有明显的硬度和弹性——像握着一根被体温捂热的硬木。'
  },
{id:'ssf_canchanmian', name:'蚕缠绵', source:'三十法', animal:'蚕', depth:2, clit:1, energy:'低/极低', type:'仰卧（女缠）', tags:['仰卧','女缠男','包裹','温存'], desc:'女仰四肢环抱男颈缠腰，男跪伏腿间俯身插入', ancient:'', op:'女子仰卧，双臂环抱男子颈部，双腿交叉缠于男子腰后。男子跪伏于女子双腿之间，双手扶女颈，俯身插入。蚕吐丝时将自身层层缠裹，此法以女子四肢缠绕男子全身得名。女方主动包裹、男方被动承受，四肢全部缠上去的体位接触面积最大，安全感最强。适合缓慢、浅入的温存式交合。', effect:'接触面积最大，安全感最强。适合缺乏安全感或刚在一起的伴侣，亲密感无出其右。', tip:'缠紧后男方运动幅度天然受限，适合缓慢、浅入的温存式交合，不适合追求冲击感。注意男方不要全重压在女方身上，这个体位女方承重较大。'
    ,naming:'蚕吐丝时将自身层层缠裹，此法以女子四肢缠绕男子全身得名。「缠绵」：缠是四肢的缠绕，绵是肌肤的柔软绵密。',sensory:'四肢全部缠上去后，身体接触面积在所有仰卧体位中最大——胸腹相贴、耻骨相抵。一种强烈的被包裹的安全感从皮肤渗进心里。'
  },
{id:'ssf_longwanzhuan', name:'龙宛转', source:'三十法', animal:'龙', depth:5, clit:1, energy:'高/中', type:'仰卧（折叠）', tags:['仰卧','折叠','柔韧','深层'], desc:'女仰屈膝高抬，男推腿至趾近乳房后插入', ancient:'', op:'女子仰卧，屈膝高举双腿。男子跪于女腿间，以手推女双腿向前折叠，使足趾接近乳房后方，随即插入。"宛转"是盘旋扭动之态，要义在女方身体的柔韧折叠。腿推到脚趾接近背部的程度，折叠程度越深，阴道轴线的改变越大，深处的刺激越强。', effect:'极深角度的体折插入，对阴道深处（后穹窿区域）刺激强烈。与九法龟腾类似但折叠更深。', tip:'对女方髋关节和腰椎要求很高，柔韧性不够的人直接跳过。膝盖不必强求贴胸，以女方舒适极限为准。和九法中龟腾的区别：龟腾推腿至胸，龙宛转推到脚趾接近背部，折叠更深。'
    ,naming:'「宛转」是盘旋扭动之态。男方推女方双腿向前折叠到脚趾接近背部的程度，比龟腾折叠更深一层。古人用「龙」而不是「蛇」来命名，取的是龙的尊贵感。',sensory:'骨盆被极度前倾压缩，龟头着力点跳到最深处的后穹窿。每一次深插都触到平时根本碰不到的位置，一种从盆腔深处往外扩散的酸胀感。'
  },
{id:'ssf_yubimu', name:'鱼比目', source:'三十法', animal:'鱼', depth:2, clit:2, energy:'极低/极低', type:'侧卧（面对面）', tags:['侧卧','面对面','持久','温存'], desc:'男女并排侧卧面面相对，接吻抬腿侧身插入', ancient:'', op:'男女并排侧卧，面面相对，接吻吮舌。女子一腿搭于男子身上，男子伸手抬女上腿，侧身插入。比目鱼只有一侧有眼，必须两条鱼并排才能游动——侧卧时两人面面相对，各自只有一只眼能看见对方，和比目鱼一模一样。这个体位温和、省力、亲密，适合疲劳时或想要长时间温存的伴侣。', effect:'温和省力，持久性强。结合深度偏浅但胜在可持续很久，双方体力消耗极低。适合疲劳时、年纪较大时、想要长时间温存的伴侣。', tip:'比目鱼的意象用在侧卧位上极其贴切。适合疲劳时、想要长时间亲密交流时使用。唯一不足是结合深度偏浅，但换来的持久性是其他体位做不到的。'
    ,naming:'比目鱼只有一侧有眼，必须两条鱼并排才能游动。侧卧时两人面面相对，各自只有一只眼能看见对方——和比目鱼一模一样。',sensory:'结合深度偏浅，但摩擦集中在阴道口最敏感的区域。面面相对的距离近到能数清对方的睫毛，呼吸互相喷在对方脸上。'
  },
{id:'ssf_yantongxin', name:'燕同心', source:'三十法', animal:'燕', depth:3, clit:2, energy:'低/极低', type:'仰卧（互抱）', tags:['仰卧','互抱','紧密','恩爱'], desc:'女仰直腿分男俯伏抱女颈互抱，正位插入', ancient:'', op:'女子仰卧，双腿伸直分开。男子俯伏于女腹上，双手环抱女颈，女子双手抱男腰，正位插入。燕子成双成对、不离不弃，是古诗里最常见的恩爱意象。此法体位端正，两人面对面、胸贴胸、四肢互抱，取的正是"同心"二字。', effect:'亲密感极强，胸部紧贴胸部，全身大面积接触。与龙翻的区别在于男方双手抱颈而非撑体，上身完全贴下去。', tip:'与龙翻的核心区别：龙翻男方双手撑体留空间，燕同心直接贴到底，亲密感翻倍。但男方体重直接传导给女方，体重差大的慎用。'
    ,naming:'燕子成双成对、不离不弃。与龙翻的区别：龙翻男方双手撑体留距离，燕同心直接贴到底——零距离。',sensory:'胸膛压着乳房，每一次呼吸乳房都被挤压又释放。正位插入后耻骨相抵，阴蒂被持续挤压。整个体位像一个密不透风的容器把两个人装在一起。'
  },
{id:'ssf_feicuijiao', name:'翡翠交', source:'三十法', animal:'翡翠鸟', depth:2, clit:5, energy:'中/中', type:'仰卧（蹲坐）', tags:['仰卧','阴蒂刺激','蹲坐','精准'], desc:'女仰屈膝男蹲坐腿间抱腰，专攻阴蒂区域', ancient:'', op:'女子仰卧屈膝，男子蹲坐于女股后，双腿分开夹于女子腿间，双手抱女腰，以阳具攻击阴蒂区域。翡翠鸟交配时雄鸟伏于雌鸟背上、头颈相交。此法重点不在插入深度，而在体位角度——蹲坐位让男方耻骨和阳具根部精准对准阴蒂区域，抽送时的摩擦集中在阴蒂体和小阴唇上。', effect:'精准刺激阴蒂区域，对需要阴蒂刺激才能达到高潮的女性来说，这个体位比龙翻有效得多。', tip:'蹲坐位而非跪姿，刺激点天然前移。如果女方平时交合中阴蒂刺激不够，尝试这个体位可能会有明显改善。古人用"攻击"二字描述此处操作，倒是诚实。'
    ,naming:'翡翠鸟交配时雄鸟伏于雌鸟背上。此法蹲坐而非跪姿，耻骨精准对准阴蒂区域，每一下都精准碾压。',sensory:'耻骨对阴蒂体和小阴唇的持续碾压——每一下推送都像用掌根按住一颗豆子来回推。快感像激光一样聚焦在阴道口外侧方寸之地。'
  },
{id:'ssf_yuanyanghe', name:'鸳鸯合', source:'三十法', animal:'鸳鸯', depth:3, clit:1, energy:'低/低', type:'侧卧（背入）', tags:['侧卧','背入','省力','持久'], desc:'女侧卧举腿一腿置男腿上，男从后骑入', ancient:'', op:'女子侧卧，举双腿，一腿置于男子腿上。男子从女背后骑于女下一腿上，一脚半跪、一脚踏前，插入。鸳鸯总是成双出现，此法以侧卧后入为要。一腿在上一腿在下，姿势略费劲但侧卧的好处是省力持久。比标准侧卧背入多了一个接触点——女方上腿的自由度更大，可以自行调整角度。', effect:'侧卧背入省力持久，女方上腿自由度大可调整角度。这个体位在后世八益法中有大量应用，是治疗型体位的基础形式。', tip:'把一腿放在男方腿上增加了一个接触点，女方上腿的自由度也更大，可以根据自己感受随时微调角度。比标准侧卧背入更灵活。'
    ,naming:'鸳鸯总是成双出现。此法以侧卧后入为要，省力、持久、不追求冲击。后世八益法中大量治疗型体位的基础形式就从这里来。',sensory:'侧卧后入的角度让龟头贴着阴道后壁滑入，着力点偏向深处。没有猛烈的冲击感，只有一种稳定充实的压迫从阴道深处往外蔓延。'
  },
{id:'ssf_kongfandie', name:'空翻蝶', source:'三十法', animal:'蝶', depth:3, clit:3, energy:'极低/中', type:'女上位（面对面）', tags:['女上位','G点','自主','面对面'], desc:'男仰女面对坐于男身双手撑其膝，如蝶展翅', ancient:'', op:'男子仰卧，双腿伸直分开。女子面对面坐于男子身上，双手按住男子膝盖，送入阳具。蝴蝶翩然落下、双翅展开，女子在上位身体舒展如蝶，节奏由女方掌控。关键是双手撑膝盖而非撑男方胸部——撑膝盖让女方上身挺直，骨盆倾斜角度更大，阴道前壁（G点侧）受压迫更强。如果改为撑男方胸部，上身前倾、骨盆后仰，刺激点就从G点移到了阴道后壁，感觉完全不同。', effect:'女上位自主控深控速，骨盆前倾角度使G点压迫显著。双手撑膝的姿态让女方身体舒展如蝶翅展开。', tip:'女上位的好处不必多说——节奏完全由女方掌控。重点是手放哪里：撑膝盖→G点刺激；撑胸部→后壁刺激。换个手的位置就是截然不同的体验，可以交替尝试。'
    ,naming:'蝴蝶翩然落下时双翅展开。女方骑乘位中骨盆一起一落，如蝶翅翻动。用蝶来命名女上位，取的是轻盈和自主——女方在上面不是被驮着的货物，是自己飞下来的。',sensory:'女方双手撑在男方膝盖上，上身挺直，骨盆自然前倾——G点被龟头和耻骨双重压迫。耻骨与耻骨在最深处撞合时，阴蒂根部受到持续的挤压式刺激。'
  },
{id:'ssf_beifeixiao', name:'背飞枭', source:'三十法', animal:'枭', depth:4, clit:1, energy:'极低/中', type:'女上位（背向）', tags:['女上位','背向','后穹窿','充实感'], desc:'男仰女背向坐其身上低头俯身，插入', ancient:'', op:'男子仰卧，双腿伸直分开。女子背向男子坐于其身上，低头俯身，以便插入。枭是猫头鹰，夜间飞行无声、背向出击。女子面朝男方双脚方向，与空翻蝶恰好相反——一个面对面，一个背靠背。古人把正面的叫蝶、背面的叫枭，一雅一猛，审美很分明。女方背向时阴道后壁朝向男方耻骨，深插时龟头顶到的是后穹窿，碰不到前壁的G点。', effect:'刺激角度与空翻蝶完全不同，深插时顶到后穹窿区域，带来深处充实感。适合喜欢深处饱满感但不太需要阴蒂刺激的女性。', tip:'与空翻蝶形成完美互补：正面蝶→G点，背面枭→后穹窿，一雅一猛。建议两个体位交替使用，覆盖不同刺激区域。'
    ,naming:'枭是猫头鹰，夜间无声飞行、从猎物背后俯冲出击。古人把正面女上位叫蝶（雅），背面女上位叫枭（猛），一雅一猛。',sensory:'女方背向时龟头深插直抵后穹窿，一种从盆腔深处往外扩散的饱满充实感。男方的视觉收获极大：女方整个背部的S型曲线。'
  },
{id:'ssf_yangaisong', name:'偃盖松', source:'三十法', animal:'', depth:4, clit:1, energy:'高/中', type:'仰卧（双腿交叉）', tags:['仰卧','双腿交叉','收紧','互抱'], desc:'女仰双腿高举交叉如松伞盖，双方互抱腰深插', ancient:'', op:'女子仰卧，双腿高举交叉。男子双手抱女腰，女子双手亦抱男腰，插入。偃盖是松树树冠平展如伞盖的样子——双腿交叉高举，从男方视角看确实像一顶撑开的伞。两人互抱腰部借力深入，体位紧凑。双腿交叉的效果让阴道口收紧，男方紧握感增强。但双腿高举比伸展位结合更深，因为骨盆被大幅抬高，阴道轴线改变。', effect:'双腿交叉使阴道口收紧，紧握感增强，结合深度深。两人互抱腰部借力，动作紧凑有力。阴道松弛或产后恢复期的女性受益最大。', tip:'对女方大腿后侧柔韧性有要求，后侧紧的人会觉得双腿交叉高举很吃力。如果柔韧性不够，可以改为双腿自然高举而不交叉，效果接近但门槛更低。'
    ,naming:'偃盖是松树树冠平展如伞盖的样子。双腿交叉让阴道口收紧如绳结。不是花哨的松，是扎实的松。',sensory:'阴道口被物理性收紧，男方的茎体被紧紧箍住。深处的酸胀感和阴道口的紧握感同时存在。两人互抱腰部借力，每一下推送都是双方合力。'
  },
{id:'ssf_lintanzhu', name:'临坛竹', source:'三十法', animal:'', depth:4, clit:2, energy:'高/中', type:'站立（相向）', tags:['站立','相向','端正','唯一'], desc:'男女相向站立口唇相接相拥，深深插入', ancient:'「男女相向站立，嘴对嘴相拥抱，并将阳具深深插入。」', op:'男女相向站立，口唇相接，拥抱交合，阳具深深插入。三十法里唯一的站立式，像临坛做法事一样端端正正。竹子中空而挺直，用来比喻这个体位的端正劲儿。站立交合双方的结合角度与卧姿完全不同，活动自由度大。', effect:'站立位交合，双方活动自由度大，结合角度与任何卧姿都不同。在不需要床的场景下有不可替代的优势。对双方身高匹配度和体力要求都高。', tip:'对双方身高匹配度和体力要求都高，身高差大的很难协调。唐代床榻比今天矮不少，床沿到地面约半米，此式可能在床沿使用更舒服。换成今天的高床，男女双方在床边的半站立式是更实际的变体。'
    ,naming:'竹子中空而挺直。「临坛」来自道教科仪，道士做法事时在祭坛前肃立。三十法里唯一的站立式，像竹子一样端正挺直。',sensory:'站立时的插入角度与任何卧姿都完全不同。阴道壁和阴茎之间的摩擦因为全身微调平衡而变得不规则、不重复。全身紧贴站立时有一种必须共同维持平衡的紧迫感。'
  },
{id:'ssf_luanshuangwu', name:'鸾双舞', source:'三十法', animal:'鸾', depth:3, clit:2, energy:'低/低', type:'仰卧（面对面）', tags:['仰卧','面对面','简约','经典'], desc:'一人仰躺一人俯卧面对面贴合，如鸾凤双飞', ancient:'', op:'一人仰躺，一人俯卧，两人面对面，插入。鸾鸟是凤凰一类，雌雄双飞、鸣声相和。此法最简——一人躺一人趴，面对面贴合。没有花哨的角度，没有复杂的腿部动作，纯粹靠亲密感取胜。在三十法的编排序列里，它正好处于仰卧式和特殊式的过渡位置，承上启下、不偏不倚。', effect:'简单直接的面对面交合，亲密感强。不偏不倚的经典体位，适合作为从常规到特殊的过渡。', tip:'最简单的体位往往最容易被忽略，但纯粹贴合的感觉不可替代。放在序列中间作为承上启下的过渡，古人编排的逻辑很清楚。'
    ,naming:'鸾是凤凰一类的神鸟，总是成双成对。此法最简单——一人仰躺一人俯卧，面对面贴合。古人用最安静的鸟来命名最安静的体位。',sensory:'面对面时眼神在极近距离内交汇，呼吸互相喷在脸上。全身的接触面积大，注意力分散到整个身体的感知上。'
  },
{id:'ssf_fengjiangchu', name:'凤将雏', source:'三十法', animal:'凤', depth:3, clit:3, energy:'极低/中', type:'女上位', tags:['女主导','体型差','包容','大女小男'], desc:'体型偏大女子主导，与轻小男子交合如母凤哺雏', ancient:'', op:'女子体格较大，以少年男子交合，如母凤哺育雏鸟之态。三十法里唯一明确提到体型差异的一法——大的带小的，女方为主导。当女方体型明显大于男方时，常规体位可能不协调，女上位的骑乘式或面对面坐式是最舒服的选择。古人对此不避讳，反而给了凤凰育雏的美名。', effect:'解决体型差异带来的体位不协调问题。女方主导，骑乘式或坐式最佳，让体型较小的一方不必承担体重支撑。', tip:'古人直面体型差异现实并给了正面命名，值得赞赏。实际操作中女方主导的骑乘式或面对面坐式是最优解，男方仰躺完全被动即可。'
    ,naming:'古人用母凤哺育雏鸟的意象来命名唯一明确提到体型差异的一法。态度坦然，没有嘲笑也没有遮掩。体型差异不是缺陷，是自然状态。',sensory:'女方完全掌控节奏、深度和角度。主导感本身就增强性快感，因为主动权意味着不被迫承受任何不舒服的节奏。'
  },
{id:'ssf_haiouxiang', name:'海鸥翔', source:'三十法', animal:'鸥', depth:4, clit:2, energy:'中/中', type:'床边站立', tags:['站立','床边','俯冲','高腰'], desc:'女仰躺床边男立于地，抬女双腿俯冲插入', ancient:'', op:'女子仰躺于床，男子立于床边，抬起女方双腿，插入。海鸥掠水，翅尖点浪即起——男子站在床边居高临下，视觉上有俯冲之势。这个体位的关键在床的高度：唐代床榻比今天矮不少，床沿到地面大约半米，站立者屈膝即可就位。高腰型体位的原型就在这里——女方臀部在床沿，男方站立进入，结合深度和角度都好控制。', effect:'站立床边交合，男子居高临下视觉冲击强，结合深度和角度好控制。高腰型体位的原始版本。', tip:'床高是决定性因素。唐代矮榻屈膝即可就位，今人高床需要深蹲能力或让女方臀部尽量靠近床沿。如果床太高，可用矮凳让男方适当垫高。'
    ,naming:'海鸥掠过水面时翅膀尖端点一下浪就飞起来。男方从上方进入，角度精准，节奏可以做到很平稳。古人用海鸥而不是凤凰来命名，说明它定位就是日常实用。',sensory:'女方臀部悬在床沿边缘，阴道轴线被改变，G点被正面压迫。男方站立位可以完全发力——幅度和力度都可大可小。'
  },
{id:'ssf_yemayue', name:'野马跃', source:'三十法', animal:'马', depth:5, clit:1, energy:'高/中', type:'仰卧（担腿）', tags:['仰卧','担腿','深插','冲击'], desc:'女仰双腿架男双肩上，深深插入如野马腾跃', ancient:'', op:'女子仰躺，双腿架于男子左右肩上，深深插入。野马奔腾时四蹄腾空、毫无拘束——女方双腿被架到肩上，骨盆抬起，角度深而紧凑。"跃"字点出要义：深插时的冲击感。与九法中猿搏的核心区别在于：猿搏强调的是"深按不动"的静态深处压迫，野马跃强调的是"深深插入"后的动态冲击节奏。一个是静中求深，一个是动中求深。', effect:'极深角度插入，骨盆抬高带来强有力的深处冲击。与猿搏形成动静对照——想静压深处的用猿搏，想冲击深处的用野马跃。', tip:'注意女方腰椎不要过度反弓，可在腰下垫薄枕做支撑。腿架到肩上对柔韧性有一定要求，柔韧不够可只架一条腿。冲击节奏要女方主导许可才可加速。'
    ,naming:'野马奔腾时四蹄腾空。与猿搏的核心区别：猿搏深按不动是静态压迫，野马跃深插后继续推送是动态冲击。',sensory:'双腿被高高架起时阴道大幅缩短，龟头每一下都直抵深处。男方居高临下俯视整个交合过程，视觉冲击力加上深处的撞击声，三重刺激同时作用。'
  },
{id:'ssf_jichengzu', name:'骥骋足', source:'三十法', animal:'马', depth:4, clit:2, energy:'中/中', type:'仰卧（蹲坐）', tags:['仰卧','蹲坐','控角','灵活'], desc:'女仰男蹲坐腿间，左臂环女颈右手扶腿插入', ancient:'', op:'女子仰卧，男子蹲坐于女股后，左臂环女颈，右手扶女腿，插入。骥是千里马，骋足是纵马奔驰。男子蹲坐的姿势类似骑马——一手勾颈一手扶腿，像驭手握缰，能同时控制女方上身和下身的角度，调节灵活度很高。蹲坐位比跪姿更省力，因为大腿分担了体重，膝关节压力小。', effect:'调节灵活度高，一手控上身一手控下身，角度随心调整。蹲坐比跪姿省力，膝关节压力小。两只手同时操控两个方向，灵活度极高。', tip:'古人把房事写成骑术毫不含糊——一手环颈一手扶腿的姿势确实像驭手握缰。这个体位最大的优势是双方角度随时可微调，女方的上体和下体角度可以独立控制。'
    ,naming:'骥是千里马，骋足是纵马奔驰。一手环颈一手扶腿，像驭手握缰。两只手同时操控两个方向，灵活度极高。',sensory:'两只手同时操控两个方向，每一次推送都可以微调角度。女方在这种被操控的状态下被动享受。'
  },
{id:'ssf_mayaoti', name:'马摇蹄', source:'三十法', animal:'马', depth:4, clit:1, energy:'高/中', type:'仰卧（半自控）', tags:['仰卧','自控','柔韧','参与'], desc:'女仰男架一腿于肩，女方自拉另一腿以深入', ancient:'', op:'女子仰卧，男子架起女方双腿，一腿置于肩上，一腿由女方自己用手拉住，以便深入。"摇蹄"说的是蹄子被架起来摇，马本身不摇。与骥骋足不同，这里女方要自己拉着一条腿，等于自己帮自己打开角度。女方自己拉腿的好处是她能精确控制自己那条腿的角度和力度——不适了就松一点，舒服了就拉紧一点，主动权完全在她手里。', effect:'女方自主控制一侧角度和力度，主动权在女方。拉紧则摩擦锐利、松开则压力柔和，随时可调的松紧感是其他体位给不了的。', tip:'女方参与度比野马跃更高——不是完全被动被架着腿，而是主动参与控制。自己拉腿能精确调控角度和力度，不适即松，舒服即紧。柔韧和臂力不足者改为男方架双腿也可。'
    ,naming:'「摇蹄」说的是蹄子被架起来摇。女方自己拉着一条腿，自己控制自己那一侧的角度。和骥骋足的区别：骥骋足男方全控，马摇蹄女方半控。',sensory:'女方自己拉着腿时，拉紧则摩擦锐利、松开则压力柔和。随时可调的松紧感是其他体位给不了的。'
  },
{id:'ssf_baihuteng', name:'白虎腾', source:'三十法', animal:'虎', depth:3, clit:2, energy:'中/中', type:'仰卧（蹲坐）', tags:['仰卧','自下而上','蹲坐','顶入'], desc:'女仰伸腿分男蹲坐腿间抱女颈，自下向上顶入', ancient:'', op:'女子仰卧伸展，双腿分开。男子蹲坐于女腿间，两腿弯曲，双手抱女颈，插入。白虎是四象之一、西方之兽，腾跃而起。男子蹲坐而非跪伏，整个身体有向上腾起的姿态，双手抱颈、下身蹲坐，发力方向是从下往上。与野马跃的从上往下恰好形成对照：一个是居高临下的冲击，一个是自下而上的顶入，方向不同，刺激的阴道壁面也不同。', effect:'自下而上的顶入方向，刺激的阴道壁面与从上往下的体位完全不同。蹲坐位省力，双手抱颈增强亲密感。与野马跃搭配使用覆盖不同区域。', tip:'与野马跃形成完美的方向对照——野马跃从上往下冲击，白虎腾从下往上顶入，两种方向刺激的阴道壁面不一样。建议搭配使用，全面覆盖。'
    ,naming:'白虎是四象之一、西方之兽。「腾」是向上跃起——蹲坐位蓄力后自下往上弹射。和野马跃的从上往下冲击恰好方向相反。',sensory:'男方蹲坐蓄力，腰臀从最低点猛然上顶——龟头沿阴道后壁一路向上刮擦，像用勺底从碗底往上舀。'
  },
{id:'ssf_xuanchanfu', name:'玄蝉附', source:'三十法', animal:'蝉', depth:4, clit:1, energy:'低/中', type:'俯卧（后入）', tags:['俯卧','后入','低伏','安静'], desc:'女俯卧分腿男趴伏腿间双手抱颈，从后插入', ancient:'', op:'女子俯卧，双腿分开。男子趴伏于女双腿之间，双手抱女颈，从背后插入。蝉附于树干，紧贴不动，只以鸣声示人——女子趴着不动，男子从背后贴上来，整个体位低伏、安静，像蝉趴在树皮上。"玄"是黑色，蝉在地下蛰伏多年出土后贴在树上，这个意象暗合了后入式的隐蔽感。', effect:'低伏后入式，安静亲密，体力消耗低。与九法蝉附相比多了双手抱颈细节，抱颈时上身完全贴下去更亲密也更省力。', tip:'与九法中蝉附的核心区别在"双手抱女颈"这个细节——抱颈意味着上身完全贴下去，比九法蝉附的双肘撑体更亲密也更省力，但女方承受的重量也更大。体重差大的慎用，建议用双肘撑体留空间的蝉附变式。'
    ,naming:'蝉趴在树干上时整个腹部贴紧树皮。「玄」是黑色——蝉幼虫在地下蛰伏数年才破土而出。和九法蝉附的区别在于多了双手抱颈，上身完全贴下去。',sensory:'胸膛完全贴实女方后背，龟头沿阴道后壁水平进入。男方的呼吸喷在女方耳后和脖颈上，距离近到汗毛都被吹动。'
  },
{id:'ssf_shanyangduishu', name:'山羊对树', source:'三十法', animal:'羊', depth:4, clit:1, energy:'极低/中', type:'坐式（背向）', tags:['坐式','背向','视觉刺激','加速'], desc:'男蹲坐女背向坐于男身俯视，男抱腰加速', ancient:'', op:'男子蹲坐，女子背向坐于男子身上，低头俯身，目视阳具插入。男子双手紧抱女方腰部，加速抽送。山羊发情时会蹭树——女子背对男子如羊蹭树，命名直接取自动物行为不加修饰。女方低头俯身能目视插入过程，这个视觉刺激对某些人来说非常强烈。背向坐式的结合深度取决于女方前倾的程度：前倾越多，阴道轴线改变越大，深处刺激越强。', effect:'视觉刺激强烈（可目视插入过程），背向坐式结合深度由女方前倾程度决定。', tip:'目视插入过程的视觉刺激因人而异——对某些人非常强烈，对另一些人可能过于直白。女方前倾程度直接决定深处刺激的强弱，可自行调节。古人在这类命名上并不故作高雅，该粗就粗。'
    ,naming:'山羊发情时会找树干不停蹭。女方背对男方坐于其身上、低头俯身，姿态和羊蹭树一模一样。古人直接取动物行为命名，该粗就粗。',sensory:'最关键的是视觉——女方低头能直接目视阳具在自己身体里进出的过程，这种第一视角的视觉冲击在其他体位里几乎不可能获得。'
  },
{id:'ssf_jilinchang', name:'鸡临场', source:'三十法', animal:'鸡', depth:3, clit:2, energy:'极低/中', type:'坐式（三人）', tags:['坐式','三人','历史','特殊'], desc:'男坐床沿一女坐身上一女身后抚弄，三人行', ancient:'', op:'男子坐于床沿，使一少女坐于其身上插入，另使一少女从身后抚弄，以增快感。三十法里唯一涉及三人行的一法。"鸡临场"指公鸡巡视鸡群时的从容姿态——古人写这一法时语气坦然，好像在说"今天菜单上有两道菜"。一男二女的体位被正式纳入技术体系，反映了唐代纳妾合法、青楼盛行的社会风气。', effect:'通过变换刺激来源和节奏增加新鲜感，打破惯性。属于历史特定的文化产物，现代参考其节奏变换思路即可。', tip:'三十法唯一涉及三人行的一法，反映了唐代社会风气。古人在编排三十法时并不局限于一夫一妻的框架，态度坦然。但现代实践中实用性有限，更多是作为一种历史现象来了解。'
    ,naming:'公鸡巡视鸡群时的姿态——昂首阔步、从容不迫。三十法里唯一涉及多人的体位，反映了唐代纳妾合法的社会现实。',sensory:'男方同时承受前方阴道的包裹和后方手指的刺激，两股快感在神经层面叠加。'
  },
{id:'ssf_danxuefengyou', name:'丹穴凤游', source:'三十法', animal:'凤', depth:4, clit:2, energy:'高/高', type:'仰卧（自举腿）', tags:['仰卧','自举腿','自主','独立'], desc:'女仰自举双腿男跪于后以手撑体，各自独立', ancient:'', op:'女子仰躺，以手自举双腿。男子跪于女股后，以手支撑身体，插入。丹穴是《山海经》中凤凰栖息之山。双方各用双手支撑自己，谁也不靠谁，各自独立。这个体位的核心是女方自我控制角度——女方自举双腿时骨盆的角度完全由她自己掌控，想深就举高一点，想浅就放低一点，男方只管进退。', effect:'女方完全自主掌控骨盆角度和插入深度，独立性强。双方都用手臂支撑、各自负责自己，体力消耗不小。', tip:'这是个"看起来轻松、做起来费劲"的姿势——双方都用双手支撑自己，时间一长手臂都会酸。但女方自我掌控角度的优势无可替代，不适了就放低一点，主动权完全在她。'
    ,naming:'丹穴出自《山海经》——凤凰栖息之山。此法的核心是独立：双方各用双手支撑自己，谁也不靠谁。',sensory:'女方自举双腿时骨盆角度完全在自己掌控中——举高就深、放低就浅。男方感觉到女方主动调整角度带来的不同深浅和松紧。'
  },
{id:'ssf_xuanmingpengzhu', name:'玄溟鹏翥', source:'三十法', animal:'鹏', depth:5, clit:1, energy:'极高/中', type:'仰卧（臂托）', tags:['仰卧','臂托','视觉','臂力'], desc:'男双臂托女双腿分置两臂，俯身抱腰插入', ancient:'', op:'女子仰卧，男子将女方双腿分别置于自己左右上臂，俯身下抱女腰，插入。鹏是《庄子》里的大鸟——"水击三千里，抟扶摇而上者九万里"，翥是高飞。男方双臂托腿、俯身抱腰，整个姿态如大鹏展翅蓄势，视觉冲击力很强。但这个体位中女方两条腿的重量全压在男方两条胳膊上，时间一长大臂会酸到发抖。', effect:'独特的臂托体位，视觉冲击力极强，结合角度深。但体力消耗极大，适合偶尔尝试，不宜作为常规体位。', tip:'这是"观赏性高、实操性低"的典型——女方双腿重量全压在男方双臂上，臂力不够的人不要尝试。如果一定要试，缩短时间，女方不要完全放松腿部让重量全部压在男方手臂上。'
    ,naming:'鹏出自《庄子》——「水击三千里，抟扶摇而上者九万里。」男方双臂托举女方双腿，如大鹏展翅蓄势。古人把体力要求极高的体位取了鹏鸟的美名。',sensory:'女方两条腿的重量全部压在男方两条上臂上，阴茎以近乎垂直的角度刺入深处。大臂肌肉很快就酸到发抖。'
  },
{id:'ssf_yinyuanbaoshu', name:'吟猿抱树', source:'三十法', animal:'猿', depth:3, clit:2, energy:'低/中', type:'坐姿（面对面）', tags:['坐姿','面对面','互抱','亲密'], desc:'男分腿坐女坐于男腿上互抱，男一手勾臀插入', ancient:'', op:'男子分腿而坐，女子坐于男子腿上，双手抱住男子。男子一手勾住女臀，插入。猿猴抱着树枝，身体悬垂，口中吱吱有声——"吟"字点出了声音。面对面坐姿交合，两人紧贴互抱，亲密程度很高，近处能听到彼此的呼吸和声响。与九法鹤交颈的区别：鹤交颈女方抱颈，吟猿抱树女方抱躯干；鹤交颈男方双手托臀辅助摇摆，吟猿抱树男方只用一手勾臀，另一手可以自由活动。', effect:'面对面坐姿极亲密，能听到彼此呼吸和声响。男方一手勾臀另一手自由，可同时抚摸女方其他部位。', tip:'与九法鹤交颈的核心区别：亲密感相当但多了一只自由的手。那只自由的手可以抚摸女方背部、头发、乳房或阴蒂，增加互动层次。坐姿对脊椎零压力，适合各年龄段。'
    ,naming:'猿猴抱着树枝时四肢紧紧抱住树干。「吟」字点出声音。和鹤交颈的区别：抱躯干而非抱颈，男方多出一只手。',sensory:'女方双手环抱男方躯干，比抱颈更踏实。男方空出的手可以同时去抚乳房、揉阴蒂，刺激层次多了一个维度。'
  },
{id:'ssf_maoshutongxue', name:'猫鼠同穴', source:'三十法', animal:'', depth:4, clit:2, energy:'高/高', type:'复合变换', tags:['复合式','体位变换','先女后男','刷新感'], desc:'先女上伏卧深插，再男翻身上位改背后攻击', ancient:'', op:'男子仰卧分腿，女子俯伏于男身上，深深插入。之后男子翻身，趴伏于女子背上，改从背后攻击。一法之内变换两次体位——先女上伏卧，再男上后入。猫和鼠同在一个洞穴里，先后易位。三十法里唯一包含体位转换的复合式，古人惜字如金，唯独这一法多写了半句"然后男子改变姿势"。', effect:'体位变换本身就是刺激来源——突然的视角切换、身体位置的重新调整，都能打断惯性、刷新感觉。一法两式，比单一体位丰富不止一倍。', tip:'体位转换的要领：中间不要完全抽出，保持结合状态翻转变换。注意翻身时不要压到女方头发或手臂。现代性学也建议在交合过程中适时变换体位，猫鼠同穴在一千多年前就把这个建议编成了标准操作。'
    ,naming:'猫和鼠同在一个洞穴里——先是你在上我在下，然后翻转过来。三十法里唯一包含体位转换的复合式。',sensory:'一次完整体位变换等于两次刷新：角度、方向、施力点全部改变。变换的中间过程本身就是刺激来源。'
  },
{id:'ssf_sanchunlv', name:'三春驴', source:'三十法', animal:'驴', depth:5, clit:1, energy:'中/中', type:'跪趴（后入）', tags:['跪趴','后入','直白','实用'], desc:'女跪趴双手撑床，男立于后双手抱腰插入', ancient:'', op:'女子双手撑床，取跪趴姿势。男子立于女股后，双手抱女腰，插入。驴在春天发情，行为直白粗放——女子四肢着地如驴，男子从后抱腰，整个画面毫不含蓄。三十法走到最后两式，文雅的意象用完了，开始说实话。其实就是膝肘位的简化版：女方双手撑床而非肘撑，上身更直，结合角度也不同。实用性很强，操作简单，不需要什么柔韧性。', effect:'后入跪趴式，操作简单不需要柔韧性，结合深度足。三十法最后两式回归朴素实用——不追求花哨，追求有效。', tip:'三十法中最接地气的实用体位之一，不需要柔韧性也不需要特殊体型匹配，大多数人可以直接操作。女方双手撑床比肘撑省力，上身更直视野更好。这是从"庙堂"到"田野"的审美递进中的倒数第二步。'
    ,naming:'驴在春天发情期的行为直白粗放。三十法走到第29式，文雅意象用尽，开始用农畜命名——从庙堂到田野的审美递进是有意为之的。',sensory:'女方双手撑床跪趴，臀部翘起。从后方视角看到的脊柱沟、腰窝、臀峰构成的S型曲线，视觉冲击本身就能加速快感累积。'
  },
{id:'ssf_sanqiugou', name:'三秋狗', source:'三十法', animal:'狗', depth:2, clit:1, energy:'极高/中', type:'跪趴（背对背）', tags:['跪趴','背对背','最难','收尾'], desc:'男女均背向跪趴臀贴臀，男低头以手扶入', ancient:'', op:'男女均取背向跪趴姿势，双手撑床，臀部相贴。男子尽量低头，以手将阳具送入。秋犬交合，背对背贴臀。这是三十法的收尾之作，体位上最难操作——两人背对背跪趴，臀部对臀部，男方还要低头用手辅助插入。实用性存疑，但编排上有一种"从最雅到最俗"的完整弧线：前四式引《诗经》、比麒麟，最后两式直接上驴和狗。', effect:'最极端最特殊的体位，三十法编排收尾用的"全"字诀。古人知道这个体位难操作，但三十法要的就是一个"全"字。', tip:'三十法在编排上有一条从雅到俗的完整弧线：从诗经风雅（叙绸缪）到麒麟瑞兽（麒麟角）到各种龙凤鱼蝶，最后收在两式直白的动物体位（驴和狗）。古人不是不知道这个体位难操作，但三十法要的就是一个"全"字——能想到的都编进去，能不能做到是你自己的事。'
    ,naming:'秋犬交配时背对背贴臀。三十法从《诗经》起笔到三秋狗收束，完成了一条从最雅到最俗的完整弧线。古人追求一个「全」字。',sensory:'男女均取背向跪趴，臀部对臀部，插入角度极其刁钻。操作难度极高。'
  },
  // 现代体位
  {id:'normal-pos',featured:true,name:'正常位',source:'现代',depth:3,clit:1,energy:'中/低',type:'男上',tags:['基础','日常'],desc:'女性仰卧双腿微分，男性俯卧其上手肘膝盖支撑。最经典的体位。',ancient:'',effect:'最自然省力的起手式。情感连接感强。体力消耗适中。',tip:'阴蒂刺激有限，需要腾手辅助。腰下垫枕头可解决角度不一致问题。腹胖或阴茎偏短者结合不够深。', naming:'"正常位"不是因为它比其他体位更"正确"，而是因为它最接近男女性交时身体自然契合的角度。女性仰卧、双腿微分、膝盖微弯，这个姿态是人在放松状态下骨盆最自然的倾斜位，男性俯卧其上、双膝双肘支撑体重，双方都不需要刻意扭曲身体去迎合对方。"正常"说的是生理默认值，不是道德判断。', detail:'女性仰卧，双腿自然弯曲微分，膝盖约120度角，脚掌踩床或自然外展。男性俯卧，双膝双肘四点支撑，膝盖承担约六成体重、双肘承担约四成，女性承受的实际压力很轻。进入后以骨盆前后推送为主导动作，节奏由男性控制，抽送幅度中等。女性可微调双腿张开角度：张得更开骨盆更开放、进入更深；并拢一些阴道口收紧、紧握感增强。腰下垫一个枕头是最简单也最被低估的技巧，能微调阴道轴线让进入更顺畅。', sensory:'女性感受偏温和，阴道整体被填充但缺乏针对某一区域的聚焦刺激，阴蒂只获得阴茎根部的间接压迫，力度和频率都不够。男性的快感来自阴道对阴茎的均匀包裹，没有特别强的局部摩擦力，属于"稳"的感受而非"刺激"。双方体温交换和心跳感知是这个体位天然的加分项，面对面的视觉和气息达成最强的亲密感。女性如果主动收缩盆底肌，可以显著提升双方的摩擦感。'},
  {id:'stretch-pos',name:'伸展位',source:'现代',depth:2,clit:1.5,energy:'低/低',type:'男上',tags:['紧握','勃起不足'],desc:'女性双腿并拢伸直，男性从外侧夹住。阴道口收紧，紧握感显著增强。',ancient:'',effect:'对勃起力偏弱者友好，紧致感帮助维持硬度。',tip:'结合深度比正常位浅。运动幅度受限易滑出。女性无法主动配合。', naming:'"伸展位"的名字来自女性双腿的姿态——从正常位的自然弯曲变成完全伸直并拢。这个腿部的简单改变带来了两个连锁反应：第一，大腿内侧肌群从两侧向内挤压阴道壁，像给阴道加了一层紧箍；第二，骨盆后倾让阴道轴线变平，进入角度变浅。所以"伸展"不仅描述了肢体的形态，也点出了这个体位的力学本质——用腿的角度来调节阴道的紧致度。', detail:'从正常位进入后，女性将双腿合拢并完全伸直，膝盖打直，脚尖可绷直也可放松。男性双腿从外侧夹住女性双腿，双膝着地支撑身体；也可将双腿并排放在女性腿上，更省力但女性承受的体重会增加。进入后抽送幅度天然受限，因为双腿夹紧后阴道口收紧、运动空间变小，阴茎以浅入浅出的小幅推送为主，频率可适当加快以补偿幅度不足。男性需注意避免幅度过大导致滑出——一旦滑出，这个姿势下重新进入比正常位困难。', sensory:'男性获得的包裹感和摩擦感显著增强，女性双腿并拢施加的侧向压力让阴道壁更紧密地贴附在阴茎上，即使勃起不充分也能感受到明显的紧握。女性的感受集中在阴道前壁，阴茎背侧沿前壁滑行对阴蒂区域产生间接压迫，比正常位略好但仍不够直接。阴道深处的刺激偏弱，快感主要来自浅层区域——阴道口周围的紧箍感和前壁的摩擦感。'},
  {id:'highwaist-pos',name:'高腰型',source:'现代',depth:4,clit:0.5,energy:'低/中高',type:'男上',tags:['初夜','阴茎偏短','深结合'],desc:'女性腰臀垫高10-15cm。阴茎沿阴道前壁进入，结合度深。初夜首选。',ancient:'',effect:'初夜疼痛降到最低。阴茎偏短者有效弥补长度不足。',tip:'阴蒂几乎无刺激。女方腰腹肌肉持续紧张会累。有一定技巧门槛。', naming:'"高腰型"的关键动作是把女性的腰臀部垫高10-15厘米。这一垫不仅改变了女性的身体高度——让男性可以挺直上身不再弯腰——更重要的是改变了阴道轴线的角度：垫高后骨盆前倾，阴道前壁的曲线变得更加水平，阴茎进入时自然沿着前壁滑行。所以"高腰"不仅是外观描述，它是利用重力+枕头重新构造一条对初夜友好的进入路径。', detail:'女性仰卧，用枕头或靠垫将腰臀部垫高约10-15厘米，双腿自然分开。男性可采取跪姿或半跪姿，上身挺直，配合女性腰部高度进入。另一种方式是女性臀部置于床沿、双腿自然下垂微分，男性站在床边进入。进入后以腰腹推送为主，男性上身挺直视野开阔，可以清楚地看到女性的全身反应。抽送节奏以舒缓平稳为佳，这个体位追求的是"舒适"而非"冲击"，突然的大幅抽送会破坏初夜场合需要的温和氛围。', sensory:'阴茎沿阴道前壁滑入，避开了处女膜附着区域和阴道后壁的易敏感组织，女性的主要感受是"顺滑"而非"撑胀"。深度充足但刺激性偏温和，因为进入角度太平，龟头几乎不接触阴蒂区域。女性能感受到腹部到盆腔区域的充胀感，而不是某个点的集中刺激。男性的快感来自开阔视野带来的视觉刺激和顺畅的抽送体验。女性腰臀悬空让腹肌持续紧张，时间超过十五分钟后腹部会有明显的酸胀感。'},
  {id:'flexion-pos',name:'屈曲位',source:'现代',depth:5,clit:0,energy:'中/中',type:'男上',tags:['最深','备孕','柔韧'],desc:'女性双腿弯曲贴向胸部。直角进入，所有正面体位中结合最深。备孕首选。',ancient:'',effect:'怀孕概率最高的体位之一。',tip:'阴蒂刺激极低。髋关节僵硬者会痛。孕中晚期绝对不能用。', naming:'"屈曲"描述的是女性双腿的动作——弯曲并贴向胸部，膝盖尽量靠近乳房。这个姿态让骨盆大幅度前倾，阴道口从水平朝向变成接近垂直朝向，阴茎进入路径从"滑入"变成"直入"。屈曲不只是腿的动作，它是一套连锁反应：腿屈→骨盆前倾→宫颈下降→阴道变短→结合极深。所以这个体位的名字其实是在描述它最核心的效果，是所有正面体位中进得最深的那个。', detail:'女性仰卧，双腿弯曲并贴向胸部，膝盖尽量靠近乳房，脚掌可以搭在男方肩上或悬在空中。男性采用跪姿上半身挺直，或与正常位相同姿势俯卧。进入后阴茎与阴道口接近直角，抽送方向不是前后滑动而是近乎垂直的推入和拔出。男性双手可以握住女方脚踝或小腿辅助固定，也能让女性腿部借力分担部分体重。节奏上建议先浅后深，先用前三分之一的浅幅抽送让女性适应，再逐步加深——直接极深推送会让大多数女性感到宫颈区域的不适。', sensory:'女性感受到的是一种深层的、弥漫在盆腔深处的充胀感和压力感，宫颈周围区域被直接触及，产生一种酸胀的钝感而非表面的摩擦快感。阴蒂在这个体位中几乎得不到刺激，快感来源从浅表转向深处。部分女性会觉得宫颈的触碰感过于刺激甚至不适，另一部分女性则恰好喜欢这种"深到极致"的充实感。男性的感受集中在龟头前端，宫颈口的环形触碰带来一种独特的前端压迫感。双腿贴胸让女性呼吸变急促，体力消耗偏大。'},
  {id:'reverse-pos',name:'反位（女上位）',source:'现代',depth:3.5,clit:2,energy:'低/中',type:'女上',tags:['女性主导','亲密'],desc:'男性仰卧，女性伏卧其上。上下位置互换，女性掌控节奏。',ancient:'',effect:'长期关系中换个视角换种心情。男性双手完全空闲。',tip:'阴道轴线和阴茎方向不完全一致。上下运动基本做不了。需要一定核心力量。', naming:'"反位"的名字来自标准的男上位被"反过来"——男性仰躺、女性伏卧在上。但"反"不只是位置的互换，它把主动权和控制权也反转了：标准男上位是男性控制节奏，反位是女性决定高低深浅。"反"字精确地描述了这个体位和正常位之间的镜像关系——同一个姿势，上下对调，体验完全不同。', detail:'男性仰卧、双腿自然分开。女性伏卧在男性身上，面对面，上身尽量挺直，双臂撑在男方身体两侧的床面上，也可以直接趴在男方胸膛上。下半身骨盆微微前倾，让阴道口对准阴茎。进入后女性以上身挺直或前倾来控制角度和深度——挺得越直进入越深、前倾越多进入越浅。运动方式以前后平移的骨盆滑动为主，不是上下起落，因为伏卧姿势天然限制了上下运动的幅度。男性双手完全空闲，可以同时爱抚乳房和阴蒂。', sensory:'女性上身挺直时，宫颈和阴道后壁直接与龟头接触，刺激集中而强烈，比正常位更容易触发阴道型高潮。乳房自然下垂的触感让男性双手的触觉反馈更充分。肌肤接触面积大——女性整个前身贴着男性胸膛——体温和心跳的互相传递形成很强的亲密基座。女性的快感主要来自骨盆前后的摩擦力以及宫颈区域的压力感，耻骨相贴时阴蒂能获得一定的压迫式刺激。体力上女性腰背和二头肌持续发力的酸胀感会在十分钟后明显增强。'},
  {id:'cowgirl-pos',name:'骑乘位',source:'现代',depth:4,clit:4,energy:'低/高',type:'女上',tags:['阴蒂刺激','女性主导','偏胖适用'],desc:'女性跨坐男性身上。女上位中阴蒂刺激最好的变型。',ancient:'',effect:'女性完全掌握主动权。偏胖男性不受腹部脂肪影响。',tip:'蹲骑式体力消耗在所有体位中排前列。有性羞耻感的女性被完全观看会紧张。孕晚期不宜。', naming:'"骑乘位"的名字直白——女性像骑手一样跨坐在男性身上，掌控方向和速度。这个比喻精准地抓住了女上位中自由度最大的一种变型：不是"骑乘"的粗野，而是"骑乘"的自由——前后、左右、旋转，想去哪个方向就去哪个方向。在所有体位中，骑乘位给女性的运动自由度排第一，不用问"这样舒服吗"，你自己试就知道了。这是女性探索自身快感最高效的练习场。', detail:'男性仰卧，女性跨坐其上，双腿可跪在两侧（跪骑式）或双脚踩床（蹲骑式）。跪骑式更省力、更稳；蹲骑式运动幅度更大但体力消耗翻倍，相当于持续深蹲。女性双手撑在男方腹部、胸部或两侧床面上。进入后女性自主控制运动——前倾时浅、后仰时深、摇摆时侧重侧壁摩擦、旋转时刺激更分散。节奏完全由女性决定，快慢深浅随时可调。男性可以伸手辅助刺激女方阴蒂或乳房。', sensory:'女性在坐下的过程中耻骨直接压迫男方耻骨和阴茎根部，阴蒂获得持续的挤压式刺激，这是所有女上位变型中阴蒂刺激最强的。如果女方配合前后摇摆而非单纯上下，阴蒂的摩擦刺激会更强——前后摇摆让阴蒂在耻骨上"研磨"，而不是简单的压一下放一下。阴道深处同时获得充胀感，G点区域在特定角度下能被龟头直接触压。男性被动仰躺，视觉刺激强烈——看到女方主动控制节奏本身就是很强的心理刺激。蹲骑式超过十分钟，女方大腿和臀部会明显发热发抖。'},
  {id:'front-side-pos',name:'前侧位',source:'现代',depth:1.5,clit:1,energy:'极低/极低',type:'侧卧',tags:['最省力','慢节奏','亲密'],desc:'双方面对面侧卧。所有体位中体力消耗最小。',ancient:'',effect:'体力消耗极低。隐私性强最安静的体位。',tip:'结合深度浅。男性活动自由度极低。下方腿压久了会麻。', naming:'"前侧位"的位置是双方面对面侧卧。"前"是面对面——能看到彼此的眼睛和表情；"侧"是身体都侧着——谁都不用承受对方的体重。这个名字概括了它的两个核心价值：情感连接没有打折（因为面对面），体力消耗降到最低（因为侧卧）。在所有性交体位中，前侧位把"亲密感/体力消耗"这个比值做到了最高。', detail:'双方面对面侧卧。女性上身稍向后仰接近仰卧状，下半身侧卧，骨盆微微前倾向男方。女性下方的腿放在男性腰间，上方的腿自然弯曲，膝盖搭在男方大腿上。男性以侧卧姿态进入，动作幅度天然受限——基本只能做小幅的骨盆前后摆动，抽送幅度小、频率慢。男方右手可从上方伸过来同时爱抚乳房和阴蒂，弥补体位本身对这两个区域刺激的不足。节奏以均匀、缓慢、持续为特点，不适合快节奏。', sensory:'双方呼吸互相可闻，近距离的面部接触让微表情和小动作变得格外清晰——闭眼、皱眉、嘴唇微动，都逃不开对方的视线。体温交换充分，长时间的肌肤接触形成一种温暖的、被困在柔软茧里的感觉。女性的阴道感受偏温和，小幅摆动带来的摩擦感远不如大幅体位，但胜在可以持续很久不疲劳。男性几乎不用出力，精力可以完全放在感受和观察上。下方那条腿被压住超过二十分钟会开始发麻。'},
  {id:'rear-side-pos',name:'后侧位',source:'现代',depth:2.5,clit:1,energy:'极低/极低',type:'侧卧',tags:['孕期首选','月经期','省力'],desc:'双方同向侧卧如大勺扣小勺。对腹部压迫最小，孕期首选。',ancient:'',effect:'孕期子宫颈部靠近骨盆底部，阴道变短，浅入恰好避开伤宫颈的风险。月经期也适用。',tip:'不面对面情感交流受限。阴蒂需用手补。阴道感度偏低的女性可能觉得不够。', naming:'"后侧位"是双方同向侧卧、男性从背后进入。"后"是背对人，"侧"是躺着做。这个体位对身体有一个独特的好处被名字直接藏过去了：它是所有体位中对腹部压迫最小的。同时"后"这个方向让男性的双手从后方伸到前方恰好覆盖整个外阴和乳房区域，手部辅助刺激的角度比面对面体位更方便——所以"后侧位"不只是"从后面侧躺着做"，它等于"零腹压+手补最优角度"。', detail:'双方同向侧卧，男性在女性背后如大勺扣小勺。男性上身后撤，与女性背部拉开一些距离以便进入，骨盆前倾向女方臀部。女性双腿微曲，膝盖微微前收，让臀部略向后突出。男性上方的腿弯曲放在女性腿间或搭在腿上，用来稳定身体和微调角度。进入后抽送幅度小、节奏温和，以持续性小幅推送为主。男性双手从背后伸到前方，一只手覆盖乳房、一只手刺激阴蒂——从背后伸手的弧线恰好让手掌自然落在外阴区域，不需要手腕别扭地转弯。', sensory:'身体被从背后完全包裹的感觉——男性的胸膛贴着女性后背，大腿贴着臀部，手臂从后方环抱——形成一种"被完全装进去"的安全感。阴道感受偏温和，小幅推送的摩擦感不强但持续稳定。女性的快感主要来自男方手部对阴蒂的精准刺激而非体位本身，所以这个体位对男性手法的依赖度很高。男性因为不承受体重、不消耗体力，可以长时间维持姿势和手部动作而不疲劳。双方的体温叠加在一起，冬天用这个体位比夏天舒服得多。'},
  {id:'rear-pos',name:'背后位',source:'现代',depth:2,clit:0,energy:'低/低',type:'背入',tags:['视觉刺激','偏瘦适用'],desc:'女性俯卧男性俯卧其上。臀部脂肪天然缓冲，骨骼不互撞。',ancient:'',effect:'双方偏瘦正常位骨骼碰撞疼的问题彻底解决。',tip:'结合深度最浅。阴蒂完全不在体位刺激范围内。女性基本无法自主运动。', naming:'"背后位"描述的是体位结构——女性俯卧、男性在其上方从背后进入。"背"是女方的背朝向男方，"后"是进入方向从后面来。这个体位的命名没有加任何评价词，但它的力学特征恰好揭示了它最适用的人群：女性臀部脂肪充当了天然的力学缓冲层，骨盆不会直接碰撞。所以"背后位"对偏瘦的伴侣来说不是为了追求某种视觉效果，而是为了避免骨头撞骨头——这是个被低估了实用性的体位。', detail:'女性俯卧在床上，双腿可张开或并拢。男性俯卧在女性身上，双腿根据需求放在女性腿内侧或外侧。进入后抽送方向是从后上方向前下方，阴道口朝下、阴茎朝前下方，方向不完全吻合，阴茎需要轻微弯曲适应角度。抽送幅度大了容易滑出，所以这个体位的运动以小幅度的短程推送为主。男性双手可以从女方身体两侧伸到前方，自由爱抚乳房或阴蒂——因为女性趴着，手从前方只能从上方往下够，角度不如后侧位方便。', sensory:'女性臀部的脂肪和肌肉对抽送的冲击力起到天然的消解作用，双方感受到的是"包裹"而非"撞击"——这对偏瘦的伴侣尤其明显，正常位时髂骨和耻骨撞得疼的问题在这里完全消失了。女性在这个体位中基本无法主动配合，感受偏被动——主要的生理刺激来自会阴、阴唇系带和阴道口后缘，阴蒂几乎完全不在体位本身的刺激范围内。男性的快感来自后方视角的视觉刺激和臀部软组织的贴合感。背向进入的本能满足感对很多男性来说是很强的心理刺激。'},
  {id:'knee-elbow-pos',name:'膝肘位',source:'现代',depth:4.5,clit:2.5,energy:'中/中',type:'背入',tags:['G点','阴道高潮','深刺激'],desc:'女性跪卧前倾，男性后方半跪。背向位中结合最深、刺激最强的变型。',ancient:'',effect:'最容易触发阴道型高潮的体位。男性控制频率和深度反复在G点区域施加刺激。',tip:'女性觉得没参与感可以主动收缩臀肌或做旋转配合。阴道负压吸入空气发出声响完全无害但可能分心。', naming:'"膝肘位"的名字来自女性支撑身体的两个支点——膝盖跪床、前臂或手肘撑床。这个四足姿态让臀部自然翘起，改变了整个阴道轴线的角度：原本向下倾斜的阴道变成了向上开口的弧形，阴茎进入时着力点从前壁转到后壁，龟头能顶到阴道深处。所以"膝肘位"的字面是姿势描述，但它的功能性定义是：背向位中结合最深、刺激最强的变型。', detail:'女性双膝跪床，上半身前倾趴下，用手肘支撑（肘撑式）或用枕头垫在胸部下方（枕撑式）。男性在后方半跪，上身挺直，双臂环抱女性臀部以调节角度和深度，或一手扶腰一手刺激阴蒂。进入后女性臀部翘起的角度决定了结合的深浅——翘得越高进入越深，但腰部悬空久了会酸，需要找到一个既能保持深度又不过度劳损的角度。抽送幅度和深度由男性完全控制，想浅就浅、想深就深。男性如果上身稍微前倾，可以亲吻女性的后颈和肩膀。', sensory:'龟头强烈接触到阴道后壁，摩擦感和压迫感在所有背向位中最强——男性获得的是阴茎整体被紧握+前端被集中刺激的双重感受。女性在阴道深处感受到持续的压力，G点区域在这个角度恰好处于龟头的着力路径上，容易触发阴道型高潮。阴茎下部在抽送时会压迫到阴蒂区域，力度不如正面位但优于其他背向位。女性因为前倾趴着，上半身处于被动松弛状态，注意力集中在骨盆区域的感觉上。一个不太雅但实际存在的感受：阴道负压吸入的空气在运动时被挤出会发出声响，阴道松弛的人尤其明显，虽然完全无害但可能让双方瞬间分心。'},
  {id:'front-sit-pos',name:'前坐位',source:'现代',depth:3,clit:3.5,energy:'中高/中',type:'坐位',tags:['全方位','孕期备选','阴蒂+阴道'],desc:'男性坐，女性面对面跨坐。少数不需手动辅助就能同时刺激阴蒂和阴道的体位。',ancient:'',effect:'紧致感增强勃起硬度延长持久时间。面对面方便亲吻对话。',tip:'男性腿腰同时发力时间一长大腿会酸。体型差距过大协调难。女性体重偏大或后仰过度男方腰椎压力大。', naming:'"前坐位"的核心是"坐"——男性坐着、女性面对男性跨坐。"前"是面对面，保留了亲吻、眼神和对话的可能。和前侧位类似，它把两个人的上半身拉到最近，但和前侧位不同的是，坐姿让骨盆角度更接近垂直，耻骨的自然压迫恰好抵在阴蒂区域。所以"前坐位"翻译成功能语言就是：一个让你能同时接吻、爱抚乳房、刺激阴蒂的体位——手的自由度最高。', detail:'男性坐在床上，盘腿或伸腿均可。女性面对男性跨坐其大腿上，骨盆微微前倾让阴道口对准阴茎，缓缓坐下纳入。男性双手环抱女性腰部辅助固定和缓冲，女性双手可环抱男性颈部。进入后女性以前后摇摆或骨盆旋转为主要运动方式，上下起落的幅度不用太大——坐姿天然限制了上下幅度。男性可以通过双腿的上下微动和环抱臀部的推拉来精确调节结合深度和节奏。男性可以把脸埋入女性怀中吸吮乳房。', sensory:'坐姿角度让耻骨直接压迫阴蒂区域，女性在骨盆前后摇摆时阴蒂在耻骨上自然滑动摩擦——这是少数不需要手动辅助就能同时刺激阴道和阴蒂的体位。阴道壁在坐姿角度下自然收紧，阴茎感受到的包裹感比仰卧时更致密。双方胸部紧贴，心跳和体温交换的亲密感很强。男性的快感来自多感官叠加——视觉上有近距离的面部表情、触觉上有双手自由爱抚的自由度、阴茎上有阴道紧致的包裹。女性体力消耗主要集中在腰部和大腿内侧。超过十五分钟男性的腿开始发酸的感受从大腿根部逐渐向上蔓延。'},
  {id:'rear-sit-pos',name:'后坐位',source:'现代',depth:4,clit:5,energy:'低/中',type:'坐位',tags:['阴蒂之王','综合刺激'],desc:'男性盘坐，女性背向跨坐。在所有体位中阴蒂综合刺激排第一。',ancient:'',effect:'只有阴蒂型高潮的女性最容易在此体位达到高潮。女性主导运动节奏完全自己掌控。',tip:'不面对面情感交流受限。男方盘腿久坐腿会麻。配合默契要求高——女方控运动男方控手部。', naming:'"后坐位"就是女性背对男性坐在他身上。"后"是背对，"坐"是体位类别。这个体位最大的价值不在于"后"或"坐"，而在于一个数据：在所有性交体位中，后坐位的阴蒂综合刺激效果排第一。原因是男性从背后环抱后双手恰好一前一后覆盖阴蒂和乳房，体位本身的骨盆压迫加上双手的精准刺激，形成三管齐下的刺激方案。所以"后坐位"听起来平平无奇，但它实际上是阴蒂型高潮女性的最佳选项之一。', detail:'男性盘腿坐在床上，女性背对男性坐于其大腿上，双腿跨在男性腿外侧。男性从背后环抱女性腰部，双手可同时覆盖乳房和阴蒂。女性上身微微前倾改变骨盆角度——前倾时进入更深、坐直时中等深度。进入后女性主导运动，前后、旋转、斜向，节奏和幅度全由她掌控。男性的核心任务不是运动，而是双手的精准刺激——一只手在乳房上、一只手在阴蒂上，两套动作要配合女方骨盆的节奏。女方运动得快，男性手部的刺激也要同步加快；女方放慢，手也放慢。', sensory:'女性同时获得三重刺激——阴道内的填充感、乳房的爱抚、阴蒂的直接摩擦——三种感觉在神经层面叠加后产生的快感远比单一项强烈。阴道轴线和阴茎方向基本一致，进入顺畅，女方前倾时可以达到相当深的结合。男性在这个体位中下半身基本不动，体力消耗主要集中在前臂和手腕，但触觉享受恰恰是最丰富的——指尖能感受到女方从呼吸到高潮全过程的乳房和阴蒂的细微变化。女方控制运动节奏带来心理上的主导感和自信。盘腿超过二十分钟男性腿部会明显发麻。'},
  {id:'standing-pos',name:'立位',source:'现代',depth:2,clit:0,energy:'高/高',type:'立位',tags:['场景自由','体力要求高'],desc:'男女皆站立从后方进入。唯一不需要床的体位。',ancient:'',effect:'心理刺激大于生理刺激。独特征服感和紧迫感。',tip:'身高差超过10cm基本不可行。体力消耗极大。新手失败率高。阴蒂基本无刺激。滑出后重新进入非常困难。', naming:'"立位"就是站着做——这是所有体位中唯一彻底摆脱"床"这个场景的。"立"不仅是姿态，它代表场景自由了：浴室、窗边、桌旁，什么地方都行。但立位的代价写在名字背面——站着交合时骨盆角度几乎被锁死，双腿既管支撑又管运动，双方的身高差会直接决定能不能做成。所以"立位"这个名字的另一层意思是：自由属于身材匹配且体力充沛的人。', detail:'双方站立，女性双腿微分、膝盖微曲、上身前倾、臀部后翘。男性同样微弯腰保持平衡，从女方斜前上方后方进入。男性双手环抱女性下腹部或握住乳房，既辅助双方身体稳定，又提供额外刺激。进入后运动以小幅度的骨盆推送为主，大幅抽送容易破坏站立平衡。女性可以用手扶墙、扶桌子或床沿来分担平衡压力。抽送节奏偏慢，因为站着做快动作会让人东倒西歪。这个体位需要双方反复练习才能找到稳定的节奏和角度。', sensory:'站立时身体的紧张感天然高于躺着——腿部肌肉持续紧绷、核心肌群全程参与维持平衡——身体的紧张会转化为性的亢奋，很多人觉得站着比躺着更"刺激"就是在利用这个原理。男性从背后进入的角度让阴茎的着力点偏向阴道深处，感觉偏于"深"而非"磨"，阴蒂在站立角度下基本得不到体位内刺激。后方站立的姿态天然带有一种征服感和紧迫感，心理刺激大于生理刺激。如果身高匹配合适，男性从背后亲吻女方脖颈和耳后是加分项。体力上双方腿部和腰部都在持续发力，超过十分钟就开始有酸胀感，疲惫时的体验很差。'}
];

// ===== 体位示意剪影图 =====
// 来源：Libido 开源图库，560w WebP，sepia 烘焙。
var POSE_MAP = {"longfan":{"file":"classic","match":"exact"},"hubu":{"file":"doggy_style","match":"exact"},"yuanbo":{"file":"shoulder_holder","match":"approximate","note":"图为跪姿托腿，本式为肩担其腿"},"chanfu":{"file":"prone_tiger","match":"exact"},"guiteng":{"file":"fold","match":"exact"},"fengxiang":{"file":"close_up","match":"approximate","note":"图为全身俯贴的男上，本式强调肘撑低伏"},"tushunhao":{"file":"reverse_cowgirl","match":"approximate","note":"图为反骑上身，本式强调慢、细、轻、柔"},"yujielin":{"file":"rider","match":"approximate","note":"图为骑乘，本式要求浅插"},"hejiaojing":{"file":"lotus_blossom","match":"exact"},"bayi_gujing":{"file":"star","match":"exact"},"bayi_anqi":{"file":"deckchair","match":"approximate","note":"图为仰卧抬腿，无高枕"},"bayi_licang":{"file":"slip","match":"exact"},"bayi_qianggu":{"file":"sidekick","match":"approximate","note":"图为侧卧不对称，未区分左右腿"},"bayi_tiaomai":{"file":"sidekick","match":"approximate","note":"与强骨同图，左右腿对称式"},"bayi_xuxue":{"file":"rider","match":"exact"},"bayi_yiye":{"file":"doggy_style","match":"approximate","note":"图为通用后入，无骨盆垫高"},"ssf_xuchoumou":{"file":"visitor","match":"approximate","note":"图为站立相拥，可作前戏氛围图"},"ssf_shenqianquan":{"file":null,"match":"none","note":"图库无握手类可用图"},"ssf_pusaiyu":{"file":null,"match":"none","note":"无对应图"},"ssf_qilinjiao":{"file":null,"match":"none","note":"无对应图"},"ssf_canchanmian":{"file":"fold","match":"approximate","note":"图为折腿，无四肢缠绕"},"ssf_longwanzhuan":{"file":"fold","match":"exact"},"ssf_yubimu":{"file":"catherine_wheel","match":"exact"},"ssf_yantongxin":{"file":"classic","match":"approximate","note":"图为标准男上，未体现直腿互抱"},"ssf_feicuijiao":{"file":"deckchair","match":"approximate","note":"图为同类姿势示意"},"ssf_yuanyanghe":{"file":"slip","match":"exact"},"ssf_kongfandie":{"file":"rider","match":"approximate","note":"图为骑乘，本式为对坐撑膝"},"ssf_beifeixiao":{"file":"reverse_cowgirl","match":"exact"},"ssf_yangaisong":{"file":"fold","match":"approximate","note":"图为折腿，无双腿交叉"},"ssf_lintanzhu":{"file":"visitor","match":"exact"},"ssf_luanshuangwu":{"file":"slide","match":"approximate","note":"图为俯卧相叠，本式为面对面贴合"},"ssf_fengjiangchu":{"file":"rider","match":"approximate","note":"体型差是本式附加条件，图未体现"},"ssf_haiouxiang":{"file":"right_angle","match":"exact"},"ssf_yemayue":{"file":"shoulder_holder","match":"approximate","note":"图为跪姿托腿，本式为双腿架肩"},"ssf_jichengzu":{"file":"deckchair","match":"approximate","note":"图为同类姿势示意"},"ssf_mayaoti":{"file":"shoulder_holder","match":"approximate","note":"图为托腿，本式为一腿搭肩"},"ssf_baihuteng":{"file":"deckchair","match":"approximate","note":"图为同类姿势示意"},"ssf_xuanchanfu":{"file":"prone_tiger","match":"approximate","note":"图为后入跪姿，本式为趴伏贴背"},"ssf_shanyangduishu":{"file":"lap_top","match":"exact"},"ssf_jilinchang":{"file":null,"match":"none","note":"无对应图"},"ssf_danxuefengyou":{"file":"fold","match":"approximate","note":"图为折腿，无自举腿"},"ssf_xuanmingpengzhu":{"file":"shoulder_holder","match":"approximate","note":"图为托腿，本式为双臂托双腿"},"ssf_yinyuanbaoshu":{"file":"lotus_blossom","match":"exact"},"ssf_maoshutongxue":{"file":null,"match":"none","note":"无对应图"},"ssf_sanchunlv":{"file":"standing_wheelbarrow","match":"exact"},"ssf_sanqiugou":{"file":"spider","match":"approximate","note":"图为背对背跪趴、臀贴臀，与本式姿态一致；性别特征弱，手部动作不可见"},"normal-pos":{"file":"classic","match":"exact"},"stretch-pos":{"file":"classic","match":"approximate","note":"图为标准男上，双腿分开；本式为并腿"},"highwaist-pos":{"file":"classic","match":"approximate","note":"图为标准男上，无腰臀垫高"},"flexion-pos":{"file":"fold","match":"exact"},"reverse-pos":{"file":"rider","match":"approximate","note":"图为跨坐骑乘，本式为伏卧其上"},"cowgirl-pos":{"file":"rider","match":"exact"},"front-side-pos":{"file":"catherine_wheel","match":"exact"},"rear-side-pos":{"file":"slip","match":"exact"},"rear-pos":{"file":"slide","match":"exact"},"knee-elbow-pos":{"file":"doggy_style","match":"exact"},"front-sit-pos":{"file":"lotus_blossom","match":"exact"},"rear-sit-pos":{"file":"lap_top","match":"exact"},"standing-pos":{"file":"from_behind","match":"exact"}};
var POSE_IMAGES = window.__POSE_IMAGES_LOCAL__ || {};
function poseFor(id) {
  var m = POSE_MAP[id];
  if (!m || !m.file) return null;
  var src = POSE_IMAGES[m.file];
  if (!src) return null;
  return { src: src, match: m.match, note: m.note || '' };
}

// ===== RENDER TECHNIQUES =====
let compareSlots = [];
function renderTechniques(filter, skipStagger) {
  const grid = document.getElementById('technique-grid');
  let filtered = techniques;
  if (filter === '九法') filtered = techniques.filter(t => t.source === '九法');
  else if (filter === '八益') filtered = techniques.filter(t => t.source === '八益');
  else if (filter === '三十法') filtered = techniques.filter(t => t.source === '三十法');
  else if (filter === '现代' || filter === '现代体位') filtered = techniques.filter(t => t.source === '现代');
  else if (filter === 'deep') filtered = techniques.filter(t => t.depth >= 4);
  else if (filter === 'clit') filtered = techniques.filter(t => t.clit >= 3);
  else if (filter === 'low-energy') filtered = techniques.filter(t => t.energy.startsWith('极低') || t.energy.startsWith('低/'));
  else if (filter === 'female-top') filtered = techniques.filter(t => t.type === '女上');

  const isAll = filter === '全部' || filter === 'all' || !filter;
  const isSource = ['九法','八益','三十法','现代','现代体位'].indexOf(filter) >= 0;
  const techTagData = function(t) {
    const tagItems = [];
    if (t.source !== '现代') tagItems.push({ text: t.source, cls: 'tag-source' });
    if (t.type) tagItems.push({ text: t.type, cls: 'tag-type' });
    if (t.animal) tagItems.push({ text: t.animal, cls: 'tag-free' });
    (t.tags || []).forEach(function(tg) { tagItems.push({ text: tg, cls: 'tag-free' }); });
    const seenTags = new Set();
    const uniqueTags = tagItems.filter(function(x) {
      if (!x.text || seenTags.has(x.text)) return false;
      seenTags.add(x.text);
      return true;
    });
    const visibleTags = uniqueTags.slice(0, 3);
    const extraCount = uniqueTags.length - visibleTags.length;
    const html = visibleTags.map(function(x) {
      return '<span class="card-tag ' + x.cls + '">' + x.text + '</span>';
    }).join('') + (extraCount > 0
      ? '<span class="card-tag tag-free tag-more" title="' + uniqueTags.slice(3).map(function(x) { return x.text; }).join('、') + '">+' + extraCount + '</span>'
      : '');
    return { html: html, unique: uniqueTags };
  };
  const compareBtn = function(t) {
    const label = compareSlots.includes(t.id) ? '取消' : '对比';
    return '<button class="btn-mini" onclick="event.stopPropagation();toggleCompare(\'' + t.id + '\',this)">' + label + '</button>';
  };
  const depthDots = function(n, filledCls) {
    const k = Math.round(n);
    return '<b>' + '●'.repeat(k) + '</b>' + '○'.repeat(5-k);
  };
  const cardHTML = function(t) {
    const gi = techniques.indexOf(t);
    const tagsHtml = techTagData(t).html;
    const depthStars = '●'.repeat(Math.round(t.depth)) + '○'.repeat(5-Math.round(t.depth));
    const clitStars = '●'.repeat(Math.round(t.clit)) + '○'.repeat(5-Math.round(t.clit));
    return `
    <div class="card tech-card" role="button" tabindex="0" id="tech-${gi}" data-source="${t.source}" onclick="openTechModal('${t.id}', this)">
      <div class="tech-card-head">
        <div class="card-tags">${tagsHtml}</div>
        ${compareBtn(t)}
      </div>
      <div class="card-title">${t.name}</div>
      <div class="card-subtitle">深度 ${depthStars} &nbsp; 阴蒂 ${clitStars} &nbsp; 体力 ${t.energy}</div>
      <div class="card-body">${t.desc}</div>
    </div>`;
  };
  const featuredHTML = function(t) {
    const gi = techniques.indexOf(t);
    const tagsHtml = techTagData(t).html;
    const depthStars = '●'.repeat(Math.round(t.depth)) + '○'.repeat(5-Math.round(t.depth));
    const clitStars = '●'.repeat(Math.round(t.clit)) + '○'.repeat(5-Math.round(t.clit));
    const pose = poseFor(t.id);
    const art = pose
      ? `<div class="tech-art tech-art-photo"><img class="ta-img" src="${pose.src}" alt="${t.name}姿势示意"></div>`
      : '';
    return `
    <div class="card tech-card tech-featured" role="button" tabindex="0" id="tech-${gi}" data-source="${t.source}" onclick="openTechModal('${t.id}', this)">
      ${art}
      <div class="tech-featured-body">
        <div class="tech-card-head"><div class="card-tags">${tagsHtml}</div>${compareBtn(t)}</div>
        <div class="card-title">${t.name}</div>
        <div class="card-subtitle">深度 ${depthStars} &nbsp; 阴蒂 ${clitStars} &nbsp; 体力 ${t.energy}</div>
        <div class="card-body">${t.desc}</div>
      </div>
    </div>`;
  };
  const denseHTML = function(t) {
    const gi = techniques.indexOf(t);
    const tag = (t.tags && t.tags[0]) || t.type || t.source;
    const cmpLabel = compareSlots.includes(t.id) ? '取消' : '对比';
    return `
    <div class="tech-dense-cell" role="button" tabindex="0" id="tech-${gi}" data-source="${t.source}" onclick="openTechModal('${t.id}', this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openTechModal('${t.id}', this)}">
      <button class="td-cmp" onclick="event.stopPropagation();toggleCompare('${t.id}',this)">${cmpLabel}</button>
      <div class="td-name">${t.name}</div>
      <div class="td-type">${t.type || t.source}</div>
      <div class="td-dots">深 ${depthDots(t.depth)} 阴 ${depthDots(t.clit)}</div>
      <span class="td-tag">${tag}</span>
    </div>`;
  };
  const buildGroup = function(k, items) {
    const feat = items.find(function(t) { return t.featured; }) || items[0];
    const rest = items.filter(function(t) { return t !== feat; });
    const dense = k === '三十法';
    const frontCount = items.filter(function(t) { return t.type === '前戏'; }).length;
    const note = dense
      ? '<div class="tech-dense-note"><div class="tdn-title">三十法索引</div>' +
        '<p class="tdn-text">前四式是前戏，其余是正题。六列密排，点任一格看完整操作。</p>' +
        '<div class="tdn-tags"><span class="card-tag tag-free">前戏 ' + frontCount + '</span>' +
        '<span class="card-tag tag-free">正题 ' + (items.length - frontCount) + '</span>' +
        '<span class="card-tag tag-free">深度 1–5</span></div></div>'
      : '';
    const head = '<h3 class="tech-group-title">' + ({'九法':'九法','八益':'八益','三十法':'三十法','现代':'现代体位'}[k] || k) +
      ' <span class="tech-group-count">· ' + items.length + '</span></h3>';
    return '<section class="tech-group">' + head +
      '<div class="tech-mix">' + featuredHTML(feat) + note + (dense ? '' : rest.map(cardHTML).join('')) + '</div>' +
      (dense ? '<div class="tech-dense">' + rest.map(denseHTML).join('') + '</div>' : '') +
    '</section>';
  };
  let html = '';
  if (isAll) {
    const order = ['九法', '八益', '三十法', '现代'];
    html = '<div class="tech-result-count">' + order.map(function(k) {
      return k + ' ' + techniques.filter(function(t) { return t.source === k; }).length;
    }).join(' · ') + ' · 共 ' + techniques.length + '</div>';
    html += order.map(function(k) {
      const items = techniques.filter(function(t) { return t.source === k; });
      return items.length ? buildGroup(k, items) : '';
    }).join('');
  } else if (isSource) {
    html = buildGroup(filter === '现代体位' ? '现代' : filter, filtered);
  } else {
    html = '<div class="card-grid cols3">' + filtered.map(cardHTML).join('') + '</div>';
  }
  grid.innerHTML = html || '<p class="empty-note">没有匹配的体位</p>';
  if (window.decorateCards) window.decorateCards(grid);
  // Stagger: first 8 of each group, 240ms / 24ms step
  if (!skipStagger) {
    const animate = function(c, i) {
      if (i >= 8) return;
      if (c.classList.contains('sr') && !c.classList.contains('sr-in')) return;
      c.style.opacity = '0';
      c.style.transform = 'translateY(8px)';
      c.style.transition = 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)';
      setTimeout(function() {
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, 24 + i * 24);
      clearEntranceStyles(c, 320 + i * 24);
    };
    const groups = grid.querySelectorAll('.tech-group');
    if (groups.length) groups.forEach(function(g) { g.querySelectorAll('.card').forEach(animate); });
    else grid.querySelectorAll('.card').forEach(animate);
  }
  srScan(grid);
  // List view
  const listEl = document.getElementById('technique-list');
  if (listEl) {
    let listHTML = '<div class="tech-list"><div class="tech-list-header"><span>名称</span><span>来源</span><span class="hide-mob">深度</span><span class="hide-mob">阴蒂</span><span>体力</span></div>';
    filtered.forEach((t,i) => {
      const ds = '●'.repeat(Math.round(t.depth)) + '○'.repeat(5-Math.round(t.depth));
      const cs = '●'.repeat(Math.round(t.clit)) + '○'.repeat(5-Math.round(t.clit));
      listHTML += `<div class="tech-list-item" onclick="openTechModal('${t.id}', this)">
        <span class="tech-list-name">${t.name}</span>
        <span class="tech-list-source">${t.source}</span>
        <span class="hide-mob tech-list-metric">${ds}</span>
        <span class="hide-mob tech-list-metric">${cs}</span>
        <span class="tech-list-metric">${t.energy}</span>
      </div>`;
    });
    listHTML += '</div>';
    listEl.innerHTML = listHTML || '<p class="empty-note">没有匹配的体位</p>';
    listEl.querySelectorAll('.tech-list-item').forEach(function(item) {
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
      if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    });
    // Stagger list item animation
    if (!skipStagger) {
      listEl.querySelectorAll('.tech-list-item').forEach(function(item, i) {
      if (i >= 8) return;
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      item.style.transition = 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)';
      setTimeout(function() {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 24 + i * 24);
      clearEntranceStyles(item, 320 + i * 24);
    });
    }
  }
}
let lastModalTrigger = null;
function rememberModalTrigger(el) {
  if (el && el.nodeType === 1) { lastModalTrigger = el; return; }
  const a = document.activeElement;
  lastModalTrigger = (a && a !== document.body) ? a : null;
}
function techTabLabel(text) {
  const t = (text || '').trim();
  if (t.indexOf('原文') >= 0) return '原文';
  if (t.indexOf('命名') >= 0 || t.indexOf('叫') >= 0) return '命名';
  if (t.indexOf('操作') >= 0 || t.indexOf('体位') >= 0) return '操作';
  if (t.indexOf('感受') >= 0 || t.indexOf('身体') >= 0) return '感受';
  if (t.indexOf('功效') >= 0 || t.indexOf('养生') >= 0) return '功效';
  if (t.indexOf('建议') >= 0 || t.indexOf('适用') >= 0) return '建议';
  return t.slice(0, 8) || '内容';
}
function collectTechSections(body) {
  const secs = Array.from(body.querySelectorAll(':scope > section'));
  const found = secs.map(function(s) {
    return { section: s, h4: s.querySelector(':scope > h4') };
  }).filter(function(x) { return !!x.h4; });
  if (found.length < 2) return [];
  found.forEach(function(x) {
    x.label = techTabLabel(x.h4.textContent);
    x.h4.remove();
    x.section.classList.add('modal-section');
    if (x.label.indexOf('建议') >= 0) x.section.classList.add('modal-tip');
  });
  return found.map(function(x) { return { section: x.section, label: x.label }; });
}
function collectGenericSections(body) {
  let root = body.querySelector(':scope > .prose');
  if (!root) {
    const directH4 = Array.from(body.children).filter(function(n) { return n.tagName === 'H4'; });
    if (directH4.length >= 2) root = body;
  }
  if (!root) return [];
  const nodes = Array.from(root.childNodes);
  const h4s = nodes.filter(function(n) { return n.nodeType === 1 && n.tagName === 'H4'; });
  if (h4s.length < 2) return [];
  const groups = [];
  const leading = [];
  let cur = null;
  nodes.forEach(function(n) {
    if (n.nodeType === 1 && n.tagName === 'H4') {
      cur = { label: (n.textContent || '').trim() || '内容', nodes: [n] };
      groups.push(cur);
    } else if (cur) {
      cur.nodes.push(n);
    } else {
      leading.push(n);
    }
  });
  function meaningful(list, ignoreH4) {
    return list.some(function(n) {
      if (ignoreH4 && n.nodeType === 1 && n.tagName === 'H4') return false;
      if ((n.textContent || '').trim()) return true;
      return n.nodeType === 1 && n.querySelector && !!n.querySelector('img,video,canvas,svg');
    });
  }
  if (meaningful(leading, false)) groups.unshift({ label: '总览', nodes: leading });
  const valid = groups.filter(function(g) { return meaningful(g.nodes, true); });
  if (valid.length < 2) return [];
  const frag = document.createDocumentFragment();
  const items = valid.map(function(g) {
    const sec = document.createElement('section');
    sec.className = 'modal-section';
    const wrap = document.createElement('div');
    wrap.className = 'prose';
    g.nodes.forEach(function(n) { wrap.appendChild(n); });
    sec.appendChild(wrap);
    frag.appendChild(sec);
    return { section: sec, label: g.label };
  });
  if (root === body) {
    body.innerHTML = '';
    body.appendChild(frag);
  } else {
    root.replaceWith(frag);
  }
  return items;
}
function setupModalSections(modal, body, nav, items) {
  if (!body || !nav || !items || items.length < 2) return null;
  const sections = items.map(function(x) { return x.section; });
  nav.innerHTML = '';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', '段落导航');
  const tabs = items.map(function(item, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'modal-tab-' + i;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'modal-sec-' + i);
    b.textContent = item.label;
    nav.appendChild(b);
    return b;
  });
  sections.forEach(function(s, i) {
    s.id = 'modal-sec-' + i;
    s.setAttribute('role', 'tabpanel');
    s.setAttribute('aria-labelledby', 'modal-tab-' + i);
    s.setAttribute('tabindex', '0');
  });
  let active = 0;
  let locked = false;
  let pinned = null;
  let lockTimer = 0;
  function setActive(i, revealTab) {
    if (i < 0 || i >= tabs.length) return;
    active = i;
    tabs.forEach(function(t, j) {
      const on = j === i;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
      t.tabIndex = on ? 0 : -1;
    });
    if (revealTab) {
      const tr = tabs[i].getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      if (tr.left < nr.left) nav.scrollLeft -= (nr.left - tr.left + 8);
      else if (tr.right > nr.right) nav.scrollLeft += (tr.right - nr.right + 8);
    }
  }
  function targetTop(i) {
    if (i === 0) return 0;
    const sr = sections[i].getBoundingClientRect();
    const br = body.getBoundingClientRect();
    return Math.max(0, body.scrollTop + (sr.top - br.top) - 8);
  }
  function goTo(i) {
    if (i < 0 || i >= sections.length) return;
    pinned = i;
    locked = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(function() { locked = false; }, 600);
    setActive(i, true);
    try {
      body.scrollTo({ top: targetTop(i), behavior: 'smooth' });
    } catch (e) {
      body.scrollTop = targetTop(i);
    }
  }
  tabs.forEach(function(tab, i) {
    tab.addEventListener('click', function() { goTo(i); });
  });
  nav.addEventListener('keydown', function(e) {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      goTo(next);
      try { tabs[next].focus({ preventScroll: true }); } catch (err) { tabs[next].focus(); }
    }
  });
  const io = new IntersectionObserver(function(entries) {
    if (locked || pinned !== null) return;
    const hits = entries.filter(function(e) { return e.isIntersecting; })
      .sort(function(a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    if (!hits.length) return;
    const idx = sections.indexOf(hits[0].target);
    if (idx >= 0) setActive(idx, true);
  }, { root: body, rootMargin: '-20% 0px -79% 0px', threshold: 0 });
  sections.forEach(function(s) { io.observe(s); });
  function syncActive() {
    if (pinned !== null) return;
    const line = body.scrollTop + body.clientHeight * 0.2;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line + 1) idx = i;
      else break;
    }
    setActive(idx, true);
  }
  function onScrollEnd() {
    const wasLocked = locked;
    locked = false;
    clearTimeout(lockTimer);
    if (!wasLocked) syncActive();
  }
  body.addEventListener('scrollend', onScrollEnd, { passive: true });
  function unpin() { pinned = null; }
  function onKeyScroll(e) {
    if (e.target && e.target.closest && e.target.closest('.tech-modal-nav')) return;
    if (['PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].indexOf(e.key) >= 0) pinned = null;
  }
  body.addEventListener('wheel', unpin, { passive: true });
  body.addEventListener('touchmove', unpin, { passive: true });
  body.addEventListener('pointerdown', unpin);
  body.addEventListener('keydown', onKeyScroll);
  const revealIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('sec-in'); revealIO.unobserve(e.target); }
    });
  }, { root: body, threshold: 0.05 });
  sections.forEach(function(s, i) {
    s.style.setProperty('--sec-delay', (Math.min(i, 4) * 40) + 'ms');
    revealIO.observe(s);
  });
  modal._cleanup = function() {
    io.disconnect();
    revealIO.disconnect();
    body.removeEventListener('scrollend', onScrollEnd);
    body.removeEventListener('wheel', unpin);
    body.removeEventListener('touchmove', unpin);
    body.removeEventListener('pointerdown', unpin);
    body.removeEventListener('keydown', onKeyScroll);
    clearTimeout(lockTimer);
  };
  setActive(0, false);
  body.scrollTop = 0;
  return { setActive: setActive, goTo: goTo };
}
function techOpFormat(text) {
  if (!text) return '';
  const keys = ['八浅二深','九浅一深','"死往生返"','浅要"磨"','不要"捅"','死往生返','浅要磨','不要捅','深要到底','到点就停','徐徐','疏缓','深按之','不泄','抽送','插入','浅插','深插'];
  const re = new RegExp('(' + keys.sort(function(a,b){return b.length-a.length;}).join('|') + ')', 'g');
  function mark(t) { return t.replace(re, '<strong class="op-key">$1</strong>'); }
  let n = 0;
  return text.split(/(?<=[。；])/).filter(Boolean).map(function(p) {
    if (/^(先|再|然后|随后|接着|最后|之后|第一步|第二步|男子|女子|男方|女方|双方|阳具|龟头|纳入|抽送|插入)/.test(p)) {
      n++;
      return '<span class="op-step"><span class="op-num">' + n + '</span><span class="op-step-text">' + mark(p) + '</span></span>';
    }
    return '<span class="op-para">' + mark(p) + '</span>';
  }).join('');
}
function techGram(n) {
  const k = Math.round(n);
  let out = '<span class="stat-gram" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) out += '<i class="' + (i <= k ? 'on' : '') + '"></i>';
  return out + '</span>';
}
function openTechModal(idx, trigger) {
  const t = typeof idx === 'string' ? techniques.find(x => x.id === idx) : techniques[idx];
  if (!t) return;
  const modal = document.getElementById('tech-modal');
  const content = document.getElementById('tech-modal-content');
  if (modal._cleanup) { modal._cleanup(); modal._cleanup = null; }
  rememberModalTrigger(trigger);
  const pose = poseFor(t.id);
  const poseCaption = pose
    ? '图为姿势示意，细节以正文为准' + (pose.match === 'approximate' ? '；与文本描述略有差异' : '')
    : '';
  const animalIcon = '';
  const headerTagItems = [];
  if (t.source) headerTagItems.push({ text: t.source, cls: 'tag-source' });
  if (t.type) headerTagItems.push({ text: t.type, cls: 'tag-type' });
  const seenHeaderTags = new Set();
  const headerTags = headerTagItems.filter(function(x) {
    if (!x.text || seenHeaderTags.has(x.text)) return false;
    seenHeaderTags.add(x.text);
    return true;
  }).map(function(x) {
    return '<span class="card-tag ' + x.cls + '">' + x.text + '</span>';
  }).join('');
  const figureHtml = pose
    ? `<figure class="tech-pose tech-modal-figure"><img src="${pose.src}" alt="${t.name}姿势示意"><figcaption>${poseCaption}</figcaption></figure>`
    : '';
  content.classList.toggle('has-media', !!pose);
  content.classList.remove('generic-modal');
  content.innerHTML = `
    <button class="tech-modal-close" onclick="closeTechModal()" aria-label="关闭">&times;</button>
    <div class="tech-modal-header">
      <div class="tech-kicker">${t.source}${t.type ? ' · ' + t.type : ''}</div>
      <div class="tech-name">${t.name}${animalIcon}</div>
      <div class="tech-subtitle">${headerTags}</div>
      <div class="tech-modal-stats">
        <div class="tech-stat"><span class="tech-stat-label">深度</span>${techGram(t.depth)}<span class="stat-legend">强→浅</span></div>
        <div class="tech-stat"><span class="tech-stat-label">阴蒂</span>${techGram(t.clit)}<span class="stat-legend">强→弱</span></div>
        <div class="tech-stat"><span class="tech-stat-label">体力</span>${t.energy}</div>
      </div>
    </div>
    <div class="tech-rule" aria-hidden="true"></div>
    <div class="tech-modal-nav" role="tablist" aria-label="段落导航"></div>
    <div class="tech-modal-body">
      ${figureHtml}
      ${t.ancient ? `<section><h4>古文原文</h4><div class="ancient-block">${t.ancient}</div></section>` : ''}
      ${t.naming ? `<section><h4>为什么叫「${t.name}」</h4><div class="naming-block">${t.naming}</div></section>` : ''}
      <section class="op-section"><h4>体位与操作</h4><div class="prose op-prose">${techOpFormat(t.detail || t.op)}</div></section>
      ${t.sensory ? `<section><h4>身体感受</h4><div class="sensory-block">${t.sensory}</div></section>` : ''}
      <section><h4>养生功效</h4><div class="prose">${t.effect}</div></section>
      <section><h4>实操建议与适用人群</h4><div class="prose">${t.tip}</div></section>
    </div>
  `;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  const body = content.querySelector('.tech-modal-body');
  const nav = content.querySelector('.tech-modal-nav');
  const items = body ? collectTechSections(body) : [];
  if (items.length >= 2) setupModalSections(modal, body, nav, items);
  else {
    if (nav) nav.hidden = true;
    if (body) body.querySelectorAll(':scope > section').forEach(function(s) { s.classList.add('sec-in'); });
  }
  if (body) body.scrollTop = 0;
  trapFocus(modal);
  try { history.pushState({modal:'tech'}, ''); } catch(e) {}
  setTimeout(function() {
    if (body) body.scrollTop = 0;
    const closeBtn = modal.querySelector('.tech-modal-close');
    if (closeBtn) closeBtn.focus();
  }, 50);
}
function hideTechModal() {
  const modal = document.getElementById('tech-modal');
  if (!modal) return;
  if (modal._cleanup) { modal._cleanup(); modal._cleanup = null; }
  modal.classList.remove('show');
  document.body.style.overflow = '';
  const trigger = lastModalTrigger;
  lastModalTrigger = null;
  if (trigger && trigger.isConnected) {
    try { trigger.focus({ preventScroll: true }); } catch (e) {}
  }
}
function closeTechModal() {
  hideTechModal();
  if (history.state && history.state.modal === 'tech') history.back();
}
function trapFocus(modalEl) {
  if (modalEl._focusTrapped) return;
  modalEl._focusTrapped = true;
  modalEl.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    const focusable = modalEl.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
function genericModalMeta(tagsHtml) {
  var out = { kicker: '', tags: '', sub: '' };
  if (!tagsHtml) return out;
  var box = document.createElement('div');
  box.innerHTML = tagsHtml;
  var tagEls = Array.prototype.slice.call(box.querySelectorAll('.card-tag'));
  var subEl = box.querySelector('.card-subtitle');
  if (subEl) out.sub = subEl.textContent.trim();
  out.tags = tagEls.map(function(t) {
    return '<span class="' + t.className + '">' + t.textContent.trim() + '</span>';
  }).join('');
  var texts = tagEls.map(function(t) { return t.textContent.trim(); }).filter(Boolean);
  out.kicker = texts.join(' · ').replace(/\s*·\s*/g, ' · ');
  if (!texts.length && !subEl) out.kicker = box.textContent.trim().replace(/\s+/g, ' ');
  return out;
}
function openGenericModal(title, html, meta, trigger) {
  try {
    const modal = document.getElementById('tech-modal');
    const content = document.getElementById('tech-modal-content');
    if (!modal || !content) { console.error('Modal elements not found'); return; }
    if (modal._cleanup) { modal._cleanup(); modal._cleanup = null; }
    rememberModalTrigger(trigger);
    meta = meta || {};
    var gm = genericModalMeta(meta.tags || '');
    var bodyPreview = meta.bodyPreview || '';
    content.classList.remove('has-media');
    content.classList.add('generic-modal');
    content.innerHTML = `
      <button class="tech-modal-close" onclick="closeTechModal()" aria-label="关闭">&times;</button>
      <div class="tech-modal-header">
        ${gm.kicker ? '<div class="tech-kicker">' + gm.kicker + '</div>' : ''}
        <div class="tech-name">${title}</div>
        ${gm.sub ? '<div class="gm-sub">' + gm.sub + '</div>' : ''}
        ${gm.tags ? '<div class="tech-subtitle modal-tags">' + gm.tags + '</div>' : ''}
        ${bodyPreview ? '<p class="modal-preview">' + bodyPreview + '</p>' : ''}
      </div>
      <div class="tech-rule" aria-hidden="true"></div>
      <div class="tech-modal-nav" role="tablist" aria-label="字段导航"></div>
      <div class="tech-modal-body">${html}</div>
    `;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    const body = content.querySelector('.tech-modal-body');
    const nav = content.querySelector('.tech-modal-nav');
    const items = body ? collectGenericSections(body) : [];
    if (items.length >= 2) setupModalSections(modal, body, nav, items);
    else if (nav) nav.hidden = true;
    if (body) decorateGenericProse(body);
    if (body) body.scrollTop = 0;
    try { history.pushState({modal:'tech'}, ''); } catch(e) {}
    trapFocus(modal);
    setTimeout(function() {
      if (body) body.scrollTop = 0;
      const closeBtn = content.querySelector('.tech-modal-close');
      if (closeBtn) closeBtn.focus();
    }, 50);
  } catch(e) {
    console.error('openGenericModal error:', e);
  }
}

function decorateGenericProse(body) {
  if (!body) return;
  var firstP = body.querySelector('p');
  body.querySelectorAll('p').forEach(function(p) {
    if (p === firstP) return;
    if (p.textContent.length < 40) return;
    if (p.querySelector('.p-lead, strong:first-child')) return;
    var prev = p.previousElementSibling;
    if (prev && prev.tagName === 'H4') return;
    var tn = null;
    for (var i = 0; i < p.childNodes.length; i++) {
      var n = p.childNodes[i];
      if (n.nodeType === 3) { if (n.textContent.trim()) { tn = n; break; } }
      else if (n.nodeType === 1) { tn = null; break; }
    }
    if (!tn) return;
    var m = /^([^。！？：]{2,42}[。！？：])/.exec(tn.textContent);
    if (!m) return;
    if (tn.textContent.slice(m[1].length).trim().length < 8) return;
    tn.splitText(m[1].length);
    var lead = document.createElement('strong');
    lead.className = 'p-lead';
    lead.textContent = m[1];
    tn.parentNode.replaceChild(lead, tn);
    p.classList.add('has-lead');
  });
  var targets = [];
  var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (!/\d/.test(node.textContent)) return NodeFilter.FILTER_REJECT;
      var pe = node.parentElement;
      if (!pe || !pe.closest('p')) return NodeFilter.FILTER_REJECT;
      if (pe.closest('strong, b, h4, code, .num-em')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walker.nextNode()) targets.push(walker.currentNode);
  targets.forEach(function(node) {
    var text = node.textContent;
    var re = /(\d+(?:\.\d+)?%?)/g, last = 0, m;
    var frag = document.createDocumentFragment();
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var b = document.createElement('b');
      b.className = 'num-em';
      b.textContent = m[1];
      frag.appendChild(b);
      last = m.index + m[1].length;
    }
    if (!last) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
}

function openCardModal(cardEl) {
  try {
    const title = cardEl.querySelector('.card-title')?.textContent || '';
    const panel = cardEl.querySelector('.expand-panel');
    if (panel && panel.innerHTML.trim()) {
      // Extract metadata from the card
      var tagEls = cardEl.querySelectorAll('.card-tag');
      var tagsHtml = '';
      tagEls.forEach(function(t) { tagsHtml += t.outerHTML + ' '; });
      var bodyEl = cardEl.querySelector('.card-body');
      var bodyPreview = bodyEl ? bodyEl.textContent.substring(0, 100) : '';
      var subtitleEl = cardEl.querySelector('.card-subtitle');
      if (subtitleEl) tagsHtml += subtitleEl.outerHTML;
      openGenericModal(title, panel.innerHTML, {
        tags: tagsHtml,
        bodyPreview: bodyPreview
      }, cardEl);
    } else {
      console.warn('openCardModal: no expand-panel content found for', title);
    }
  } catch(e) {
    console.error('openCardModal error:', e);
  }
}
let techViewMode = 'grid';
var _viewSwitching = false;
function toggleTechView(el) {
  if (_viewSwitching) return;
  _viewSwitching = true;
  var isList = el.classList.toggle('list-mode');
  el.setAttribute('aria-checked', isList ? 'true' : 'false');
  el.querySelector('.view-toggle-grid').classList.toggle('active', !isList);
  el.querySelector('.view-toggle-list').classList.toggle('active', isList);
  var grid = document.getElementById('technique-grid');
  var list = document.getElementById('technique-list');
  var hide = isList ? grid : list;
  var show = isList ? list : grid;
  // Freeze show element during transition
  show.hidden = true;
  // Quick fade out current view
  hide.style.transition = 'opacity 180ms var(--ease-out)';
  hide.style.opacity = '0';
  setTimeout(function() {
    hide.hidden = true;
    hide.style.opacity = '';
    hide.style.transition = '';
    // Re-render content while hidden
    techViewMode = isList ? 'list' : 'grid';
    var af = document.querySelector('#page-techniques .filter-bar .filter-chip.active');
    renderTechniques(af ? af.textContent : 'all', true); // true = skip stagger
    // Show and fade in
    show.hidden = false;
    show.style.opacity = '0';
    void show.offsetWidth;
    show.style.transition = 'opacity 180ms var(--ease-out)';
    show.style.opacity = '1';
    // Trigger stagger after fade in starts
    setTimeout(function() {
      var items = show.querySelectorAll('.card, .tech-list-item');
      items.forEach(function(c, i) {
        if (i >= 8) return;
        c.style.opacity = '0';
        c.style.transform = 'translateY(8px)';
        c.style.transition = 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)';
        setTimeout(function() {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, 24 + i * 24);
        clearEntranceStyles(c, 320 + i * 24);
      });
    }, 30);
    setTimeout(function() { show.style.transition = ''; show.style.opacity = ''; _viewSwitching = false; }, 240);
  }, 190);
}
function filterTechniques(filter,btn) { document.querySelectorAll('#page-techniques .filter-bar .filter-chip').forEach(c=>{c.classList.remove('active');c.setAttribute('aria-selected','false')}); btn.classList.add('active');btn.setAttribute('aria-selected','true'); renderTechniques(filter); }
function updateCompareBar() {
  let bar = document.getElementById('compare-bar');
  const n = compareSlots.length;
  if (!bar && n === 0) return;
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'compare-bar';
    bar.className = 'compare-bar';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    document.body.appendChild(bar);
  }
  if (n === 0) { bar.hidden = true; bar.innerHTML = ''; document.body.classList.remove('compare-bar-open'); return; }
  bar.hidden = false;
  document.body.classList.add('compare-bar-open');
  bar.innerHTML = '<span class="compare-bar-count">已选 <b>' + n + '</b>/3</span>' +
    '<span class="compare-bar-hint">' + (n < 2 ? '再选 ' + (2 - n) + ' 个可对比' : '可并排对比') + '</span>' +
    '<button class="compare-bar-view" ' + (n < 2 ? 'disabled' : '') + ' onclick="showCompare()">查看对比</button>' +
    '<button class="compare-bar-clear" onclick="clearCompare()">清空</button>';
}
function toggleCompare(id,btn) {
  if(compareSlots.includes(id)){compareSlots=compareSlots.filter(s=>s!==id);}
  else if(compareSlots.length<3){compareSlots.push(id);}
  else { btn.textContent='最多3个'; setTimeout(function(){ btn.textContent='对比'; }, 1200); return; }
  if(compareSlots.length>=2)showCompare();else closeCompare();
  const af=document.querySelector('#page-techniques .filter-bar .filter-chip.active');
  renderTechniques(af?af.textContent:'all', true);
  updateCompareBar();
}
function showCompare(){
  if(compareSlots.length<2)return;
  const grid=document.getElementById('compare-grid');
  const sel=compareSlots.map(id=>techniques.find(t=>t.id===id)).filter(Boolean);
  grid.innerHTML=sel.map(t=>`<div class="compare-col"><h4>${t.name}<span class="compare-source">${t.source}${t.animal?'·'+t.animal:''}</span></h4>${t.ancient?`<div class="quote">${t.ancient}</div>`:''}<div class="label">操作要领</div><div class="prose">${t.op || t.detail}</div><div class="label">功效</div><div class="prose">${t.effect}</div><div class="label">建议</div><div class="prose">${t.tip}</div><div class="compare-metrics">深度${'●'.repeat(Math.round(t.depth))}${'○'.repeat(5-Math.round(t.depth))} 阴蒂${'●'.repeat(Math.round(t.clit))}${'○'.repeat(5-Math.round(t.clit))} 体力${t.energy}</div></div>`).join('');
  document.getElementById('compare-modal').classList.add('show');document.body.style.overflow='hidden';
  trapFocus(document.getElementById('compare-modal'));
  try { history.pushState({modal:'compare'}, ''); } catch(e) {}
}
function closeCompare(){
  document.getElementById('compare-modal').classList.remove('show');
  document.body.style.overflow='';
  if(history.state && history.state.modal === 'compare') history.back();
}
function clearCompare(){compareSlots=[];closeCompare();const af=document.querySelector('#page-techniques .filter-bar .filter-chip.active');renderTechniques(af?af.textContent:'all', true);updateCompareBar();}

// ===== FREQUENCY DATA =====
const freqData = {
  '20': {sunv:{strong:'一日二次',weak:'一日一次'},yufang:'二日一次',qianjin:'四日一次'},
  '30': {sunv:{strong:'一日一次',weak:'二日一次'},yufang:'三日一次',qianjin:'八日一次'},
  '40': {sunv:{strong:'三日一次',weak:'四日一次'},yufang:'四日一次',qianjin:'十六日一次'},
  '50': {sunv:{strong:'五日一次',weak:'十日一次'},yufang:'五日一次',qianjin:'二十日一次'},
  '60': {sunv:{strong:'十日一次',weak:'二十日一次'},yufang:'慎勿泄',qianjin:'闭精勿泄（体强可一月一泄）'},
  '70': {sunv:{strong:'三十日一次',weak:'不泄'},yufang:'—',qianjin:'—'}
};
function renderFreqSelector() {
  const ages = ['20','30','40','50','60','70'];
  const sel = document.getElementById('freq-age-selector');
  sel.innerHTML = ages.map(a => `<button class="freq-age-btn" onclick="showFreq('${a}',this)">${a}岁</button>`).join('');
  sel.querySelector('.freq-age-btn').click();
}
function showFreq(age,btn) {
  document.querySelectorAll('.freq-age-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = freqData[age];
  document.getElementById('freq-display').innerHTML = `
    <div class="freq-version"><h5>素女经（强档/弱档）</h5><div class="freq-value">${d.sunv.strong}</div><div class="freq-note">弱者 ${d.sunv.weak}</div></div>
    <div class="freq-version"><h5>玉房秘诀</h5><div class="freq-value">${d.yufang}</div><div class="freq-note">一刀切，不分强弱</div></div>
    <div class="freq-version"><h5>千金方（孙思邈）</h5><div class="freq-value">${d.qianjin}</div><div class="freq-note">最保守，活了一百多岁的人的标准</div></div>
  `;
}

// ===== 八益 DATA =====
const bayiData = [
  {name:'固精',pos:'面对面侧卧',num:'18次',freq:'每日2次',course:'15天',effect:'固摄精液，兼治女子月经过多',detail:'八益入门首关，抽送次数最少（18次），每日频次最低（2次），疗程适中（15天）。此关训练的是"到点就停"的纪律——十八次抽送完毕必须停止，不可贪多。很多早泄者的问题不是太敏感，是不知道什么时候该停。固精法训练的就是这个判断力。侧卧位男方体力消耗极低，所有注意力都可以放在控制射精这件事上。十八次抽送是一个很小的量，正常男人在这个次数内完全不会接近射精阈值。'},
  {name:'安气',pos:'女仰高枕',num:'27次',freq:'每日3次',course:'20天',effect:'安气和脉，兼治女子阴门寒冷',detail:'阴门寒是什么感觉？女方外阴部位温度偏低，即使在温暖环境中摸上去也是凉的，性唤起缓慢甚至完全唤不起，阴道分泌物极少。安气法选择的是标准仰卧正面位，男方跪姿女方高枕，这个角度让阳具沿着阴道前壁进入，前壁血流最丰富，反复抽送摩擦等于在给局部做热敷和按摩。二十天疗程，每天三次，持续血流刺激逐渐改善局部微循环。"安气"二字说的就是气顺则血行、血行则温通的道理。'},
  {name:'利藏',pos:'背向侧卧',num:'36次',freq:'每日4次',course:'20天',effect:'心气和平，兼治女子冷感',detail:'利藏治的是冷感，和安气治的阴门寒有交叉但不完全相同。阴门寒是局部温度低，冷感是整体性欲低下、反应迟钝。冷感的原因很复杂，有生理的有心理的，但中医认为核心在于"藏"的功能出了问题——肾主藏精、肝主藏血，五脏的"藏"功能失调，性欲的物质基础就不够。侧卧背入的好处：体力消耗低适合高频次、背入式对深处刺激比正面位强、女方身体最容易放松没有面对面的心理压力。'},
  {name:'强骨',pos:'侧卧屈左膝',num:'45次',freq:'每日5次',course:'10天',effect:'通利关节，兼治女子月经久闭',detail:'十天短疗程，每天五次高频次，短时间内用大量重复动作"打通"淤滞的气血。强骨法的独特之处在于不对称体位——女子侧卧左膝弯曲向胸右腿伸直，这种一侧屈一侧伸的姿态让骨盆两侧受力不均，骶髂关节和腰椎被迫在非对称状态下工作，恰好是一种关节活动度训练。月经久闭属于实证，经血淤滞不通，需要较强烈的短期刺激来打通。'},
  {name:'调脉',pos:'侧卧屈右膝',num:'54次',freq:'每日6次',course:'20天',effect:'通调脉络，兼治女子膣痉挛',detail:'阴道痉挛的女性，阴道壁肌肉处于持续紧张状态，像一根绷紧的弦，一碰就弹。调脉法的治疗原理类似于脱敏疗法：用反复的、温和的、可控的刺激，让紧张的肌肉慢慢松弛下来。男方耐心比体力重要得多。二十天疗程，每天六次，是系统性脱敏的标准配置。如果男方急躁粗暴，反而会加重痉挛。与强骨法配合，强骨弯左腿调脉弯右腿，左右交替使两侧均衡。'},
  {name:'蓄血',pos:'女上位',num:'63次',freq:'每日7次',course:'10天',effect:'强力蓄气，兼治月经不调',detail:'八益法中第一个女上位体位，主被动彻底翻转。女子跨跪骑乘主动上下，掌控插入的深度、角度和节奏。骨盆底肌群（PC肌、提肛肌等）全程主动收缩发力，六十三次的骑乘运动相当于一组中等强度的凯格尔运动。月经不调的女性，盆底血流通常也不好，骑乘位的主动运动直接促进盆腔区域血液循环。十天疗程，男方仰躺体力消耗接近零。'},
  {name:'益液',pos:'女俯垫高',num:'72次',freq:'每日8次',course:'10天',effect:'充实骨质',detail:'八益法中强度最高的一益。七十二次是八益中最大抽送量，加上垫高后入的深度插入，三项叠加对双方体力和控制力都是考验。腹胯下垫枕的高度需要调试：太高女子腰部悬空时间长会酸痛，太低则臀部抬升不够角度不佳。以腹部贴床、臀部自然翘起、腰部无明显不适为准。益液重点不在骨骼本身而在骨髓——"肾主骨、生髓"，骨髓充实则骨骼强健。'}
];
function renderBayi() {
  const grid = document.getElementById('bayi-grid');
  if (!grid) return;
  grid.className = 'bayi-grid';
  grid.innerHTML = bayiData.map(function(b, i) {
    return '<div class="bayi-cell">' +
      '<div class="bayi-cell-head"><span class="bayi-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="bayi-name">' + b.name + '</span><span class="bayi-pos">' + b.pos + '</span></div>' +
      '<div class="bayi-stats">' +
        '<span><b>' + b.num + '</b>抽送</span>' +
        '<span><b>' + b.freq + '</b>频率</span>' +
        '<span><b>' + b.course + '</b>疗程</span>' +
      '</div>' +
      '<div class="bayi-effect">' + b.effect + '</div>' +
      '<button class="btn-mini" onclick="openBayiDetail(' + i + ')">详情</button>' +
    '</div>';
  }).join('') +
  '<div class="bayi-note"><span class="bayi-num">注</span><span>抽送次数以 9 为基数递增：18→27→36→45→54→63→72。前几益温和缓慢，适合体质较弱或初次接触；后几益强度陡增，适合有一定基础的人。</span></div>';
  srScan(grid);
}
function openBayiDetail(i) {
  const b = bayiData[i];
  if (!b) return;
  openGenericModal(b.name + ' · ' + b.pos, '<p>' + b.detail + '</p>', {
    tags: '<span class="card-tag tag-source">八益</span><span class="card-tag tag-attr">' + b.num + '</span>'
  });
}
function decorateHealthBands() {
  const root = document.getElementById('health-practice');
  if (!root || root.querySelector('.health-band')) return;
  const direct = Array.from(root.children);
  function findH3(prefix) {
    return direct.find(function(el) { return el.tagName === 'H3' && el.textContent.trim().indexOf(prefix) === 0; });
  }
  function takeBlock(h3) {
    if (!h3) return [];
    const nodes = [];
    let el = h3;
    while (el && !(el !== h3 && el.tagName === 'H3')) {
      nodes.push(el);
      el = el.nextElementSibling;
    }
    return nodes;
  }
  const map = {
    decline: takeBlock(findH3('精力五衰')),
    ten: takeBlock(findH3('十动不泄')),
    breath: takeBlock(findH3('腹式呼吸五步法')),
    bayi: takeBlock(findH3('八益处方速览'))
  };
  const ids = { decline: 'health-decline', ten: 'health-ten', breath: 'health-breath', bayi: 'health-bayi' };
  ['decline', 'ten', 'breath', 'bayi'].forEach(function(k) {
    if (map[k][0]) map[k][0].id = ids[k];
  });
  function makeBand(num, title, desc, groups) {
    const sec = document.createElement('section');
    sec.className = 'health-band';
    const rail = document.createElement('div');
    rail.className = 'band-rail';
    rail.innerHTML = '<div class="band-num">' + num + '</div><div class="band-title">' + title + '</div><div class="band-desc">' + desc + '</div>';
    const body = document.createElement('div');
    body.className = 'band-body';
    groups.forEach(function(nodes) { nodes.forEach(function(n) { body.appendChild(n); }); });
    sec.appendChild(rail);
    sec.appendChild(body);
    return sec;
  }
  const frag = document.createDocumentFragment();
  frag.appendChild(makeBand('01', '基础', '五衰预警与呼吸法', [map.decline, map.breath]));
  frag.appendChild(makeBand('02', '处方', '八益：次数、频次、疗程', [map.bayi]));
  frag.appendChild(makeBand('03', '自检', '十动阶梯、频次对照与 13 个不要', [map.ten]));
  root.insertBefore(frag, root.firstChild);
  const firstBody = root.querySelector('.health-band .band-body');
  if (firstBody) {
    const flow = document.createElement('div');
    flow.className = 'flow-row';
    flow.innerHTML =
      `<button type="button" class="flow-node" onclick="scrollToHealth('health-breath')"><span class="flow-num">01</span><span class="flow-name">呼吸</span><span class="flow-desc">五步沉丹田</span></button>` +
      `<span class="flow-arrow" aria-hidden="true">→</span>` +
      `<button type="button" class="flow-node" onclick="scrollToHealth('sec-daoyin')"><span class="flow-num">02</span><span class="flow-name">导引</span><span class="flow-desc">六区肢体导引</span></button>` +
      `<span class="flow-arrow" aria-hidden="true">→</span>` +
      `<button type="button" class="flow-node" onclick="scrollToHealth('health-bayi')"><span class="flow-num">03</span><span class="flow-name">还精</span><span class="flow-desc">控精与八益处方</span></button>`;
    firstBody.insertBefore(flow, firstBody.firstChild);
  }
  const tenH3 = root.querySelector('#health-ten');
  if (tenH3) tenH3.insertAdjacentHTML('afterbegin', '<span class="selfcheck-num">01</span> ');
  const thirdBody = root.querySelectorAll('.health-band .band-body')[2];
  if (thirdBody) {
    const row = document.createElement('div');
    row.className = 'selfcheck-row';
    row.innerHTML =
      `<button type="button" class="selfcheck-card" onclick="openHealthTab('knowledge','health-freq')"><span class="selfcheck-num">02</span><span class="selfcheck-title">频次对照</span><span class="selfcheck-desc">20–70 岁 × 素女经 / 玉房秘诀 / 千金方</span></button>` +
      `<button type="button" class="selfcheck-card" onclick="openHealthTab('knowledge','health-donts')"><span class="selfcheck-num">03</span><span class="selfcheck-title">13 个不要</span><span class="selfcheck-desc">禁忌清单，逐条对照</span></button>`;
    thirdBody.appendChild(row);
  }
  const five = root.querySelector('.grid-five');
  if (five) five.classList.add('chain');
  srScan(root);
}
function scrollToHealth(id) {
  const el = document.getElementById(id);
  if (!el) return;
  setTimeout(function() {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}
function openHealthTab(tab, id) {
  const tabs = document.querySelectorAll('#page-health .health-tab');
  const idx = tab === 'knowledge' ? 1 : 0;
  if (tabs[idx]) switchHealthTab(tab, tabs[idx]);
  setTimeout(function() {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, 360);
}
// ===== FIGURES DATA =====
const figures = [
  {name:'黄帝',sortYear:-2550,axis:'约前2550',art:'huangdi',caption:'图源：Wellcome Collection L0039314 · CC BY 4.0',era:'约公元前2550年',role:'提问者',related:'Ch1,Ch2,Ch6',desc:'华夏始祖。后宫御女多而不得法，五十岁虚亏。向素女、玄女请教房中之道，开启了这门学问的文献传统。',story:'黄帝的问题很实在：我气力衰竭，脉理不和，终日忧心忡忡，是怎么回事？素女没有讲玄学，直接给了水火之喻。黄帝又问：想射精但忍住不射有什么好处？素女给了他十动的阶梯式回答。这些问答构成了《素女经》的核心。'},
  {name:'素女',sortYear:-2500,axis:'约前2500',art:'sunujing',caption:'图源：《素女经》书影 · Public domain',era:'传说时代',role:'最早的性学导师',related:'Ch1,Ch2,Ch6,Ch8',desc:'房中术第一导师。把男人比作火、女人比作水，四字道破性学底层逻辑。她的九法、十动、五徵、五欲、九气体系，是整部房中术的理论骨架。',story:'素女没有谈玄学，没有讲道德，直接给比喻。这种直面身体、不讲空话的态度，在两千多年后的今天依然少见。她传下来的不是道德规训，是可操作的技术体系。'},
  {name:'彭祖',sortYear:-1900,axis:'约前1900',art:'pengzu',caption:'图源：《仙佛奇踪》卷一 · Public domain',era:'夏商周',role:'八百岁老狐狸',related:'Ch1,Ch3,Ch13',desc:'历史上记载最长寿的人之一。给采女传了三字真言：多御、少泄。孔夫子亲口把自己比作彭祖。',story:'彭祖活了八百岁（传说）。商王派才色兼备的采女去讨教。他直说：想成仙得吃仙丹，但仙丹人间弄不到。退而求其次——房中术。排在仙丹之后、气功之前。这个排序本身就说明问题。'},
  {name:'采女',sortYear:-1600,axis:'约前1600',era:'商代',role:'最早的房中术学生',related:'Ch1,Ch3',desc:'《列仙全传》说她才色兼备，闻一知十，十分美艳。商王派她去拜访彭祖不是随便选的——要问床上那点事，派一个能让老头开口的女人去。',story:'采女把彭祖教的东西整理成了最早的房中术文献。后来的素女经、玉房秘诀，源头都在她这里。两千年的中国房中术，起点就是一个女人向一个老头的请教。'},
  {name:'葛洪',sortYear:283,axis:'283',art:'gehong',caption:'图源：Wellcome Collection L0039323 · CC BY 4.0',era:'东晋 283-363',role:'最清醒的批判者',related:'Ch1,Ch12',desc:'把房中术定位为道教三大方术之一。最了不起的是他对房中术功效的清醒判断：高可以治小疾，次可以免虚耗而已。不能成仙，不能消灾，不能升官发财。',story:'当时社会上对房中术的吹嘘离谱——有人说能单行致神仙，能移灾解罪转祸为福，能居室高迁商贾倍利。葛洪的回答干脆利落：此皆巫书妖妄过差之言。一千七百年前就把这条线画清楚了。'},
  {name:'孙思邈',sortYear:541,axis:'541',art:'sunsimiao',caption:'图源：Wellcome Collection L0039324 · CC BY 4.0',era:'唐代 541-682',role:'药王',related:'Ch1,Ch4,Ch13',desc:'活了一百多岁。在《备急千金要方》中专设《房中补益》篇，把房中术的操作流程做了最系统的医学化整理。强调前戏、呼吸导引、控精技术。',story:'他提出的控精法——快要射精时缩下部与腹部，用手指按压会阴穴，叩齿吐气——和1970年代马斯特斯和约翰逊提出的挤压法在原理上高度重合。隔了一千三百年，原理分毫不差。他给的泄精频率最保守：四十岁十六日一次，五十岁二十日一次。自己活了一百多岁，他的话分量不同。'},
  {name:'白行简',sortYear:776,axis:'776',art:'dalefu',caption:'图源：《天地阴阳交欢大乐赋》书影 · Public domain',era:'唐代',role:'文学家',related:'Ch8,Ch16',desc:'白居易的弟弟。写了《天地阴阳交欢大乐赋》，在敦煌石室中被发现。用赋这种最正统的文学体裁来写性——在唐代文人眼中，性不天然属于下流范畴。',story:'赋里描写武则天：打开帐爬上龙床，花容月貌星眼明眸。由侍女搀扶着褪褫衣裳，露出雪玉般肌肤，献出丰润的玉臀，皇帝将阳具三番两次地抽送。用司马相如写上林苑的文体写交合之乐，这种坦荡态度比后来的道学家诚实得多。'},
  {name:'洞玄子',sortYear:700,axis:'约700',era:'唐代',role:'体位分类学家',related:'Ch10',desc:'唐代道家张鼎的号。整理了三十种交合体位，从叙绸缪到三秋狗，从《诗经》风雅到乡野直白，把散落民间的菜谱编成了正经的烹饪手册。',story:'前四法用诗经意象串起前戏的生理进程：叙绸缪（拥抱）、申缱绻（握手）、曝鳃鱼（女方兴奋）、麒麟角（男方勃起）。二十六种正题体位按角度递进编排。最后两法直接上驴和狗——前二十八种把风雅用尽了，最后两种该说实话了。'},
  {name:'赵飞燕',sortYear:-45,axis:'前45',art:'zhaofeiyan',caption:'图源：Wikimedia Commons《漢趙飛燕》 · Public domain',era:'汉代',role:'女性修炼者',related:'Ch1,Ch12,Ch16',desc:'从小练行气之术，快速舞步锻炼腰身，束紧腰带，用呼吸锻炼闭气止息力。长期练习使阴部收缩力极强。',story:'成帝晚年阳痿，但每次看到合德的小脚便忽然精力饱满。飞燕的脚被形容为「能为掌上舞」，一双金莲还没有男人一只手掌大。她在汉宫中以气术固宠——帝王的宠爱，很多时候看的是真功夫不是脸。'},
  {name:'冷寿光',sortYear:100,axis:'约100',era:'东汉',role:'一百六十岁的房中术士',related:'Ch1,Ch12',desc:'《后汉书·方术列传》记载他活了百五六十岁，行容成公御妇人之术。常作摇摆环转头颈运动和深呼吸。头发虽白，气色仍似三四十岁。',story:'冷寿光代表了帝王秘术追求的第一个维度：长寿。一百六十岁大概率有夸大，但他被正史收录——东汉社会上层对房中术作为延寿之术是认真对待的，不是只当淫技。'},
  {name:'王真',sortYear:120,axis:'约120',era:'东汉',role:'百岁驻颜者',related:'Ch1,Ch12',desc:'年近百岁，面色红润光泽望之不到五十。秘诀是长期练习胎息法和胎食法。',story:'王真代表了第二个维度：驻颜。他的胎息法能练到面容比实际年龄年轻一半。胎食法是不吃谷物只吞舌下唾液——听着玄乎，但唾液中的表皮生长因子和免疫球蛋白确有生理活性。'},
  {name:'郝孟节',sortYear:180,axis:'约180',era:'东汉',role:'百日不食者',related:'Ch1,Ch12',desc:'嘴里常含一枚大枣，坐定时气息停止身体不动。不吃不喝维持百日不动，形如死人。曹操拜他为众方士总监督。',story:'郝孟节代表了第三个维度：辟谷。百日不食基本可断定夸张，但折射出古人观念——房中术修炼到极致，可以超越凡人生理限制。不食、不眠、不泄，三大标志。'}
];
function renderFigures() {
  const chMap = {1:'overview',2:'overview',3:'overview',4:'overview',5:'readher',6:'techniques',7:'techniques',8:'techniques',9:'techniques',10:'techniques',11:'techniques',12:'health',13:'health',14:'references',15:'references',16:'references'};
  const sorted = figures.slice().sort((a, b) => a.sortYear - b.sortYear);
  document.getElementById('figures-grid').innerHTML = sorted.map((f, i) => {
    const relatedTags = f.related ? f.related.split(',').map(r => {
      const ch = r.trim();
      const num = parseInt(ch.replace('Ch',''));
      const page = chMap[num] || 'overview';
      return `<span class="card-tag tag-source tag-link" onclick="event.stopPropagation();showPage('${page}')">${ch}</span>`;
    }).join('') : '';
    const art = f.art
      ? `<div class="lit-art art-${f.art}" role="img" aria-label="${f.name}画像"></div><div class="lit-credit">${f.caption}</div>`
      : `<div class="lit-art lit-nameplate" role="img" aria-label="${f.name}文字铭牌"><span class="np-name">${f.name}</span><span class="np-meta">${f.era}</span><span class="np-role">${f.role}</span></div><div class="lit-credit">无传世画像 · 文字铭牌</div>`;
    return `
    <article class="lit-node ${i % 2 ? 'right' : 'left'}">
      <div class="lit-mid"><span class="lit-dot" aria-hidden="true"></span><span class="lit-year">${f.axis || f.era}</span></div>
      <div class="lit-card card">
        <div class="lit-art-col">${art}</div>
        <div class="lit-text">
          <span class="card-tag tag-era">${f.era}</span><span class="card-tag tag-type">${f.role}</span>${relatedTags}
          <h3 class="lit-name">${f.name}</h3>
          <p class="lit-desc">${f.desc}</p>
          <p class="lit-story">${f.story || ''}</p>
        </div>
      </div>
    </article>`;
  }).join('');
  srScan(document.getElementById('figures-grid'));
}

// ===== TEXTS DATA =====
const textData = [
  {source:'素女经',theme:'阴阳',original:'凡人之所以衰微者，皆伤于阴阳交接之道尔。女之胜男，犹水之胜火。',vernacular:'人之所以衰老，都是因为在男女交合这件事上不得其法。女人的精力胜过男人，就像水浇灭火一样。'},
  {source:'素女经',theme:'体位',original:'阳具先浅进九次，使女子青春荡漾，心猿意马，然后再作很深入的一掣。',vernacular:'阳具先浅浅进入九次，让女子春心荡漾、意乱神迷，然后再做一次很深入的贯穿。'},
  {source:'素女经',theme:'体位',original:'一曰面赤，则徐徐合之；二曰乳坚鼻汗，则徐徐内之；三曰喉乾咽唾，则徐徐摇之；四曰阴滑，则徐徐深之；五曰尻傅液，则徐徐引之。',vernacular:'第一徵脸红了，就慢慢贴合；第二徵乳头硬了鼻尖出汗了，就慢慢进入；第三徵喉咙干吞咽口水了，就慢慢摇动；第四徵阴道润滑了，就慢慢深入；第五徵臀部流满液体了，就慢慢引出她的高潮。'},
  {source:'素女经',theme:'体位',original:'一曰两手抱人者，欲体相薄相当也；二曰伸其两腿者，切磨其上方也……九曰身纵者，肢体快也；十曰阴液滑者，精已泄也。',vernacular:'她两手抱你，是想要肌肤大面积相贴。她伸腿，是想要阴蒂区域被摩擦……她全身绷直，是快乐弥漫到了全身。她阴液涌出，是高潮释放了。'},
  {source:'素女经',theme:'控精',original:'一动不泻则气力强，再动不泻耳目聪明，三动不泻众病消亡。',vernacular:'第一次忍住不射，气力饱满。第二次忍住，耳朵和眼睛变得更敏锐。第三次忍住，百病消除。'},
  {source:'玉房秘诀',theme:'控精',original:'道甚易知，人不能信而行之耳。幸多后宫，宜知交接之法。法之要者，在於多御少女而莫教泻精，使人身轻百病消除也。',vernacular:'道理很简单，人不去信、不去做罢了。你后宫人多，更该懂得交合的方法。方法的要诀就是多交合、少射精。身体轻快，百病消除。'},
  {source:'玉房秘诀',theme:'控精',original:'久而不泄致痈疽。',vernacular:'长期憋着不泄精，会长疮生疽。'},
  {source:'千金方',theme:'阴阳',original:'男不可无女，女不可无男。无妇则意动，意动则神劳，神劳则损寿。',vernacular:'男人不能没有女人，女人不能没有男人。没有伴侣就会欲念躁动，欲念躁动就会消耗精神，精神消耗就会折寿。'},
  {source:'千金方',theme:'阴阳',original:'强抑郁闭之，难持易失，使人漏精、尿浊，以致鬼交之病，损一而当百也。',vernacular:'强行压制性欲，很难坚持、容易失控，导致漏精、尿液浑浊，甚至梦中遗精。这样造成的损伤，抵得上正常泄精一百次。'},
  {source:'玄女经',theme:'体位',original:'令女正偃卧向上，男伏其上，隐於床。女举其阴以受玉茎，刺其谷实，又攻其上。疏缓动摇，八浅二深，死往生返。',vernacular:'女子仰卧面朝上，男子伏于其上。女子上迎阴户接受阳具。先刺激阴蒂，再深入阴道。舒缓摇动，八次浅的两次深的，快射时退出，软了再进。'},
  {source:'洞玄子',theme:'体位',original:'交合之态不出三十种，前後屈伸、上下俯仰，大体相同而各有小异，以此三十法网罗一切，毫发无遗。',vernacular:'交合的姿势不超过三十种。前后屈伸、上下俯仰，大体相似但各有细微差别。用这三十种方法网罗一切可能，一丝不漏。'},
  {source:'抱朴子',theme:'养生',original:'高可以治小疾，次可以免虚耗而已。',vernacular:'往高了说能治点小毛病，往低了说能让你在交合时少亏损一点。就这么多。'},
  {source:'玉房指要',theme:'控精',original:'用力压著阴沟子，吐出一口长而大的气，同时咬紧牙齿。',vernacular:'用力按压会阴穴，同时长长地吐出一口气，牙齿咬紧。三管齐下压制射精冲动。'},
  {source:'养生要集',theme:'养生',original:'春天三日泄一次，夏秋一个月两次，冬天不泄。',vernacular:'春天三天泄一次，夏秋一个月两次，冬天最好不泄精。冬天泄一次抵春天一百次。'},
  {source:'素女经',theme:'控精',original:'各随其气力，不欲强快，强快即有损。',vernacular:'根据自己的体力和状态来，不要逞强贪快。逞强贪快就会损伤身体。'},
  {source:'素女经',theme:'控精',original:'御敌家当视敌如瓦石，自视如金玉。若其精动，当疾去其乡。',vernacular:'交合时把对方看成瓦石，把自己看成金玉。如果感觉要射精了，赶快退出来。'},
  {source:'素女经',theme:'阴阳',original:'天地有开阖，阴阳有施化，人法阴阳随四时。',vernacular:'天地有开有合，阴阳有施有化，人也应该遵循阴阳法则顺应四季变化来安排房事。'},
  {source:'玄女经',theme:'体位',original:'有不至者，则容伤。',vernacular:'九气有不到的，勉强交合就会伤及五脏。这里的容伤不只是毁容，是五脏受损、筋骨亏耗。'},
  {source:'玉房秘诀',theme:'控精',original:'阳具坚硬要泄精之前，应立刻忍住，毅然从阴道中抽出，等到稍软时再继续。',vernacular:'阳具硬到快要射精时立刻忍住抽出来，等它稍微软一些再插回去。反复硬出软入、死往生还。'},
  {source:'玉房指要',theme:'控精',original:'交合抽送摆动时，深吸一口气凝集在小腹丹田处，默数到三十下再换气。',vernacular:'交合时深吸一口气聚集在丹田，默数三十下再换气。这样有助于阳具坚挺和持久。'},
  {source:'千金方',theme:'养生',original:'凡养生，要在于爱情。',vernacular:'养生的关键全在于两情相悦。不是机械操作，是情感。陶弘景这句话说得比任何房中家都通透。'},
  {source:'千金方',theme:'控精',original:'御而不施，不过百日，气力必致百倍。',vernacular:'继续交合但控制住不泄精，坚持不到一百天，精力就能恢复翻倍。这是彭祖对精力五衰给出的治疗方案。'},
  {source:'洞玄子',theme:'体位',original:'龟头的深浅要像婴儿吸奶那样。',vernacular:'龟头进出的深浅节奏要像婴儿吃奶——浅浅含住，吸几口放开，再含住再吸。节奏轻柔有规律，时轻时重时快时慢。'},
  {source:'黄帝内经',theme:'养生',original:'冬三月，此谓闭藏。水冰地坼，无扰乎阳。',vernacular:'冬天这三个月是闭藏的季节。水结冰地开裂，不要扰动阳气。冬天连阳气都得藏起来，更何况精。'},
  {source:'抱朴子',theme:'养生',original:'房中之法十余家，或以补救伤损，或以攻治众病，或以采阴益阳，或以增年延寿。',vernacular:'房中术的方法有十多家，有的用来补救身体损伤，有的用来治疗各种疾病，有的用来采阴补阳，有的用来延年益寿。'},
  {source:'千金方',theme:'养生',original:'人年四十以下，多有放恣。四十以上，即顿觉气力一时衰退。衰退既至，众病蜂起。',vernacular:'四十岁以下的人大多放纵不知节制。一过四十立刻感到气力全面衰退。衰退一到，各种病就蜂拥而来。'},
  {source:'素女经',theme:'阴阳',original:'女之胜男，犹水之胜火。能体认水火交融的道理，便能尽享人间乐趣。',vernacular:'女人胜过男人就像水浇灭火。能体会水火交融的道理就能享尽人间乐趣，不懂的人身体和性命都要受损。'},
  {source:'素女经',theme:'体位',original:'不寒不热，不饥不饱。定气、安心、和志。浅内徐动，出入欲希。',vernacular:'不冷也不热，不饿也不饱。情绪安定、心境放松、精神饱满。慢慢进去，轻轻动，别急着抽送。'}
];
const textSources = [...new Set(textData.map(t => t.source))];
const textThemes = ['阴阳','控精','体位','养生','择偶','禁忌'];
function renderTexts(filter,btn,theme) {
  const container = document.getElementById('texts-container');
  const sourceFilter = document.getElementById('text-source-filter');
  sourceFilter.innerHTML = `<button class="filter-chip ${!filter||filter==='all'&&!theme?'active':''}" onclick="renderTexts('all',this)">全部</button>` +
    textSources.map(s => `<button class="filter-chip ${filter===s&&!theme?'active':''}" onclick="renderTexts('${s}',this)">${s}</button>`).join('') +
    `<span class="text-sep">|</span>` +
    textThemes.map(t => `<button class="filter-chip ${theme===t?'active':''}" onclick="renderTexts(null,this,'${t}')">${t}</button>`).join('');
  let filtered = textData;
  if(filter && filter !== 'all') filtered = filtered.filter(t => t.source === filter);
  if(theme) filtered = filtered.filter(t => t.theme === theme);
  container.innerHTML = filtered.map(t => `
    <div class="text-card">
      <span class="text-source">${t.source}</span>
      ${t.theme ? `<span class="card-tag tag-type tag-theme">${t.theme}</span>` : ''}
      <div class="original">${t.original}</div>
      <div class="vernacular">${t.vernacular}</div>
    </div>
  `).join('');
  srScan(container);
}

// ===== READHER SIGNALS =====
const readherSignals = [
  {num:'1',title:'四至：男方的准备信号',hint:'怒→大→坚→热',desc:'勃起四阶段，缺一不可',
   cols:['阶段','身体表现','气的层次'],
   rows:[['怒','阳具充血膨大，微微抬头','和气已到'],['大','明显变粗变壮，膨胀一圈','肌气充盈'],['坚','坚硬如铁，叩之有声','骨气到了'],['热','触之灼热，像火把烫手','神气充盈，四至齐备']],
   extra:'四至缺一不可。做不到就等，硬上伤自己也伤她。'},
  {num:'2',title:'九气：女方的准备信号',hint:'呼吸急促→意乱神迷',desc:'九气不全就交合，古人说会「容伤」',
   cols:['五脏','身体信号','应该怎么做'],
   rows:[['肺','呼吸急促、吞咽口水','继续搂抱亲吻，不急着往下走'],['心','低吟呻吟、主动吸吻','情绪已被调动，理性在退场'],['脾','双臂紧抱、缠住不放','从「被触碰」切换到「要触碰」'],['肾','阴部滑润、分泌增多','身体已为交合做最直接准备'],['骨','齿咬男方','深层的、近乎本能的渴望'],['筋','双脚勾缠','骨盆在调整角度，为更深进入做准备'],['血','抚弄阳具','欲望从「被爱抚」升级到「想参与」'],['肉','抚摸男乳','身体已全面打开']],
   extra:''},
  {num:'3',title:'五徵：交合中的五个阶段',hint:'脸→乳→喉→阴→臀',desc:'素女经五个「徐徐」，跟着她的节奏走',
   cols:['阶段','身体表现','古文指令'],
   rows:[['面赤','脸颊晕红，从两颊蔓延到耳根','徐徐合之：阳具轻轻附在阴阜上，像叩门等主人来开门'],['乳坚鼻汗','乳头挺立、鼻尖沁汗','徐徐内之：缓慢地一点一点进入，让她有时间适应'],['喉干咽唾','喉咙发干、嘴唇干燥','徐徐摇之：阳具在内部缓慢左右摆动，像钟摆有节奏'],['阴滑','阴道润滑明显增多','徐徐深之：有序地逐渐深入，让她一寸一寸被填满'],['尻傅液','大量液体涌出到臀部','徐徐引之：缓慢抽出，把她的高潮从体内牵引出来']],
   extra:'五徵核心在一个「徐徐」。女性的生理反应天生就比男性慢半拍。快了她跟不上，急了她出不来。'},
  {num:'4',title:'五欲：渴望的五个层次',hint:'屏息→翕张→颤抖→汗透→僵直',desc:'从想要被抱到彻底淹没',
   cols:['层次','身体表现','对应动作'],
   rows:[['屏息','忽然屏住呼吸，气息变轻变浅','用双臂把她裹住，胸膛贴胸膛'],['翕张','鼻孔微张，呼吸又深又粗','手、唇、舌头，集中在她最敏感的部位'],['颤抖','浑身一颤，双臂猛地收紧搂住','再快一点，不要停'],['汗透','全身大汗淋漓，衣服都透了','保持节奏不要变，维持原速'],['僵直','身体完全伸直僵硬，双眼紧闭','不要试图唤醒她，让她多待一会儿']],
   extra:'她屏息，抱她。她翕张，摸她。她颤抖，加速。她出汗，稳住。她僵直，别动。每一层都有正确答案。'},
  {num:'5',title:'十动：身体语言',hint:'抱人→伸腿→张腹→尻动→勾人→交股→侧摇→举身→纵身→液流',desc:'十个动作，十种含义',
   cols:['动作','含义','对应动作'],
   rows:[['两手抱人','想要体肤大面积相贴','把身体压上去，胸膛贴着胸膛'],['伸其两腿','想要阴蒂区域受充分摩擦','调整骨盆角度让关键位置形成更好接触面'],['张腹','腹部上抬，缩短阴道深度','她在邀请释放'],['尻动','明确感受到了快感，持续加深','保持节奏不变'],['举两脚勾人','要更深，在物理上缩短距离','配合她，把骨盆拉向她的骨盆'],['交其两股','从阴道深处涌上的无法抑制的痒感','盆底肌群都在痉挛'],['侧摇','要左右研磨，「往这边试试」','让阳具在阴道内画圈或左右摇摆'],['举身','快感一波波涌上来，用全身追上来','不要停，她正在高潮途中'],['纵身','全身绷直伸展，快感最高阈值','阴道痉挛从深处往外推，这是高潮'],['阴液流','大量液体涌出，高潮释放','接受她的全部']],
   extra:'她的身体一直在说话，学会听懂这些话，比学会任何体位都重要。'},
  {num:'+',title:'G点：现代人补上的拼图',hint:'前壁2-3cm，耻骨正后方',desc:'约三成女性从未体验过阴道高潮',
   cols:null, rows:null,
   detail:'<p>阴道口内侧两到三厘米，耻骨正后方，手指贴住前壁用「come-hither」手势从里往外勾。如果她感到想要排尿的冲动，那就对了——G点恰好在膀胱和尿道之间。顶住那种感觉继续，很快排尿感会被快感取代。</p><p>约三成女性从未体验过阴道高潮，强求不来。有反应的女性可以通过训练耻骨肌显著提升强度：收紧三秒、放松三秒，每天两个75次循环，三周后会有明显变化。</p>'}
];

function decorateReadherChapters() {
  const root = document.getElementById('readher-foreplay');
  if (!root) return;
  if (root.querySelector('.step-chapter')) return;
  const h3s = Array.from(root.children).filter(function(el) {
    return el.tagName === 'H3' && el.dataset.cat;
  });
  h3s.forEach(function(h3, i) {
    const nodes = [];
    let el = h3;
    while (el && !(el !== h3 && el.tagName === 'H3')) {
      nodes.push(el);
      el = el.nextElementSibling;
    }
    const sec = document.createElement('section');
    sec.className = 'step-chapter';
    sec.dataset.cat = h3.dataset.cat;
    const head = document.createElement('div');
    head.className = 'step-head';
    const num = document.createElement('span');
    num.className = 'step-num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = String(i + 1).padStart(2, '0');
    const body = document.createElement('div');
    body.className = 'step-body';
    root.insertBefore(sec, h3);
    h3.removeAttribute('data-cat');
    h3.textContent = h3.textContent.replace(/^[一二三四五六七八九十]+、\s*/, '').trim();
    head.appendChild(num);
    head.appendChild(h3);
    nodes.slice(1).forEach(function(n) {
      n.removeAttribute('data-cat');
      n.querySelectorAll('[data-cat]').forEach(function(x) { x.removeAttribute('data-cat'); });
      body.appendChild(n);
    });
    sec.appendChild(head);
    sec.appendChild(body);
  });
  srScan(root);
}
function renderReadher() {
  const grid = document.getElementById('readher-grid');
  if (!grid) return;
  grid.innerHTML = readherSignals.map(function(s) {
    var isTable = s.cols && s.rows;
    var tableHTML;
    if (isTable) {
      tableHTML = '<div class="signal-table-wrap"><div class="signal-table-inner"><table class="signal-table"><thead><tr>'
        + s.cols.map(function(c) { return '<th>' + c + '</th>'; }).join('')
        + '</tr></thead><tbody>'
        + s.rows.map(function(r, ri) {
          return '<tr>' + r.map(function(c, ci) {
            return '<td>' + (ci === 0 ? '<span class="sig-icon">' + (ri + 1) + '</span>' : '') + c + '</td>';
          }).join('') + '</tr>';
        }).join('')
        + '</tbody></table>'
        + (s.extra ? '<p class="bayi-note">' + s.extra + '</p>' : '')
        + '</div></div>';
    } else {
      tableHTML = '<div class="signal-table-wrap"><div class="signal-table-inner">'
        + '<div class="bayi-detail">'
        + (s.detail || '') + '</div></div></div>';
    }
    return '<div class="signal-card" onclick="this.classList.toggle(\'open\')">'
      + '<div class="signal-header"><span class="signal-num">' + s.num + '</span>'
      + '<div class="signal-info"><div class="s-title">' + s.title + '</div>'
      + '<div class="s-hint">' + s.hint + '</div>'
      + (s.desc ? '<div class="bayi-label">' + s.desc + '</div>' : '')
      + '</div></div>'
      + tableHTML + '</div>';
  }).join('');
  srScan(grid);
}

// ===== INIT =====
// ===== SCROLL REVEAL (bidirectional) =====
var SR_SELECTOR = '.card,.tech-dense-cell,.step-chapter,.health-band,.bayi-cell,.flow-node,.lit-node,.signal-card,.text-card,.freq-selector,.progressive-list,.quick-entry,.herb-master';
var srInObs = null, srOutObs = null, srReady = false, srWillTimers = new WeakMap();

function srNear(el) {
  var r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  var vh = window.innerHeight;
  return r.bottom > -vh * 0.08 && r.top < vh * 0.92;
}
function srInViewport(el) {
  var r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0;
}
function srHasAncestor(el) {
  var p = el.parentElement;
  while (p) {
    if (p.classList && p.classList.contains('sr')) return true;
    p = p.parentElement;
  }
  return false;
}
function srCollect(root) {
  var list = [];
  if (root.nodeType === 1 && root.matches(SR_SELECTOR)) list.push(root);
  if (root.querySelectorAll) list = list.concat(Array.prototype.slice.call(root.querySelectorAll(SR_SELECTOR)));
  return list.filter(function (el) { return !el.closest('[data-legacy]'); });
}
function srSet(el, on, instant) {
  if (!el.classList.contains('sr')) el.classList.add('sr');
  if (el.classList.contains('sr-in') === on) return;
  if (instant) {
    el.classList.add('sr-now');
    el.classList.toggle('sr-in', on);
    return;
  }
  el.classList.add('sr-will');
  el.classList.toggle('sr-in', on);
  clearTimeout(srWillTimers.get(el));
  srWillTimers.set(el, setTimeout(function () { el.classList.remove('sr-will'); }, 520));
}
function srScan(root) {
  if (!root || !srReady) return;
  var list = srCollect(root), nearMap = new Map();
  list.forEach(function (el) { nearMap.set(el, srNear(el)); });
  list.forEach(function (el) {
    if (el.classList.contains('sr')) return;
    if (srHasAncestor(el)) return;
    el.classList.add('sr');
    if (nearMap.get(el)) el.classList.add('sr-in');
    srInObs.observe(el);
    srOutObs.observe(el);
  });
}
function srSync(root) {
  if (!root || !srReady) return;
  var todo = [];
  srCollect(root).forEach(function (el) {
    if (!el.classList.contains('sr')) return;
    var want = srInViewport(el);
    if (el.classList.contains('sr-in') !== want) todo.push([el, want]);
  });
  if (!todo.length) return;
  todo.forEach(function (p) {
    p[0].classList.add('sr-now');
    p[0].classList.toggle('sr-in', p[1]);
  });
  void document.documentElement.offsetWidth;
  requestAnimationFrame(function () {
    todo.forEach(function (p) { p[0].classList.remove('sr-now'); });
  });
}
function srRevealVisible() {
  if (!srReady) return;
  srCollect(document.body).forEach(function (el) {
    if (!el.classList.contains('sr') || el.classList.contains('sr-in')) return;
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0) srSet(el, true, false);
  });
}
function srInit() {
  if (srReady) return;
  if (!('IntersectionObserver' in window)) {
    srCollect(document.body).forEach(function (el) { el.classList.add('sr', 'sr-in'); });
    return;
  }
  srInObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) srSet(e.target, true, false); });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  srOutObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (!e.isIntersecting) srSet(e.target, false, false); });
  }, { rootMargin: '8% 0px 8% 0px', threshold: 0 });
  srReady = true;
  srScan(document.body);
  document.addEventListener('transitionend', function (e) {
    if (e.target.classList && e.target.classList.contains('sr-will')) e.target.classList.remove('sr-will');
  });
  var srStopTimer = 0;
  window.addEventListener('scrollend', srRevealVisible, { passive: true });
  window.addEventListener('scroll', function () {
    clearTimeout(srStopTimer);
    srStopTimer = setTimeout(srRevealVisible, 220);
  }, { passive: true });
}

// ===== HERB MASTER-DETAIL =====
var HERB_ART = {
  '淫羊藿':'yinyanghuo','肉苁蓉':'roucongrong','菟丝子':'tusizi','枸杞子':'gouqizi',
  '巴戟天':'bajitian','鹿茸':'lurong','杜仲':'duzhong','蛇床子':'shechuangzi',
  '锁阳':'suoyang','仙茅':'xianmao','韭菜子':'jiucaizi','覆盆子':'fupenzi',
  '五味子':'wuweizi','黄精':'huangjing'
};
var HERB_GROUPS = {
  formula:[['yang','补肾壮阳'],['sejing','固精涩精'],['pingbu','平补五脏'],['yin','滋阴']],
  herb:[['补阳','补阳'],['滋阴','滋阴'],['平补','平补'],['收涩','收涩']],
  modern:[['PDE5抑制剂','PDE5 抑制剂'],['早泄','早泄'],['激素','激素'],['营养','营养']]
};
var HERB_ROOT = {formula:'herb-formula',herb:'herb-herb',modern:'herb-modern'};
var herbState = {formula:{groups:[],items:[],active:null},herb:{groups:[],items:[],active:null},modern:{groups:[],items:[],active:null}};

function herbArtKey(name) {
  if (!name) return '';
  if (HERB_ART[name]) return HERB_ART[name];
  var hit = Object.keys(HERB_ART).find(function (k) { return name.indexOf(k) >= 0; });
  return hit ? HERB_ART[hit] : '';
}
function herbJun(comp) {
  var first = (comp || '').split(/[、，,；;]/)[0] || '';
  var name = Object.keys(HERB_ART).find(function (k) { return first.indexOf(k) === 0; });
  return name ? {name:name, key:HERB_ART[name]} : null;
}
function herbFields(card) {
  var out = [];
  var prose = card.querySelector('.expand-panel .prose');
  if (!prose) return out;
  Array.prototype.forEach.call(prose.querySelectorAll('h4'), function (h) {
    var p = h.nextElementSibling;
    out.push({h:h.textContent.trim(),p:p ? p.innerHTML : ''});
  });
  return out;
}
function herbParseTab(tab) {
  var root = document.getElementById(HERB_ROOT[tab]);
  if (!root) return [];
  var cards = Array.prototype.slice.call(root.querySelectorAll('.card'));
  return cards.map(function (card, i) {
    var titleEl = card.querySelector('.card-title');
    var tagEl = card.querySelector('.card-tag');
    var bodyEl = card.querySelector('.card-body');
    var subEl = card.querySelector('.card-subtitle');
    if (!titleEl) return null;
    var tags = (card.dataset.tags || '').split(',').filter(Boolean);
    var tagText = tagEl ? tagEl.textContent.trim() : '';
    var fields = herbFields(card);
    var comp = '';
    fields.forEach(function (f) { if (f.h === '组成') comp = f.p.replace(/<[^>]+>/g,''); });
    return {
      key: tab + '-' + i,
      title: titleEl.textContent.trim(),
      tag: tagText,
      tags: tags,
      subtitle: subEl ? subEl.textContent.trim() : '',
      body: bodyEl ? bodyEl.innerHTML : '',
      fields: fields,
      comp: comp,
      group: tab === 'formula' ? (tags[0] || '') : tagText
    };
  }).filter(Boolean);
}
function herbIndexItem(tab, it) {
  var jun = tab === 'formula' ? herbJun(it.comp) : null;
  var art = tab === 'formula' ? (jun ? jun.key : '') : herbArtKey(it.title);
  var meta = tab === 'formula'
    ? it.tag
    : (tab === 'herb' ? (it.tag + (it.subtitle ? ' · ' + it.subtitle.split('·')[0].trim() : '')) : it.tag);
  return '<button type="button" class="hi-item' + (herbState[tab].active === it.key ? ' active' : '') + '" data-key="' + it.key + '" onclick="selectHerb(\'' + tab + '\',\'' + it.key + '\')">' +
    (art ? '<span class="hi-thumb art-' + art + '" aria-hidden="true"></span>' : '<span class="hi-thumb-plate" aria-hidden="true">' + it.title.charAt(0) + '</span>') +
    '<span class="hi-name">' + it.title + '<span class="hi-meta">' + meta + '</span></span>' +
    '<span class="hi-count">' + (tab === 'formula' && it.comp ? it.comp.split(/[、，,；;]/).filter(Boolean).length + '味' : '') + '</span>' +
  '</button>';
}
function herbBuildIndex(tab) {
  var idx = document.getElementById('herb-index-' + tab);
  if (!idx) return;
  var st = herbState[tab];
  var chips = st.groups.map(function (g, i) {
    return '<button type="button" class="filter-chip hi-group-chip' + (i === 0 ? ' active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" onclick="setHerbGroup(\'' + tab + '\',\'' + g.key + '\',this)">' + g.label + ' <b>' + g.items.length + '</b></button>';
  }).join('');
  var groups = st.groups.map(function (g, i) {
    return '<div class="hi-group' + (i === 0 ? ' on' : '') + '" data-g="' + g.key + '">' +
      '<div class="hi-group-head"><span>' + g.label + '</span><b>' + g.items.length + '</b></div>' +
      '<div class="hi-items">' + g.items.map(function (it) { return herbIndexItem(tab, it); }).join('') + '</div>' +
    '</div>';
  }).join('');
  idx.innerHTML = '<div class="hi-group-tabs" role="tablist" aria-label="分类">' + chips + '</div>' + groups;
}
function herbIngredientChips(text) {
  if (!text) return '';
  return text.split(/[、，,；;]/).map(function (s) { return s.trim(); }).filter(Boolean).map(function (p) {
    var name = Object.keys(HERB_ART).find(function (k) { return p.indexOf(k) === 0; });
    return '<span class="hd-chip' + (name ? ' herb' : '') + '">' + p + '</span>';
  }).join('');
}
function herbTagHtml(it) {
  var cls = 'tag-source';
  if (it.tag === '补阳' || it.tag === '滋阴' || it.tag === '平补' || it.tag === '收涩') cls = 'tag-attr';
  if (it.tag === 'PDE5抑制剂' || it.tag === '激素' || it.tag === '营养') cls = 'tag-type';
  if (it.tag === '早泄') cls = 'tag-alert';
  var extra = (it.tags || []).slice(1).map(function (t) {
    return '<span class="card-tag tag-attr">' + ({sejing:'固精涩精',yang:'补肾壮阳',pingbu:'平补五脏',yin:'滋阴'}[t] || t) + '</span>';
  }).join('');
  return (it.tag ? '<span class="card-tag ' + cls + '">' + it.tag + '</span>' : '') + extra;
}
function herbRenderDetail(tab, it) {
  var fields = it.fields.map(function (f) { return '<h4>' + f.h + '</h4><p>' + f.p + '</p>'; }).join('');
  if (tab === 'formula') {
    var junInfo = herbJun(it.comp);
    var jun = junInfo ? junInfo.name : '';
    var junKey = junInfo ? junInfo.key : '';
    var art = junKey
      ? '<div class="hd-art formula art-' + junKey + '" role="img" aria-label="' + jun + '药材图"></div><div class="hd-caption formula">君药：' + jun + ' · 图源《植物名实图考》Public domain</div>'
      : '<div class="hd-art hd-artplate formula"><b>' + it.title + '</b><span>原方无对应药材图</span></div><div class="hd-caption formula">图源《植物名实图考》Public domain</div>';
    return '<article class="hd-card"><div class="hd-head"><h3 class="hd-title">' + it.title + '</h3>' + herbTagHtml(it) + '</div>' +
      '<p class="hd-lead">' + it.body + '</p>' +
      '<div class="hd-layout formula"><div>' + art + '</div><div class="hd-fields">' + fields + '</div></div>' +
      (it.comp ? '<div class="hd-chips"><span class="hd-chips-label">药味</span>' + herbIngredientChips(it.comp) + '</div>' : '') +
    '</article>';
  }
  if (tab === 'herb') {
    var key = herbArtKey(it.title);
    var art2 = key
      ? '<div class="hd-art art-' + key + '" role="img" aria-label="' + it.title + '药材图"></div><div class="hd-caption">图源：《植物名实图考》· Public domain</div>'
      : '<div class="hd-art hd-artplate"><b>' + it.title + '</b><span>暂无木刻</span></div><div class="hd-caption">图源：《植物名实图考》· Public domain</div>';
    return '<article class="hd-card"><div class="hd-head"><h3 class="hd-title">' + it.title + '</h3>' + herbTagHtml(it) + '</div>' +
      (it.subtitle ? '<div class="hd-sub">' + it.subtitle + '</div>' : '') +
      '<p class="hd-lead">' + it.body + '</p>' +
      '<div class="hd-layout"><div>' + art2 + '</div><div class="hd-fields">' + fields + '</div></div>' +
    '</article>';
  }
  return '<article class="hd-card"><div class="hd-head"><h3 class="hd-title">' + it.title + '</h3>' + herbTagHtml(it) + '</div>' +
    '<p class="hd-lead">' + it.body + '</p>' +
    '<div class="hd-layout single"><div class="hd-fields">' + fields + '</div></div>' +
  '</article>';
}
function selectHerb(tab, key, scroll) {
  var st = herbState[tab];
  var it = st.items.find(function (x) { return x.key === key; });
  if (!it) return;
  st.active = key;
  Array.prototype.forEach.call(document.querySelectorAll('#herb-index-' + tab + ' .hi-item'), function (b) {
    b.classList.toggle('active', b.dataset.key === key);
  });
  if (window.innerWidth <= 767) {
    var activeBtn = document.querySelector('#herb-index-' + tab + ' .hi-item.active');
    var wrap = activeBtn ? activeBtn.closest('.hi-items') : null;
    if (activeBtn && wrap) {
      var br = activeBtn.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      if (br.left < wr.left || br.right > wr.right) {
        wrap.scrollLeft += (br.left - wr.left) - (wr.width - br.width) / 2;
      }
    }
  }
  var group = st.groups.find(function (g) { return g.key === it.group; });
  if (group) {
    Array.prototype.forEach.call(document.querySelectorAll('#herb-index-' + tab + ' .hi-group'), function (g) {
      g.classList.toggle('on', g.dataset.g === group.key);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#herb-index-' + tab + ' .hi-group-chip'), function (c, i) {
      var on = st.groups[i] && st.groups[i].key === group.key;
      c.classList.toggle('active', on); c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  var det = document.getElementById('herb-detail-' + tab);
  if (det) {
    det.innerHTML = herbRenderDetail(tab, it);
    if (scroll) det.scrollIntoView({behavior:'smooth', block:'start'});
  }
}
function setHerbGroup(tab, groupKey, btn) {
  var st = herbState[tab];
  Array.prototype.forEach.call(document.querySelectorAll('#herb-index-' + tab + ' .hi-group-chip'), function (c) {
    var on = c === btn; c.classList.toggle('active', on); c.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  Array.prototype.forEach.call(document.querySelectorAll('#herb-index-' + tab + ' .hi-group'), function (g) {
    g.classList.toggle('on', g.dataset.g === groupKey);
  });
  var g = st.groups.find(function (x) { return x.key === groupKey; });
  var gEl = document.querySelector('#herb-index-' + tab + ' .hi-group[data-g="' + groupKey + '"] .hi-items');
  if (gEl) gEl.scrollLeft = 0;
  if (g && g.items[0]) selectHerb(tab, g.items[0].key, false);
}
function selectHerbByTitle(tab, title) {
  var st = herbState[tab];
  if (!st || !st.items.length) return;
  var it = st.items.find(function (x) { return x.title === title; }) ||
           st.items.find(function (x) { return x.title.indexOf(title) >= 0 || title.indexOf(x.title) >= 0; });
  if (it) selectHerb(tab, it.key, true);
}
function initHerbMasters() {
  ['formula','herb','modern'].forEach(function (tab) {
    var items = herbParseTab(tab);
    var order = HERB_GROUPS[tab];
    var groups = order.map(function (o) { return {key:o[0],label:o[1],items:[]}; });
    items.forEach(function (it) {
      var g = groups.find(function (x) { return x.key === it.group; });
      if (!g) { g = {key:it.group || 'other', label:it.group || '其他', items:[]}; groups.push(g); }
      g.items.push(it);
    });
    var st = herbState[tab];
    st.items = items;
    st.groups = groups.filter(function (g) { return g.items.length > 0; });
    st.active = null;
    herbBuildIndex(tab);
    if (st.groups[0] && st.groups[0].items[0]) selectHerb(tab, st.groups[0].items[0].key, false);
  });
  ['#herb-formula .herb-filter','#herb-formula .filterable-group','#herb-formula > .card-grid','#herb-herb > .card-grid','#herb-modern > .card-grid'].forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { el.setAttribute('data-legacy','1'); });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // ===== AMBIENT AURORA BACKGROUND =====
  (function() {
    var container = document.getElementById('aurora-bg');
    if (!container) return;
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    container.appendChild(canvas);
    gl.clearColor(0, 0, 0, 0);

    var vertSrc = 'attribute vec2 uv;attribute vec2 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0,1);}';
    var fragSrc = [
      'precision highp float;',
      'uniform float uTime;uniform vec3 uResolution;uniform float uSpeed;uniform float uScale;',
      'uniform float uBrightness;uniform vec3 uColor1;uniform vec3 uColor2;',
      'uniform float uNoiseFreq;uniform float uNoiseAmp;uniform float uBandHeight;',
      'uniform float uBandSpread;uniform float uOctaveDecay;uniform float uLayerOffset;uniform float uColorSpeed;',
      '#define TAU 6.28318',
      'vec3 gradientHash(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,234.6)),dot(p,vec3(269.5,183.3,198.3)),dot(p,vec3(169.5,283.3,156.9)));vec3 h=fract(sin(p)*43758.5453);float phi=acos(2.0*h.x-1.0);float theta=TAU*h.y;return vec3(cos(theta)*sin(phi),sin(theta)*cos(phi),cos(phi));}',
      'float quinticSmooth(float t){float t2=t*t;float t3=t2*t;return 6.0*t3*t2-15.0*t2*t2+10.0*t3;}',
      'vec3 cosineGradient(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(TAU*(c*t+d));}',
      'float perlin3D(float amplitude,float frequency,float px,float py,float pz){float x=px*frequency;float y=py*frequency;float fx=floor(x);float fy=floor(y);float fz=floor(pz);float cx=ceil(x);float cy=ceil(y);float cz=ceil(pz);vec3 g000=gradientHash(vec3(fx,fy,fz));vec3 g100=gradientHash(vec3(cx,fy,fz));vec3 g010=gradientHash(vec3(fx,cy,fz));vec3 g110=gradientHash(vec3(cx,cy,fz));vec3 g001=gradientHash(vec3(fx,fy,cz));vec3 g101=gradientHash(vec3(cx,fy,cz));vec3 g011=gradientHash(vec3(fx,cy,cz));vec3 g111=gradientHash(vec3(cx,cy,cz));float d000=dot(g000,vec3(x-fx,y-fy,pz-fz));float d100=dot(g100,vec3(x-cx,y-fy,pz-fz));float d010=dot(g010,vec3(x-fx,y-cy,pz-fz));float d110=dot(g110,vec3(x-cx,y-cy,pz-fz));float d001=dot(g001,vec3(x-fx,y-fy,pz-cz));float d101=dot(g101,vec3(x-cx,y-fy,pz-cz));float d011=dot(g011,vec3(x-fx,y-cy,pz-cz));float d111=dot(g111,vec3(x-cx,y-cy,pz-cz));float sx=quinticSmooth(x-fx);float sy=quinticSmooth(y-fy);float sz=quinticSmooth(pz-fz);float lx00=mix(d000,d100,sx);float lx10=mix(d010,d110,sx);float lx01=mix(d001,d101,sx);float lx11=mix(d011,d111,sx);float ly0=mix(lx00,lx10,sy);float ly1=mix(lx01,lx11,sy);return amplitude*mix(ly0,ly1,sz);}',
      'float auroraGlow(float t,vec2 shift){vec2 uv=gl_FragCoord.xy/uResolution.y;uv+=shift;float noiseVal=0.0;float freq=uNoiseFreq;float amp=uNoiseAmp;vec2 sp=uv*uScale;for(float i=0.0;i<3.0;i+=1.0){noiseVal+=perlin3D(amp,freq,sp.x,sp.y,t);amp*=uOctaveDecay;freq*=2.0;}float yBand=uv.y*10.0-uBandHeight*10.0;return 0.3*max(exp(uBandSpread*(1.0-1.1*abs(noiseVal+yBand))),0.0);}',
      'void main(){vec2 uv=gl_FragCoord.xy/uResolution.xy;float t=uSpeed*0.4*uTime;vec3 col=vec3(0.0);',
      'col+=0.99*auroraGlow(t,vec2(0.0))*cosineGradient(uv.x+uTime*uSpeed*0.2*uColorSpeed,vec3(0.5),vec3(0.5),vec3(1.0),vec3(0.3,0.20,0.20))*uColor1;',
      'col+=0.99*auroraGlow(t+uLayerOffset,vec2(0.0))*cosineGradient(uv.x+uTime*uSpeed*0.1*uColorSpeed,vec3(0.5),vec3(0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25))*uColor2;',
      'col*=uBrightness;float alpha=clamp(length(col),0.0,1.0);gl_FragColor=vec4(col,alpha);}'
    ].join('\n');

    function compileShader(src, type) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Aurora shader:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    }
    var vs = compileShader(vertSrc, gl.VERTEX_SHADER);
    var fs = compileShader(fragSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('Aurora link:', gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    // Fullscreen triangle
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 0,0, 3,-1, 2,0, -1,3, 0,2]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'position');
    var uvLoc = gl.getAttribLocation(prog, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    // Uniforms
    var loc = {};
    ['uTime','uResolution','uSpeed','uScale','uBrightness','uColor1','uColor2',
     'uNoiseFreq','uNoiseAmp','uBandHeight','uBandSpread','uOctaveDecay','uLayerOffset','uColorSpeed'].forEach(function(n) {
      loc[n] = gl.getUniformLocation(prog, n);
    });

    function hexToVec3(hex) {
      var h = hex.replace('#','');
      return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
    }

    function getThemeColors() {
      var dark = document.documentElement.getAttribute('data-theme') !== 'light';
      return dark
        ? { c1: '#ffc040', c2: '#ff6040', brightness: 0.55 }
        : { c1: '#e8a030', c2: '#d06040', brightness: 0.35 };
    }

    var colors = getThemeColors();

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    var running = true;
    function loop(t) {
      if (!running) return;
      requestAnimationFrame(loop);
      gl.uniform1f(loc.uTime, t * 0.001);
      gl.uniform3f(loc.uResolution, canvas.width, canvas.height, canvas.width / canvas.height);
      gl.uniform1f(loc.uSpeed, 0.8);
      gl.uniform1f(loc.uScale, 1.5);
      gl.uniform1f(loc.uBrightness, colors.brightness);
      gl.uniform3fv(loc.uColor1, hexToVec3(colors.c1));
      gl.uniform3fv(loc.uColor2, hexToVec3(colors.c2));
      gl.uniform1f(loc.uNoiseFreq, 2.5);
      gl.uniform1f(loc.uNoiseAmp, 2.0);
      gl.uniform1f(loc.uBandHeight, 0.45);
      gl.uniform1f(loc.uBandSpread, 0.65);
      gl.uniform1f(loc.uOctaveDecay, 0.09);
      gl.uniform1f(loc.uLayerOffset, 0.1);
      gl.uniform1f(loc.uColorSpeed, 0.9);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { running = false; }
      else { running = true; requestAnimationFrame(loop); }
    });
    new MutationObserver(function() { colors = getThemeColors(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  // Back to top button
  var btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', function() {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  // Apply section-split layout to 进阶功法 sections
  document.querySelectorAll('#health-practice .section').forEach(function(sec) {
    var h3 = sec.querySelector('h3');
    var desc = sec.querySelector('.section-desc');
    var grid = sec.querySelector('.card-grid');
    if (!h3 || !grid) return;
    var split = document.createElement('div');
    split.className = 'section-split';
    var left = document.createElement('div');
    left.className = 'section-left';
    left.appendChild(h3.cloneNode(true));
    if (desc) {
      var d = desc.cloneNode(true);
      d.className = 'section-left-desc';
      left.appendChild(d);
    }
    var right = document.createElement('div');
    right.className = 'section-right';
    right.appendChild(grid.cloneNode(true));
    split.appendChild(left);
    split.appendChild(right);
    while (sec.firstChild) sec.removeChild(sec.firstChild);
    sec.appendChild(split);
  });

  // Apply left-right layout to 进阶功法 cards - DISABLED (cards use normal vertical layout)
  // document.querySelectorAll('#health-practice .section .card').forEach(function(card) { ... });

  // Keyboard accessibility for clickable/expandable cards and signal cards
  function decorateCards(root) {
    (root || document).querySelectorAll('.card, .signal-card').forEach(el => {
      const interactive = el.classList.contains('signal-card') || el.hasAttribute('onclick') || el.querySelector('.expand-panel');
      if (!interactive) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (el.classList.contains('signal-card')) {
        el.setAttribute('aria-expanded', el.classList.contains('open') ? 'true' : 'false');
      }
    });
  }
  window.decorateCards = decorateCards;
  decorateCards();
  document.addEventListener('click', function(e) {
    const sc = e.target.closest('.signal-card');
    if (sc) sc.setAttribute('aria-expanded', sc.classList.contains('open') ? 'true' : 'false');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const el = e.target;
      if (el.hasAttribute('onclick') && el.getAttribute('tabindex') === '0') {
        e.preventDefault(); el.click();
      }
    }
  });

  renderTechniques('九法');
  // Activate 九法 filter chip by default
  const jfChip = document.querySelector('#page-techniques .filter-bar .filter-chip:nth-child(2)');
  if(jfChip){
    jfChip.classList.add('active'); jfChip.setAttribute('aria-selected','true');
    const allChip = document.querySelector('#page-techniques .filter-bar .filter-chip:first-child');
    allChip.classList.remove('active'); allChip.setAttribute('aria-selected','false');
  }
  renderFreqSelector();
  renderBayi();
  decorateHealthBands();
  renderFigures();
  renderTexts('all');
  renderReadher();
  decorateReadherChapters();
  initHerbMasters();
  decorateCards();

  // Mobile back button closes modals
  window.addEventListener('popstate', function(e) {
    if(document.getElementById('tech-modal').classList.contains('show')) {
      hideTechModal();
      return;
    }
    if(document.getElementById('compare-modal').classList.contains('show')) {
      document.getElementById('compare-modal').classList.remove('show');
      document.body.style.overflow = '';
      return;
    }
  });

  // Delegated click handler: all expand-panel cards open in modal (avoids CSS grid row expansion bug)
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.card');
    if (!card || !card.querySelector('.expand-panel')) return;
    if (card.hasAttribute('onclick')) return;
    e.stopPropagation();
    const title = card.querySelector('.card-title')?.textContent || '';
    const panel = card.querySelector('.expand-panel');
    if (panel && panel.innerHTML.trim()) {
      let tagsHtml = '';
      card.querySelectorAll('.card-tag').forEach(function(t) { tagsHtml += t.outerHTML + ' '; });
      const bodyEl = card.querySelector('.card-body');
      openGenericModal(title, panel.innerHTML, {
        tags: tagsHtml,
        bodyPreview: bodyEl ? bodyEl.textContent.substring(0, 100) : ''
      }, card);
    }
  });

  // Escape key closes modals
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') {
      if(document.getElementById('tech-modal').classList.contains('show')) { closeTechModal(); return; }
      if(document.getElementById('compare-modal').classList.contains('show')) { closeCompare(); return; }
    }
  });

  // ===== REFINEMENTS =====

  // #2 Card glow follow + 3D tilt (mousemove on cards)
  document.addEventListener('mousemove', function(e) {
    const card = e.target.closest ? e.target.closest('.card') : null;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width;
    const my = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', (mx * 100) + '%');
    card.style.setProperty('--my', (my * 100) + '%');
    const tiltX = (my - 0.5) * -12;
    const tiltY = (mx - 0.5) * 12;
    card.style.setProperty('--rx', tiltX.toFixed(2) + 'deg');
    card.style.setProperty('--ry', tiltY.toFixed(2) + 'deg');
  });
  document.addEventListener('mouseleave', function(e) {
    const card = e.target.closest ? e.target.closest('.card') : null;
    if (!card) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
  }, true);

  // #3 Scroll reveal (bidirectional, per element)
  srInit();

  // Footer quote rotation
  var quotes = [
    '「凡人之所以衰微者，皆伤于阴阳交接之道尔。」——《素女经》',
    '「高可以治小疾，次可以免虚耗而已。」——《抱朴子》',
    '「男不可无女，女不可无男。」——《千金方》',
    '「凡养生，要在于爱情。」——《千金方》',
    '「道甚易知，人不能信而行之耳。」——《玉房秘诀》',
    '「练气数行，去故纳新，以自助也。」——《素女经》',
    '「冬三月，此谓闭藏。水冰地坼，无扰乎阳。」——《黄帝内经》'
  ];
  var fq = document.getElementById('footer-quote');
  if (fq) fq.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  // ===== HOMEPAGE ATMOSPHERIC BACKGROUND =====
  (function() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var raf;

    var blobs = [
      {cx: 0.3, cy: 0.35, r: 0.35, sx: 0.0004, sy: 0.0003, px: 28, py: 32, ox: 0, oy: 0},
      {cx: 0.7, cy: 0.65, r: 0.30, sx: 0.0003, sy: 0.0004, px: 35, py: 25, ox: 2, oy: 4}
    ];

    function getColors() {
      var dark = document.documentElement.getAttribute('data-theme') !== 'light';
      return [
        {c: dark ? 'rgba(180,140,60' : 'rgba(150,120,40', a: dark ? 0.18 : 0.10},
        {c: dark ? 'rgba(160,70,50'  : 'rgba(140,60,40',  a: dark ? 0.12 : 0.07}
      ];
    }
    var colors = getColors();

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function draw(t) {
      var w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i], c = colors[i];
        var x = (b.cx + Math.sin(t * b.sx + b.ox) * 0.08) * w;
        var y = (b.cy + Math.cos(t * b.sy + b.oy) * 0.08) * h;
        var pulse = 1 + Math.sin(t * 0.0008 + i * 3) * 0.08;
        var rad = b.r * Math.max(w, h) * pulse;
        var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, c.c + ',' + c.a + ')');
        g.addColorStop(0.5, c.c + ',' + (c.a * 0.4) + ')');
        g.addColorStop(1, c.c + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      var w2 = w / 2, h2 = h / 2;
      var breathT = t * 0.0027;
      var breathR = (0.28 + Math.sin(breathT) * 0.06) * Math.max(w, h);
      var breathA = (1 + Math.sin(breathT) * 0.15);
      var dark = document.documentElement.getAttribute('data-theme') !== 'light';
      var sc = dark ? '180,150,80' : '160,130,60';
      var sa = dark ? 0.12 : 0.07;
      var sg = ctx.createRadialGradient(w2, h2, 0, w2, h2, breathR);
      sg.addColorStop(0,   'rgba(' + sc + ',' + (sa * breathA) + ')');
      sg.addColorStop(0.3, 'rgba(' + sc + ',' + (sa * 0.5 * breathA) + ')');
      sg.addColorStop(0.7, 'rgba(' + sc + ',' + (sa * 0.1) + ')');
      sg.addColorStop(1,   'rgba(' + sc + ',0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);
    }

    var reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var last = 0;
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      if (!reducedMotion) {
        if (ts - last < 33) return;
        last = ts;
      }
      draw(ts / 16);
      if (reducedMotion) { cancelAnimationFrame(raf); }
    }
    raf = requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { last = 0; raf = requestAnimationFrame(loop); }
    });

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    var observer = new MutationObserver(function() {
      colors = getColors();
    });
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  }());
});

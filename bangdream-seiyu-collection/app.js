(() => {
  const $ = (s) => document.querySelector(s);
  const WARN_TAGS = new Set(['복제', '중고구매']);

  // 카드는 처음에 모두 접힌 상태. 펼친 카드 목록만 브라우저에 저장해서 새로고침해도 유지
  // (저장소를 못 쓰는 환경이면 그냥 메모리로만 동작)
  const OPENED_KEY = 'seiyu.opened';
  const loadOpened = () => {
    try {
      const ids = JSON.parse(localStorage.getItem(OPENED_KEY) || '[]');
      return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : []);
    } catch { return new Set(); }
  };
  const saveOpened = () => {
    try { localStorage.setItem(OPENED_KEY, JSON.stringify([...state.opened])); } catch { /* 무시 */ }
  };

  const state = { band: 'all', q: '', opened: loadOpened() };

  // 작은 DOM 헬퍼 (textContent 사용)
  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return el;
  }

  const cvar = (a) => `--c:${BANDS[a.band] || '#888'}`;

  // 전체 사인을 평평한 목록으로
  const allSigns = ACTORS.flatMap((actor) =>
    actor.signs.map((sign) => ({ actor, sign, event: EVENTS[sign.event], eventId: sign.event }))
  );

  function matches({ actor, event, sign }) {
    if (state.band !== 'all' && actor.band !== state.band) return false;
    const q = state.q.trim().toLowerCase();
    if (!q) return true;
    return [actor.character, actor.cv, actor.band, event.name, event.when, sign.note, ...(sign.tags || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
  }

  const tagEls = (tags = []) => tags.map((t) => h('span', { class: 'tag' + (WARN_TAGS.has(t) ? ' warn' : '') }, t));

  // 사인 사진 (image: 경로 한 개 또는 경로 배열). 사진이 없는 사인에는 아무것도 만들지 않음
  const photoEls = (sign, label) =>
    [].concat(sign.image || []).map((src, i, all) => {
      const cap = all.length > 1 ? `${label} (${i + 1}/${all.length})` : label;
      return h('button', { class: 'photo', type: 'button', 'aria-label': `${cap} 사진 크게 보기`, onclick: () => openLightbox(src, cap) },
        h('img', { src, alt: `${cap} 사인 사진`, loading: 'lazy' }));
    });

  /* ───── 캐릭터별 ───── */
  function renderActors(list) {
    const byActor = new Map();
    list.forEach((s) => { if (!byActor.has(s.actor)) byActor.set(s.actor, []); byActor.get(s.actor).push(s); });
    return h('div', { class: 'grid' }, [...byActor].map(([actor, items]) =>
      h('details', {
        class: 'card', style: cvar(actor), open: state.opened.has(actor.id),
        ontoggle: (e) => {
          if (e.target.open) state.opened.add(actor.id); else state.opened.delete(actor.id);
          saveOpened();
          updateToggleAll();
        },
      },
        h('summary', {},
          h('span', { class: 'count' }, `${items.length}개`),
          h('h3', {}, actor.character),
          h('p', { class: 'sub' }, 'CV. ', h('b', {}, actor.cv)),
          h('span', { class: 'band' }, actor.band)),
        h('ul', { class: 'signs' }, items.map(({ sign, event }) =>
          h('li', { class: 'sign' },
            h('div', { class: 'sign-body' },
              h('div', { class: 'sign-title' }, event.name),
              h('div', { class: 'sign-meta' }, [event.when, sign.note].filter(Boolean).join(' · ')),
              tagEls(sign.tags),
              photoEls(sign, `${actor.character} · ${event.name}`)))))
      )));
  }

  /* ───── 렌더 ───── */
  function render() {
    const list = allSigns.filter(matches);
    $('#view').replaceChildren(
      list.length ? renderActors(list) : h('p', { class: 'empty' }, '조건에 맞는 사인이 없어요.'));
    updateToggleAll();
  }

  // 전체 접기/펼치기 버튼
  const toggleAll = $('#toggleAll');
  function updateToggleAll() {
    const items = document.querySelectorAll('#view details');
    toggleAll.hidden = !items.length;
    toggleAll.textContent = [...items].some((d) => d.open) ? '모두 접기' : '모두 펼치기';
  }
  toggleAll.addEventListener('click', () => {
    const items = [...document.querySelectorAll('#view details')];
    const open = !items.some((d) => d.open);
    items.forEach((d) => { d.open = open; });
  });

  function renderChips() {
    const bands = [...new Set(ACTORS.map((a) => a.band))];
    const wrap = $('#bandChips');
    const chip = (value, label, c) =>
      h('button', {
        class: 'chip', type: 'button', style: c ? `--c:${c}` : '', 'aria-pressed': String(state.band === value),
        onclick: () => { state.band = value; renderChips(); render(); },
      }, c && h('i'), label);
    wrap.replaceChildren(chip('all', '전체'), ...bands.map((b) => chip(b, b, BANDS[b])));
  }

  /* ───── 사진 확대 보기 ───── */
  const box = $('#lightbox');
  function openLightbox(src, caption) {
    box.querySelector('img').src = src;
    box.querySelector('img').alt = caption;
    box.querySelector('.cap').textContent = caption;
    box.showModal();
  }
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

  /* ───── 이벤트 연결 ───── */
  $('#search').addEventListener('input', (e) => { state.q = e.target.value; render(); });

  renderChips();
  render();
})();

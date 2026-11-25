/*
  사인 컬렉션 데이터
  ─────────────────────────────────────────────
  새 사인을 추가하려면:
   1) EVENTS 에 행사가 없으면 한 줄 추가
   2) ACTORS 의 해당 캐릭터 signs 배열에 { event, note, tags, image } 추가
   - 새 캐릭터는 ACTORS 에 { id, character, cv, band, signs } 블록을 추가
     (band 는 BANDS 의 이름과 똑같이 적어야 색이 적용됩니다. 목록에 없는 밴드는 BANDS 에도 한 줄 추가)
   - image: 사진 경로. 예) image: 'images/kasumi-agf2018.jpg'  (여러 장이면 배열: image: ['images/a.jpg', 'images/b.jpg'])
            사진이 있는 사인에만 사진이 크게 표시되고, 누르면 확대됩니다 (생략 가능)
   - imagePos: 사진이 정사각형으로 잘릴 때 보여줄 위치 '가로% 세로%' (생략하면 가운데 '50% 50%')
            세로로 긴 사진은 세로% (0% = 위, 100% = 아래), 가로로 긴 사진은 가로% (0% = 왼쪽, 100% = 오른쪽)
   - note : 짧은 메모 (생략 가능)
   - tags : 복제 / 중고구매 같은 표시 (생략 가능)
*/

// 행사 종류 (화면에 보이는 순서)
const TYPES = [
  { id: 'delivery', label: '전달회',        en: 'Delivery' },
  { id: 'event',    label: '페스 · 이벤트', en: 'Fes & Event' },
  { id: 'fanmeet',  label: '팬미팅',        en: 'Fan Meeting' },
  { id: 'live',     label: '라이브',        en: 'Live' },
  { id: 'talk',     label: '토크쇼',        en: 'Talk Show' },
];

// 밴드 (색상은 화면용 대표색)
const BANDS = {
  'Poppin\'Party':      '#ff3377',
  'Roselia':            '#3344aa',
  'Hello, Happy World!': '#ffdd00',
  'Morfonica':          '#33aaff',
  'RAISE A SUILEN':     '#33cccc',
  'MyGO!!!!!':          '#0088bb',
  // 아직 사인이 없는 밴드 (캐릭터를 추가하면 필터 칩이 자동으로 생깁니다)
  'Afterglow':          '#ee3344',
  'Pastel*Palettes':    '#33ddaa',
  'Ave Mujica':         '#881144',
  '무겐다이 뮤타입':    '#ff7788',
  'millsage':           '#aa22ee',
  '일가 Dumb Rock!':    '#ffaa33',
};

// 행사 목록  (when: 시기, 모르면 비워도 됨)
const EVENTS = {
  agf2018:     { name: 'AGF 2018 전달회',            type: 'delivery', when: '2018' },
  agf2023:     { name: 'AGF 2023 전달회 굿즈',        type: 'delivery', when: '2023. 12.' },
  kimkuku24:   { name: '2024 여름 김쿠 with 일러스타 페스', type: 'event',    when: '2024.08.' },
  kimchikura23:{ name: '2023 4월 김치쿠라',           type: 'event',    when: '2023.04.' },
  teamY:       { name: '팀 Y + 아이아이',             type: 'event',    when: '2025.03.' },
  aimiFan:     { name: '아이미 팬미 (라이스몬스터)', type: 'fanmeet',  when: '2026. 03.' },
  kudoFan:     { name: '쿠도 하루카 팬미',            type: 'fanmeet',  when: '2026. 10.' },
  nakashimaFan:{ name: '나카시마 유키 팬미',          type: 'fanmeet',  when: '2026. 11.' },
  tadokoroFan: { name: '타도코로 아즈사 팬미',        type: 'fanmeet',  when: '2026. 06.' },
  shindoFan:   { name: '신도 아마네 팬미',            type: 'fanmeet',  when: '2023. 10.' },
  aimiLive:    { name: '아이미 라이브',               type: 'live',     when: '2026. 11.' },
  yumeTalk:    { name: '꿈의 결창 토크쇼',            type: 'talk',     when: '2025. 06.' },
};

// 캐릭터 / 성우 / 받은 사인
const ACTORS = [
  {
    id: 'kasumi', character: '토야마 카스미', cv: '아이미', band: 'Poppin\'Party',
    signs: [
      //{ event: 'agf2018'},
      { event: 'kimkuku24', image: 'images/1-aimi/kimchikura2024.jpg' },
      { event: 'teamY', image: 'images/1-aimi/teamy2025.jpg', imagePos: '50% 80%' },
      { event: 'aimiFan', image: 'images/1-aimi/ricemonster.jpg' },
      { event: 'aimiLive' },
    ],
  },
  {
    id: 'arisa', character: '이치가야 아리사', cv: '이토 아야사', band: 'Poppin\'Party',
    signs: [
      { event: 'teamY', image: 'images/5-ito-ayasa/teamy2025.jpg', imagePos: '50% 100%' },
    ],
  },
  {
    id: 'yukina', character: '미나토 유키나', cv: '아이바 아이나', band: 'Roselia',
    signs: [
      { event: 'kimchikura23', image: 'images/16-aiba-aina/kimchikura2023.jpg', imagePos: '0% 50%' },
      { event: 'teamY', image: 'images/16-aiba-aina/teamy2025.jpg', imagePos: '50% 100%' },
      { event: 'yumeTalk', image: 'images/16-aiba-aina/img_3263.jpg' },
    ],
  },
  {
    id: 'sayo', character: '히카와 사요', cv: '쿠도 하루카', band: 'Roselia',
    signs: [
      { event: 'kudoFan', image: 'images/17-kudo-haruka/img_3260.jpg' },
    ],
  },
  {
    id: 'lisa', character: '이마이 리사', cv: '나카시마 유키', band: 'Roselia',
    signs: [
      { event: 'nakashimaFan', image: 'images/18-nakashima-yuki/20261124_204654.jpg' },
    ],
  },
  {
    id: 'kaoru', character: '세타 카오루', cv: '타도코로 아즈사', band: 'Hello, Happy World!',
    signs: [
      { event: 'tadokoroFan', image: 'images/22-tatokoro-azusa/20260614_025320.jpg', imagePos: '50% 0%' },
    ],
  },
  {
    id: 'mashiro', character: '쿠라타 마시로', cv: '신도 아마네', band: 'Morfonica',
    signs: [
      { event: 'shindoFan', image: 'images/26-shindo-amane/img_4191.jpg', imagePos: '34% 50%' },
    ],
  },
  {
    id: 'pareo', character: '파레오', cv: '쿠라치 레오', band: 'RAISE A SUILEN',
    signs: [
      { event: 'kimkuku24', image: 'images/35-kurachi-reo/kimchikura2024.jpg' },
    ],
  },
  {
    id: 'rana', character: '카나메 라나', cv: '아오키 히나', band: 'MyGO!!!!!',
    signs: [
      { event: 'agf2023', image: 'images/40-aoki-hina/20231211_195831.jpg' },
    ],
  },
];

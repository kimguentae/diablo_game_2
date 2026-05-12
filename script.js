const players = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
].map(n => ({
  name: n,
  active: false,
  paired: false
}));

const listEl = document.getElementById("playerList");
const countEl = document.getElementById("count");

const p1Sel = document.getElementById("p1");
const p2Sel = document.getElementById("p2");

const addPairBtn = document.getElementById("addPair");
const pairList = document.getElementById("pairList");

let pairs = [];

/* =========================
   PLAYER
========================= */
function renderPlayers(){
  listEl.innerHTML = "";

  players.forEach(p=>{
    const div = document.createElement("div");
    div.className = "player";
    div.textContent = p.name;

    listEl.appendChild(div);
  });

  countEl.textContent = players.filter(p=>p.active).length;
}

function toggleActive(name){
  const p = players.find(x=>x.name===name);
  p.active = !p.active;
  renderSelect();
  renderPlayers();
}

/* 클릭 이벤트 따로 */
function attachClick(){
  Array.from(listEl.children).forEach(el=>{
    el.onclick = ()=>{
      toggleActive(el.textContent);
    };
  });
}

/* =========================
   SELECT (핵심 개선)
========================= */
function renderSelect(){
  const available = players.filter(p => p.active && !p.paired);

  p1Sel.innerHTML = "";
  p2Sel.innerHTML = "";

  const optA = document.createElement("option");
  optA.text = "PLAYER 1";
  optA.value = "";

  const optB = document.createElement("option");
  optB.text = "PLAYER 2";
  optB.value = "";

  p1Sel.appendChild(optA);
  p2Sel.appendChild(optB);

  available.forEach(p=>{
    const o1 = document.createElement("option");
    const o2 = document.createElement("option");

    o1.value = p.name;
    o2.value = p.name;

    o1.textContent = p.name;
    o2.textContent = p.name;

    p1Sel.appendChild(o1);
    p2Sel.appendChild(o2);
  });

  /* 🔥 서로 중복 제거 */
  p1Sel.onchange = () => filterSecond();
}

function filterSecond(){
  const selected = p1Sel.value;

  Array.from(p2Sel.options).forEach(opt=>{
    opt.disabled = (opt.value === selected && opt.value !== "");
  });
}

/* =========================
   PAIR 생성
========================= */
addPairBtn.onclick = () => {
  const a = p1Sel.value;
  const b = p2Sel.value;

  if(!a || !b || a === b) return;

  const p1 = players.find(p=>p.name===a);
  const p2 = players.find(p=>p.name===b);

  p1.paired = true;
  p2.paired = true;

  pairs.push([a,b]);

  renderPairs();
  renderSelect();
};

/* =========================
   PAIR 출력
========================= */
function renderPairs(){
  pairList.innerHTML = "";

  pairs.forEach((pair,i)=>{
    const div = document.createElement("div");
    div.className = "pair";
    div.textContent = `PAIR ${i+1} : ${pair[0]} ${pair[1]}`;

    pairList.appendChild(div);
  });
}

/* =========================
   INIT
========================= */
renderPlayers();
attachClick();
renderSelect();
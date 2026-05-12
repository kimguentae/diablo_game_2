const players = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
].map(n => ({ name: n, active: false }));

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
    div.className = "player" + (p.active ? " active" : "");
    div.innerText = p.name;

    div.onclick = ()=>{
      p.active = !p.active;
      renderPlayers();
      renderSelect();
    };

    listEl.appendChild(div);
  });

  countEl.innerText = players.filter(p=>p.active).length;
}

renderPlayers();
renderSelect();

/* =========================
   SELECT (휠)
========================= */
function renderSelect(){
  const active = players.filter(p=>p.active);

  p1Sel.innerHTML = "";
  p2Sel.innerHTML = "";

  active.forEach(p=>{
    const o1 = document.createElement("option");
    const o2 = document.createElement("option");

    o1.value = o2.value = p.name;
    o1.textContent = o2.textContent = p.name;

    p1Sel.appendChild(o1);
    p2Sel.appendChild(o2);
  });
}

/* =========================
   PAIR 생성 (+ 버튼)
========================= */
addPairBtn.onclick = ()=>{
  const a = p1Sel.value;
  const b = p2Sel.value;

  if(!a || !b || a === b) return;

  const id = Date.now();
  pairs.push({id, a, b});
  renderPairs();
};

function renderPairs(){
  pairList.innerHTML = "";

  pairs.forEach(p=>{
    const div = document.createElement("div");
    div.className = "pair";
    div.textContent = `PAIR: ${p.a} + ${p.b}`;

    // 클릭 삭제
    div.onclick = ()=>{
      pairs = pairs.filter(x => x.id !== p.id);
      renderPairs();
    };

    pairList.appendChild(div);
  });
}
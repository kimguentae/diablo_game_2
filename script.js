const COURTS = ["A","B","C"];

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map(n => ({
  name: n,
  active: false
}));

let pairs = [];
const setStore = {1:null,2:null,3:null,4:null,5:null};

/* =========================
   ELEMENT
========================= */
const listEl = document.getElementById("playerList");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const addPair = document.getElementById("addPair");
const pairList = document.getElementById("pairList");

/* =========================
   PLAYER
========================= */
function renderPlayers(){
  listEl.innerHTML = "";

  const sorted = [
    ...players.filter(p=>p.active),
    ...players.filter(p=>!p.active)
  ];

  sorted.forEach(p=>{
    const div = document.createElement("div");
    div.className = "player" + (p.active ? " active" : "");
    div.textContent = p.name;

    div.onclick = ()=>{
      p.active = !p.active;
      renderAll();
    };

    listEl.appendChild(div);
  });

  const guest = document.createElement("div");
  guest.className = "player guest";
  guest.textContent = "+";

  guest.onclick = ()=>{
    const name = prompt("GUEST NAME");
    if(!name) return;

    players.push({name, active:true});
    renderAll();
  };

  listEl.appendChild(guest);

  countEl.textContent = players.filter(p=>p.active).length;
}

/* =========================
   SELECT
========================= */
function renderSelect(){
  const active = players.filter(p=>p.active);

  p1.innerHTML = "";
  p2.innerHTML = "";

  p1.appendChild(new Option("PLAYER1",""));
  p2.appendChild(new Option("PLAYER2",""));

  active.forEach(p=>{
    p1.appendChild(new Option(p.name,p.name));
    p2.appendChild(new Option(p.name,p.name));
  });
}

/* =========================
   PAIR
========================= */
addPair.onclick = ()=>{
  const a = p1.value;
  const b = p2.value;

  if(!a || !b || a === b) return;

  if(pairs.some(p => p.includes(a) || p.includes(b))) return;

  pairs.push([a,b]);

  p1.value = "";
  p2.value = "";

  renderAll();
};

function renderPairs(){
  pairList.innerHTML = "";

  pairs.forEach((p,i)=>{
    const div = document.createElement("div");
    div.className = "pairItem";
    div.textContent = `PAIR ${i+1} : ${p[0]} ${p[1]}`;

    div.onclick = ()=>{
      pairs = pairs.filter(x=>x!==p);
      renderAll();
    };

    pairList.appendChild(div);
  });
}

/* =========================
   🔥 GAME (최종 안정 구조)
========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    const setNo = btn.dataset.set;
    const active = players.filter(p=>p.active);

    if(active.length < 4){
      alert("인원 부족");
      return;
    }

    let used = new Set();
    let teams = [];

    // 1️⃣ FIXED PAIR → 팀 생성
    pairs.forEach(p=>{
      const a = active.find(x=>x.name === p[0]);
      const b = active.find(x=>x.name === p[1]);

      if(a && b){
        teams.push([a, b]);
        used.add(a.name);
        used.add(b.name);
      }
    });

    // 2️⃣ 나머지 → 팀 생성
    let rest = active.filter(p => !used.has(p.name));
    shuffle(rest);

    let soloTeams = [];

    for(let i=0;i<rest.length;i+=2){
      if(rest[i+1]){
        soloTeams.push([rest[i], rest[i+1]]);
      }
    }

    // 3️⃣ 전체 팀 합치기
    let allTeams = [...teams, ...soloTeams];

    // ⭐ 핵심: 팀 자체 섞기 (이게 상대 고정 방지 핵심)
    shuffle(allTeams);

    // 4️⃣ 팀 vs 팀 매칭
    let matches = [];

    for(let i=0;i<allTeams.length;i+=2){
      const teamA = allTeams[i];
      const teamB = allTeams[i+1];

      if(!teamA || !teamB) continue;

      matches.push([
        teamA[0], teamA[1],
        teamB[0], teamB[1]
      ]);
    }

    setStore[setNo] = matches;
    renderResult();
  };
});

/* =========================
   RESULT
========================= */
function renderResult(){
  resultEl.innerHTML = "";

  for(let i=1;i<=5;i++){
    const data = setStore[i];
    if(!data) continue;

    const div = document.createElement("div");
    div.className = "result-set";

    div.innerHTML =
      `(${i}SET)<br>` +
      data.map((t,idx)=>
        `${COURTS[idx] || "C"}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
      ).join("<br>");

    resultEl.appendChild(div);
  }
}

/* =========================
   shuffle
========================= */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    let j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* =========================
   INIT
========================= */
function renderAll(){
  renderPlayers();
  renderSelect();
  renderPairs();
  renderResult();
}

renderAll();
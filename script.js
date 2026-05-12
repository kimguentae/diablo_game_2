const COURTS = ["A","B","C"];

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map(n => ({
  name:n,
  active:false
}));

let pairs = [];

// 🔥 SET 간 연결 핵심
window.nextWaiting = [];

const listEl = document.getElementById("playerList");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const addPair = document.getElementById("addPair");
const pairList = document.getElementById("pairList");

/* ================= PLAYER ================= */
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

/* ================= SELECT ================= */
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

/* ================= FIXED PAIR ================= */
addPair.onclick = ()=>{
  const a = p1.value;
  const b = p2.value;

  if(!a || !b || a===b) return;

  if(pairs.some(x=>x.includes(a)||x.includes(b))) return;

  pairs.push([a,b]);

  p1.value="";
  p2.value="";

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

/* ================= GAME ================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    let active = players.filter(p=>p.active);

    // 🔥 이전 SET 대기자 먼저 무조건 투입
    active = [...window.nextWaiting, ...active];
    window.nextWaiting = [];

    active = [...new Map(active.map(p=>[p.name,p])).values()];

    if(active.length < 4){
      alert("인원 부족");
      return;
    }

    let used = new Set();
    let teams = [];

    pairs.forEach(([a,b])=>{
      const pa = active.find(p=>p.name===a);
      const pb = active.find(p=>p.name===b);

      if(pa && pb){
        teams.push([pa,pb]);
        used.add(a);
        used.add(b);
      }
    });

    let rest = active.filter(p=>!used.has(p.name));
    shuffle(rest);

    let matches = [];

    for(let i=0;i<COURTS.length;i++){
      if(rest[i*4+3]){
        matches.push([
          rest[i*4],
          rest[i*4+1],
          rest[i*4+2],
          rest[i*4+3]
        ]);
      }
    }

    let played = new Set();
    matches.forEach(m=>{
      m.forEach(p=>played.add(p.name));
    });

    // 🔥 다음 SET 대기자 생성
    window.nextWaiting = active.filter(p=>!played.has(p.name));

    renderResult(matches);
  };
});

/* ================= RESULT ================= */
function renderResult(matches){

  resultEl.innerHTML = "";

  const div = document.createElement("div");
  div.className = "result-set";

  div.innerHTML = `
    <b>GAME RESULT</b><br><br>

    ${matches.map((m,i)=>`
      ${COURTS[i]}코트:
      ${m[0].name} ${m[1].name} vs ${m[2].name} ${m[3].name}
    `).join("<br>")}

    <br><br>

    <b>대기 (다음 SET 자동 참가)</b><br>
    ${window.nextWaiting.length ? window.nextWaiting.map(p=>p.name).join(" ") : "없음"}
  `;

  resultEl.appendChild(div);
}

/* ================= UTIL ================= */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    let j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* ================= INIT ================= */
function renderAll(){
  renderPlayers();
  renderSelect();
  renderPairs();
}

renderAll();
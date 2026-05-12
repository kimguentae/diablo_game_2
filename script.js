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
   PLAYER + GUEST (유지)
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

  // GUEST 버튼 유지 (삭제 금지 원칙 반영)
  const guest = document.createElement("div");
  guest.className = "player guest";
  guest.textContent = "+";

  guest.onclick = ()=>{
    const name = prompt("GUEST NAME");
    if(!name) return;

    players.push({
      name,
      active:true
    });

    renderAll();
  };

  listEl.appendChild(guest);

  countEl.textContent = players.filter(p=>p.active).length;
}

/* =========================
   FIXED PAIR SELECT
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

  if(!a || !b || a===b) return;

  pairs.push([a,b]);
  renderPairs();
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
   GAME
========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    const setNo = btn.dataset.set;
    const active = players.filter(p=>p.active);

    if(active.length < 4){
      alert("인원 부족");
      return;
    }

    let pool = [...active];
    shuffle(pool);

    let matches = [];

    for(let i=0;i<COURTS.length;i++){
      if(pool.length < 4) break;
      matches.push(pool.splice(0,4));
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
        `${COURTS[idx]}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
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
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
let prevWaiting = []; // 🔥 이전 SET 대기자 저장

/* ========================= */
const listEl = document.getElementById("playerList");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const addPair = document.getElementById("addPair");
const pairList = document.getElementById("pairList");

/* ========================= PLAYER ========================= */
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

/* ========================= SELECT ========================= */
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

/* ========================= FIXED PAIR ========================= */
addPair.onclick = ()=>{
  const a = p1.value;
  const b = p2.value;
  if(!a || !b || a===b) return;
  if(pairs.some(x=>x.includes(a)||x.includes(b))) return;
  pairs.push([a,b]);
  p1.value=""; p2.value="";
  renderAll();
};

function renderPairs(){
  pairList.innerHTML="";
  pairs.forEach((p,i)=>{
    const div=document.createElement("div");
    div.className="pairItem";
    div.textContent=`PAIR ${i+1} : ${p[0]} ${p[1]}`;
    div.onclick=()=>{
      pairs=pairs.filter(x=>x!==p);
      renderAll();
    };
    pairList.appendChild(div);
  });
}

/* ========================= SET GENERATE ========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{
    const setNo = Number(btn.dataset.set);
    const active = players.filter(p=>p.active);
    if(active.length<4){
      alert("인원 부족");
      return;
    }

    /* 1️⃣ 이전 SET 대기자 우선 */
    let ordered = [];
    if(setNo>1 && prevWaiting.length){
      ordered = [...prevWaiting];
    }

    let rest = active.filter(p=>!ordered.some(x=>x.name===p.name));
    shuffle(rest);
    ordered = [...ordered, ...rest];

    /* 2️⃣ 고정페어 처리 */
    let used = new Set();
    let teams = [];

    pairs.forEach(pair=>{
      const a = ordered.find(p=>p.name===pair[0]);
      const b = ordered.find(p=>p.name===pair[1]);
      if(a && b && !used.has(a.name) && !used.has(b.name)){
        teams.push([a,b]);
        used.add(a.name); used.add(b.name);
      }
    });

    /* 3️⃣ 나머지 랜덤 팀 */
    let remain = ordered.filter(p=>!used.has(p.name));
    let soloTeams=[];
    for(let i=0;i<remain.length;i+=2){
      if(remain[i+1]){
        soloTeams.push([remain[i],remain[i+1]]);
      }
    }

    let allTeams=[...teams,...soloTeams];

    /* 4️⃣ 3코트만 경기 배정 */
    let matches=[];
    let played=new Set();

    for(let i=0;i<COURTS.length;i++){
      if(allTeams[i*2] && allTeams[i*2+1]){
        const t1=allTeams[i*2];
        const t2=allTeams[i*2+1];
        matches.push([t1[0],t1[1],t2[0],t2[1]]);
        [...t1,...t2].forEach(p=>played.add(p.name));
      }
    }

    /* 5️⃣ 대기자 저장 (🔥 핵심) */
    prevWaiting = active.filter(p=>!played.has(p.name));

    setStore[setNo]=matches;
    renderResult();
  };
});

/* ========================= RESULT ========================= */
function renderResult(){
  resultEl.innerHTML="";
  const activePlayers=players.filter(p=>p.active);

  for(let i=1;i<=5;i++){
    const data=setStore[i];
    if(!data) continue;

    const div=document.createElement("div");
    div.className="result-set";

    let played=new Set();
    let html=`(${i}SET)<br>`;

    data.forEach((t,idx)=>{
      html+=`${COURTS[idx]}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}<br>`;
      t.forEach(p=>played.add(p.name));
    });

    const waiting=activePlayers.filter(p=>!played.has(p.name));
    html+=`<br>대기 : ${waiting.map(p=>p.name).join(" ")}`;

    div.innerHTML=html;
    resultEl.appendChild(div);
  }
}

/* ========================= UTIL ========================= */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* ========================= INIT ========================= */
function renderAll(){
  renderPlayers();
  renderSelect();
  renderPairs();
  renderResult();
}

renderAll();
const COURTS = ["A","B","C"];

const players = Array.from({length:28}, (_,i)=>({
  name:i+1,
  active:false,
  playCount:0
}));

const setStore = {1:null,2:null,3:null,4:null,5:null};
let pairs = [];

/* 🔥 핵심: 파트너 중복 기록 (Set) */
const usedPairs = new Set();

/* ================= UTIL ================= */
function key(a,b){
  return [a.name,b.name].sort((x,y)=>x-y).join("-");
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* ================= SET 생성 ================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{

    const active = players.filter(p=>p.active);
    if(active.length < 4) return;

    let used = new Set();
    let teams = [];

    /* 1️⃣ 고정 페어 */
    pairs.forEach(p=>{
      const a = active.find(x=>x.name===p[0]);
      const b = active.find(x=>x.name===p[1]);
      if(a && b){
        teams.push([a,b]);
        used.add(a.name);
        used.add(b.name);
      }
    });

    let rest = active.filter(p=>!used.has(p.name));

    /* 2️⃣ 공정성 정렬 (덜 뛴 사람 우선) */
    rest.sort((a,b)=>a.playCount - b.playCount);

    /* 3️⃣ 완전 랜덤 섞기 */
    shuffle(rest);

    let usedLocal = new Set();

    /* 4️⃣ 진짜 핵심: 2명씩 랜덤 pairing */
    for(let i=0;i<rest.length-1;i++){

      const a = rest[i];

      if(usedLocal.has(a.name)) continue;

      for(let j=i+1;j<rest.length;j++){
        const b = rest[j];

        if(usedLocal.has(b.name)) continue;

        const k = key(a,b);

        /* 🔥 같은 파트너 하루 1회 제한 */
        if(usedPairs.has(k)) continue;

        teams.push([a,b]);
        usedLocal.add(a.name);
        usedLocal.add(b.name);
        usedPairs.add(k);

        break;
      }
    }

    /* 5️⃣ 3코트 구성 */
    shuffle(teams);

    let matches = [];

    for(let i=0;i<3;i++){
      if(!teams[i*2] || !teams[i*2+1]) break;

      matches.push({
        team1: teams[i*2],
        team2: teams[i*2+1],
        s1:0,
        s2:0
      });
    }

    const setNo = btn.dataset.set;
    setStore[setNo] = {locked:false, matches};

    /* 6️⃣ 출전 기록 */
    const played = new Set();

    matches.forEach(m=>{
      [...m.team1,...m.team2].forEach(p=>played.add(p.name));
    });

    played.forEach(name=>{
      const p = players.find(x=>x.name===name);
      if(p) p.playCount++;
    });

    renderResult();
  };
});

/* ================= RESULT ================= */
function renderResult(){
  const resultEl = document.getElementById("result");
  resultEl.innerHTML="";

  const active = players.filter(p=>p.active);

  for(let i=1;i<=5;i++){
    const set = setStore[i];
    if(!set) continue;

    const wrap = document.createElement("div");
    wrap.className="result-set";

    const title = document.createElement("div");
    title.textContent = i + "SET";
    wrap.appendChild(title);

    set.matches.forEach((m,idx)=>{
      const line = document.createElement("div");
      line.textContent =
        `${COURTS[idx]}코트 : ${m.team1[0].name}-${m.team1[1].name} vs ${m.team2[0].name}-${m.team2[1].name}`;
      wrap.appendChild(line);
    });

    const wait = active.filter(p=>{
      return !set.matches.some(m=>
        [...m.team1,...m.team2].some(x=>x.name===p.name)
      );
    });

    const w = document.createElement("div");
    w.textContent = "대기 : " + wait.map(p=>p.name).join(" ");
    wrap.appendChild(w);

    resultEl.appendChild(wrap);
  }
}

/* ================= INIT ================= */
function renderAll(){
  renderResult();
}

renderAll();
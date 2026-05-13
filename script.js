const COURTS=["A","B","C"];

const players=Array.from({length:28},(_,i)=>({
  name:i+1,
  active:false,
  playCount:0
}));

let fixedPairs=[];
const setStore={1:null,2:null,3:null,4:null,5:null};
const partnerHistory=new Set();

/* ================= UTIL ================= */
function key(a,b){
  return [a.name,b.name].sort((x,y)=>x-y).join("-");
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

/* ================= PLAYER ================= */
function renderPlayers(){
  const el=document.getElementById("playerList");
  const count=document.getElementById("count");

  el.innerHTML="";

  [...players.filter(p=>p.active),...players.filter(p=>!p.active)]
  .forEach(p=>{
    const d=document.createElement("div");
    d.className="player"+(p.active?" active":"");
    d.textContent=p.name;
    d.onclick=()=>{
      p.active=!p.active;
      render();
    };
    el.appendChild(d);
  });

  count.textContent=players.filter(p=>p.active).length;
}

/* ================= PAIR ================= */
function renderPairs(){
  const el=document.getElementById("pairList");
  el.innerHTML="";

  fixedPairs.forEach((p,i)=>{
    const d=document.createElement("div");
    d.textContent=`PAIR ${i+1}: ${p[0]}-${p[1]}`;
    d.onclick=()=>{
      fixedPairs=fixedPairs.filter(x=>x!==p);
      render();
    };
    el.appendChild(d);
  });
}

/* ================= GENERATE ================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{

    const active=players.filter(p=>p.active);
    if(active.length<4) return;

    let used=new Set();
    let teams=[];

    /* 1. 고정페어 */
    fixedPairs.forEach(p=>{
      const a=active.find(x=>x.name===p[0]);
      const b=active.find(x=>x.name===p[1]);
      if(a&&b){
        teams.push([a,b]);
        used.add(a.name);
        used.add(b.name);
      }
    });

    let rest=active.filter(p=>!used.has(p.name));

    /* 2. 공정성 */
    rest.sort((a,b)=>a.playCount-b.playCount);

    /* 3. 랜덤 */
    shuffle(rest);

    let usedLocal=new Set();

    /* 4. pairing */
    for(let i=0;i<rest.length;i++){
      const a=rest[i];
      if(usedLocal.has(a.name)) continue;

      for(let j=i+1;j<rest.length;j++){
        const b=rest[j];
        if(usedLocal.has(b.name)) continue;

        const k=key(a,b);
        if(partnerHistory.has(k)) continue;

        teams.push([a,b]);
        usedLocal.add(a.name);
        usedLocal.add(b.name);
        partnerHistory.add(k);
        break;
      }
    }

    /* 5. 3코트 */
    shuffle(teams);

    let matches=[];

    for(let i=0;i<3;i++){
      if(!teams[i*2]) break;

      matches.push({
        team1:teams[i*2],
        team2:teams[i*2+1]
      });
    }

    setStore[btn.dataset.set]={matches};

    /* 6. 출전 기록 */
    const played=new Set();

    matches.forEach(m=>{
      [...m.team1,...m.team2].forEach(p=>played.add(p.name));
    });

    played.forEach(n=>{
      const p=players.find(x=>x.name===n);
      if(p) p.playCount++;
    });

    render();
  };
});

/* ================= RESULT ================= */
function renderResult(){
  const el=document.getElementById("result");
  el.innerHTML="";

  const active=players.filter(p=>p.active);

  for(let i=1;i<=5;i++){
    const set=setStore[i];
    if(!set) continue;

    const wrap=document.createElement("div");
    wrap.className="result-set";

    wrap.innerHTML=`<b>${i}SET</b>`;

    set.matches.forEach((m,idx)=>{
      const d=document.createElement("div");
      d.textContent=
        `${COURTS[idx]}: ${m.team1[0].name}-${m.team1[1].name} vs ${m.team2[0].name}-${m.team2[1].name}`;
      wrap.appendChild(d);
    });

    const wait=active.filter(p=>
      !set.matches.some(m=>
        [...m.team1,...m.team2].some(x=>x.name===p.name)
      )
    );

    const w=document.createElement("div");
    w.textContent="대기: "+wait.map(p=>p.name).join(" ");
    wrap.appendChild(w);

    el.appendChild(wrap);
  }
}

/* ================= FIXED PAIR UI ================= */
document.getElementById("addPair").onclick=()=>{
  const a=+document.getElementById("p1").value;
  const b=+document.getElementById("p2").value;
  if(!a||!b||a===b) return;

  if(fixedPairs.some(x=>x.includes(a)||x.includes(b))) return;

  fixedPairs.push([a,b]);
  render();
};

/* ================= INIT ================= */
function render(){
  renderPlayers();
  renderPairs();
  renderResult();
}

render();
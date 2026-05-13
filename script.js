const COURTS=["A","B","C"];

/* ================= 1~28 숫자 선수 ================= */
const players=Array.from({length:28},(_,i)=>({
  name:i+1,
  active:false,
  playCount:0
}));

let pairs=[];
const setStore={1:null,2:null,3:null,4:null,5:null};

/* 🔥 파트너 중복 제한 */
const partnerUsedToday={};

const listEl=document.getElementById("playerList");
const countEl=document.getElementById("count");
const resultEl=document.getElementById("result");

const p1=document.getElementById("p1");
const p2=document.getElementById("p2");
const addPair=document.getElementById("addPair");
const pairList=document.getElementById("pairList");

/* ================= UTIL ================= */
function pairKey(a,b){
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
  listEl.innerHTML="";

  [...players.filter(p=>p.active),...players.filter(p=>!p.active)]
  .forEach(p=>{
    const d=document.createElement("div");
    d.className="player"+(p.active?" active":"");
    d.textContent=p.name;
    d.onclick=()=>{p.active=!p.active;renderAll();};
    listEl.appendChild(d);
  });

  const g=document.createElement("div");
  g.className="player guest";
  g.textContent="+";
  g.onclick=()=>{
    const n=prompt("NUMBER INPUT");
    if(n){
      players.push({name:Number(n),active:true,playCount:0});
    }
    renderAll();
  };
  listEl.appendChild(g);

  countEl.textContent=players.filter(p=>p.active).length;
}

/* ================= SELECT ================= */
function renderSelect(){
  const active=players.filter(p=>p.active);

  p1.innerHTML='<option>PLAYER1</option>';
  p2.innerHTML='<option>PLAYER2</option>';

  active.forEach(p=>{
    p1.appendChild(new Option(p.name,p.name));
    p2.appendChild(new Option(p.name,p.name));
  });
}

/* ================= FIXED PAIR ================= */
addPair.onclick=()=>{
  const a=p1.value,b=p2.value;
  if(!a||!b||a===b) return;
  if(pairs.some(x=>x.includes(a)||x.includes(b))) return;

  pairs.push([Number(a),Number(b)]);
  p1.value=p2.value="";
  renderAll();
};

function renderPairs(){
  pairList.innerHTML="";
  pairs.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="pairItem";
    d.textContent=`PAIR ${i+1}: ${p[0]} ${p[1]}`;
    d.onclick=()=>{
      pairs=pairs.filter(x=>x!==p);
      renderAll();
    };
    pairList.appendChild(d);
  });
}

/* ================= SET GENERATE ================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{
    const setNo=Number(btn.dataset.set);

    const active=players.filter(p=>p.active);
    if(active.length<4) return;

    let used=new Set();
    let teams=[];

    /* 고정 페어 */
    pairs.forEach(p=>{
      const a=active.find(x=>x.name===p[0]);
      const b=active.find(x=>x.name===p[1]);
      if(a&&b){
        teams.push([a,b]);
        used.add(a.name);
        used.add(b.name);
      }
    });

    let rest=active.filter(p=>!used.has(p.name));

    /* ================= 🔥 완전 랜덤 ================= */
    shuffle(rest);

    let usedPlayers=new Set();

    for(let i=0;i<rest.length;i+=2){
      const a=rest[i];
      const b=rest[i+1];
      if(!a||!b) break;

      const key=pairKey(a,b);

      /* 같은 파트너 중복 방지 */
      if(partnerUsedToday[key]) continue;

      if(usedPlayers.has(a.name) || usedPlayers.has(b.name)) continue;

      teams.push([a,b]);
      usedPlayers.add(a.name);
      usedPlayers.add(b.name);

      partnerUsedToday[key]=true;
    }

    const maxCourts=Math.min(3,Math.floor(teams.length/2));

    let matches=[];

    for(let i=0;i<maxCourts;i++){
      matches.push({
        team1:teams[i*2],
        team2:teams[i*2+1],
        s1:0,
        s2:0
      });
    }

    setStore[setNo]={locked:false,matches};

    /* ================= 출전 기록 ================= */
    const played=new Set();

    matches.forEach(m=>{
      [...m.team1,...m.team2].forEach(p=>played.add(p.name));
    });

    active.forEach(p=>{
      if(played.has(p.name)){
        p.playCount++;
      }
    });

    renderResult();
  };
});

/* ================= RESULT ================= */
function renderResult(){
  resultEl.innerHTML="";
  const active=players.filter(p=>p.active);

  for(let i=1;i<=5;i++){
    const set=setStore[i];
    if(!set) continue;

    const wrap=document.createElement("div");
    wrap.className="result-set";

    const header=document.createElement("div");
    const title=document.createElement("span");
    title.textContent=`${i}SET `;

    const lock=document.createElement("button");
    lock.className="lockBtn";
    lock.textContent=set.locked?"🔒":"🔓";
    lock.onclick=()=>toggleLock(i);

    header.appendChild(title);
    header.appendChild(lock);
    wrap.appendChild(header);

    set.matches.forEach((m,idx)=>{
      const line=document.createElement("div");

      const text=document.createTextNode(
        `${COURTS[idx]}코트 : ${m.team1[0].name}-${m.team1[1].name} vs ${m.team2[0].name}-${m.team2[1].name}`
      );

      const s1=document.createElement("select");
      const s2=document.createElement("select");
      for(let k=0;k<=6;k++){
        s1.appendChild(new Option(k,k));
        s2.appendChild(new Option(k,k));
      }

      s1.value=m.s1;
      s2.value=m.s2;
      s1.onchange=()=>m.s1=+s1.value;
      s2.onchange=()=>m.s2=+s2.value;

      const scoreWrap=document.createElement("span");
      scoreWrap.className="scoreWrap";
      scoreWrap.appendChild(s1);
      scoreWrap.appendChild(document.createTextNode(" : "));
      scoreWrap.appendChild(s2);

      line.appendChild(text);
      line.appendChild(scoreWrap);
      wrap.appendChild(line);
    });

    const played=new Set();
    set.matches.forEach(m=>{
      [...m.team1,...m.team2].forEach(p=>played.add(p.name));
    });

    const wait=active.filter(p=>!played.has(p.name));
    const w=document.createElement("div");
    w.textContent="대기 : "+wait.map(p=>p.name).join(" ");
    wrap.appendChild(w);

    resultEl.appendChild(wrap);
  }
}

/* ================= LOCK ================= */
function toggleLock(i){
  setStore[i].locked=!setStore[i].locked;
  renderResult();
}

/* ================= INIT ================= */
function renderAll(){
  renderPlayers();
  renderSelect();
  renderPairs();
  renderResult();
}

renderAll();
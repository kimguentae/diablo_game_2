const COURTS=["A","B","C"];

const names=[
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players=names.map(n=>({name:n,active:false}));

let pairs=[];
const setStore={1:null,2:null,3:null,4:null,5:null};

const listEl=document.getElementById("playerList");
const countEl=document.getElementById("count");
const resultEl=document.getElementById("result");

const p1=document.getElementById("p1");
const p2=document.getElementById("p2");
const addPair=document.getElementById("addPair");
const pairList=document.getElementById("pairList");

/* PLAYER */
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
    const n=prompt("GUEST NAME");
    if(n) players.push({name:n,active:true});
    renderAll();
  };
  listEl.appendChild(g);

  countEl.textContent=players.filter(p=>p.active).length;
}

/* SELECT */
function renderSelect(){
  const active=players.filter(p=>p.active);

  p1.innerHTML='<option>PLAYER1</option>';
  p2.innerHTML='<option>PLAYER2</option>';

  active.forEach(p=>{
    p1.appendChild(new Option(p.name,p.name));
    p2.appendChild(new Option(p.name,p.name));
  });
}

/* FIXED PAIR */
addPair.onclick=()=>{
  const a=p1.value,b=p2.value;
  if(!a||!b||a===b) return;
  if(pairs.some(x=>x.includes(a)||x.includes(b))) return;

  pairs.push([a,b]);
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

/* SET */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{

    const setNo=btn.dataset.set;

    const active=players.filter(p=>p.active);
    if(active.length<4) return;

    let used=new Set();
    let teams=[];

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
    shuffle(rest);

    for(let i=0;i<rest.length;i+=2){
      if(rest[i+1]) teams.push([rest[i],rest[i+1]]);
    }

    shuffle(teams);

    let matches=[];
    for(let i=0;i<Math.min(COURTS.length,teams.length/2);i++){
      matches.push({
        team1:teams[i*2],
        team2:teams[i*2+1],
        s1:0,
        s2:0
      });
    }

    setStore[setNo]={locked:false,matches};

    renderResult();
  };
});

/* RESULT */
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
    title.textContent=`${i}SET`;

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
        `${COURTS[idx]}코트 : ${m.team1[0].name} ${m.team1[1].name} vs ${m.team2[0].name} ${m.team2[1].name}`
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

  renderAnalysis();
}

/* 🔥 ANALYSIS + 득실 */
function renderAnalysis(){

  let stats={};

  players.filter(p=>p.active).forEach(p=>{
    stats[p.name]={game:0,win:0,lose:0,draw:0};
  });

  for(let i=1;i<=5;i++){
    const set=setStore[i];
    if(!set) continue;

    set.matches.forEach(m=>{

      const s1=m.s1;
      const s2=m.s2;

      const t1=m.team1.map(p=>p.name);
      const t2=m.team2.map(p=>p.name);

      const all=[...t1,...t2];

      if(s1===0&&s2===0) return;

      all.forEach(n=>stats[n].game++);

      if(s1>s2){
        t1.forEach(n=>stats[n].win++);
        t2.forEach(n=>stats[n].lose++);
      }else if(s2>s1){
        t2.forEach(n=>stats[n].win++);
        t1.forEach(n=>stats[n].lose++);
      }else{
        return; // 무승부 제외
      }
    });
  }

  let arr=Object.keys(stats).map(name=>{
    const s=stats[name];
    return {
      name,
      game:s.game,
      win:s.win,
      lose:s.lose,
      diff:s.win - s.lose
    };
  });

  // 🔥 정렬
  arr.sort((a,b)=>{
    if(b.game!==a.game) return b.game-a.game;
    return b.win-a.win;
  });

  let html="";

  arr.forEach(s=>{
    if(s.game===0) return;

    const diff=s.diff>0?`+${s.diff}`:`${s.diff}`;

    html+=`${s.name} : ${s.game}게임 (${s.win}승 ${s.lose}패) / ${diff}<br>`;
  });

  let box=document.getElementById("analysisBox");

  if(!box){
    const btn=document.createElement("button");
    btn.id="analysisBtn";
    btn.textContent="경기분석";

    box=document.createElement("div");
    box.id="analysisBox";

    resultEl.parentNode.appendChild(btn);
    resultEl.parentNode.appendChild(box);

    btn.onclick=()=>box.style.display="block";
  }

  box.innerHTML=html;
}

/* LOCK */
function toggleLock(i){
  setStore[i].locked=!setStore[i].locked;
  renderResult();
}

/* UTIL */
function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    let j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

/* INIT */
function renderAll(){
  renderPlayers();
  renderSelect();
  renderPairs();
  renderResult();
}

renderAll();
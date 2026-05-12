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

/* ELEMENT */
const listEl = document.getElementById("playerList");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const addPair = document.getElementById("addPair");
const pairList = document.getElementById("pairList");

/* PLAYER */
function renderPlayers(){
  listEl.innerHTML = "";

  [...players.filter(p=>p.active), ...players.filter(p=>!p.active)]
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

  countEl.textContent = players.filter(p=>p.active).length;
}

/* SELECT */
function renderSelect(){
  const active = players.filter(p=>p.active);

  p1.innerHTML='<option value="">P1</option>';
  p2.innerHTML='<option value="">P2</option>';

  active.forEach(p=>{
    p1.appendChild(new Option(p.name,p.name));
    p2.appendChild(new Option(p.name,p.name));
  });
}

/* PAIR */
addPair.onclick=()=>{
  if(!p1.value||!p2.value||p1.value===p2.value) return;
  if(pairs.some(x=>x.includes(p1.value)||x.includes(p2.value))) return;

  pairs.push([p1.value,p2.value]);
  p1.value=p2.value="";
  renderAll();
};

function renderPairs(){
  pairList.innerHTML="";
  pairs.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="pairItem";
    d.textContent=`PAIR ${i+1}: ${p[0]} ${p[1]}`;
    d.onclick=()=>{pairs=pairs.filter(x=>x!==p);renderAll();};
    pairList.appendChild(d);
  });
}

/* GAME */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{

    const setNo=btn.dataset.set;

    if(setStore[setNo]?.locked){
      alert("LOCK 상태입니다");
      return;
    }

    const active=players.filter(p=>p.active);
    if(active.length<4) return alert("인원 부족");

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

    setStore[setNo]={
      locked:false,
      matches
    };

    renderResult();
  };
});

/* RESULT */
function renderResult(){
  resultEl.innerHTML="";
  const activePlayers=players.filter(p=>p.active);

  for(let i=1;i<=5;i++){
    const set=setStore[i];
    if(!set) continue;

    const div=document.createElement("div");
    div.className="result-set";

    if(set.locked) div.classList.add("locked");

    let html=`(${i}SET) 
      <button class="lockBtn" onclick="toggleLock(${i})">
        ${set.locked?"UNLOCK":"LOCK"}
      </button><br><br>`;

    set.matches.forEach((m,idx)=>{

      html+=`
      ${COURTS[idx]}코트 
      ${m.team1[0].name} ${m.team1[1].name} vs ${m.team2[0].name} ${m.team2[1].name}

      (${scoreSel(m.s1,i,idx,'s1')}) : (${scoreSel(m.s2,i,idx,'s2')})
      <br><br>
      `;

    });

    const played=new Set();
    set.matches.forEach(m=>{
      [...m.team1,...m.team2].forEach(p=>played.add(p.name));
    });

    const wait=activePlayers.filter(p=>!played.has(p.name));
    html+=`대기 : ${wait.map(p=>p.name).join(" ")}`;

    div.innerHTML=html;
    resultEl.appendChild(div);
  }
}

/* SCORE UI */
function scoreSel(val,setNo,idx,key){
  let s=`<select class="scoreSelect"
    onchange="setScore(${setNo},${idx},'${key}',this.value)"
    ${setStore[setNo]?.locked?"disabled":""}>`;

  for(let i=0;i<=6;i++){
    s+=`<option value="${i}" ${i==val?"selected":""}>${i}</option>`;
  }

  return s+"</select>";
}

function setScore(setNo,idx,key,val){
  setStore[setNo].matches[idx][key]=Number(val);
}

/* LOCK TOGGLE */
function toggleLock(setNo){
  setStore[setNo].locked=!setStore[setNo].locked;
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
const COURTS = ["A","B","C"];
const names = ["김재용","염성민","김근태","장준원","손가람","이정현",
"박종성","김준현","송지훈","박정규","김동현","유세호","하지훈","김남진"];

const players = names.map(n=>({name:n,active:false}));
let pairs=[];
let setStore={1:null,2:null,3:null,4:null,5:null};
let prevWaiting=[];

const listEl=document.getElementById("playerList");
const countEl=document.getElementById("count");
const resultEl=document.getElementById("result");
const p1=document.getElementById("p1");
const p2=document.getElementById("p2");

function renderPlayers(){
  listEl.innerHTML="";
  players.forEach(p=>{
    const d=document.createElement("div");
    d.className="player"+(p.active?" active":"");
    d.textContent=p.name;
    d.onclick=()=>{p.active=!p.active;renderAll();}
    listEl.appendChild(d);
  });
  countEl.textContent=players.filter(p=>p.active).length;
}

function renderSelect(){
  p1.innerHTML="";p2.innerHTML="";
  p1.append(new Option("PLAYER1",""));
  p2.append(new Option("PLAYER2",""));
  players.filter(p=>p.active).forEach(p=>{
    p1.append(new Option(p.name,p.name));
    p2.append(new Option(p.name,p.name));
  });
}

document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick=()=>{
    const setNo=btn.dataset.set;
    const active=players.filter(p=>p.active);
    let ordered=[...prevWaiting,...active.filter(p=>!prevWaiting.includes(p))];
    let matches=[];
    let idx=0;

    while(idx+3<ordered.length && matches.length<3){
      matches.push({
        team1:[ordered[idx],ordered[idx+1]],
        team2:[ordered[idx+2],ordered[idx+3]],
        s1:null,s2:null
      });
      idx+=4;
    }

    prevWaiting=ordered.slice(idx);
    setStore[setNo]=matches;
    renderResult();
  };
});

function renderResult(){
  resultEl.innerHTML="";
  let stat={};

  players.forEach(p=>stat[p.name]={w:0,l:0,g:0});

  for(let i=1;i<=5;i++){
    const data=setStore[i];
    if(!data) continue;

    const div=document.createElement("div");
    div.className="result-set";
    div.innerHTML=`(${i}SET)<br>`;

    data.forEach((m,idx)=>{
      div.innerHTML+=`${COURTS[idx]}코트 
      ${m.team1[0].name} ${m.team1[1].name}
      <input class="score" type="number" min="0" max="6" 
      value="${m.s1??""}"
      onchange="this.blur();m.s1=this.value;renderResult();">
      :
      <input class="score" type="number" min="0" max="6"
      value="${m.s2??""}"
      onchange="this.blur();m.s2=this.value;renderResult();">
      ${m.team2[0].name} ${m.team2[1].name}<br>`;

      if(m.s1!=null && m.s2!=null){
        const win=m.s1>m.s2?m.team1:m.team2;
        const lose=m.s1>m.s2?m.team2:m.team1;
        win.forEach(p=>{stat[p.name].w++;stat[p.name].g++;});
        lose.forEach(p=>{stat[p.name].l++;stat[p.name].g++;});
      }
    });

    resultEl.appendChild(div);
  }

  const sum=document.createElement("div");
  sum.className="result-set";
  sum.innerHTML="<b>RESULT</b><br>";

  Object.entries(stat)
    .sort((a,b)=>b[1].g-a[1].g)
    .forEach(([n,s])=>{
      if(s.g>0)
        sum.innerHTML+=`${n} : ${s.w}승 ${s.l}패 (${s.g}게임)<br>`;
    });

  resultEl.appendChild(sum);
}

function renderAll(){
  renderPlayers();
  renderSelect();
  renderResult();
}
renderAll();
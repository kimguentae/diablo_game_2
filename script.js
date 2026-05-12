const COURTS = ["A", "B", "C"];

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

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");
const countEl = document.getElementById("count");

const setStore = {1:null,2:null,3:null,4:null,5:null};

/* =========================
   PLAYER
========================= */
function updateCount(){
  countEl.innerText = players.filter(p=>p.active).length;
}

players.forEach(p=>{
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p.name;

  div.onclick = ()=>{
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();

    reorder();
  };

  listEl.appendChild(div);
});

/* =========================
   GUEST (+)
========================= */
const guest = document.createElement("div");
guest.className = "player guest";
guest.innerText = "+";

guest.onclick = ()=>{
  const name = prompt("GUEST NAME");
  if(!name) return;

  const p = {name, active:true};
  players.push(p);

  const div = document.createElement("div");
  div.className = "player active";
  div.innerText = name;

  div.onclick = ()=>{
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();
    reorder();
  };

  listEl.appendChild(div);
  updateCount();
  reorder();
};

listEl.appendChild(guest);

/* =========================
   선택자 상단 정렬
========================= */
function reorder(){
  const active = [];
  const inactive = [];

  players.forEach(p=>{
    const el = Array.from(listEl.children)
      .find(d => d.innerText === p.name);

    if(!el) return;

    if(p.active) active.push(el);
    else inactive.push(el);
  });

  listEl.innerHTML = "";

  active.forEach(el => listEl.appendChild(el));
  inactive.forEach(el => listEl.appendChild(el));
  listEl.appendChild(guest);
}

/* =========================
   GAME
========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    const setNo = +btn.dataset.set;
    const available = players.filter(p=>p.active);

    if(available.length < 4){
      alert("인원 부족");
      return;
    }

    let pool = [...available];
    shuffle(pool);

    let used = new Set();
    let matches = [];

    for(let i=0;i<COURTS.length;i++){
      let team = [];

      while(team.length<4 && pool.length){
        const p = pool.shift();
        if(!used.has(p.name)){
          used.add(p.name);
          team.push(p);
        }
      }

      if(team.length===4) matches.push(team);
    }

    setStore[setNo] = matches;
    render();
  };
});

/* =========================
   RESULT
========================= */
function render(){
  resultEl.innerHTML = "";

  for(let s=1;s<=5;s++){
    const data = setStore[s];
    if(!data) continue;

    const div = document.createElement("div");
    div.className = "result-set";

    div.innerHTML =
      `(${s})<br>` +
      data.map((t,i)=>
        `${COURTS[i]}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
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
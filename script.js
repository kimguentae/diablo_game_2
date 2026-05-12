document.addEventListener("DOMContentLoaded", () => {

  const names = [
    "김재용","염성민","김근태","장준원","손가람","이정현",
    "박종성","김준현","송지훈","박정규","김동현","유세호",
    "하지훈","김남진","이우진","이해동","박종혁","최준희",
    "최성욱","이진우","이현철","정상돈","최부승","최선우",
    "이명진","전유준","성제현","장이현"
  ];

  let players = names.map(n => ({
    name:n,
    active:false,
    paired:false
  }));

  let pairs = [];

  const listEl = document.getElementById("playerList");
  const countEl = document.getElementById("count");

  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const addBtn = document.getElementById("addPair");
  const pairList = document.getElementById("pairList");

  /* =========================
     PLAYER
  ========================= */
  function renderPlayers(){

    listEl.innerHTML = "";

    // 🔥 active 먼저 위로
    let sorted = [
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

    countEl.textContent = players.filter(p=>p.active).length;
  }

  /* =========================
     SELECT
  ========================= */
  function renderSelect(){

    const available = players.filter(p => p.active && !p.paired);

    p1.innerHTML = "";
    p2.innerHTML = "";

    const opt1 = document.createElement("option");
    opt1.value = "";
    opt1.textContent = "PLAYER 1";

    const opt2 = document.createElement("option");
    opt2.value = "";
    opt2.textContent = "PLAYER 2";

    p1.appendChild(opt1);
    p2.appendChild(opt2);

    available.forEach(p=>{
      const o1 = document.createElement("option");
      const o2 = document.createElement("option");

      o1.value = o2.value = p.name;
      o1.textContent = o2.textContent = p.name;

      p1.appendChild(o1);
      p2.appendChild(o2);
    });

    syncSelect();
  }

  function syncSelect(){
    const v = p1.value;

    Array.from(p2.options).forEach(o=>{
      o.disabled = (o.value === v && v !== "");
    });
  }

  p1.onchange = syncSelect;

  /* =========================
     PAIR 생성
  ========================= */
  addBtn.onclick = ()=>{
    const a = p1.value;
    const b = p2.value;

    if(!a || !b || a === b) return;

    const pa = players.find(x=>x.name===a);
    const pb = players.find(x=>x.name===b);

    pa.paired = true;
    pb.paired = true;

    pairs.push([a,b]);

    renderAll();
  };

  /* =========================
     PAIR 출력
  ========================= */
  function renderPairs(){
    pairList.innerHTML = "";

    pairs.forEach((p,i)=>{
      const div = document.createElement("div");
      div.className = "pair";
      div.textContent = `PAIR ${i+1} : ${p[0]} ${p[1]}`;

      div.onclick = ()=>{
        players.forEach(x=>{
          if(x.name===p[0] || x.name===p[1]){
            x.paired = false;
          }
        });

        pairs = pairs.filter(x=>x!==p);
        renderAll();
      };

      pairList.appendChild(div);
    });
  }

  /* =========================
     전체 렌더
  ========================= */
  function renderAll(){
    renderPlayers();
    renderSelect();
    renderPairs();
  }

  renderAll();

});
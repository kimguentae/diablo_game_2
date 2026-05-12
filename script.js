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
  const result = document.getElementById("result");

  /* =========================
     PLAYER
  ========================= */
  function renderPlayers(){
    listEl.innerHTML = "";

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

    let o1 = document.createElement("option");
    o1.textContent = "PLAYER 1";
    o1.value = "";

    let o2 = document.createElement("option");
    o2.textContent = "PLAYER 2";
    o2.value = "";

    p1.appendChild(o1);
    p2.appendChild(o2);

    available.forEach(p=>{
      let a = document.createElement("option");
      let b = document.createElement("option");

      a.value = b.value = p.name;
      a.textContent = b.textContent = p.name;

      p1.appendChild(a);
      p2.appendChild(b);
    });

    sync();
  }

  function sync(){
    let v = p1.value;

    Array.from(p2.options).forEach(o=>{
      o.disabled = (o.value === v && v !== "");
    });
  }

  p1.onchange = sync;

  /* =========================
     PAIR
  ========================= */
  addBtn.onclick = ()=>{
    let a = p1.value;
    let b = p2.value;

    if(!a || !b || a===b) return;

    let pa = players.find(x=>x.name===a);
    let pb = players.find(x=>x.name===b);

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
      let div = document.createElement("div");
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
     GAME (간단 랜덤)
  ========================= */
  document.querySelectorAll(".genBtn").forEach(btn=>{
    btn.onclick = ()=>{
      let active = players.filter(p=>p.active);

      if(active.length < 4){
        alert("인원 부족");
        return;
      }

      let pool = [...active];
      pool.sort(()=>Math.random()-0.5);

      let teams = [];

      while(pool.length >= 4){
        teams.push(pool.splice(0,4));
      }

      result.innerHTML = "";
      teams.forEach((t,i)=>{
        let div = document.createElement("div");
        div.style.marginTop = "5px";
        div.textContent =
          `SET ${i+1} : ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`;
        result.appendChild(div);
      });
    };
  });

  function renderAll(){
    renderPlayers();
    renderSelect();
    renderPairs();
  }

  renderAll();

});
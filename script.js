/* =========================================================
   DRAGON BATTLE
   ORGANIZED JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. FORMS & DIFFICULTY
   ========================================================= */

const FORMS = [
  ["Base", 1, "#222"],
  ["SSJ", 1.4, "#ffd54a"],
  ["SSJ2", 1.8, "#ffe066"],
  ["SSJ3", 2.3, "#ffd54a"],
  ["SSJ4", 2.8, "#c1121f"],
  ["SSJ God", 3.3, "#ff3b5c"],
  ["SSJ Blue", 3.8, "#33c6ff"],
  ["Ultra Instinct", 4.5, "#dfe6ee"],
  ["Autonomous UI", 5, "#ffffff"],
  ["Rainbow (Admin)", 6, "rainbow"]
];

let target = 0;
let unlocked = false;
let dk = "medium";
let D;

const DIFF = {
  easy: {
    int: 1.1,
    dm: 0.6,
    hp: 300,
    rate: 4,
    kame: 0.05,
    ct: 1.8,
    sp: 0.7,
    cl: 0,
    fi: [0, 2]
  },

  medium: {
    int: 0.7,
    dm: 1,
    hp: 400,
    rate: 7,
    kame: 0.1,
    ct: 1.2,
    sp: 1,
    cl: 0.01,
    fi: [1, 4]
  },

  hard: {
    int: 0.35,
    dm: 1.4,
    hp: 500,
    rate: 10,
    kame: 0.15,
    ct: 0.8,
    sp: 1.3,
    cl: 0.03,
    fi: [5, 8]
  }
};


/* =========================================================
   2. DIFFICULTY MENU
   ========================================================= */

function buildDiff() {
  const d = document.getElementById("diff");

  d.innerHTML = "";

  Object.keys(DIFF).forEach(k => {
    const b = document.createElement("button");

    b.textContent = k.toUpperCase();

    if (k == dk) {
      b.className = "sel";
    }

    b.onclick = () => {
      dk = k;
      buildDiff();
    };

    d.appendChild(b);
  });
}


/* =========================================================
   3. TRANSFORMATION MENU
   ========================================================= */

const fd = document.getElementById("forms");

function build() {
  buildDiff();

  fd.innerHTML = "";

  FORMS.forEach((f, i) => {
    const b = document.createElement("button");

    b.textContent =
      f[0] + (i == 9 && !unlocked ? " 🔒" : "");

    if (i == target) {
      b.className = "sel";
    }

    b.onclick = () => {

      // Rainbow/Admin form
      if (i == 9 && !unlocked) {
        askPw();
        return;
      }

      target = i;

      build();
    };

    fd.appendChild(b);
  });
}

build();


/* =========================================================
   4. PASSWORD / ADMIN UNLOCK
   ========================================================= */

const E$ = id => document.getElementById(id);

function askPw() {
  E$("pw").style.display = "flex";
  E$("pwi").value = "";
  E$("pwm").textContent = "";
  E$("pwi").focus();
}

function submitPw() {

  if (E$("pwi").value === "Hmyloves") {

    unlocked = true;
    target = 9;

    E$("pw").style.display = "none";

    build();

  } else {

    E$("pwm").textContent = "Wrong password";

  }
}

E$("pws").onclick = submitPw;

E$("pwc").onclick = () => {
  E$("pw").style.display = "none";
};

E$("pwi").onkeydown = e => {

  if (e.key === "Enter") {
    submitPw();
  }

};


/* =========================================================
   5. CANVAS
   ========================================================= */

const cv = document.getElementById("c");
const g = cv.getContext("2d");

const GY = 380;


/* =========================================================
   6. AUDIO SYSTEM
   ========================================================= */

let AC;

function ac() {

  if (!AC) {
    AC = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  return AC;
}


function tone(
  f,
  d,
  t = "square",
  v = 0.15,
  sl = 0
) {

  try {

    const a = ac();

    const o = a.createOscillator();
    const k = a.createGain();

    o.type = t;

    o.frequency.setValueAtTime(
      f,
      a.currentTime
    );

    if (sl) {

      o.frequency.exponentialRampToValueAtTime(
        Math.max(20, f + sl),
        a.currentTime + d
      );

    }

    k.gain.setValueAtTime(
      v,
      a.currentTime
    );

    k.gain.exponentialRampToValueAtTime(
      0.001,
      a.currentTime + d
    );

    o.connect(k).connect(a.destination);

    o.start();
    o.stop(a.currentTime + d);

  } catch (e) {}

}


function noise(d, v = 0.2) {

  try {

    const a = ac();

    const n = a.sampleRate * d;

    const b = a.createBuffer(
      1,
      n,
      a.sampleRate
    );

    const x = b.getChannelData(0);

    for (let i = 0; i < n; i++) {

      x[i] =
        (Math.random() * 2 - 1) *
        (1 - i / n);

    }

    const s = a.createBufferSource();

    const k = a.createGain();

    k.gain.value = v;

    s.buffer = b;

    s.connect(k).connect(a.destination);

    s.start();

  } catch (e) {}

}




/* =========================================================
   7. SOUND EFFECTS
   ========================================================= */

const SFX = {

  punch: () => {

    noise(0.12, 0.3);

    tone(
      120,
      0.1,
      "sine",
      0.3,
      -60
    );

  },


  blast: () => {

    tone(
      700,
      0.25,
      "sawtooth",
      0.12,
      -500
    );

  },


  kame: () => {

    tone(
      180,
      0.9,
      "sawtooth",
      0.25,
      300
    );

    noise(0.6, 0.2);

  },


  charge: p => {

    tone(
      200 + p * 120,
      0.12,
      "triangle",
      0.1
    );

  },


  trans: () => {

    tone(
      100,
      1.2,
      "sawtooth",
      0.25,
      900
    );

    noise(1, 0.15);

  },


  dodge: () => {

    tone(
      1200,
      0.2,
      "sine",
      0.15,
      -900
    );

  },


  hit: () => {

    noise(0.2, 0.35);

    tone(
      90,
      0.2,
      "sine",
      0.3
    );

  },


  dragon: () => {

    tone(
      90,
      1,
      "sawtooth",
      0.3,
      500
    );

    noise(0.8, 0.3);

  },


  ui: () => {

    tone(
      440,
      0.8,
      "sine",
      0.2,
      440
    );

  },


  win: () => {

    [500, 650, 800, 1000].forEach(
      (f, i) => {

        setTimeout(
          () =>
            tone(
              f,
              0.25,
              "square",
              0.15
            ),
          i * 140
        );

      }
    );

  }

};


/* =========================================================
   8. GAME STATE
   ========================================================= */

let clash = null;

let beams = [];

let P;

let E;

let proj;

let pops;

let keys = {};

let over;

let T = 0;

let last = 0;


/* =========================================================
   9. CREATE CHARACTER
   ========================================================= */

const mk = (x, fi, d) => ({
  x,
  y: GY,
  vy: 0,
  hp: 400,
  ki: 3,
  fi,
  dir: d,

  cp: 0,
  ck: 0,
  cu: 0,
  co: 0,
  inv: 0,
  ch: -1,
  fire: 0,
  chT: 0,
  fl: 0,
  aura: 0,

  // BLOCK
  blocking: false,
  blockTimer: 0
});

/* =========================================================
   10. START / RESET GAME
   ========================================================= */

function start() {

  P = mk(
    220,
    0,
    1
  );

  D = DIFF[dk];

  clash = null;

  E = mk(
    680,
    D.fi[0] +
      Math.floor(
        Math.random() *
        (D.fi[1] - D.fi[0] + 1)
      ),
    -1
  );

  E.ai = 0;

  E.hp = E.mx = D.hp;

  proj = [];

  beams = [];

  pops = [];

  over = null;

  document.getElementById(
    "menu"
  ).style.display = "none";

  cv.style.display = "inline-block";

  ac();

  if (!last) {
    requestAnimationFrame(loop);
  }

  last = performance.now();

}

document.getElementById("go").onclick = start;


/* =========================================================
   11. BEAM CLASH
   ========================================================= */

function mash() {

  if (clash) {

    clash.pos += 0.025;

    clash.pc++;

    tone(
      300 + Math.random() * 200,
      0.06,
      "square",
      0.08
    );

  }

}

cv.addEventListener(
  "pointerdown",
  mash
);


function cpt() {

  const a =
    P.x +
    P.dir * 34;

  const b =
    E.x +
    E.dir * 34;

  return a +
    (b - a) *
    clash.pos;

}


/* =========================================================
   12. PLAYER CONTROLS
   ========================================================= */

/* =========================================================
   12. PLAYER CONTROLS
   ========================================================= */

addEventListener(
  "keydown",
  e => {

    const k = e.key.toLowerCase();

    if (
      [
        " ",
        "arrowleft",
        "arrowright",
        "arrowup"
      ].includes(k)
    ) {
      e.preventDefault();
    }

    if (keys[k]) {
      return;
    }

    keys[k] = 1;


    /* ---------- BLOCK ---------- */

    if (k == "b" && P) {
      P.blocking = true;
      P.blockTimer = 0;
      return;
    }


    /* ---------- Beam clash ---------- */

    if (
      clash &&
      (k == "l" || k == " ")
    ) {

      mash();

      return;
    }


    if (
      !P ||
      over ||
      P.fire > 0
    ) {

      return;
    }


    /* ---------- Punch ---------- */

    if (
      k == "j" &&
      P.cp <= 0
    ) {

      P.cp = 0.35;

      SFX.punch();

      if (
        Math.abs(E.x - P.x) < 75 &&
        (E.x - P.x) * P.dir > 0
      ) {

        hit(
          E,
          5 *
            FORMS[P.fi][1] *
            (1 + Math.random() * 0.3),
          P
        );

      }

    }


    /* ---------- Ki Blast ---------- */

    if (
      k == "k" &&
      P.ck <= 0 &&
      P.ki >= 0.5
    ) {

      P.ki -= 0.5;

      P.ck = 0.3;

      shoot(
        P,
        8,
        14,
        1
      );

    }


    /* ---------- Kamehameha ---------- */

    if (
      k == "l" &&
      P.ki >= 1 &&
      P.ch < 0
    ) {

      P.ki -= 1;

      P.ch = 0;

      SFX.kame();

    }


    /* ---------- Transform ---------- */

    if (k == "t") {

      trans(
        P,
        target
      );

    }


    /* ---------- Dragon Fist ---------- */

    if (
      k == "u" &&
      P.cu <= 0 &&
      [3, 4, 9].includes(P.fi) &&
      P.ki >= 2
    ) {

      P.ki -= 2;

      P.cu = 3;

      SFX.dragon();

      proj.push({

        x: P.x,

        y: P.y - 50,

        vx: 13 * P.dir,

        r: 38,

        d:
          55 *
          FORMS[P.fi][1] /
          2,

        o: P,

        dragon: 1

      });

      pop(
        P.x,
        P.y - 110,
        "DRAGON FIST!",
        "#fb0"
      );

    }


    /* ---------- Instinct Dodge ---------- */

    if (
      k == "o" &&
      P.co <= 0 &&
      P.fi >= 7 &&
      P.ki >= 0.5
    ) {

      P.ki -= 0.5;

      P.inv =
        P.fi == 7
          ? 5
          : P.fi == 8
            ? 6
            : 7;

      P.co =
        P.inv + 6;

      SFX.ui();

      pop(
        P.x,
        P.y - 120,
        "INSTINCT!",
        "#cff"
      );

    }

  }
);






addEventListener(
  "keyup",
  e => {

    const k = e.key.toLowerCase();

    keys[k] = 0;


    /* ---------- STOP BLOCKING ---------- */

    if (k == "b" && P) {
      P.blocking = false;
    }


    /* ---------- FIRE KAMEHAMEHA ---------- */

    if (
      k == "l" &&
      P &&
      P.ch >= 0
    ) {

      fireK(P);

    }

  }
);



/* =========================================================
   13. TRANSFORMATION
   ========================================================= */

function trans(f, to) {

    if (
        to == 0 ||
        f.fi == to ||
        f.ki < 4
    ) {
        return;
    }


    /* =====================================================
       SAVE THE NEW FORM
       ===================================================== */

    f.ki -= 4;

    f.fi = to;

    f.aura = 1.2;


    /* =====================================================
       TRANSFORMATION SOUND
       ===================================================== */

    SFX.trans();


    /* =====================================================
       TRANSFORMATION TEXT
       ===================================================== */

    pop(
        f.x,
        f.y - 120,
        FORMS[to][0] + "!",
        "#ff0"
    );


    /* =====================================================
       PLAY TRANSFORMATION VIDEO
       ===================================================== */

    playTransformationVideo(to);

}

/* =========================================================
   14. FLOATING TEXT
   ========================================================= */

function pop(
  x,
  y,
  t,
  c
) {

  pops.push({

    x,

    y,

    t,

    c,

    l: 1.2

  });

}


/* =========================================================
   15. KI BLAST
   ========================================================= */

function shoot(
  f,
  d,
  sp,
  kind
) {

  SFX.blast();


  proj.push({

    x:
      f.x +
      f.dir * 30,

    y:
      f.y - 55,

    vx:
      sp * f.dir,

    r: 11,

    d:
      d *
      FORMS[f.fi][1],

    o: f

  });

}


/* =========================================================
   16. KAMEHAMEHA
   ========================================================= */

function fireK(f) {

  const c = f.ch;

  f.ch = -1;

  SFX.kame();


  const du =
    1.6 +
    c * 0.6;


  f.fire = du;


  beams.push({

    o: f,

    t: 0,

    dur: du,

    w:
      14 +
      c * 10,

    dmg:
      (4 + c * 3) *
      FORMS[f.fi][1] *
      (f == E
        ? D.dm
        : 1),

    tick: 0

  });


  pop(
    f.x,
    f.y - 110,
    "KAMEHAMEHA!",
    "#6cf"
  );

}


/* =========================================================
   17. DAMAGE / HIT
   ========================================================= */

function hit(
  t,
  d,
  src
) {

  if (over) {
    return;
  }


  // Instinct dodge
  if (t.inv > 0) {

    SFX.dodge();


    t.x +=
      Math.random() < 0.5
        ? -60
        : 60;


    t.x =
      Math.max(
        40,
        Math.min(
          860,
          t.x
        )
      );


    pop(
      t.x,
      t.y - 110,
      "DODGE",
      "#cff"
    );


    return;

  }


 /* =========================================================
   BLOCK DAMAGE
   ========================================================= */

if (t.blocking) {

    // Block reduces damage by 75%
    const blockedDamage =
        d * 0.25;

    t.hp -= blockedDamage;

    pop(
        t.x,
        t.y - 100,
        "BLOCK!",
        "#4cf"
    );

    tone(
        180,
        0.08,
        "square",
        0.12
    );

    return;
}


/* NORMAL DAMAGE */

t.hp -= d;

  t.fl = 0.15;

  SFX.hit();


  pop(
    t.x,
    t.y - 100,
    Math.round(d),
    "#f55"
  );


  t.x +=
    src.dir * 8;


  if (t.hp <= 0) {

    t.hp = 0;

    over =
      t == E
        ? "YOU WIN!"
        : "DEFEATED";

    SFX.win();

  }

}


/* =========================================================
   18. UPDATE PLAYER / RIVAL
   ========================================================= */

function upd(
  f,
  dt,
  isP
) {

  f.cp -= dt;
  f.fire -= dt;
  f.ck -= dt;
  f.cu -= dt;
  f.co -= dt;
  f.inv -= dt;
  f.fl -= dt;
  f.aura -= dt;


  // Gravity
  f.vy +=
    1500 * dt;

  f.y +=
    f.vy * dt;


  // Ground
  if (f.y > GY) {

    f.y = GY;

    f.vy = 0;

  }


  // Ki regeneration
  f.ki =
    Math.min(
      6,
      f.ki +
        0.08 * dt
    );


  // Charging
  if (f.ch >= 0) {

    f.ch =
      Math.min(
        2.5,
        f.ch + dt
      );

    f.chT += dt;


    if (f.chT > 0.15) {

      f.chT = 0;

      SFX.charge(
        f.ch
      );

    }

  }


  // Face opponent
  f.dir =
    (
      isP
        ? E.x - f.x
        : P.x - f.x
    ) > 0
      ? 1
      : -1;


  // Keep inside arena
  f.x =
    Math.max(
      40,
      Math.min(
        860,
        f.x
      )
    );

}


/* =========================================================
   19. RIVAL AI
   ========================================================= */

function ai(dt) {

  const e = E;

  const d =
    Math.abs(
      P.x - e.x
    );


  e.ai -= dt;


  if (e.fire > 0) {
    return;
  }


  // Rival reacts to player's Kamehameha
  if (
    P.fire > 0 &&
    e.ch < 0 &&
    e.ki >= 1 &&
    Math.random() < D.cl
  ) {

    e.ki -= 1;

    e.ch = 0;

    SFX.kame();

  }


  // Rival charging
  if (e.ch >= 0) {

    if (e.ch > D.ct) {

      fireK(e);

    }

    return;

  }


  // Movement
  if (d > 170) {

    e.x +=
      e.dir *
      (120 +
        e.fi * 15) *
      D.sp *
      dt;

  } else if (d < 70) {

    e.x -=
      e.dir *
      80 *
      dt;

  }


  // AI decision
  if (e.ai <= 0) {

    e.ai =
      D.int *
      (
        0.8 +
        Math.random() *
        0.6
      );


    const r =
      Math.random();


    if (e.ki < 3) {

      e.ki += 0.6;

    }


    // Punch
    if (
      d < 85 &&
      r < 0.6 &&
      e.cp <= 0
    ) {

      e.cp = 0.5;

      SFX.punch();


      hit(
        P,
        5 *
          FORMS[e.fi][1] *
          0.8 *
          D.dm,
        e
      );


    }

    // Ki blast
    else if (
      r < 0.8 &&
      e.ki >= 0.5
    ) {

      e.ki -= 0.5;

      shoot(
        e,
        8 *
          0.8 *
          D.dm,
        11,
        1
      );

    }

    // Kamehameha
    else if (
      r <
        0.8 +
        D.kame &&
      e.ki >= 1
    ) {

      e.ki -= 1;

      e.ch = 0;

      SFX.kame();

    }

    // Jump
    else if (
      e.y >= GY &&
      r < 0.97
    ) {

      e.vy = -600;

    }

  }

}


/* =========================================================
   20. MAIN GAME LOOP
   ========================================================= */

function loop(t) {

  const dt =
    Math.min(
      0.05,
      (t - last) / 1000
    );


  last = t;

  T += dt;


  if (P && !over) {


    /* ---------- PLAYER MOVEMENT ---------- */

    if (
      P.ch < 0 &&
      P.fire <= 0
    ) {


      // Charge Ki
      if (keys["c"]) {

        P.ki =
          Math.min(
            6,
            P.ki +
              1.4 * dt
          );

        P.aura = 0.2;

      }


      // Normal movement
      else {

        if (
          keys["a"] ||
          keys["arrowleft"]
        ) {

          P.x -=
            260 * dt;

        }


        if (
          keys["d"] ||
          keys["arrowright"]
        ) {

          P.x +=
            260 * dt;

        }


        // Jump
        if (
          (
            keys["w"] ||
            keys["arrowup"] ||
            keys[" "]
          ) &&
          P.y >= GY
        ) {

          P.vy = -620;

        }

      }

    }


    /* ---------- UPDATE CHARACTERS ---------- */

    upd(
      P,
      dt,
      1
    );

    upd(
      E,
      dt,
      0
    );

    ai(dt);


    /* =====================================================
       BEAMS
       ===================================================== */

    beams.forEach(
      b => {

        b.t += dt;

        b.tick -= dt;


        const o = b.o;

        const t =
          o == P
            ? E
            : P;


        if (
          Math.floor(
            b.t * 4
          ) !=
          Math.floor(
            (b.t - dt) * 4
          )
        ) {

          tone(
            140,
            0.3,
            "sawtooth",
            0.12,
            60
          );

        }


        if (
          b.tick <= 0 &&
          !clash
        ) {

          b.tick = 0.1;


          const dx =
            (t.x - o.x) *
            o.dir;


          const dy =
            Math.abs(
              o.y -
              55 -
              (
                t.y -
                45
              )
            );


          if (
            dx > 0 &&
            dx <
              Math.min(
                900,
                b.t * 1800
              ) +
              30 &&
            dy <
              b.w + 50
          ) {

            hit(
              t,
              b.dmg,
              o
            );

          }

        }


        if (
          b.t >
            b.dur ||
          over
        ) {

          b.dead = 1;

        }

      }
    );


    beams =
      beams.filter(
        b => !b.dead
      );


    /* =====================================================
       START BEAM CLASH
       ===================================================== */

    if (
      !clash &&
      beams.some(
        b => b.o == P
      ) &&
      beams.some(
        b => b.o == E
      )
    ) {

      clash = {

        pos: 0.5,

        t: 0,

        pc: 0,

        ec: 0,

        ea: 0,

        rate: D.rate

      };


      beams.forEach(
        b => {
          b.dur = 999;
        }
      );


      P.fire =
        E.fire =
        999;


      pop(
        430,
        150,
        "BEAM CLASH!",
        "#ff0"
      );

    }


    /* =====================================================
       BEAM CLASH LOGIC
       ===================================================== */

    if (clash) {

      const k = clash;

      k.t += dt;


      k.ea +=
        dt *
        k.rate *
        (
          0.7 +
          Math.random() *
          0.6
        );


      while (
        k.ea >= 1
      ) {

        k.ea--;

        k.pos -= 0.025;

        k.ec++;

      }


      if (
        Math.floor(
          k.t * 8
        ) !=
        Math.floor(
          (k.t - dt) * 8
        )
      ) {

        tone(
          80 +
            Math.random() *
            80,
          0.15,
          "sawtooth",
          0.12
        );

      }


      if (
        k.pos <= 0 ||
        k.pos >= 1 ||
        k.t > 8
      ) {

        const w =
          k.pos >= 0.5
            ? P
            : E;

        const l =
          w == P
            ? E
            : P;


        beams = [];


        P.fire =
          E.fire =
          0;


        clash = null;

        l.inv = 0;


        pop(
          w.x,
          w.y - 130,
          w == P
            ? "CLASH WON!"
            : "CLASH LOST!",
          "#ff0"
        );


        hit(
          l,
          Math.min(
            200,
            40 *
              FORMS[w.fi][1] *
              (
                w == E
                  ? D.dm
                  : 1
              )
          ),
          w
        );


        SFX.dragon();

      }

    }


    /* =====================================================
       PROJECTILES
       ===================================================== */

    proj.forEach(
      p => {

        p.x += p.vx;


        const t =
          p.o == P
            ? E
            : P;


        if (
          Math.abs(
            p.x - t.x
          ) <
            p.r + 22 &&

          Math.abs(
            p.y -
            (
              t.y - 45
            )
          ) <
            p.r + 50
        ) {

          hit(
            t,
            p.d,
            p.o
          );

          p.dead = 1;

        }


        if (
          p.x < -100 ||
          p.x > 1000
        ) {

          p.dead = 1;

        }

      }
    );


    proj =
      proj.filter(
        p => !p.dead
      );

  }


  /* =======================================================
     FLOATING TEXT
     ======================================================= */

  pops.forEach(
    p => {

      p.l -= dt;

      p.y -=
        30 * dt;

    }
  );


  pops =
    pops.filter(
      p => p.l > 0
    );


  /* =======================================================
     DRAW
     ======================================================= */

  if (P) {
    draw();
  }


  requestAnimationFrame(
    loop
  );

}


/* =========================================================
   21. CHARACTER COLORS
   ========================================================= */

function col(fi) {

  const c =
    FORMS[fi][2];


  return c == "rainbow"

    ? `hsl(${T * 200 % 360},100%,60%)`

    : c;

}


const HAIR = [

  "#111",

  "#ffd43b",

  "#ffe066",

  "#ffd43b",

  "#161616",

  "#ff3b5c",

  "#33c6ff",

  "#cfd6df",

  "#fff",

  "rainbow"

];


const EYE = [

  "#111",

  "#1bb",

  "#1bb",

  "#1bb",

  "#111",

  "#f33",

  "#5df",

  "#ddd",

  "#fff",

  "#fff"

];


/* =========================================================
   22. HAIR SHAPES
   ========================================================= */

const SP = {

  A: [
    [-24, -14],
    [-16, -30],
    [-4, -38],
    [8, -34],
    [18, -24]
  ],

  B: [
    [-24, -18],
    [-14, -38],
    [-3, -48],
    [9, -44],
    [19, -32],
    [25, -18]
  ]

};


/* =========================================================
   23. DRAWING HELPERS
   ========================================================= */

function L(
  x1,
  y1,
  x2,
  y2,
  w,
  c
) {

  g.strokeStyle = c;

  g.lineWidth = w;

  g.lineCap = "round";


  g.beginPath();

  g.moveTo(
    x1,
    y1
  );

  g.lineTo(
    x2,
    y2
  );

  g.stroke();

}


function arm(
  sx,
  sy,
  hx,
  hy,
  c
) {

  const ex =
    (sx + hx) / 2;

  const ey =
    (sy + hy) / 2 +
    9;


  L(
    sx,
    sy,
    ex,
    ey,
    10,
    c
  );


  L(
    ex,
    ey,
    hx,
    hy,
    10,
    c
  );


  L(
    ex +
      (hx - ex) *
      0.65,

    ey +
      (hy - ey) *
      0.65,

    ex +
      (hx - ex) *
      0.88,

    ey +
      (hy - ey) *
      0.88,

    11,

    "#2447c8"
  );


  g.fillStyle =
    "#ffcc99";


  g.beginPath();

  g.arc(
    hx,
    hy,
    5.5,
    0,
    7
  );

  g.fill();

}


/* =========================================================
   24. DRAW FIGHTER
   ========================================================= */

function fighter(
  f,
  isP
) {

  const fi = f.fi;

  const x = f.x;

  const y = f.y;

  const d = f.dir;

  const hurt =
    f.fl > 0;

  const c =
    col(fi);

  const air =
    y < GY - 3;


  const mv =
    Math.abs(
      f.x -
      (f.lx ?? f.x)
    ) > 0.4;


  f.lx = f.x;


  /* ---------- Shadow ---------- */

  g.fillStyle =
    "rgba(0,0,0,.25)";


  g.beginPath();

  g.ellipse(
    x,
    GY + 4,
    Math.max(
      10,
      30 -
        (GY - y) /
          10
    ),
    7,
    0,
    0,
    7
  );

  g.fill();


  /* ---------- Instinct Effect ---------- */

  if (f.inv > 0) {

    g.globalAlpha =
      0.25;

    g.fillStyle =
      "#cff";


    g.fillRect(
      x - 40,
      y - 125,
      24,
      125
    );


    g.fillRect(
      x + 16,
      y - 125,
      24,
      125
    );

  }


  /* ---------- Transformation Aura ---------- */

  if (
    fi > 0 ||
    f.aura > 0
  ) {

    g.globalAlpha =
      (
        f.inv > 0
          ? 0.5
          : 0.32
      ) +
      0.1 *
      Math.sin(
        T * 15
      );


    g.fillStyle = c;


    g.beginPath();

    g.moveTo(
      x - 34,
      y
    );


    for (
      let i = 0;
      i <= 6;
      i++
    ) {

      g.lineTo(

        x -
          34 +
          i * 11.3,

        y -
          70 -

          Math.abs(
            Math.sin(
              T * 9 + i
            )
          ) *
            45 -

          (i % 2
            ? 15
            : 0) -

          (
            f.aura > 0
              ? 25
              : 0
          )

      );

    }


    g.lineTo(
      x + 34,
      y
    );


    g.fill();

  }


  g.globalAlpha =
    f.inv > 0
      ? 0.6
      : 1;


  /* ---------- Body Colors ---------- */

  const gi =
    hurt
      ? "#fff"
      : isP
        ? "#f57c00"
        : "#c62828";


  const fur =
    "#b71c1c";


  const blue =
    "#2447c8";


  /* ---------- Movement ---------- */

  const sw =
    mv
      ? Math.sin(
          T * 14
        ) * 16
      : 0;


  const bob =
    mv
      ? 0
      : Math.sin(
          T * 4
        ) * 1.5;


  const hy =
    y - 45 + bob;


  const sy =
    y - 88 + bob;


  /* ---------- Legs ---------- */

  const fa =
    air
      ? [
          x -
            d * 6 -
            8,
          y - 14
        ]
      : [
          x - 9 + sw,
          y
        ];


  const fb =
    air
      ? [
          x +
            d * 10,
          y - 22
        ]
      : [
          x + 9 - sw,
          y
        ];


  [fa, fb].forEach(
    p => {

      L(
        x,
        hy,
        p[0],
        p[1] - 12,
        14,
        gi
      );


      L(
        p[0],
        p[1] - 3,
        p[0],
        p[1] - 14,
        15,
        blue
      );


      L(
        p[0],
        p[1] - 3,
        p[0] +
          d * 8,
        p[1] - 3,
        9,
        blue
      );

    }
  );


  /* ---------- Body ---------- */

  g.fillStyle = gi;


  g.beginPath();

  g.moveTo(
    x - 17,
    sy
  );

  g.lineTo(
    x + 17,
    sy
  );

  g.lineTo(
    x + 11,
    hy
  );

  g.lineTo(
    x - 11,
    hy
  );

  g.fill();


  /* ---------- SSJ4 Fur ---------- */

  if (
    fi == 4 &&
    !hurt
  ) {

    g.fillStyle =
      fur;


    g.beginPath();

    g.moveTo(
      x - 17,
      sy
    );

    g.lineTo(
      x + 17,
      sy
    );

    g.lineTo(
      x + 13,
      sy + 22
    );

    g.lineTo(
      x,
      sy + 30
    );

    g.lineTo(
      x - 13,
      sy + 22
    );

    g.fill();

  }

  else {

    g.fillStyle =
      blue;


    g.beginPath();

    g.moveTo(
      x - 7,
      sy
    );

    g.lineTo(
      x + 7,
      sy
    );

    g.lineTo(
      x,
      sy + 14
    );

    g.fill();

  }


  /* ---------- Belt ---------- */

  g.fillStyle =
    blue;


  g.fillRect(
    x - 12,
    hy - 8,
    24,
    8
  );


  g.fillRect(
    x -
      d * 8 -
      3,
    hy,
    6,
    16
  );


  /* ---------- Arms ---------- */

  const ac =
    fi == 4 &&
    !hurt
      ? fur
      : gi;


  const s1 = [
    x - d * 13,
    sy + 5
  ];


  const s2 = [
    x + d * 13,
    sy + 5
  ];


  let bh;

  let fh;


  if (
    f.fire > 0
  ) {

    bh = [
      x + d * 34,
      sy + 12
    ];

    fh = [
      x + d * 46,
      sy + 8
    ];

  }


  else if (
    f.ch >= 0
  ) {

    bh = [
      x - d * 22,
      hy - 10
    ];

    fh = [
      x - d * 14,
      hy - 16
    ];

  }


  else if (
    f.cp > 0
  ) {

    bh = [
      x - d * 6,
      sy + 22
    ];

    fh = [
      x +
        d *
          (
            42 +
            Math.min(
              20,
              f.cp * 60
            )
          ),
      sy + 2
    ];

  }


  else if (
    f.ck > 0.1 ||
    f.cu > 2.6
  ) {

    bh = [
      x + d * 10,
      sy + 20
    ];

    fh = [
      x + d * 38,
      sy + 8
    ];

  }


  else {

    bh = [
      x + d * 10,
      sy + 26 + bob
    ];

    fh = [
      x + d * 24,
      sy +
        18 +
        bob * 2 +
        (
          mv
            ? Math.sin(
                T * 14
              ) * 5
            : 0
        )
    ];

  }


  arm(
    s1[0],
    s1[1],
    bh[0],
    bh[1],
    ac
  );


  /* ---------- Head ---------- */

  const hx =
    x + d * 2;

  const hh =
    sy - 15;


  const hc =
    fi == 9
      ? c
      : HAIR[fi];


  /* ---------- SSJ3 Hair ---------- */

  if (fi == 3) {

    g.fillStyle =
      hc;


    g.beginPath();

    g.moveTo(
      hx - d * 4,
      hh - 12
    );

    g.lineTo(
      hx - d * 40,
      hh + 30
    );

    g.lineTo(
      hx - d * 30,
      hh + 82
    );

    g.lineTo(
      hx - d * 12,
      hh + 50
    );

    g.lineTo(
      hx + d * 4,
      hh + 10
    );

    g.fill();

  }


  /* ---------- Face ---------- */

  g.fillStyle =
    "#ffcc99";


  g.beginPath();

  g.arc(
    hx,
    hh,
    16,
    0,
    7
  );

  g.fill();


  /* ---------- Hair ---------- */

  g.fillStyle =
    hc;


  const set =
    fi >= 1 &&
    fi <= 3
      ? SP.B
      : SP.A;


  const k =
    fi == 4 ||
    fi >= 7
      ? 1.15
      : 1;


  set.forEach(
    ([a, b]) => {

      const bx =
        hx +
        d *
          a *
          0.5;


      const by =
        hh +
        b *
          0.3;


      g.beginPath();


      g.moveTo(
        bx - 8,
        by
      );


      g.lineTo(
        bx + 8,
        by + 4
      );


      g.lineTo(
        hx +
          d *
            a *
            k,
        hh +
          b *
            k
      );


      g.fill();

    }
  );


  /* ---------- Hair Top ---------- */

  g.beginPath();

  g.arc(
    hx,
    hh - 3,
    16.5,
    Math.PI,
    0
  );

  g.fill();


  /* ---------- Eye ---------- */

  L(
    hx + d * 3,
    hh - 1,
    hx + d * 12,
    hh + 1,
    2.5,
    "#222"
  );


  g.fillStyle =
    EYE[fi];


  g.fillRect(
    hx +
      d * 7 -
      3,
    hh + 2,
    6,
    4
  );


  /* ---------- Second Arm ---------- */

  arm(
    s2[0],
    s2[1],
    fh[0],
    fh[1],
    ac
  );


  /* ---------- Charging Energy ---------- */

  if (
    f.ch >= 0
  ) {

    g.fillStyle =
      "#8df";

    g.globalAlpha =
      0.9;


    g.beginPath();

    g.arc(
      x -
        d * 22,
      hy - 14,
      8 +
        f.ch * 10,
      0,
      7
    );

    g.fill();

  }


  g.globalAlpha = 1;

}


/* =========================================================
   25. HEALTH / KI BAR
   ========================================================= */

function bar(
  x,
  y,
  w,
  v,
  m,
  c,
  lab
) {

  g.fillStyle =
    "#222";

  g.fillRect(
    x,
    y,
    w,
    16
  );


  g.fillStyle =
    c;


  g.fillRect(

    lab[0] == "R"
      ? x +
        w *
          (1 -
            v / m)
      : x,

    y,

    w *
      v /
      m,

    16

  );


  g.strokeStyle =
    "#fff";

  g.strokeRect(
    x,
    y,
    w,
    16
  );


  g.fillStyle =
    "#fff";

  g.font =
    "12px sans-serif";


  g.fillText(
    lab,
    x + 4,
    y + 12
  );

}


/* =========================================================
   26. DRAW GAME
   ========================================================= */

function draw() {


  /* ---------- Sky ---------- */

  const s =
    g.createLinearGradient(
      0,
      0,
      0,
      GY
    );


  s.addColorStop(
    0,
    "#3f8fd8"
  );

  s.addColorStop(
    1,
    "#bfe4ff"
  );


  g.fillStyle = s;


  g.fillRect(
    0,
    0,
    900,
    450
  );


  /* ---------- Clouds ---------- */

  g.fillStyle =
    "rgba(255,255,255,.7)";


  [
    [150, 90],
    [420, 60],
    [700, 110]
  ].forEach(
    ([cx, cy]) => {

      g.beginPath();

      g.arc(
        cx,
        cy,
        26,
        0,
        7
      );

      g.arc(
        cx + 28,
        cy + 6,
        20,
        0,
        7
      );

      g.arc(
        cx - 28,
        cy + 8,
        18,
        0,
        7
      );

      g.fill();

    }
  );


  /* ---------- Ground ---------- */

  g.fillStyle =
    "#c9b28a";


  g.fillRect(
    0,
    GY + 4,
    900,
    70
  );


  g.fillStyle =
    "#a8916a";


  g.fillRect(
    0,
    GY + 4,
    900,
    6
  );


  g.strokeStyle =
    "#a8916a";

  g.lineWidth = 2;


  for (
    let i = 0;
    i < 10;
    i++
  ) {

    g.beginPath();

    g.moveTo(
      i * 100,
      GY + 10
    );

    g.lineTo(
      i * 100 - 30,
      450
    );

    g.stroke();

  }


  /* ---------- Fighters ---------- */

  fighter(
    E,
    0
  );

  fighter(
    P,
    1
  );


  /* ---------- VS ---------- */

  g.fillStyle =
    "#fff";

  g.font =
    "bold 22px sans-serif";


  g.fillText(
    "VS",
    430,
    30
  );


  /* =======================================================
     PROJECTILES
     ======================================================= */

  proj.forEach(
    p => {

      const c =
        p.dragon
          ? "#fb0"
          : p.o == P
            ? "#6cf"
            : "#f66";


      const r =
        g.createRadialGradient(
          p.x,
          p.y,
          1,
          p.x,
          p.y,
          p.r
        );


      r.addColorStop(
        0,
        "#fff"
      );

      r.addColorStop(
        1,
        c
      );


      g.fillStyle = r;


      g.beginPath();

      g.arc(
        p.x,
        p.y,
        p.r,
        0,
        7
      );

      g.fill();


      if (p.dragon) {

        g.fillStyle =
          "#e60";


        g.fillRect(
          p.x -
            p.vx * 5,
          p.y - 8,
          p.vx * 5,
          16
        );

      }

    }
  );


  /* =======================================================
     BEAMS
     ======================================================= */

  beams.forEach(
    b => {

      const o = b.o;


      const ox =
        o.x +
        o.dir * 34;


      const oy =
        o.y - 55;


      const len =
        clash

          ? Math.min(
              b.t * 1800,
              Math.abs(
                cpt() -
                ox
              )
            )

          : Math.min(
              900,
              b.t * 1800
            );


      const w =
        b.w *
        (
          0.8 +
          0.2 *
            Math.sin(
              T * 40
            )
        ) *
        Math.min(
          1,
          (
            b.dur -
            b.t
          ) * 4
        );


      const c =
        o == P
          ? "#6cf"
          : "#f66";


      const x2 =
        ox +
        o.dir *
          len;


      const gr =
        g.createLinearGradient(
          0,
          oy - w,
          0,
          oy + w
        );


      gr.addColorStop(
        0,
        c
      );

      gr.addColorStop(
        0.5,
        "#fff"
      );

      gr.addColorStop(
        1,
        c
      );


      g.globalAlpha =
        0.9;

      g.fillStyle =
        gr;


      g.fillRect(
        Math.min(
          ox,
          x2
        ),
        oy - w,
        Math.abs(
          x2 - ox
        ),
        w * 2
      );


      g.fillStyle =
        "#fff";


      g.beginPath();

      g.arc(
        ox,
        oy,
        w * 1.3,
        0,
        7
      );

      g.fill();


      g.beginPath();

      g.arc(
        x2,
        oy,
        w * 1.1,
        0,
        7
      );

      g.fill();


      g.globalAlpha = 1;

    }
  );


  /* =======================================================
     BEAM CLASH UI
     ======================================================= */

  if (clash) {

    const k =
      clash;

    const cx =
      cpt();

    const oy =
      P.y - 55;


    g.fillStyle =
      "#fff";

    g.globalAlpha =
      0.9;


    g.beginPath();

    g.arc(
      cx,
      oy,
      26 +
        Math.random() *
          10,
      0,
      7
    );

    g.fill();


    g.globalAlpha = 1;


    // Clash bar
    g.fillStyle =
      "#333";


    g.fillRect(
      250,
      80,
      400,
      16
    );


    g.fillStyle =
      "#6cf";


    g.fillRect(
      250,
      80,
      400 *
        k.pos,
      16
    );


    g.fillStyle =
      "#f66";


    g.fillRect(
      250 +
        400 *
          k.pos,
      80,
      400 *
        (1 -
          k.pos),
      16
    );


    g.strokeStyle =
      "#fff";


    g.strokeRect(
      250,
      80,
      400,
      16
    );


    g.fillStyle =
      "#fff";

    g.font =
      "bold 26px sans-serif";


    g.fillText(
      "MASH L / SPACE / CLICK!",
      285,
      130
    );


    g.font =
      "14px sans-serif";


    g.fillText(
      "You " +
        k.pc +
        "  vs  Rival " +
        k.ec,
      385,
      152
    );

  }


  /* =======================================================
     HEALTH BARS
     ======================================================= */

  bar(
    20,
    15,
    340,
    P.hp,
    400,
    "#3c3",
    "YOU - " +
      FORMS[P.fi][0]
  );


  bar(
    540,
    15,
    340,
    E.hp,
    E.mx,
    "#e33",
    "RIVAL (" +
      dk +
      ") - " +
      FORMS[E.fi][0]
  );


  /* =======================================================
     KI BARS
     ======================================================= */

  g.fillStyle =
    "#222";


  g.fillRect(
    20,
    38,
    240,
    16
  );


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    g.fillStyle =
      i < 4
        ? "#fc0"
        : "#4cf";


    const v =
      Math.max(
        0,
        Math.min(
          1,
          P.ki - i
        )
      );


    g.fillRect(
      22 +
        i * 39,
      40,
      37 * v,
      12
    );


    g.strokeStyle =
      "#fff";


    g.strokeRect(
      22 +
        i * 39,
      40,
      37,
      12
    );

  }


  /* =======================================================
     TRANSFORMATION MESSAGE
     ======================================================= */

  g.fillStyle =
    "#fff";

  g.font =
    "12px sans-serif";


  g.fillText(

    target > 0 &&
    P.fi != target

      ? P.ki >= 4

        ? "Press T to transform → " +
          FORMS[target][0]

        : "Fill 4 bars (hold C) to transform → " +
          FORMS[target][0]

      : "",

    270,
    52

  );


  /* =======================================================
     INSTINCT UI
     ======================================================= */

  if (P.fi >= 7) {

    g.fillText(

      P.inv > 0

        ? "Instinct: " +
          P.inv.toFixed(1) +
          "s"

        : P.co > 0

          ? "Instinct cooldown " +
            P.co.toFixed(0) +
            "s"

          : "Press O for Instinct",

      20,
      72

    );

  }


  /* =======================================================
     FLOATING DAMAGE TEXT
     ======================================================= */

  g.font =
    "bold 22px sans-serif";


  pops.forEach(
    p => {

      g.fillStyle =
        p.c;


      g.globalAlpha =
        Math.min(
          1,
          p.l
        );


      g.fillText(
        p.t,
        p.x - 30,
        p.y
      );


      g.globalAlpha =
        1;

    }
  );


  /* =======================================================
     GAME OVER
     ======================================================= */

  if (over) {

    g.fillStyle =
      "rgba(0,0,0,.6)";


    g.fillRect(
      0,
      0,
      900,
      450
    );


    g.fillStyle =
      "#fb0";


    g.font =
      "bold 60px sans-serif";


    g.fillText(
      over,
      300,
      230
    );


    g.font =
      "20px sans-serif";


    g.fillStyle =
      "#fff";


    g.fillText(
      "Press R to return to menu",
      335,
      275
    );


    if (keys["r"]) {

      P = null;

      cv.style.display =
        "none";


      document.getElementById(
        "menu"
      ).style.display =
        "block";

    }

  }

}


/* =========================================================
   TRANSFORMATION VIDEOS
   ========================================================= */

/*
   Put your videos here.

   form 0  = Base
   form 1  = SSJ
   form 2  = SSJ2
   form 3  = SSJ3
   form 4  = SSJ4
   form 5  = SSJ God
   form 6  = SSJ Blue
   form 7  = Ultra Instinct
   form 8  = Autonomous UI
   form 9  = Rainbow
*/

const TRANSFORM_VIDEOS = {

    0: null,

    1: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    2: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    3: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    4: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    5: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    6: {
        type: "youtube",
        url: "https://youtu.be/I8zF7WSzuiE?si=wzEvMALYpwy6rIIa"
    },

    7: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    8: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    },

    9: {
        type: "youtube",
        url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    }

};


/* =========================================================
   TRANSFORMATION VIDEO PLAYER
   ========================================================= */

function playTransformationVideo(form) {

    const data =
        TRANSFORM_VIDEOS[form];

    if (!data) {
        return;
    }

    const overlay =
        document.getElementById(
            "transformVideo"
        );

    const video =
        document.getElementById(
            "transformVideoPlayer"
        );

    const youtube =
        document.getElementById(
            "transformYoutube"
        );


    overlay.style.display =
        "flex";


    /* =====================================================
       GITHUB / MP4 VIDEO
       ===================================================== */

    if (data.type === "video") {

        youtube.style.display =
            "none";

        video.style.display =
            "block";

        video.src =
            data.url;

        video.currentTime = 0;

        video.muted = false;

        video.play()
            .catch(() => {

                /*
                   Browser may block autoplay.
                   User can click the screen to start it.
                */

                console.log(
                    "Video autoplay was blocked."
                );

            });


        video.onended = () => {

            closeTransformationVideo();

        };

    }


    /* =====================================================
       YOUTUBE VIDEO
       ===================================================== */

    else if (
        data.type === "youtube"
    ) {

        video.pause();

        video.removeAttribute(
            "src"
        );

        video.style.display =
            "none";

        youtube.style.display =
            "block";


        youtube.src =
            data.url +
            "?autoplay=1";

    }

}


/* =========================================================
   CLOSE TRANSFORMATION VIDEO
   ========================================================= */

function closeTransformationVideo() {

    const overlay =
        document.getElementById(
            "transformVideo"
        );

    const video =
        document.getElementById(
            "transformVideoPlayer"
        );

    const youtube =
        document.getElementById(
            "transformYoutube"
        );


    video.pause();

    video.removeAttribute(
        "src"
    );

    youtube.src = "";

    overlay.style.display =
        "none";

}


/* =========================================================
   CLICK VIDEO TO CLOSE
   ========================================================= */

document
    .getElementById("transformVideo")
    .addEventListener(
        "click",
        e => {

            if (
                e.target.id ===
                "transformVideo"
            ) {

                closeTransformationVideo();

            }

        }
    );

    


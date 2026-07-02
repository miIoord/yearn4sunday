const SECRET = "143";
let typed = "";
let found = [];
let matchedCount = 0;
let firstCard = null;
let lock = false;

const display = document.getElementById("display");
const lockCard = document.getElementById("lockCard");
const gate = document.getElementById("gate");
const main = document.getElementById("main");
const curtain = document.getElementById("curtain");

document.querySelectorAll(".hunt-heart").forEach(btn => {
  btn.addEventListener("click", () => {
    const n = btn.dataset.num;
    if (!found.includes(n)) {
      found.push(n);
      const slot = document.getElementById(`hint${found.length}`);
      slot.textContent = n;
      btn.classList.add("collected");
      softPop(slot);
    }
  });
});

document.querySelectorAll(".keypad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;

    if (key === "clear") {
      typed = "";
      updateDisplay();
      return;
    }

    if (key === "enter") {
      tryUnlock();
      return;
    }

    if (typed.length < 6) {
      typed += key;
      updateDisplay();
    }
  });
});

function updateDisplay(){
  display.textContent = typed ? "•".repeat(typed.length) : "code";
}

function tryUnlock(){
  if (found.length < 3) {
    fail("collect hearts first");
    return;
  }

  if (typed === SECRET) {
    unlockWorld();
  } else {
    typed = "";
    updateDisplay();
    fail("try again");
  }
}

function fail(text){
  display.textContent = text;
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth;
  lockCard.classList.add("shake");
}

function unlockWorld(){
  curtain.classList.add("active");

  setTimeout(() => {
    gate.style.display = "none";
    main.classList.add("open");
    window.scrollTo(0,0);
    revealObserver();
  }, 850);

  setTimeout(() => {
    curtain.classList.remove("active");
  }, 2500);
}

function softPop(el){
  el.animate([
    { transform:"scale(1)" },
    { transform:"scale(1.22)" },
    { transform:"scale(1)" }
  ], { duration:420, easing:"ease-out" });
}

/* reveal animation */
function revealObserver(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold:.18 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* name modal */
const nameBtn = document.getElementById("nameBtn");
const modal = document.getElementById("nameModal");
const saveName = document.getElementById("saveName");

nameBtn.addEventListener("click", () => {
  modal.classList.add("open");
});

saveName.addEventListener("click", () => {
  const value = document.getElementById("nameInput").value.trim();
  if (value) {
    document.getElementById("personName").textContent = value;
  }
  modal.classList.remove("open");
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("open");
});

/* music fake interaction */
let playing = false;
document.getElementById("playBtn").addEventListener("click", e => {
  playing = !playing;
  e.currentTarget.textContent = playing ? "❚❚" : "▶";
});

/* memory match game */
const icons = ["💙","☁️","🔒","🌷","🫧","💌"];
const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
const grid = document.getElementById("matchGrid");
const status = document.getElementById("matchStatus");

deck.forEach((icon, index) => {
  const card = document.createElement("button");
  card.className = "match-card";
  card.dataset.icon = icon;
  card.dataset.index = index;
  card.textContent = "♡";
  card.addEventListener("click", () => flip(card));
  grid.appendChild(card);
});

function flip(card){
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.icon;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  if (firstCard.dataset.icon === card.dataset.icon) {
    firstCard.classList.add("matched");
    card.classList.add("matched");
    matchedCount++;
    status.textContent = `matched: ${matchedCount}/6`;
    firstCard = null;

    if (matchedCount === 6) {
      unlockLetter();
    }

  } else {
    lock = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      card.classList.remove("flipped");
      firstCard.textContent = "♡";
      card.textContent = "♡";
      firstCard = null;
      lock = false;
    }, 760);
  }
}

function unlockLetter(){
  status.textContent = "all memories unlocked.";
  const btn = document.getElementById("letterBtn");
  btn.disabled = false;
  btn.classList.remove("locked");
  btn.textContent = "open the letter";
}

const letterText = `aku bikin ini bukan karena aku paling jago bikin kata-kata, tapi karena aku pengen kamu punya satu tempat kecil yang isinya cuma tentang kamu.

kalau nanti harimu berat, buka ini lagi ya. inget kalau kamu pernah jadi alasan seseorang senyum cuma karena kamu ada.

thank you for being my favorite little daydream.`;

document.getElementById("letterBtn").addEventListener("click", () => {
  const letter = document.getElementById("letter");
  const target = document.getElementById("letterText");
  letter.classList.add("open");
  typeLetter(target, letterText);
});

function typeLetter(el, text){
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 24);
}

/* subtle parallax like a dreamy webpage */
window.addEventListener("pointermove", e => {
  const x = (e.clientX / window.innerWidth - .5) * 16;
  const y = (e.clientY / window.innerHeight - .5) * 16;
  document.querySelectorAll(".paint-heart").forEach((el, i) => {
    el.style.translate = `${x * (i+1) * .18}px ${y * (i+1) * .18}px`;
  });
});

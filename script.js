const SECRET = "1806";
let typed = "";
let foundCount = 0;
let matchedCount = 0;
let firstCard = null;
let lock = false;

const display = document.getElementById("display");
const lockCard = document.getElementById("lockCard");
const gate = document.getElementById("gate");
const giftScene = document.getElementById("giftScene");
const main = document.getElementById("main");
const curtain = document.getElementById("curtain");
const clueBox = document.getElementById("clueBox");
const clueText = document.getElementById("clueText");
const codeDots = Array.from(document.querySelectorAll("#codeDots span"));

document.querySelectorAll(".hunt-heart").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("collected")) return;

    btn.classList.add("collected");
    foundCount++;

    const progress = document.getElementById(`love${foundCount}`);
    progress.textContent = "♥";
    progress.classList.add("filled");
    softPop(progress);

    if (foundCount === 3) {
      clueBox.classList.add("unlocked");
      clueBox.querySelector(".clue-icon").textContent = "🔓";
      clueText.textContent = "clue unlocked: the date we first started dating (DDMM)";
      softPop(clueBox);
    }
  });
});

document.querySelectorAll(".keypad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;

    if (key === "clear") {
      typed = "";
      display.textContent = "enter 4 digits";
      updateDisplay();
      return;
    }

    if (key === "enter") {
      tryUnlock();
      return;
    }

    if (typed.length < 4) {
      typed += key;
      display.textContent = typed.length === 4 ? "ready to unlock ♡" : `${4 - typed.length} digit${4 - typed.length === 1 ? "" : "s"} left`;
      updateDisplay();
    }
  });
});

function updateDisplay(){
  codeDots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < typed.length);
  });
}

function tryUnlock(){
  if (foundCount < 3) {
    fail("collect 3 loves first");
    return;
  }

  if (typed.length < 4) {
    fail("enter all 4 digits");
    return;
  }

  if (typed === SECRET) {
    unlockGift();
  } else {
    typed = "";
    updateDisplay();
    fail("wrong code — try the date we first started dating");
  }
}

function fail(text){
  display.textContent = text;
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth;
  lockCard.classList.add("shake");
}

function unlockGift(){
  display.textContent = "unlocked ♡";
  curtain.classList.add("active");

  setTimeout(() => {
    gate.style.display = "none";
    giftScene.classList.add("open");
    giftScene.setAttribute("aria-hidden", "false");
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

/* gift opening */
const giftBox = document.getElementById("giftBox");
const giftHint = document.getElementById("giftHint");
const giftMessage = document.getElementById("giftMessage");
const enterWorldBtn = document.getElementById("enterWorldBtn");
let giftOpened = false;

giftBox.addEventListener("click", () => {
  if (giftOpened) return;
  giftOpened = true;

  giftBox.classList.add("opened");
  giftHint.textContent = "made with love for the one i cherish.";

  setTimeout(() => {
    giftMessage.classList.add("open");
  }, 850);
});

enterWorldBtn.addEventListener("click", () => {
  curtain.classList.add("active");

  setTimeout(() => {
    giftScene.classList.remove("open");
    giftScene.setAttribute("aria-hidden", "true");
    main.classList.add("open");
    window.scrollTo(0,0);
    revealObserver();
  }, 850);

  setTimeout(() => {
    curtain.classList.remove("active");
  }, 2500);
});

/* reveal animation */
function revealObserver(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold:.18 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* music fake interaction */
/* MUSIC PLAYER */

const music = document.getElementById("bgMusic");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("musicProgress");
const progressBar = document.getElementById("musicProgressBar");

/* PLAY / PAUSE */
playBtn.addEventListener("click", async () => {

  if (music.paused) {

    try {
      await music.play();
      playBtn.textContent = "❚❚";
      playBtn.setAttribute("aria-label", "pause music");
    } catch (error) {
      console.error("Music gagal diputar:", error);
    }

  } else {

    music.pause();
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "play music");

  }

});

/* PROGRESS BAR JALAN SESUAI LAGU */
music.addEventListener("timeupdate", () => {

  if (!music.duration) return;

  const percentage = (music.currentTime / music.duration) * 100;

  progressBar.style.width = percentage + "%";

});

/* KLIK PROGRESS BAR BUAT PINDAH BAGIAN LAGU */
progress.addEventListener("click", (event) => {

  if (!music.duration) return;

  const rect = progress.getBoundingClientRect();

  const clickPosition =
    (event.clientX - rect.left) / rect.width;

  music.currentTime =
    clickPosition * music.duration;

});

/* KALAU LAGU SELESAI */
music.addEventListener("ended", () => {

  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "play music");
  progressBar.style.width = "0%";

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


/* counting days we've been dating */
const DATING_START = "2026-06-18"; // ganti tahun kalau perlu, format: YYYY-MM-DD

(function updateDatingDays(){
  const el = document.getElementById("datingDays");
  if(!el) return;

  const start = new Date(DATING_START + "T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);

  const diff = today - start;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  el.textContent = days.toLocaleString("en-US");
})();

let scene = 0;

const storyText = {
  1: "hari ini aku cuma mau bilang satu hal...",
  2: "aku ga tau sejak kapan semuanya jadi sehangat ini...",
  3: "tapi kamu selalu jadi bagian paling nyaman di hari aku 💖",
  4: "aku pengen kita jalan bareng terus, walaupun pelan..."
};

// typing effect
function typeText(text, callback){
  let i = 0;
  document.getElementById("story").innerHTML = "";

  let interval = setInterval(() => {
    document.getElementById("story").innerHTML += text[i];
    i++;
    if(i >= text.length){
      clearInterval(interval);
      if(callback) callback();
    }
  }, 40);
}

// scene control
function nextScene(step){
  scene += step;

  if(storyText[scene]){
    typeText(storyText[scene]);

    if(scene === 2){
      document.getElementById("puzzle").style.display = "block";
    }

    if(scene === 3){
      document.getElementById("choices").style.display = "block";
    }

  } else {
    typeText("end of story... 💖");
    document.getElementById("nextBtn").style.display = "none";
  }
}

// puzzle unlock
function solvePuzzle(){
  alert("kamu nemuin potongan hati aku 💖");
  typeText("ternyata... aku udah nyaman sama kamu lebih dari yang aku sadar");
}

// choices
function loveReaction(){
  typeText("gapapa bingung, yang penting kamu ada disini 💖");
}

// floating hearts
setInterval(() => {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.style.position = "absolute";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "100vh";
  heart.style.fontSize = "20px";
  heart.style.animation = "floatUp 5s linear";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}, 300);

// initial story
nextScene(1);

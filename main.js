const titulo = document.getElementById('start')
const empezar = document.getElementById('reset')
const pista = document.getElementById('pista')
const bus1 = document.getElementById('bus1')
const bus2 = document.getElementById('bus2')
const audioStart = document.getElementById('audioStart')
const audioFinish = document.getElementById('audioFinish')

const RACE_DURATION = 28_000
const SPEED_INTERVAL = 2_000
const MIN_SPEED = 20
const MAX_SPEED = 120

let startTime = 0,
   lastFrame = 0,
   rafId = null,
   speedInt = null,
   speed1 = 0,
   speed2 = 0,
   pos1 = 0,
   pos2 = 0,
   finishLine = 0,
   finished = false;

function randSpeed(min, max) {
   return Math.random() * (max - min) + min;
}

function initRace() {
   pos1 = pos2 = 0;
   bus1.style.transform = bus2.style.transform = "translateX(0)";
   finished = false;
   
   finishLine = pista.clientWidth - bus1.clientWidth;
   
   speed1 = randSpeed(MIN_SPEED, MAX_SPEED);
   speed2 = randSpeed(MIN_SPEED, MAX_SPEED);
   
   
   audioStart.currentTime = 0;
   audioStart.play();
   
   startTime = lastFrame = performance.now();
   
   speedInt = setInterval(() => {
       speed1 = randSpeed(MIN_SPEED, MAX_SPEED);
       speed2 = randSpeed(MIN_SPEED, MAX_SPEED);
   }, SPEED_INTERVAL);
   
   rafId = requestAnimationFrame(animate);
}

function animate(now) {
   const elapsed = now - startTime;
   const delta = now - lastFrame;
   
   pos1 += speed1 * (delta / 1000);
   pos2 += speed2 * (delta / 1000);
   bus1.style.transform = `translateX(${pos1}px)`;
   bus2.style.transform = `translateX(${pos2}px)`;
   
   if (!finished && (pos1 >= finishLine || pos2 >= finishLine)) {
       finished = true;
       const winner = pos1 >= finishLine && pos1 > pos2
                    ? "Berlinave" 
                    : pos2 >= finishLine && pos2 > pos1
                      ? "Brasilia"
                      : pos1 > pos2 
                        ? "Berlinave"
                        : "Brasilia";
       endRace(winner);
       return;
   }
   
   if (!finished && elapsed >= RACE_DURATION) {
       finished = true;
       const winner = pos1 > pos2 ? "Berlinave" 
                    : pos2 > pos1 ? "Brasilia" 
                    : "¡Empate!";
       endRace(winner);
       return;
   }
   
   lastFrame = now;
   rafId = requestAnimationFrame(animate);
}

function endRace(winner) {
   cancelAnimationFrame(rafId);
   clearInterval(speedInt);
   console.log(`¡${winner} gana la carrera!`);
   
  
   audioStart.pause();
   audioFinish.currentTime = 0;
   audioFinish.play();
   
   empezar.disabled = false;
}

function resetRace() {
   cancelAnimationFrame(rafId);
   clearInterval(speedInt);
   pos1 = pos2 = 0;
   bus1.style.transform = bus2.style.transform = "translateX(0)";
   console.log("Carrera reiniciada");
   
   audioStart.pause();
   audioStart.currentTime = 0;
   audioFinish.pause();
   audioFinish.currentTime = 0;
   
   empezar.disabled = true;
   titulo.disabled = false;
}

titulo.addEventListener("click", () => {
   titulo.disabled = true;
   empezar.disabled = true;
   initRace();
});
empezar.addEventListener("click", () => {
   resetRace();
});
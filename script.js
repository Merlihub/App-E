const noteNames = [
  "C",
  "Csharp",
  "D",
  "Dsharp",
  "E",
  "F",
  "Fsharp",
  "G",
  "Gsharp",
  "A",
  "Asharp",
  "B",
];
let currentLevel = 1;
let questionCount = 0;
let audioContextUnlocked = false;

function unlockAudio() {
  if (!audioContextUnlocked) {
    const silent = new Audio();
    silent.play().catch(() => {});
    audioContextUnlocked = true;
    console.log("Audio unlocked!");
    alert("Audio is ready. You can now play notes.");
  }
}

function playENote() {
  console.log("Playing E note");
  document.getElementById("eNote").play();
}

function playRandomChord() {
  const notesToPlay = currentLevel + 1;
  console.log(`Level ${currentLevel} - Playing ${notesToPlay} notes`);

  const selectedNotes = [];

  // 50% chance to force E into the chord
  const shouldContainE = Math.random() < 0.5;
  if (shouldContainE) {
    selectedNotes.push("E");
  }

  while (selectedNotes.length < notesToPlay) {
    const randomNote = noteNames[Math.floor(Math.random() * noteNames.length)];
    if (!selectedNotes.includes(randomNote)) {
      selectedNotes.push(randomNote);
    }
  }

  console.log("Selected notes:", selectedNotes);

  playChord(selectedNotes);

  window.currentChordContainsE = selectedNotes.includes("E");
  window.lastSelectedNotes = selectedNotes;

  document.getElementById("guess-buttons").style.display = "block";
  document.getElementById("repeatButton").style.display = "inline-block";
  document.getElementById("message").textContent = "";

  // Show notes being played
  document.getElementById("chord-notes").textContent =
    "Chord: " + selectedNotes.join(", ");
}

function repeatChord() {
  if (window.lastSelectedNotes) {
    console.log("Repeating chord:", window.lastSelectedNotes);
    playChord(window.lastSelectedNotes);
  } else {
    console.log("No chord to repeat yet.");
  }
}

function playChord(selectedNotes) {
  selectedNotes.forEach((note) => {
    const path = `audio/${note}.mp3`;
    console.log("Playing:", path);
    const audio = new Audio(path);
    audio.play().catch((err) => console.error("Audio play error:", err));
  });
}

function checkAnswer(userSaysContainsE) {
  const isCorrect = window.currentChordContainsE === userSaysContainsE;
  const msg = document.getElementById("message");
  msg.textContent = isCorrect ? "✅ Correct!" : "❌ Wrong!";
  msg.className = isCorrect ? "correct" : "wrong";

  // Hide guess buttons & repeat button
  document.getElementById("guess-buttons").style.display = "none";
  document.getElementById("repeatButton").style.display = "none";

  // Show the "Show Notes" button
  document.getElementById("showNotesButton").style.display = "inline-block";

  questionCount++;
  if (questionCount >= 10) {
    currentLevel++;
    questionCount = 0;
    alert(`Level up! Now you will hear ${currentLevel + 1} notes at once.`);
  }
}
function showPlayedNotes() {
  document.getElementById("answer-notes").textContent =
    "Played notes: " + window.lastSelectedNotes.join(", ");
  document.getElementById("showNotesButton").style.display = "none"; // Hide button after showing
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").then(
      (registration) => {
        console.log("ServiceWorker registered with scope:", registration.scope);
      },
      (err) => {
        console.log("ServiceWorker registration failed:", err);
      }
    );
  });
}

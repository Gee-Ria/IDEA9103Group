let synth = new Tone.Synth().toDestination();
let colorNoteMap = {
  red: "C",
  green: "D",
  blue: "E",
  yellow: "F",
  purple: "G",
  black: "A",
  orange: "B"
};

let currentColor = 'red';
let dots = [];

function setup() {
  let canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.7);
  canvas.parent('canvas-container');
}

function draw() {
  background('lightgrey');

  dots.forEach(dot => {
    fill(dot.color);
    ellipse(dot.x, dot.y, dot.size, dot.size);
    if (dot.isPlaying) {
      dot.size += 0.5;
      if (dot.size > 50) {
        dot.isPlaying = false;
      }
    } else {
      dot.size = dot.originalSize;
    }
  });
}

function mouseDragged() {
  let y = map(mouseY, 0, height, 0, 7);
  let note = colorNoteMap[currentColor] + Math.floor(y);
  synth.triggerAttackRelease(note, "8n");
  let dot = {
    x: mouseX,
    y: mouseY,
    color: currentColor,
    note: note,
    size: 30,
    originalSize: 30,
    isPlaying: false
  };
  dots.push(dot);
}

document.getElementById('red').addEventListener('click', () => currentColor = 'red');
document.getElementById('green').addEventListener('click', () => currentColor = 'green');
document.getElementById('blue').addEventListener('click', () => currentColor = 'blue');
document.getElementById('yellow').addEventListener('click', () => currentColor = 'yellow');
document.getElementById('purple').addEventListener('click', () => currentColor = 'purple');
document.getElementById('black').addEventListener('click', () => currentColor = 'black');
document.getElementById('orange').addEventListener('click', () => currentColor = 'orange');

let timeoutIds = [];

document.getElementById('play').addEventListener('click', () => {
  let sortedDots = [...dots].sort((a, b) => a.x - b.x || a.y - b.y);
  sortedDots.forEach((dot, index) => {
    let timeoutId = setTimeout(() => {
      synth.triggerAttackRelease(dot.note, "8n");
      dot.isPlaying = true;
    }, index * 500);
    timeoutIds.push(timeoutId);
  });
});

document.getElementById('stop').addEventListener('click', () => {
  synth.triggerRelease();
  timeoutIds.forEach(clearTimeout);
  dots.forEach((dot) => {
    dot.isPlaying = false;
  });
  timeoutIds = [];
});

document.getElementById('reset').addEventListener('click', () => dots = []);

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.7);
}

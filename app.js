const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const drawModeBtn = document.querySelector("#drawModeBtn");
const pickThick = document.querySelector("#pickThick");
const pickColor = document.querySelector("#pickColor");
const colorSet = Array.from(document.querySelectorAll(".color"));
const eraser = document.querySelector("#eraser");
const refresh = document.querySelector("#refresh");
const loadImg = document.querySelector("#loadImg");
const textForm = document.querySelector("#textForm");
const textInput = document.querySelector("#textInput");
const saveBtn = document.querySelector("#saveBtn");
const fontSizeSelect = document.querySelector("#fontSizeSelect");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = pickThick.value;
ctx.lineCap = "round";

let isDrawing = false;
let isDraw = 1;
let isTexting = false;
let fontSize = 40;

canvas.addEventListener("mousedown", drawStart);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", drawEnd);
canvas.addEventListener("mouseleave", drawEnd);
canvas.addEventListener("click", fillCanvas);

drawModeBtn.addEventListener("click", changeDrawWay);
pickThick.addEventListener("change", changeThick);
pickColor.addEventListener("change", changeColor);
colorSet.forEach((element) => {
  element.addEventListener("click", changeColor2);
});
eraser.addEventListener("click", erase);
refresh.addEventListener("click", eraseAll);
loadImg.addEventListener("change", loadImgChange);
canvas.addEventListener("dblclick", insertText);
textForm.addEventListener("submit", noF5);
textInput.addEventListener("focusout", noTexting);
saveBtn.addEventListener("click", saveImg);
fontSizeSelect.addEventListener("change", changeFontSize);

function drawStart(event) {
  ctx.moveTo(event.offsetX, event.offsetY);
  isDrawing = true;
  ctx.beginPath();
}
function drawing(event) {
  if (isDrawing) {
    if (isDraw === 1) {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    } else {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.fill();
    }
  } else {
    return;
  }
}
function drawEnd() {
  isDrawing = false;
}

function changeDrawWay() {
  if (isDraw === 1) {
    isDraw = 2;
    drawModeBtn.innerText = "unique pencil";
    canvas.classList.add("wait");
  } else if (isDraw === 2) {
    isDraw = 3;
    drawModeBtn.innerText = "fill";
    canvas.classList.replace("wait", "pointer");
  } else {
    isDraw = 1;
    drawModeBtn.innerText = "pencil mode";
    canvas.classList.remove("pointer");
  }
}

function fillCanvas() {
  if (isDraw === 3) {
    ctx.beginPath();
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function changeThick(event) {
  ctx.lineWidth = event.target.value;
}

function changeColor(event) {
  const colorPicked = event.target.value;
  ctx.strokeStyle = colorPicked;
  ctx.fillStyle = colorPicked;
}

function changeColor2(event) {
  const colorPicked = event.target.dataset.color;
  ctx.strokeStyle = colorPicked;
  ctx.fillStyle = colorPicked;
  pickColor.value = colorPicked;
}

function erase() {
  isDraw = 1;
  drawModeBtn.innerText = "pencil mode";
  ctx.strokeStyle = "white";
  pickColor.value = "white";
  ctx.lineWidth = 8;
  pickThick.value = 8;
}

function eraseAll() {
  let savedColor = pickColor.value;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = savedColor;
}

function loadImgChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
}

function insertText(event) {
  ctx.save();
  isTexting = true;
  textInput.focus();
  ctx.font = `${fontSize}px malgun gothic`;
  const x = event.offsetX;
  const y = event.offsetY;
  textForm.onsubmit = function (event) {
    if (isTexting) {
      ctx.fillText(textInput.value, x, y);
      textInput.value = "";
      isTexting = false;
      ctx.restore();
    }
  };
}
function noF5(event) {
  event.preventDefault();
}
function noTexting() {
  isTexting = false;
}

function saveImg() {
  if (confirm("save?") === true) {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.png";
    a.click();
  }
}

function changeFontSize(event) {
  fontSize = event.target.value;
}

/* 그림그리기 방법 2 
이벤트리스너를 add 했다 remove 했다 반복하는 방법은 생각보다 번거롭다.
항상 listen을 하는 방식으로 설계하는 것이 더 나을 것 같다.
canvas.addEventListener("mousedown", drawMode);
drawModeBtn.addEventListener("click", changeDrawWay);
function changeDrawWay(event) {
  if (isDraw) {
    isDraw = false;
    drawModeBtn.innerText = "fill";
    canvas.removeEventListener("mousedown", drawMode);
    canvas.addEventListener("click", fillMode);
  } else {
    isDraw = true;
    drawModeBtn.innerText = "draw";
    canvas.removeEventListener("click", fillMode);
    canvas.addEventListener("mousedown", drawMode);
  }
}
function drawMode(event) {
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", drawCancel);
  canvas.addEventListener("mouseleave", drawCancel);
}
function draw(event) {
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}
function drawCancel() {
  canvas.removeEventListener("mousemove", draw);
  return;
}
function fillMode() {
  ctx.beginPath();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
} */

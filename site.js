const WA = "5997011136";

/* reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* project filters */
const chips = document.querySelectorAll(".filters .chip");
chips.forEach((chip) => chip.addEventListener("click", () => {
  chips.forEach((c) => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", c === chip); });
  const f = chip.dataset.f;
  document.querySelectorAll(".tile").forEach((t) => t.classList.toggle("is-hidden", f !== "alle" && t.dataset.c !== f));
}));

/* stone picker */
const COLORS = [
  { id: "rood", name: "Rood-bruin", tones: ["#8a4438", "#9a5244", "#7a413a", "#a65e4c", "#6e3c37"], img: "klinker-curve", cap: "Rood-bruin, gelegd in een bocht." },
  { id: "bont", name: "Gemêleerd", tones: ["#8a4438", "#4a4c55", "#9a5244", "#3c3e46", "#7a4a42", "#5a4d52"], img: "courtyard-street", cap: "Gemêleerd bij Courtyard Bonaire." },
  { id: "antraciet", name: "Antraciet", tones: ["#3a3d44", "#45484f", "#2f3137", "#50535a"], img: "cordia-herringbone", cap: "Antraciet bij Garage Cordia." },
  { id: "grijs", name: "Grijs", tones: ["#9c9ea0", "#a8a9a8", "#8f9294", "#b2b2ae"], img: "boatyard-wide", cap: "Grijs op een groot terrein, 2020." },
  { id: "zand", name: "Zand", tones: ["#cdbb93", "#d8c8a3", "#c2ae86", "#e0d2b0"], img: "airport-wob", cap: "Licht, bij de luchthaven." },
];
const PATTERNS = [
  { id: "keper", name: "Keperverband" },
  { id: "elleboog", name: "Elleboogverband" },
  { id: "halfsteens", name: "Halfsteens" },
  { id: "blok", name: "Blokverband" },
];
const PER_M2 = 50; // 20 x 10 cm steen

const state = { color: COLORS[1], pattern: PATTERNS[0] };
const svg = document.getElementById("preview");
const colorBox = document.getElementById("colors");
const patBox = document.getElementById("patterns");
const m2 = document.getElementById("m2");
const count = document.getElementById("count");
const send = document.getElementById("send");
const realImg = document.getElementById("real-img");
const realCap = document.getElementById("real-cap");

COLORS.forEach((c) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "swatch";
  b.innerHTML = `<i style="background:linear-gradient(135deg,${c.tones[0]} 0 33%,${c.tones[1]} 33% 66%,${c.tones[2]} 66%)"></i>${c.name}`;
  b.addEventListener("click", () => { state.color = c; render(); });
  b.dataset.id = c.id;
  colorBox.append(b);
});
PATTERNS.forEach((p) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "chip"; b.textContent = p.name; b.dataset.id = p.id;
  b.addEventListener("click", () => { state.pattern = p; render(); });
  patBox.append(b);
});

// seeded random so a stone keeps its tone between renders
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function bricks(pattern) {
  const u = 20, out = []; // u = 10 cm
  if (pattern === "halfsteens") {
    for (let r = -1; r < 25; r++) for (let c = -1; c < 17; c++) out.push([c * 2 * u + (r % 2 ? u : 0), r * u, 2 * u, u]);
  } else if (pattern === "blok") {
    for (let i = -1; i < 17; i++) for (let j = -1; j < 13; j++) {
      const x = i * 2 * u, y = j * 2 * u;
      if ((i + j) % 2 === 0) { out.push([x, y, 2 * u, u], [x, y + u, 2 * u, u]); }
      else { out.push([x, y, u, 2 * u], [x + u, y, u, 2 * u]); }
    }
  } else {
    // herringbone: one diagonal staircase, repeated every 4 units
    for (let m = -16; m < 16; m++) for (let k = -30; k < 45; k++) {
      const x = (k + 4 * m) * u, y = k * u;
      out.push([x, y, 2 * u, u], [x, y + u, u, 2 * u]);
    }
  }
  return out;
}

function draw() {
  const { color, pattern } = state;
  const rand = rng(7);
  const rot = pattern.id === "keper" ? 'transform="translate(300 225) rotate(45) translate(-300 -225)"' : "";
  const rects = bricks(pattern.id).map(([x, y, w, h]) => {
    const t = color.tones[Math.floor(rand() * color.tones.length)];
    return `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="1.5" fill="${t}"/>`;
  }).join("");
  svg.innerHTML = `<rect width="600" height="450" fill="#d9cbb0"/><g ${rot}>${rects}</g>`;
}

function render() {
  colorBox.querySelectorAll(".swatch").forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === state.color.id));
  patBox.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === state.pattern.id));
  draw();
  realImg.src = `img/${state.color.img}.jpg`;
  realImg.alt = state.color.cap;
  realCap.textContent = state.color.cap;
  update();
}

function update() {
  const a = Math.max(0, parseFloat(String(m2.value).replace(",", ".")) || 0);
  const n = Math.ceil(a * PER_M2 * 1.05);
  count.textContent = a ? `Ongeveer ${n.toLocaleString("nl-NL")} stenen, inclusief 5% snijverlies.` : "Vul de oppervlakte in.";
  const msg = `Bon dia De Jong B.V., ik heb interesse in ${state.color.name.toLowerCase()} klinkers in ${state.pattern.name.toLowerCase()}${a ? `, voor ongeveer ${a} m²` : ""}. Kunt u een offerte maken?`;
  send.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}
m2.addEventListener("input", update);
render();

/* quote form: opens WhatsApp with the details filled in */
const form = document.getElementById("quote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  ["q-name", "q-contact"].forEach((id) => {
    const el = document.getElementById(id), err = document.getElementById(id + "-err");
    const bad = !el.value.trim();
    el.setAttribute("aria-invalid", bad); err.hidden = !bad;
    if (bad && ok) { el.focus(); ok = false; }
  });
  if (!ok) return;
  const d = new FormData(form);
  const msg = `Bon dia, ik ben ${d.get("name")}. Ik wil graag een offerte voor: ${d.get("kind")}.${d.get("msg") ? " " + d.get("msg") : ""} Bereikbaar op ${d.get("contact")}.`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

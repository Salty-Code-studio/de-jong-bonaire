const WA = "5997011136";

/* reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".sec-head, .work-in, .quote-in, .stones-in, .services-in, .supply, .heat, .visit-card").forEach((el) => { el.classList.add("rv"); io.observe(el); });

/* project register: one photo, pick the project */
const workImg = document.getElementById("work-img");
const workCap = document.getElementById("work-cap");
const rows = document.querySelectorAll("#register button");
rows.forEach((b) => b.addEventListener("click", () => {
  rows.forEach((r) => r.setAttribute("aria-pressed", r === b));
  workImg.classList.add("is-swapping");
  const next = new Image();
  next.src = `img/${b.dataset.img}.jpg`;
  next.onload = () => {
    workImg.src = next.src;
    workImg.alt = `${b.querySelector("b").textContent}: ${b.dataset.cap}`;
    workCap.textContent = b.dataset.cap;
    workImg.classList.remove("is-swapping");
  };
}));

/* stone catalog to WhatsApp */
const stones = document.querySelectorAll("#catalog button");
const pick = document.getElementById("pick");
stones.forEach((b) => b.addEventListener("click", () => {
  stones.forEach((s) => s.setAttribute("aria-pressed", s === b));
  pick.textContent = b.dataset.name;
}));
document.getElementById("order").addEventListener("submit", (e) => {
  e.preventDefault();
  const m2 = parseFloat(String(document.getElementById("m2").value).replace(",", "."));
  const msg = `Bon dia De Jong B.V., ik heb interesse in: ${pick.textContent}${m2 > 0 ? `, voor ongeveer ${m2} m²` : ""}. Kunt u mij een prijs sturen?`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* phone: show the WhatsApp bar once the hero button is out of view */
const dock = document.querySelector(".dock");
new IntersectionObserver(([e]) => dock.classList.toggle("is-on", !e.isIntersecting)).observe(document.querySelector(".hero-row .btn"));

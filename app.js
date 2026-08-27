const STORAGE_KEY = "mahili-birthday-story-v1";
const initialState = {
  contentVersion: 2,
  page: "wish",
  name: "mahiiiiiiiii / mahiluuuuuuu",
  wish: "Happy birthday to the person who makes my ordinary days feel like something worth keeping. I made you a tiny little world because you deserve a big, impossible kind of love.",
  noMessage: "hey pandi don't you love me?????? i know you love me, go back and click yes",
  final: `You are my favourite kind of home: the one I can laugh in, be quiet in, and keep choosing every day.

Mahi i promise you that i will fight with anyone to keep you in my life.

Asalu love ey odhu anukone nenu ninnu love chesa ,see edho magic la anipistundi naku like the college in which i never wanted to study gave me the love of my life. alochisthe chala surprising ga untundiiiiii.

The thing i love most is i can be a child again infront of you like neetho unte em pattinchukonu assalu responsible ga undanu free ga nachindi chesthanu.ah version andari mundu undalenu i can be like that only infront of you. 

and nuvu alane appudu appudu chinaapillodila avuthavu chudu na mundu i lovvvvve it yaarrrrrrrr .

And most importantly ne valla na insecurities anni poyayi like assalu life antha avi carry chesthu vachanu nenu avi but nuvu few months lo pogottesav vatini mahi i am so thankful for that .

Thank you so muchhhhhh nannaaaaaaaaaaaaaaaaaaaaaaaaaaa.

I just love the way you come back to me after each and every fight and argument.

I will be always with you.

Thank you for being all the small joys and the big magic. Happy birthday, my love. I hope this year is gentle with your heart and wildly good to you.`,
  chapters: [
    { id: "happy", emoji: "☀️", label: "happy", feeling: "the grin you give me", message: "Your happiness is honestly my favourite plot twist. Every time you smile, something in me remembers that life is very, very good.", photo: "" },
    { id: "love", emoji: "💛", label: "love", feeling: "the obvious one", message: "I love you in the loud ways, the sleepy ways, and all the tiny in-between ways that sneak into a normal Tuesday.", photo: "love.jpg.png?v=2" },
    { id: "tired", emoji: "🌙", label: "exhausted", feeling: "for your soft days", message: "When the day asks too much of you, come here. You don't have to be impressive with me. You can just be held, loudly admired, and given snacks.", photo: "exhausted.jpg.png" },
    { id: "missed", emoji: "🫶", label: "missed", feeling: "when you're away", message: "I miss you in all the little spaces: the empty side of a joke, the pause before I tell you something, the quiet after a long day.", photo: "missed.jpg.png" }
  ]
};

let state = loadState();
const app = document.querySelector("#app");

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const saved = { ...initialState, ...stored };
    if (stored.contentVersion !== initialState.contentVersion) {
      saved.contentVersion = initialState.contentVersion;
      saved.final = initialState.final;
    }
    if (Array.isArray(stored.chapters)) {
      saved.chapters = initialState.chapters.map(defaultChapter => {
        const storedChapter = stored.chapters.find(chapter => chapter.id === defaultChapter.id);
        return { ...defaultChapter, ...storedChapter, photo: storedChapter?.photo || defaultChapter.photo };
      });
    }
    delete saved.noShown;
    return saved;
  }
  catch { return structuredClone(initialState); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(value) { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }
function editable(key, value, tag = "p", extra = "") { return `<${tag} class="editable ${extra}">${esc(value)}</${tag}>`; }
function chrome(content, back = "") {
  return `<div class="app-shell">
    <header class="topbar"><div class="brand"><span class="brand-mark">✦</span><span>A birthday story, just for you</span></div></header>
    <section class="page">${back ? `<button class="back" data-action="back">← ${back}</button>` : ""}${content}</section>
  </div>`;
}
function wishPage() {
  return chrome(`<div class="content"><div class="eyebrow">a little note before we begin</div><h1>For <span class="italic">${editable("name", state.name, "span")}</span></h1>${editable("wish", state.wish, "p", "lede")}<div class="actions"><button class="primary" data-action="next" data-page="love">Continue <span>→</span></button></div></div>`);
}
function lovePage() {
  return chrome(`<div class="content"><div class="eyebrow">be honest, birthday person</div><h2>Do you love me?</h2><p class="lede">A very serious question. There may or may not be a correct answer.</p><div class="choice-row"><button class="primary choice" data-action="next" data-page="grid">Yes, obviously</button><button class="secondary choice" data-action="no">No</button></div><div class="tease" id="tease">${state.noShown ? editable("noMessage", state.noMessage, "p") : ""}</div>${state.noShown ? `<button class="secondary" data-action="retry">Fine, go back and click yes</button>` : ""}</div>`, "Birthday wish");
}
function gridPage() {
  const cards = state.chapters.map(chapter => `<button class="emoji-card" data-action="chapter" data-id="${chapter.id}"><span class="emoji">${chapter.emoji}</span>${editable(`chapter:${chapter.id}:label`, chapter.label, "span", "card-label")}${editable(`chapter:${chapter.id}:feeling`, `${chapter.feeling} ↗`, "span", "card-note")}</button>`).join("");
  return chrome(`<div class="content"><div class="eyebrow">choose a little feeling</div><h2>Open the parts<br><span class="italic">that are you.</span></h2><p class="lede">Each one has a note waiting inside. You can visit them in any order, and yes, I checked: they don't disappear.</p><div class="grid">${cards}</div><button class="primary" data-action="next" data-page="final">Continue to the final message <span>→</span></button></div>`, "Do you love me?");
}
function chapterPage(chapter) {
  return chrome(`<div class="sub-page"><div class="chapter"><div><div class="eyebrow">${chapter.emoji} ${esc(chapter.feeling)}</div><h2>${esc(chapter.label)} <span class="italic">looks good on you.</span></h2>${editable(`chapter:${chapter.id}:message`, chapter.message, "p", "chapter-message")}</div>${uploadMarkup(chapter)}</div></div>`, "All the feelings");
}
function uploadMarkup(chapter) {
  return `<div class="upload-zone" data-upload="${chapter.id}">${chapter.photo ? `<div><img class="preview-photo" src="${chapter.photo}" alt="Uploaded memory for ${esc(chapter.label)}"></div>` : `<div><strong>Drop a memory here</strong><p>One photo, just for this feeling.<br>It stays on this device.</p><label class="upload-button">Choose a photo<input class="upload-input" type="file" accept="image/*" data-file="${chapter.id}"></label></div>`}</div>`;
}
function finalPage() {
  return chrome(`<div class="content"><div class="eyebrow">the last page, promise</div><h2>My favourite<br><span class="italic">person.</span></h2>${editable("final", state.final, "p", "final-note")}<div class="actions"><button class="primary" data-action="confetti">Make it sparkle ✦</button></div><div id="confetti" class="hidden" aria-live="polite"><p class="tease">Happy birthday, ${esc(state.name)}. Now come here so I can annoy you in person.</p></div></div>`, "Your little feelings");
}
function render() {
  const current = state.page === "chapter" ? chapterPage(state.chapters.find(item => item.id === state.chapterId)) : ({ wish: wishPage, love: lovePage, grid: gridPage, final: finalPage }[state.page] || wishPage);
  app.innerHTML = typeof current === "function" ? current() : current;
  bind();
}
function navigate(page) {
  if (state.page === "love" && page !== "love") state.noShown = false;
  state.page = page;
  saveState();
  render();
}
function handleBack() { navigate(state.page === "love" ? "wish" : state.page === "grid" ? "love" : state.page === "chapter" ? "grid" : "grid"); }
function bind() {
  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "next") navigate(button.dataset.page);
    if (action === "back") handleBack();
    if (action === "no") { state.noShown = true; render(); }
    if (action === "retry") navigate("grid");
    if (action === "chapter") { state.chapterId = button.dataset.id; navigate("chapter"); }
    if (action === "confetti") { document.querySelector("#confetti")?.classList.remove("hidden"); burst(); }
  }));
  document.querySelectorAll("[data-file]").forEach(input => input.addEventListener("change", event => readPhoto(event.target.files[0], input.dataset.file)));
  document.querySelectorAll("[data-upload]").forEach(zone => {
    zone.addEventListener("dragover", event => { event.preventDefault(); zone.classList.add("dragover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
    zone.addEventListener("drop", event => { event.preventDefault(); zone.classList.remove("dragover"); readPhoto(event.dataTransfer.files[0], zone.dataset.upload); });
  });
}
function readPhoto(file, id) { if (!file || !file.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = () => { state.chapters.find(item => item.id === id).photo = reader.result; saveState(); render(); }; reader.readAsDataURL(file); }
function burst() { const layer = document.querySelector(".ambient"); for (let index = 0; index < 18; index += 1) { const spark = document.createElement("span"); spark.textContent = index % 2 ? "✦" : "♥"; spark.style.cssText = `position:absolute;left:${35 + Math.random() * 30}%;top:${35 + Math.random() * 25}%;color:#f3d9a1;font-size:${10 + Math.random() * 16}px;animation:float ${2 + Math.random() * 2}s ease-out forwards;`; layer.appendChild(spark); setTimeout(() => spark.remove(), 4200); } }
render();

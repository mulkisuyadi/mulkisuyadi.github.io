// ==== Section switcher: show only one big section at a time ====
function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
  const target = document.getElementById(sectionId);
  if (!target) return;

  target.style.display = 'block';

  const firstBtn = target.querySelector('.tab-buttons .tab-btn');
  if (firstBtn) {
    target.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    target.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    firstBtn.classList.add('active');
    const tabId = firstBtn.dataset.tab;
    const firstPane = target.querySelector(`#${tabId}`);
    if (firstPane) firstPane.classList.add('active');
  }
}

// ==== Tab switching INSIDE each section ====
document.querySelectorAll('.tab-buttons').forEach(buttonGroup => {
  buttonGroup.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.content-section');

      section.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      section.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

      button.classList.add('active');
      const tabId = button.dataset.tab;
      const targetPane = section.querySelector(`#${tabId}`);
      if (targetPane) targetPane.classList.add('active');

      if (tabId === 'percakapan-materi') {
        const visibleWeek = targetPane.querySelector('.week-content:not([style*="display: none"])') 
                         || targetPane.querySelector('#week1');
        if (visibleWeek) autoSelectFirstCardIn(visibleWeek);
      }
    });
  });
});

// ==== Handle HSK dropdown clicks ====
document.querySelectorAll('.dropdown-content li').forEach(item => {
  if (!item.classList.contains('disabled')) {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-content li').forEach(li => li.classList.remove('active'));
      item.classList.add('active');
    });
  }
});

// ==== Toast system ====
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

document.querySelectorAll('.coming-soon').forEach(item => {
  item.addEventListener('click', () => showToast("Coming soon!"));
});

// ==== Quiz logic ====
document.querySelectorAll('form[id^="quiz-"]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.dataset.name;
    const correctValue = form.dataset.correct;
    const correctMsg = form.dataset.correctMsg;
    const wrongMsg = form.dataset.wrongMsg;
    const result = document.getElementById(`quiz-result-${form.id.split('-')[1]}`);
    const selected = document.querySelector(`input[name="${name}"]:checked`);

    if (!selected) {
      result.textContent = "Please select an answer.";
      result.style.color = "orange";
      return;
    }

    if (selected.value === correctValue) {
      result.textContent = correctMsg;
      result.style.color = "green";
    } else {
      result.textContent = wrongMsg;
      result.style.color = "red";
    }
  });
});

// ==== Audio ====
function playAudio(file) {
  if (!file) return;
  const audio = new Audio(file);
  audio.play();
}

// ==== Card selection + content update ====
function updateContent(card) {
  const scope = card.closest('.tab-content');
  if (!scope) return;

  const featuredHanzi =
    scope.querySelector('.featured-hanzi') ||
    document.querySelector('#featured-hanzi');

  let exampleSentences = scope.querySelector('.example-sentences');
  if (!exampleSentences) {
    exampleSentences = document.createElement('div');
    exampleSentences.className = 'example-sentences';
    exampleSentences.innerHTML = `
      <div class="default-message">
        <p>Klik kata di bawah untuk melihat contoh kalimat</p>
        <p>Click a word below to see example sentences</p>
      </div>
    `;
    (featuredHanzi?.parentNode || scope).insertBefore(
      exampleSentences,
      featuredHanzi ? featuredHanzi.nextSibling : null
    );
  }

  if (!featuredHanzi || !exampleSentences) return;

  const hanzi = card.dataset.hanzi || "";
  const pinyin = card.dataset.pinyin || "";
  const translation = card.dataset.translation || "";
  const audio = card.dataset.audio || "";
  const sentences = JSON.parse(card.dataset.sentences || "[]");

  featuredHanzi.innerHTML = `
    <div class="hanzi-display">${hanzi || "—"}</div>
    <div class="pinyin">${pinyin || ""}</div>
    <div class="translation">${translation || ""}</div>
    <div class="audio-player">
      <button onclick="playAudio('${audio}')">
        <i class="fas fa-play"></i> Play Audio
      </button>
      <span>Click to listen</span>
    </div>
  `;

  exampleSentences.classList.add("has-content");
  exampleSentences.innerHTML = sentences.length
  ? sentences.map(s => `
      <div class="sentence-card">
        <div class="sentence-hanzi">${s.hanzi || ""}</div>
        <div class="sentence-pinyin">${s.pinyin || ""}</div>
        <div class="sentence-translation">${s.translation || ""}</div>
        <div class="sentence-audio">
          <button class="audio-btn-small" 
                  ${s.audio ? `onclick="playAudio('${s.audio}')"` : "disabled"}>
            <i class="fas fa-play"></i>
          </button>
          ${!s.audio ? "<span class='no-audio'>No audio</span>" : ""}
        </div>
      </div>
    `).join("")
  : `<div class="default-message"><p>Tidak ada contoh kalimat.</p></div>`;

}

function selectCard(card) {
  const scope = card.closest('.tab-content') || document;
  scope.querySelectorAll('.vocab-card.selected').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function autoSelectFirstCardIn(container) {
  const firstCard = container.querySelector('.vocab-card');
  if (firstCard) {
    selectCard(firstCard);
    updateContent(firstCard);
  }
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.vocab-card');
  if (!card) return;
  selectCard(card);
  updateContent(card);
});

// ==== Percakapan: week switching ====
function showWeek(weekId) {
  const pane = document.getElementById('percakapan-materi');
  if (!pane) return;

  pane.querySelectorAll('.week-content').forEach(div => div.style.display = 'none');
  const target = pane.querySelector(`#${weekId}`);
  if (target) {
    target.style.display = 'block';
    autoSelectFirstCardIn(target);
  }

  pane.querySelectorAll('.week-buttons button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = pane.querySelector(`.week-buttons button[data-week="${weekId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}



document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#percakapan-materi .week-buttons button');
  buttons.forEach(button => {
    button.addEventListener('click', () => showWeek(button.dataset.week));
  });

  showWeek('week1');

  const defaultHSKCard = document.querySelector('#hsk1-materi .vocab-card[data-hanzi="我"]') 
                      || document.querySelector('#hsk1-materi .vocab-card');
  if (defaultHSKCard) {
    selectCard(defaultHSKCard);
    updateContent(defaultHSKCard);
  }
});


// ==== ✅ Unified vocab renderer ====
function renderVocabCards(items, gridSelector) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  grid.innerHTML = "";

  items.forEach(v => {
    const div = document.createElement("div");
    div.className = "vocab-card";

    const sentences = (v.sentences || []).map(s => ({
      hanzi: s.hanzi || s.cn || "",
      pinyin: s.pinyin || "",
      translation: s.translation || s.id || "",
      audio: s.audio || ""
    }));

    div.dataset.hanzi = v.hanzi || "";
    div.dataset.pinyin = v.pinyin || "";
    div.dataset.translation = v.translation || v.arti || "";
    div.dataset.audio = v.audio || "";
    div.dataset.sentences = JSON.stringify(sentences);

    div.innerHTML = `
      <p class="hanzi">${v.hanzi || ""}</p>
      <p class="pinyin">${v.pinyin || ""}</p>
      <p class="translation">${v.translation || v.arti || ""}</p>
    `;
    grid.appendChild(div);
  });

  if (grid.children.length) autoSelectFirstCardIn(grid);
}

// === Load vocab.json (HSK1 Materi) ===
fetch("data/vocab.json")
  .then(res => res.json())
  .then(data => renderVocabCards(data.hsk1 || [], "#hsk1-materi .vocab-grid"))
  .catch(err => console.error("Failed to load data/vocab.json:", err));

// === Load weeks.json (Percakapan Materi) ===
fetch("data/weeks.json")
  .then(res => res.json())
  .then(data => {
    if (!data.weeks) return;

    for (const week in data.weeks) {
      const container = document.querySelector(`#${week} .vocab-container`);
      if (!container) continue;
      container.innerHTML = "";

      data.weeks[week].forEach(v => {
        const div = document.createElement("div");
        div.className = "vocab-card";

        const sentences = (v.sentences || []).map(s => ({
          hanzi: s.hanzi || s.cn || "",
          pinyin: s.pinyin || "",
          translation: s.translation || s.id || "",
          audio: s.audio || ""
        }));

        div.dataset.hanzi = v.hanzi || "";
        div.dataset.pinyin = v.pinyin || "";
        div.dataset.translation = (v.translation || v.arti || "");
        div.dataset.audio = v.audio || "";
        div.dataset.sentences = JSON.stringify(sentences);

        div.innerHTML = `
          <p class="hanzi">${v.hanzi || ""}</p>
          <p class="pinyin">${v.pinyin || ""}</p>
          <p class="translation">${v.translation || v.arti || ""}</p>
        `;
        container.appendChild(div);
      });
    }

    // ✅ All weeks rendered, now attach week buttons + initial state
    const buttons = document.querySelectorAll('#percakapan-materi .week-buttons button');
    buttons.forEach(button => {
      button.addEventListener('click', () => showWeek(button.dataset.week));
    });

    // ✅ Show Week 1 by default after async render
    showWeek('week1');
  })
  .catch(err => console.error("Failed to load data/weeks.json:", err));



// === Render story + quizzes from JSON ===
async function loadQuizzes() {
  try {
    const res = await fetch("data/quizzes.json");
    const data = await res.json();

    const container = document.getElementById("hsk1-membaca");
    container.innerHTML = "";

    if (data.story) {
      const storyTitle = document.createElement("h3");
      storyTitle.textContent = "Latihan Membaca";
      container.appendChild(storyTitle);

      const storyHeading = document.createElement("p");
      storyHeading.innerHTML = `<strong>${data.story.title}</strong>`;
      container.appendChild(storyHeading);

      data.story.content.forEach(line => {
        const p = document.createElement("p");
        p.textContent = line;
        container.appendChild(p);
      });

      const questionHeader = document.createElement("h4");
      questionHeader.textContent = "Pertanyaan:";
      container.appendChild(questionHeader);
    }

    if (data.hsk1 && Array.isArray(data.hsk1)) {
      data.hsk1.forEach(q => {
        const form = document.createElement("form");
        form.classList.add("quiz-form");

        form.innerHTML = `
          <p>${q.question}</p>
          ${q.options.map(opt => `
            <label>
              <input type="radio" name="${q.id}" value="${opt.value}">
              ${opt.label}
            </label><br>
          `).join("")}
          <button type="submit">提交</button>
          <div class="feedback"></div>
        `;

        form.addEventListener("submit", e => {
          e.preventDefault();
          const selected = form.querySelector("input[type=radio]:checked");
          const feedback = form.querySelector(".feedback");

          if (!selected) {
            feedback.textContent = "⚠️ 请选择一个答案";
            feedback.style.color = "orange";
            return;
          }

          if (selected.value === q.correct) {
            feedback.textContent = q.correctMsg;
            feedback.style.color = "green";
          } else {
            feedback.textContent = q.wrongMsg;
            feedback.style.color = "red";
          }
        });

        container.appendChild(form);
      });
    }
  } catch (err) {
    console.error("加载测验失败:", err);
  }
}
loadQuizzes();

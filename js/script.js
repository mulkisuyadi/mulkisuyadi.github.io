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

      // If we switched into Percakapan Materi, ensure a default card is selected
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

// ==== Card selection + content update (SCOPED to the current tab) ====
function updateContent(card) {
  const scope = card.closest('.tab-content'); // HSK1 or Percakapan tab
  if (!scope) return;

  // Find featured panel: prefer local .featured-hanzi, fallback to #featured-hanzi for HSK1
  const featuredHanzi = scope.querySelector('.featured-hanzi') 
                     || document.querySelector('#featured-hanzi');
  const exampleSentences = scope.querySelector('.example-sentences') 
                        || document.querySelector('.example-sentences');

  if (!featuredHanzi || !exampleSentences) return;

  const hanzi = card.getAttribute("data-hanzi") || "";
  const pinyin = card.getAttribute("data-pinyin") || "";
  const translation = card.getAttribute("data-translation") || "";
  const audio = card.getAttribute("data-audio") || "";
  const sentences = JSON.parse(card.getAttribute("data-sentences") || "[]");

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
          <div class="sentence-hanzi">${s.hanzi}</div>
          <div class="sentence-pinyin">${s.pinyin}</div>
          <div class="sentence-translation">${s.translation}</div>
          <div class="sentence-audio">
            <button class="audio-btn-small" onclick="playAudio('${s.audio}')">
              <i class="fas fa-play"></i>
            </button>
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

// ==== Event delegation for ALL vocab cards (works for both sections) ====
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

// ==== Attach week button listeners + initial state ====
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#percakapan-materi .week-buttons button');
  buttons.forEach(button => {
    button.addEventListener('click', () => showWeek(button.dataset.week));
  });

  // Show Week 1 by default and select its first card
  showWeek('week1');

  // HSK1 default select (keeps your old behavior)
  const defaultHSKCard = document.querySelector('#hsk1-materi .vocab-card[data-hanzi="我"]') 
                      || document.querySelector('#hsk1-materi .vocab-card');
  if (defaultHSKCard) {
    selectCard(defaultHSKCard);
    updateContent(defaultHSKCard);
  }
});
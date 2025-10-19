// Elements
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const lengthSlider = document.querySelector("[data-lengthSlider]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const copyBtn = document.querySelector("[data-copy]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const saveBtn = document.querySelector(".saveBtn");
const saveInput = document.querySelector(".saveInput");
const savedList = document.querySelector(".saved-list");
const clearAll = document.querySelector(".clearAll");

// Initialize
let passwordLength = 10;
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// Update slider
lengthSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  lengthNumber.textContent = passwordLength;
});

// Character sets
const upperSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerSet = "abcdefghijklmnopqrstuvwxyz";
const numberSet = "0123456789";
const symbolSet = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// Generate random characters
function getRandomData(dataset) {
  return dataset[Math.floor(Math.random() * dataset.length)];
}

// Generate password
generateBtn.addEventListener("click", () => {
  const includeUpper = document.getElementById("uppercase").checked;
  const includeLower = document.getElementById("lowercase").checked;
  const includeNumber = document.getElementById("numbers").checked;
  const includeSymbol = document.getElementById("symbols").checked;

  let charPool = "";
  if (includeUpper) charPool += upperSet;
  if (includeLower) charPool += lowerSet;
  if (includeNumber) charPool += numberSet;
  if (includeSymbol) charPool += symbolSet;

  if (charPool === "") {
    alert("Please select at least one option!");
    return;
  }

  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += getRandomData(charPool);
  }

  passwordDisplay.value = password;
  updateStrength(password);
});

// Password strength indicator
function updateStrength(password) {
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const colors = ["#ff4b5c", "#ffb84b", "#4cd137", "#2ecc71"];
  indicator.style.background = colors[strength - 1] || "#ccc";
}

// Copy to clipboard
copyBtn.addEventListener("click", () => {
  if (!passwordDisplay.value) return;
  navigator.clipboard.writeText(passwordDisplay.value);
  copyBtn.innerHTML = "✅";
  setTimeout(() => {
    copyBtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/54/54602.png" width="22" height="22"/>`;
  }, 1200);
});

// Save password
saveBtn.addEventListener("click", () => {
  const label = saveInput.value.trim();
  const pwd = passwordDisplay.value.trim();
  if (!pwd) return alert("No password to save!");
  if (!label) return alert("Please enter a label.");

  const saved = JSON.parse(localStorage.getItem("passwords")) || [];
  saved.push({ label, pwd });
  localStorage.setItem("passwords", JSON.stringify(saved));

  saveInput.value = "";
  renderSaved();
});

// Render saved list
function renderSaved() {
  const saved = JSON.parse(localStorage.getItem("passwords")) || [];
  savedList.innerHTML = "";

  if (saved.length === 0) {
    savedList.innerHTML = `<p class="empty">No saved passwords.</p>`;
    return;
  }

  saved.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "saved-item";
    div.innerHTML = `
      <div>
        <strong>${item.label}</strong>
        <p class="mask">••••••••••</p>
      </div>
      <div>
        <button class="btn-ghost reveal" data-index="${i}">👁️</button>
        <button class="btn-ghost copy" data-index="${i}">📋</button>
        <button class="btn-danger delete" data-index="${i}">🗑️</button>
      </div>
    `;
    savedList.appendChild(div);
  });
}

// Saved list actions
savedList.addEventListener("click", (e) => {
  const saved = JSON.parse(localStorage.getItem("passwords")) || [];
  const index = e.target.dataset.index;
  if (e.target.classList.contains("delete")) {
    saved.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(saved));
    renderSaved();
  } else if (e.target.classList.contains("copy")) {
    navigator.clipboard.writeText(saved[index].pwd);
    e.target.textContent = "✅";
    setTimeout(() => (e.target.textContent = "📋"), 1000);
  } else if (e.target.classList.contains("reveal")) {
    const mask = e.target.parentElement.parentElement.querySelector(".mask");
    if (mask.textContent.includes("•")) {
      mask.textContent = saved[index].pwd;
    } else {
      mask.textContent = "••••••••••";
    }
  }
});

// Clear all
clearAll.addEventListener("click", () => {
  if (confirm("Delete all saved passwords?")) {
    localStorage.removeItem("passwords");
    renderSaved();
  }
});

// Load saved on start
renderSaved();

// Theme Toggle + Auto Detect
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (
  savedTheme === "light" ||
  (window.matchMedia("(prefers-color-scheme: light)").matches && !savedTheme)
) {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
});

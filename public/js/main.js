// public/js/main.js

const form = document.getElementById("shorten-form");
const resultSection = document.getElementById("result");
const shortUrlEl = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "";
  resultSection.classList.add("hidden");

  const originalUrl = document.getElementById("originalUrl").value.trim();
  const customCode = document.getElementById("customCode").value.trim();

  if (!originalUrl) return;

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ originalUrl, customCode })
    });

    const data = await res.json();

    if (!res.ok) {
      statusMsg.textContent = data.error || "Could not create short link.";
      resultSection.classList.remove("hidden");
      shortUrlEl.textContent = "";
      copyBtn.style.display = "none";
      return;
    }

    shortUrlEl.textContent = data.shortUrl;
    copyBtn.style.display = "inline-block";
    statusMsg.textContent = "Short link created. Tap to copy.";
    resultSection.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "Network error. Please try again.";
    resultSection.classList.remove("hidden");
    shortUrlEl.textContent = "";
    copyBtn.style.display = "none";
  }
});

copyBtn.addEventListener("click", async () => {
  const text = shortUrlEl.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    statusMsg.textContent = "Copied to clipboard!";
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "Could not copy. Please copy manually.";
  }
});

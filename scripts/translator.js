// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FLOATING BOX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Create the floating box
const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.maxWidth = "20em";
popup.style.background = "rgba(0,0,0,0.85)";
popup.style.color = "white";
popup.style.padding = "6px 10px";
popup.style.borderRadius = "6px";
popup.style.fontSize = "16px";
popup.style.zIndex = "9999";
popup.style.display = "none"; // hidden by default
document.body.appendChild(popup);

// Show & move the popup near the mouse
document.addEventListener("mousemove", e => {
  popup.style.left = e.clientX + 12 + "px";
  popup.style.top = e.clientY + 12 + "px";
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENT HANDLERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const onClick = async () => {
  window.removeEventListener("click", onClick)
  popup.style.display = "none";
}

const onSelect = async () => {
  // Event listener cleanup
  window.removeEventListener("mouseup", onSelect)

  // Check if the extension is activated
  const storage = await chrome.storage.local.get()
  const active = storage.simpleTranslatorActive
  if (!active) {
    return
  }

  // Get selection
  const selection = window.getSelection().toString();
  if (selection === "") return;

  // Get languages
  const from = storage.simpleTranslatorFrom
  const to = storage.simpleTranslatorTo

  try {
    // Translate text
    document.body.style.cursor = "wait"
    const translator = await Translator.create({
      sourceLanguage: from,
      targetLanguage: to,
    });

    const translation = await translator.translate(selection);

    // Display translation
    popup.textContent = translation;
    popup.style.display = "block";

    // Add event listener to remove popup
    window.addEventListener("click", onClick)
  } catch {
    // Display error
    popup.textContent = "Unsupported language pair. Sorry :(";
    popup.style.display = "block";

    // Add event listener to remove popup
    window.addEventListener("click", onClick)
  }
  finally {
    document.body.style.cursor = "auto"
  }
}

// Add event listener to run the translation on every selection of text
window.addEventListener("selectstart", () => {
  window.addEventListener("mouseup", onSelect)
});

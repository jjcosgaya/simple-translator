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
const onClick = () => {
  window.removeEventListener("click", onClick)
  popup.style.display = "none";
}

const onSelect = async () => {
  // Event listener cleanup
  window.removeEventListener("mouseup", onSelect)

  // Get selection
  const selection = window.getSelection().toString();
  if (selection === "") return;

  // Translate text
  document.body.style.cursor = "wait"
  const translator = await Translator.create({
    sourceLanguage: 'fi',
    targetLanguage: 'es',
  });

  const translation = await translator.translate(selection);
  document.body.style.cursor = "auto"

  // Display translation
  popup.textContent = translation;
  popup.style.display = "block";

  // Add event listener to remove popup
  window.addEventListener("click", onClick)
}

// Add event listener to run the translation on every selection of text
window.addEventListener("selectstart", () => {
  window.addEventListener("mouseup", onSelect)
});

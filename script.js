const fromSelector = document.getElementById("from")
const toSelector = document.getElementById("to")
const activeSelector = document.getElementById("active")
console.log(activeSelector.value)

const storage = await chrome.storage.local.get()

const from = storage.simpleTranslatorFrom
const to = storage.simpleTranslatorTo
const active = storage.simpleTranslatorActive

if (from) {
  fromSelector.value = from
}
if (to) {
  toSelector.value = to
}
activeSelector.checked = active

fromSelector.addEventListener("change", async () =>{
  await chrome.storage.local.set({ simpleTranslatorFrom: fromSelector.value })
})
toSelector.addEventListener("change", async () =>{
  await chrome.storage.local.set({ simpleTranslatorTo: toSelector.value })
})
activeSelector.addEventListener("change", async () =>{
  await chrome.storage.local.set({ simpleTranslatorActive: activeSelector.checked })
})

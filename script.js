const fromSelector = document.getElementById("from")
const toSelector = document.getElementById("to")

const storage = await chrome.storage.local.get()

const from = storage.simpleTranslatorFrom
const to = storage.simpleTranslatorTo

if (from) {
  fromSelector.value = from
}
if (to) {
  toSelector.value = to
}

fromSelector.addEventListener("change", async () =>{
  await chrome.storage.local.set({ simpleTranslatorFrom: fromSelector.value })
})
toSelector.addEventListener("change", async () =>{
  await chrome.storage.local.set({ simpleTranslatorTo: toSelector.value })
})

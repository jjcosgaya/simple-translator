console.log("Hola")
document.addEventListener("selectionchange", () => {
  console.log(document.getSelection().toString());
});

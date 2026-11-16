const pages = [...document.querySelectorAll(".page")];
const navButtons = [...document.querySelectorAll("nav button")];

function showPage(id) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === id);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === id);
  });

  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

// Open the page referenced in the URL, if it exists.
const initialPage = location.hash.slice(1);
if (pages.some((page) => page.id === initialPage)) {
  showPage(initialPage);
}

// Display the current year in the footer.
document.getElementById("year").textContent = new Date().getFullYear();

// Project file selection and drag-and-drop.
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const dropzone = document.getElementById("dropzone");

let selectedFiles = [];

function addFiles(newFiles) {
  selectedFiles.push(...Array.from(newFiles));
  renderFiles();
}

function renderFiles() {
  fileList.innerHTML = "";

  if (selectedFiles.length === 0) {
    fileList.innerHTML =
      '<p style="color:#68736d">Ingen filer lagt til ennå.</p>';
    return;
  }

  selectedFiles.forEach((file, index) => {
    const row = document.createElement("div");
    row.className = "file";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = file.name;

    const size = document.createElement("small");
    size.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    info.append(name, size);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Fjern";
    removeButton.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderFiles();
    });

    row.append(info, removeButton);
    fileList.append(row);
  });
}

fileInput.addEventListener("change", (event) => {
  addFiles(event.target.files);
  fileInput.value = "";
});

// Highlight the drop area while files are dragged over it.
["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("drag");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("drag");
  });
});

dropzone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

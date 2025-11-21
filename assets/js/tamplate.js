function loadTemplate(path, containerId) {
    const target = document.getElementById(containerId);
    if (!target) {
        console.warn("Container tidak ditemukan:", containerId);
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", path);
    xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0) {
            target.innerHTML = xhr.responseText;
        } else {
            console.error("Gagal load:", xhr.status, path);
        }
    };
    xhr.onerror = () => console.error("XHR error:", path);
    xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Load header...");
    loadTemplate("../../../assets/tamplate/header.html", "header-container");

    console.log("Load footer...");
    loadTemplate("../../../assets/tamplate/footer.html", "footer-container");
});

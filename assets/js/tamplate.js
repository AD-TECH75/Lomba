document.addEventListener("DOMContentLoaded", () => {
    // Ganti path relatif sesuai lokasi file HTML yang sedang dibuka
    loadTemplate("../../../../assets/tamplate/header.html", "header-container");
    loadTemplate("../../../../assets/tamplate/footer.html", "footer-container");
});

function loadTemplate(path, containerId) {
    const target = document.getElementById(containerId);
    if (!target) {
        console.log("Container tidak ditemukan:", containerId);
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", path);

    xhr.onload = () => {
        // status 200 = HTTP OK
        // status 0 = GitHub Pages tidak pakai (hanya local), tapi tetap kita anggap OK
        if (xhr.status === 200 || xhr.status === 0) {
            target.innerHTML = xhr.responseText;
        } else {
            console.error("Gagal load:", xhr.status, path);
        }
    };

    xhr.onerror = () => console.error("XHR error:", path);

    xhr.send();
}

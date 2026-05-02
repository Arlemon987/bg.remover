const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");
const beforeImg = document.getElementById("before");
const afterImg = document.getElementById("after");
const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");

let file;

// drag & drop
dropArea.onclick = () => fileInput.click();

fileInput.onchange = () => {
    file = fileInput.files[0];
    beforeImg.src = URL.createObjectURL(file);
};

// remove bg
document.getElementById("removeBtn").onclick = async () => {
    if (!file) return alert("Upload image first");

    loader.style.display = "block";

    const formData = new FormData();
    formData.append("image_file", file);

    const res = await fetch("/api/remove", {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    afterImg.src = url;
    loader.style.display = "none";

    downloadBtn.style.display = "block";

    downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "no-bg.png";
        a.click();
    };
};

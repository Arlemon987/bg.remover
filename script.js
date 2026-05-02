const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");
const beforeImg = document.getElementById("before");
const afterImg = document.getElementById("after");
const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");
const removeBtn = document.getElementById("removeBtn");

let file = null;

// click upload
dropArea.onclick = () => fileInput.click();

// file select
fileInput.onchange = () => {
    file = fileInput.files[0];

    if (!file) return;

    // preview before image
    beforeImg.src = URL.createObjectURL(file);

    // reset output
    afterImg.src = "";
    downloadBtn.style.display = "none";
};

// remove background
removeBtn.onclick = async () => {
    if (!file) {
        alert("Upload an image first");
        return;
    }

    loader.style.display = "block";
    removeBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("image_file", file);

        const res = await fetch("/api/remove", {
            method: "POST",
            body: formData
        });

        // 🔴 HANDLE ERROR RESPONSE
        if (!res.ok) {
            const text = await res.text();
            console.error("API ERROR:", text);
            alert("Error: " + text);
            return;
        }

        const blob = await res.blob();

        // ensure it's actually an image
        if (!blob.type.includes("image")) {
            alert("Invalid response from server");
            return;
        }

        const url = URL.createObjectURL(blob);

        // show result
        afterImg.src = url;

        // show download button
        downloadBtn.style.display = "block";

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = "no-bg.png";
            a.click();
        };

    } catch (err) {
        console.error(err);
        alert("Something went wrong: " + err.message);
    } finally {
        loader.style.display = "none";
        removeBtn.disabled = false;
    }
};

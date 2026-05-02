const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");
const beforeImg = document.getElementById("before");
const afterImg = document.getElementById("after");
const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");
const removeBtn = document.getElementById("removeBtn");

let file = null;
let resultURL = null;

// click upload
dropArea.onclick = () => fileInput.click();

// drag & drop support
dropArea.ondragover = (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#22c55e";
};

dropArea.ondragleave = () => {
    dropArea.style.borderColor = "#3b82f6";
};

dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#3b82f6";

    file = e.dataTransfer.files[0];
    handleFile(file);
};

// file select
fileInput.onchange = () => {
    file = fileInput.files[0];
    handleFile(file);
};

// handle preview + reset
function handleFile(selectedFile) {
    if (!selectedFile) return;

    file = selectedFile;

    // preview before image
    beforeImg.src = URL.createObjectURL(file);

    // reset output
    afterImg.src = "";
    downloadBtn.style.display = "none";

    // clean old URL
    if (resultURL) {
        URL.revokeObjectURL(resultURL);
        resultURL = null;
    }
}

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

        // 🔥 REQUIRED FIELD
        formData.append("image_file", file);

        // 🔥 QUALITY SETTINGS (VERY IMPORTANT)
        formData.append("size", "full");   // HD output
        formData.append("format", "png");  // best quality

        const res = await fetch("/api/remove", {
            method: "POST",
            body: formData
        });

        // error handling
        if (!res.ok) {
            const text = await res.text();
            console.error("API ERROR:", text);
            alert("Error: " + text);
            return;
        }

        const blob = await res.blob();

        if (!blob.type.includes("image")) {
            alert("Invalid response from server");
            return;
        }

        // clean previous result
        if (resultURL) URL.revokeObjectURL(resultURL);

        resultURL = URL.createObjectURL(blob);

        // show result
        afterImg.src = resultURL;

        // show download
        downloadBtn.style.display = "block";

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = resultURL;
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

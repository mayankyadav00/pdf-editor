const { jsPDF } = window.jspdf;
let globalPDF = new jsPDF();
let pdfPages = [];

// Convert images to PDF
function handleFileSelect(event) {
    const files = event.target.files;
    if (!files.length) {
        alert("Please select images.");
        return;
    }
    convertToPDF(files);
}

function convertToPDF(files) {
    let isFirstPage = true;
    pdfPages = [];
    globalPDF = new jsPDF();

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                const pdfWidth = globalPDF.internal.pageSize.getWidth();
                const pdfHeight = globalPDF.internal.pageSize.getHeight();
                const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
                const newWidth = img.width * ratio;
                const newHeight = img.height * ratio;
                const xOffset = (pdfWidth - newWidth) / 2;
                const yOffset = (pdfHeight - newHeight) / 2;

                if (!isFirstPage) globalPDF.addPage();
                globalPDF.addImage(img, "JPEG", xOffset, yOffset, newWidth, newHeight);
                isFirstPage = false;

                pdfPages.push(globalPDF.output("dataurlstring"));
                renderPDF();
            };
        };
        reader.readAsDataURL(file);
    });
}

// Render PDF Preview
function renderPDF() {
    const pdfViewer = document.getElementById("pdfViewer");
    pdfViewer.innerHTML = "";
    pdfPages.forEach((pdf) => {
        let iframe = document.createElement("iframe");
        iframe.src = pdf;
        iframe.width = "100%";
        iframe.height = "100%";
        pdfViewer.appendChild(iframe);
    });
}

// Download the generated PDF
function downloadPDF() {
    globalPDF.save("generated.pdf");
}

// Event listeners
document.getElementById("fileInput").addEventListener("change", handleFileSelect);
document.getElementById("convertBtn").addEventListener("click", function () {
    const files = document.getElementById("fileInput").files;
    convertToPDF(files);
});
document.getElementById("downloadBtn").addEventListener("click", downloadPDF);

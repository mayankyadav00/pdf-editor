// script.js - JavaScript-based PDF Editor

const { jsPDF } = window.jspdf; let globalPDF = new jsPDF(); let pdfPages = [];

Select files for conversion function handleFileSelect(event) { const files = event.target.files; if (!files.length) { alert("Please select images or a PDF."); return; } convertToPDF(files); }

Convert images to PDF function convertToPDF(files) { let isFirstPage = true; Array.from(files).forEach((file, index) => { const reader = new FileReader(); reader.onload = function(event) { const img = new Image(); img.src = event.target.result; img.onload = function() { const pdfWidth = globalPDF.internal.pageSize.getWidth(); const pdfHeight = globalPDF.internal.pageSize.getHeight(); const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height); const newWidth = img.width * ratio; const newHeight = img.height * ratio; const xOffset = (pdfWidth - newWidth) / 2; const yOffset = (pdfHeight - newHeight) / 2;

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

Render PDF preview function renderPDF() { const pdfViewer = document.getElementById("pdfViewer"); pdfViewer.innerHTML = ""; pdfPages.forEach((pdf, index) => { let iframe = document.createElement("iframe"); iframe.src = pdf; iframe.width = "100%"; iframe.height = "500px"; pdfViewer.appendChild(iframe); }); }

Add a new blank page function addPage() { globalPDF.addPage(); pdfPages.push(globalPDF.output("dataurlstring")); renderPDF(); }

Remove last page function removePage() { if (pdfPages.length > 1) { pdfPages.pop(); globalPDF.deletePage(pdfPages.length); renderPDF(); } else { alert("Cannot remove the last page."); } }

Download the edited PDF function downloadPDF() { globalPDF.save("edited.pdf"); }

Attach event listeners document.getElementById("fileInput").addEventListener("change", handleFileSelect); document.getElementById("addPageBtn").addEventListener("click", addPage); document.getElementById("removePageBtn").addEventListener("click", removePage); document.getElementById("downloadBtn").addEventListener("click", downloadPDF);

Live text editing functionality function enableTextEditing() { let textArea = document.createElement("textarea"); textArea.style.position = "absolute"; textArea.style.top = "100px"; textArea.style.left = "50px"; textArea.style.width = "300px"; textArea.style.height = "100px"; textArea.style.border = "1px solid black"; textArea.style.resize = "both"; textArea.oninput = function() { updatePDFText(this.value); }; document.body.appendChild(textArea); }

function updatePDFText(text) { if (!globalPDF) return; globalPDF.text(text, 20, 30); renderPDF(); }

document.getElementById("editTextBtn").addEventListener("click", enableTextEditing);


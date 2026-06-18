import html2pdf from "html2pdf.js";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

export const downloadPdfFromPage = async ({
  url,
  elementSelector = ".qt-card",
  fileName = "document.pdf",
}) => {
  const iframe = document.createElement("iframe");

  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "1200px";
  iframe.style.height = "1000px";
  iframe.style.border = "0";
  iframe.style.background = "#fff";

  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      const element = iframeDocument.querySelector(elementSelector);

      if (!element) {
        alertify.alert("error", "Unable to load template");
        return;
      }

      // Wait for images
      const images = iframeDocument.images;

      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // const options = {
      //   margin: 0.2,

      //   filename: fileName,

      //   image: {
      //     type: "jpeg",
      //     quality: 1,
      //   },

      //   html2canvas: {
      //     scale: 3,
      //     useCORS: true,
      //     allowTaint: false,
      //     logging: true,
      //     scrollX: 0,
      //     scrollY: 0,
      //     windowWidth: 1600,
      //     imageTimeout: 15000,
      //   },


      //   jsPDF: {
      //     unit: "mm",
      //     format: "a3",
      //     orientation: "landscape",
      //   },

      //   pagebreak: {
      //     mode: ["avoid-all", "css", "legacy"],
      //   },
      // };


      const options = {
        margin: 5,

        filename: fileName,

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 1.5, // 2 or 3 valla borders thick ga vastayi
          useCORS: true,
          scrollY: 0,
          windowWidth: 1400,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
        },

        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      };

      await html2pdf().set(options).from(element).save();

      document.body.removeChild(iframe);
    } catch (err) {
      console.error("PDF Error:", err);
      alertify.alert("error", "PDF download failed");
    }
  };
};
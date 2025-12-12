import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SlideData {
  id: string;
  slide_number: number;
  content: any;
  xml_content: string;
  layout_type: string;
  section_layout: string;
  img_url?: string;
  dominant_color: string;
}

const handleDownloadPDF = async ({
  slides,
  title,
}: {
  slides: SlideData[];
  title: string;
}) => {
  try {
    console.log("PDF: Starting generation for", slides.length, "slides");

    if (!slides || slides.length === 0) {
      throw new Error("No slides to export");
    }

    const container = document.querySelector("[data-slides-container]");
    if (!container) {
      throw new Error("Presentation not found");
    }

    // Hide UI elements
    const navbar = document.querySelector("nav");
    const originalNavDisplay = navbar ? window.getComputedStyle(navbar).display : "";
    if (navbar) (navbar as HTMLElement).style.display = "none";

    const sidebar = document.querySelector("[class*='sidebar'], nav + div");
    const originalSidebarDisplay = sidebar ? window.getComputedStyle(sidebar).display : "";
    if (sidebar) (sidebar as HTMLElement).style.display = "none";

    // --- FORCE LOAD SLIDES ---
    console.log("PDF: Force-loading all slides...");
    const containerEl = container as HTMLElement;
    containerEl.scrollTop = containerEl.scrollHeight;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    containerEl.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const slideElements = Array.from(
      container.querySelectorAll("[data-slide-renderer]")
    ) as HTMLElement[];

    if (slideElements.length === 0) {
      throw new Error("No slides found for export");
    }

    // --- PRELOAD IMAGES ---
    console.log("PDF: Preloading images...");
    const allImages = Array.from(container.querySelectorAll("img")) as HTMLImageElement[];
    const imagePromises = allImages.map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 12000);
      });
    });
    await Promise.all(imagePromises);

    // --- PDF GENERATION ---
    // We declare pdf as null initially and create it with the dimensions of the first slide
    let pdf: jsPDF | null = null;

    for (let i = 0; i < slideElements.length; i++) {
      try {
        const slideElement = slideElements[i];
        console.log(`PDF: Processing slide ${i + 1}/${slideElements.length}`);

        // 1. Scroll slide into view for capture
        slideElement.scrollIntoView({ behavior: "auto", block: "center" });
        await new Promise((resolve) => setTimeout(resolve, 600));

        // 2. Get Natural Dimensions of the slide
        // This is crucial: we use the DOM element's actual pixel size
        const slideWidth = slideElement.offsetWidth;
        const slideHeight = slideElement.offsetHeight;

        console.log(`PDF: Slide dimensions: ${slideWidth}x${slideHeight}`);

        // 3. Capture High-Res Canvas
        const canvas = await html2canvas(slideElement, {
          scale: 2, // 2x scale for crisp text
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null, // Transparent background from html2canvas
          windowWidth: slideWidth,
          windowHeight: slideHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        // 4. Initialize or Add Page
        // Determine orientation based on THIS SPECIFIC SLIDE
        const orientation = slideWidth > slideHeight ? "landscape" : "portrait";

        if (i === 0) {
          // Initialize PDF with the dimensions of the FIRST slide
          // We use 'px' unit to match HTML/Canvas pixels 1:1
          pdf = new jsPDF({
            orientation: orientation,
            unit: "px",
            format: [slideWidth, slideHeight],
          });
        } else {
          // For subsequent slides, add a new page with THAT slide's dimensions
          // This allows mixed heights/widths in a single PDF
          pdf?.addPage([slideWidth, slideHeight], orientation);
        }

        // 5. Draw Image
        // We draw at 0,0 with exactly the width/height of the page
        // This eliminates white borders/margins completely
        pdf?.addImage(imgData, "PNG", 0, 0, slideWidth, slideHeight);

      } catch (error) {
        console.error(`PDF: Error on slide ${i + 1}:`, error);
      }
    }

    if (pdf) {
      pdf.save(`${title || "presentation"}.pdf`);
      console.log("PDF: Export complete");
    } else {
      throw new Error("Failed to initialize PDF");
    }

    // Restore UI
    if (navbar) (navbar as HTMLElement).style.display = originalNavDisplay;
    if (sidebar) (sidebar as HTMLElement).style.display = originalSidebarDisplay;

  } catch (error) {
    console.error("PDF Error:", error);
    alert("Failed to export PDF. Please try again.");
  }
};

export default handleDownloadPDF;
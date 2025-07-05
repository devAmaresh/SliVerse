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
    console.log("Starting PDF generation with slides:", slides);

    if (!slides || slides.length === 0) {
      throw new Error("No slides to export");
    }

    // Find all slide elements that are currently rendered
    const slideElements = document.querySelectorAll("[data-slide-renderer]");

    if (slideElements.length === 0) {
      throw new Error("No slide elements found. Make sure slides are visible on the page.");
    }

    console.log(`Found ${slideElements.length} slide elements`);

    // Create PDF instance - no initial page
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    

    // Process each slide element
    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements[i] as HTMLElement;

      console.log(`Processing slide ${i + 1}/${slideElements.length}`);

      // Temporarily make the slide fully visible
      const originalOpacity = slideElement.style.opacity;
      const parentElement = slideElement.parentElement;
      
      // Make sure the slide is visible
      slideElement.style.opacity = "1";
      if (parentElement) {
        parentElement.style.opacity = "1";
      }

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture the slide element with optimized settings
      const canvas = await html2canvas(slideElement, {
        scale: 2, 
        backgroundColor: "#0A0A0A",
        useCORS: true,
        allowTaint: true,
        logging: true, 
        removeContainer: true,
        imageTimeout: 5000,
      });

      // Restore original opacity
      slideElement.style.opacity = originalOpacity;
      if (parentElement) {
        parentElement.style.opacity = originalOpacity;
      }

      console.log(`Canvas captured for slide ${i + 1}:`, canvas.width, "x", canvas.height);

      // Add page to PDF (this creates a new page)
      pdf.addPage("a4", "landscape");

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Convert canvas to image with lower quality to reduce file size
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with 70% quality
      
      // Add image to PDF, fitting to page
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      console.log(`Added slide ${i + 1} to PDF`);
    }

    // Remove the last blank page that gets created
    const totalPages = pdf.internal.getNumberOfPages();
    if (totalPages > slideElements.length) {
      pdf.deletePage(totalPages);
    }
    //Remove the first blank page that gets created
    if (pdf.internal.getNumberOfPages() > 1) {
      pdf.deletePage(1);
    }
    // Save the PDF
    const fileName = `${title || "presentation"}.pdf`;
    pdf.save(fileName);
    console.log("PDF saved successfully:", fileName);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
};

export default handleDownloadPDF;

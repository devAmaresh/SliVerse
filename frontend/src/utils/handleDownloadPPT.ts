import pptxgen from "pptxgenjs";
import { themes } from "./theme";

const handleDownloadPPT = async ({ slides, title }: any) => {
  const currentTheme = themes.ocean;

  const pptx = new pptxgen();
  pptx.author = "Sliverse";
  pptx.company = "Sliverse";
  pptx.title = `${title}`;

  // Define current theme colors dynamically
  const themeTextColor = currentTheme.text_hex || "FFFFFF";
  const themeAccentColor = currentTheme.accent_hex || "3B82F6";
  const themeBackgroundColor = currentTheme.background_hex || "0A0A0A";

  // Clean color function - remove # and ensure 6 digits
  const cleanColor = (color: string) => {
    if (!color) return "FFFFFF";
    const cleaned = color.replace("#", "").toUpperCase();
    return cleaned.length === 6 ? cleaned : "FFFFFF";
  };

  const cleanTextColor = cleanColor(themeTextColor);
  const cleanAccentColor = cleanColor(themeAccentColor);
  const cleanBackgroundColor = cleanColor(themeBackgroundColor);

  // Dimensions and Margins (in inches)
  const margin = 0.5;
  const slideWidth = 10 - 2 * margin;
  const slideHeight = 5.63 - 2 * margin;

  const validateImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok && response.headers.get('content-type')?.includes('image')) {
        return url;
      }
    } catch (error) {
      console.error("Error validating image URL:", error);
    }
    return null;
  };

  for (const slide of slides) {
    const pptSlide = pptx.addSlide();

    // Clean slide dominant color
    const slideDominantColor = slide.dominant_color ? cleanColor(slide.dominant_color) : cleanAccentColor;

    // Set slide background
    pptSlide.background = { color: cleanBackgroundColor };

    // Add main background shape - Use simple rectangle instead of roundRect
    pptSlide.addShape("rect", {
      x: margin,
      y: margin,
      w: slideWidth,
      h: slideHeight,
      fill: { color: "000000", transparency: 40 },
      line: { color: "FFFFFF", transparency: 80, width: 1 }
    });

    let contentStartY = margin + 0.3;
    let contentWidth = slideWidth - 0.6;

    // Add Slide Heading
    if (slide?.content?.heading) {
      pptSlide.addText(slide.content.heading, {
        x: margin + 0.3,
        y: contentStartY,
        w: contentWidth,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: cleanTextColor,
        fontFace: "Calibri",
        align: "center"
      });
      contentStartY += 1.0;
    }

    // Calculate content area based on image placement
    let textAreaWidth = contentWidth;
    let textAreaX = margin + 0.3;

    // Handle image placement first
    if (slide?.img_url) {
      const validImageUrl = await validateImageUrl(slide.img_url);
      
      if (validImageUrl) {
        try {
          if (slide.section_layout === 'vertical') {
            // Image above content
            await pptSlide.addImage({
              path: validImageUrl,
              x: margin + 1,
              y: contentStartY,
              w: slideWidth - 2,
              h: 1.5
            });
            contentStartY += 1.8;
          } else if (slide.section_layout === 'left') {
            // Image on left, content on right
            await pptSlide.addImage({
              path: validImageUrl,
              x: margin + 0.3,
              y: contentStartY,
              w: 3,
              h: slideHeight - contentStartY - margin
            });
            textAreaX = margin + 3.5;
            textAreaWidth = slideWidth - 3.5;
          } else if (slide.section_layout === 'right') {
            // Content on left, image on right
            textAreaWidth = slideWidth - 3.5;
            await pptSlide.addImage({
              path: validImageUrl,
              x: margin + textAreaWidth + 0.2,
              y: contentStartY,
              w: 3,
              h: slideHeight - contentStartY - margin
            });
          }
        } catch (imageError) {
          console.error("Error adding image to slide:", imageError);
        }
      }
    }

    // Handle different layout types
    switch (slide.layout_type) {
      case 'bullets':
        handleBulletsLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
      
      case 'columns':
        handleColumnsLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
      
      case 'icons':
        handleIconsLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
      
      case 'timeline':
        handleTimelineLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
      
      case 'arrows':
        handleArrowsLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
      
      default:
        handleDefaultLayout(pptSlide, pptx, slide, textAreaX, contentStartY, textAreaWidth, cleanTextColor, slideDominantColor);
        break;
    }
  }

  // Save the presentation
  try {
    await pptx.writeFile({ fileName: `${title}.pptx` });
    console.log("PowerPoint file saved successfully!");
  } catch (error) {
    console.error("Error saving PPT:", error);
    throw error;
  }
};

// Layout-specific handlers with proper formatting
function handleBulletsLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, _accentColor: string) {
  const bullets = slide.content?.bullets || [];
  
  bullets.forEach((bullet: any, index: number) => {
    const yPos = startY + (index * 0.5);
    
    if (yPos + 0.4 < 5.63 - 0.5) {
      const bulletText = typeof bullet === 'string' ? bullet : 
                        (bullet.heading || bullet.text || bullet.content || '');
      
      if (bulletText && bulletText.trim()) {
        pptSlide.addText(`• ${bulletText}`, {
          x: x,
          y: yPos,
          w: width - 0.3,
          h: 0.4,
          fontSize: 18,
          color: textColor,
          fontFace: "Calibri",
          valign: "middle"
        });
      }
    }
  });
}

function handleColumnsLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, accentColor: string) {
  const columns = slide.content?.columns || [];
  if (columns.length === 0) return;
  
  const colWidth = (width - 0.6) / columns.length;
  
  columns.forEach((column: any, colIndex: number) => {
    const colX = x + (colIndex * colWidth);
    let currentY = startY;
    
    if (column.heading || column.title) {
      pptSlide.addText(column.heading || column.title, {
        x: colX,
        y: currentY,
        w: colWidth - 0.2,
        h: 0.4,
        fontSize: 20,
        bold: true,
        color: accentColor,
        fontFace: "Calibri"
      });
      currentY += 0.5;
    }
    
    const items = column.points || column.items || column.content || [];
    items.forEach((point: any, _pointIndex: number) => {
      if (currentY + 0.3 < 5.63 - 0.5) {
        const pointText = typeof point === 'string' ? point : (point.text || point.content || '');
        if (pointText && pointText.trim()) {
          pptSlide.addText(`• ${pointText}`, {
            x: colX,
            y: currentY,
            w: colWidth - 0.2,
            h: 0.3,
            fontSize: 16,
            color: textColor,
            fontFace: "Calibri"
          });
          currentY += 0.35;
        }
      }
    });
  });
}

function handleIconsLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, accentColor: string) {
  const icons = slide.content?.icons || [];
  const itemsPerRow = Math.min(2, icons.length);
  const itemWidth = (width - 0.4) / itemsPerRow;
  
  icons.forEach((icon: any, index: number) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    
    const xPos = x + (col * itemWidth);
    const yPos = startY + (row * 1.0);
    
    if (yPos + 0.8 < 5.63 - 0.5) {
      // Add icon background using rectangle instead of roundRect
      pptSlide.addShape("rect", {
        x: xPos,
        y: yPos,
        w: 0.5,
        h: 0.5,
        fill: { color: accentColor, transparency: 80 }
      });
      
      // Add icon text/emoji
      const iconSymbol = icon.icon || icon.symbol || "💡";
      pptSlide.addText(iconSymbol, {
        x: xPos,
        y: yPos,
        w: 0.5,
        h: 0.5,
        fontSize: 20,
        align: "center",
        valign: "middle"
      });
      
      // Add description
      const iconText = icon.text || icon.heading || icon.description || '';
      if (iconText && iconText.trim()) {
        pptSlide.addText(iconText, {
          x: xPos + 0.6,
          y: yPos + 0.05,
          w: itemWidth - 0.7,
          h: 0.4,
          fontSize: 16,
          color: textColor,
          fontFace: "Calibri",
          valign: "middle"
        });
      }
    }
  });
}

function handleTimelineLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, accentColor: string) {
  const timeline = slide.content?.timeline || [];
  
  timeline.forEach((item: any, index: number) => {
    const yPos = startY + (index * 0.7);
    
    if (yPos + 0.5 < 5.63 - 0.5) {
      // Add timeline dot using circle
      pptSlide.addShape("ellipse", {
        x: x,
        y: yPos + 0.15,
        w: 0.2,
        h: 0.2,
        fill: { color: accentColor }
      });
      
      // Add timeline content
      const timelineText = item.text || item.heading || item.content || '';
      if (timelineText && timelineText.trim()) {
        pptSlide.addText(timelineText, {
          x: x + 0.4,
          y: yPos,
          w: width - 0.6,
          h: 0.5,
          fontSize: 16,
          color: textColor,
          fontFace: "Calibri",
          valign: "middle"
        });
      }
      
      // Add connecting line (except for last item)
      if (index < timeline.length - 1) {
        pptSlide.addShape("line", {
          x: x + 0.1,
          y: yPos + 0.35,
          w: 0,
          h: 0.35,
          line: { color: accentColor, width: 2 }
        });
      }
    }
  });
}

function handleArrowsLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, accentColor: string) {
  const arrows = slide.content?.arrows || [];
  if (arrows.length === 0) return;
  
  const stepWidth = (width - 0.4) / arrows.length;
  
  arrows.forEach((step: any, index: number) => {
    const xPos = x + (index * stepWidth);
    
    // Add arrow box using rectangle
    pptSlide.addShape("rect", {
      x: xPos,
      y: startY,
      w: stepWidth - 0.1,
      h: 0.8,
      fill: { color: accentColor, transparency: 80 }
    });
    
    // Add step text
    const stepText = step.text || step.heading || step.content || '';
    if (stepText && stepText.trim()) {
      pptSlide.addText(stepText, {
        x: xPos + 0.05,
        y: startY + 0.1,
        w: stepWidth - 0.2,
        h: 0.6,
        fontSize: 14,
        color: textColor,
        fontFace: "Calibri",
        align: "center",
        valign: "middle"
      });
    }
    
    // Add arrow (except for last item)
    if (index < arrows.length - 1) {
      pptSlide.addText("→", {
        x: xPos + stepWidth - 0.05,
        y: startY + 0.3,
        w: 0.2,
        h: 0.2,
        fontSize: 18,
        color: accentColor,
        align: "center"
      });
    }
  });
}

function handleDefaultLayout(pptSlide: any, _pptx: any, slide: any, x: number, startY: number, width: number, textColor: string, _accentColor: string) {
  // Handle any content as bullet points
  const content = slide.content?.bullets || slide.content?.content || slide.content?.text || [];
  
  if (Array.isArray(content)) {
    content.forEach((item: any, index: number) => {
      const yPos = startY + (index * 0.5);
      if (yPos + 0.4 < 5.63 - 0.5) {
        const text = typeof item === 'string' ? item : (item.text || item.heading || item.content || '');
        if (text && text.trim()) {
          pptSlide.addText(`• ${text}`, {
            x: x,
            y: yPos,
            w: width - 0.3,
            h: 0.4,
            fontSize: 18,
            color: textColor,
            fontFace: "Calibri",
            valign: "middle"
          });
        }
      }
    });
  } else if (typeof content === 'string' && content.trim()) {
    pptSlide.addText(content, {
      x: x,
      y: startY,
      w: width - 0.3,
      h: 2,
      fontSize: 18,
      color: textColor,
      fontFace: "Calibri",
      valign: "top"
    });
  }
}

export default handleDownloadPPT;

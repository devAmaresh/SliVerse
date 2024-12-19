import pptxgen from "pptxgenjs";

import { themes } from "./theme";

const handleDownloadPPT = async ({ slides, title }: any) => {
  const currentTheme = themes.ocean;

  const pptx = new pptxgen();
  pptx.author = "Sliverse";
  pptx.company = "Sliverse";
  pptx.title = `${title}`;

  // Define current theme colors dynamically
  const themeTextColor = currentTheme.text_hex || "#3B3B3B";
  const themeAccentColor = currentTheme.accent_hex || "#5A5A5A";

  // Dimensions and Margins
  const margin = 0.5; // 0.5-inch margin from all sides
  const slideWidth = 10 - 2 * margin; // Slide width after margins
  const slideHeight = 5.63 - 2 * margin; // Slide height after margins
  const textWidth = slideWidth * 0.7; // Text occupies 70% of width
  const imageWidth = slideWidth * 0.3; // Image occupies 30% of width
  const listItemSpacing = 0.3; // Spacing between list items
  const double_list_spacing = 0.6; // Spacing between double list items
  const validateImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" }); // Use HEAD to only fetch headers
      if (response.ok) {
        return url; // URL is valid
      }
    } catch (error) {
      // console.error("Error validating image URL:", error);
    }
    return "https://img.icons8.com/color/idea.png"; // Fallback URL
  };
  for (const slide of slides) {
    const pptSlide = pptx.addSlide();

    // Set slide background
    pptSlide.background = { fill: currentTheme.background_hex };

    // Add Slide Heading
    if (slide?.content?.heading) {
      pptSlide.addText(slide.content.heading, {
        x: margin,
        y: margin,
        fontSize: 28,
        bold: true,
        color: themeAccentColor,
        w: textWidth, // Constrain heading width
      });
    }

    const body = slide?.content?.body?.points || [];
    let textStartY = margin + 1; // Start text 1 inch below margin

    // Handle Double Column Layout
    if (slide?.content?.style === "double_column") {
      const colWidth = (textWidth - margin) / 2; // Divide slideWidth into two columns with a gap
      const colGap = margin; // Gap between columns

      body.forEach((column: any, colIdx: number) => {
        const colX = margin + colIdx * (colWidth + colGap); // Calculate x position for each column
        let currentY = textStartY; // Track Y position for the current column

        // Add Column Heading
        if (column?.heading) {
          pptSlide.addText(column.heading, {
            x: colX,
            y: currentY,
            fontSize: 20,
            bold: true,
            color: themeAccentColor,
            w: colWidth, // Constrain heading to column width
          });
          currentY += 0.5; // Add spacing after the heading
        }

        // Add Points within the Column
        column.points?.forEach((point: string, _pointIdx: number) => {
          pptSlide.addText(`• ${point}`, {
            x: colX,
            y: currentY,
            fontSize: 16,
            color: themeTextColor,
            w: colWidth, // Ensure points are bounded to the column
          });
          currentY += double_list_spacing;
        });
      });
    }

    // Handle Icon Slide Layout
    else if (slide?.content?.style === "icon") {
      const itemsPerRow = 2;
      const boxWidth = (slideWidth * 0.8 - 3 * margin) / itemsPerRow;
      const boxHeight = 1.2;
      const iconSize = 0.35;

      const iconPromises = body.map(async (point: any, idx: any) => {
        const row = Math.floor(idx / itemsPerRow);
        const col = idx % itemsPerRow;

        const xPosition = margin + col * (boxWidth + margin);
        const yPosition = textStartY + row * (boxHeight + listItemSpacing);

        const iconMatch = point.match(/\[\[(.*?)\]\]/)?.[1] || "idea";
        const text = point.replace(/\[\[(.*?)\]\]/, "").trim();
        const iconUrl = `https://img.icons8.com/color/${iconMatch}.png`;
        const finalIconUrl = await validateImageUrl(iconUrl);

        console.log("Adding icon:", finalIconUrl); // Log to check the image URL being used

        // Add Icon
        pptSlide.addImage({
          path: finalIconUrl,
          x: xPosition,
          y: yPosition,
          w: iconSize,
          h: iconSize,
        });

        // Add Text
        pptSlide.addText(text, {
          x: xPosition + iconSize + 0.2,
          y: yPosition + 0.3,
          fontSize: 16,
          color: themeTextColor,
          w: boxWidth - iconSize - 0.3,
        });
      });

      // Wait for all icon slide elements to complete
      await Promise.all(iconPromises);
    }

    // Handle Sequential Slide Layout
    else if (slide?.content?.style === "sequential") {
      body.forEach((point: any, idx: any) => {
        const yPosition = textStartY + idx * (1 + 0.2);
        let final_point = "";
        if (typeof point === "string") {
          point = point.replace(/^>>/, "");
          final_point = point;
        }

        pptSlide.addImage({
          path: `https://img.icons8.com/color/${idx + 1}.png`,
          x: margin,
          y: yPosition - 0.2,
          w: 0.7,
          h: 0.7,
        });

        pptSlide.addText(final_point, {
          x: margin + 1,
          y: yPosition,
          fontSize: 18,
          color: themeTextColor,
          w: textWidth - 1,
        });
      });
    }

    // Handle Default Layout
    else {
      body.forEach((point: any, pointIdx: any) => {
        pptSlide.addText(`• ${point}`, {
          x: margin,
          y: textStartY + pointIdx * (0.5 + listItemSpacing),
          fontSize: 18,
          color: themeTextColor,
          w: textWidth,
        });
      });
    }

    // Add Slide Image to the remaining area
    // Add Slide Image to the remaining area (30% section)
    if (slide?.img_url) {
      // Set the background color of the image container to the dominant color
      pptSlide.addShape("rect", {
        x: margin + textWidth, // Position next to the text
        y: margin, // Align vertically with the margin
        w: imageWidth, // Set width of the image container
        h: slideHeight, // Set proportional height
        fill: { color: slide.dominant_color }, // Set background color to dominant color
      });

      // Add the image on top of the colored background
      pptSlide.addImage({
        path: slide.img_url,
        x: margin + textWidth, // Position next to the text
        y: margin + 1, // Align the image vertically starting at margin
        w: imageWidth, // Set image width
        h: slideHeight * 0.5, // Set proportional height
      });
    }
  }

  // Save the presentation
  try {
    await pptx.writeFile({ fileName: `${title}.pptx` });
  } catch (error) {
    console.error("Error saving PPT:", error);
  }
};
export default handleDownloadPPT;

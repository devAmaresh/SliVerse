import xml.etree.ElementTree as ET
import re
from .pexel import get_img_link
import html

def clean_xml_content(xml_content):
    """
    Clean XML content to handle parsing issues
    """
    import re
    
    # Remove XML declaration
    if xml_content.startswith("<?xml"):
        lines = xml_content.split('\n')
        xml_content = '\n'.join(lines[1:])
    
    # Replace problematic characters
    xml_content = xml_content.replace('"', "'")
    xml_content = xml_content.replace("&", "and")
    
    # Remove any HTML entities that might cause issues
    xml_content = re.sub(r'&[a-zA-Z]+;', '', xml_content)
    
    # Clean up any malformed tags
    xml_content = re.sub(r'<([^>]+)"([^>]*)>', r'<\1\2>', xml_content)
    
    return xml_content.strip()

def parse_xml_presentation(xml_content, project_title):
    """
    Parse XML presentation content and extract slide data
    """
    try:
        # Clean the XML content first
        xml_content = clean_xml_content(xml_content.strip())
        
        if not xml_content.startswith('<?xml'):
            xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_content
            
        print("Cleaned XML Content:")
        print(xml_content[:500] + "..." if len(xml_content) > 500 else xml_content)
        
        root = ET.fromstring(xml_content)
        slides_data = []
        
        sections = root.findall('SECTION')
        
        for i, section in enumerate(sections):
            slide_data = {
                'slide_number': i + 1,
                'section_layout': section.get('layout', 'left'),
                'layout_type': None,
                'content': {},
                'img_queries': [],
                'has_images': False,
                'xml_content': ET.tostring(section, encoding='unicode')
            }
            
            # Extract layout type and content
            for child in section:
                if child.tag in ['COLUMNS', 'BULLETS', 'ICONS', 'CYCLE', 'ARROWS', 'TIMELINE', 'PYRAMID', 'STAIRCASE', 'CHART']:
                    slide_data['layout_type'] = child.tag.lower()
                    slide_data['content'] = parse_layout_content(child)
                
                # Extract direct IMG tags from SECTION
                if child.tag == 'IMG':
                    query = child.get('query', '')
                    if query:
                        slide_data['img_queries'].append(query)
                        slide_data['has_images'] = True
                
                # Look for nested IMG tags in layout components
                for img in child.findall('.//IMG'):
                    query = img.get('query', '')
                    if query:
                        slide_data['img_queries'].append(query)
                        slide_data['has_images'] = True
            
            # Also check for any IMG tags at the section level
            for img in section.findall('IMG'):
                query = img.get('query', '')
                if query:
                    slide_data['img_queries'].append(query)
                    slide_data['has_images'] = True
            
            slides_data.append(slide_data)
            
        return slides_data
        
    except ET.ParseError as e:
        print(f"XML Parse Error: {e}")
        print("Problematic XML content:")
        print(xml_content)
        
        # Try to parse with more aggressive cleaning
        try:
            return parse_xml_with_fallback(xml_content, project_title)
        except Exception as fallback_error:
            print(f"Fallback parsing also failed: {fallback_error}")
            return []
    except Exception as e:
        print(f"Error parsing XML: {e}")
        return []

def parse_xml_with_fallback(xml_content, project_title):
    """
    Fallback parser for malformed XML using regex
    """
    slides_data = []
    
    # Extract sections using regex
    section_pattern = r'<SECTION[^>]*?layout="([^"]*)"[^>]*?>(.*?)</SECTION>'
    sections = re.findall(section_pattern, xml_content, re.DOTALL)
    
    for i, (layout, section_content) in enumerate(sections):
        slide_data = {
            'slide_number': i + 1,
            'section_layout': layout,
            'layout_type': None,
            'content': {},
            'img_queries': [],
            'has_images': False,
            'xml_content': f'<SECTION layout="{layout}">{section_content}</SECTION>'
        }
        
        # Extract IMG queries
        img_pattern = r'<IMG[^>]*?query="([^"]*)"[^>]*?/?>'
        img_queries = re.findall(img_pattern, section_content)
        if img_queries:
            slide_data['img_queries'] = img_queries
            slide_data['has_images'] = True
        
        # Detect layout type
        layout_patterns = {
            'bullets': r'<BULLETS>',
            'columns': r'<COLUMNS>',
            'icons': r'<ICONS>',
            'timeline': r'<TIMELINE>',
            'chart': r'<CHART',
            'cycle': r'<CYCLE>',
            'arrows': r'<ARROWS>',
            'pyramid': r'<PYRAMID>',
            'staircase': r'<STAIRCASE>'
        }
        
        for layout_type, pattern in layout_patterns.items():
            if re.search(pattern, section_content):
                slide_data['layout_type'] = layout_type
                slide_data['content'] = parse_layout_content_regex(section_content, layout_type)
                break
        
        slides_data.append(slide_data)
    
    return slides_data

def parse_layout_content_regex(content, layout_type):
    """
    Parse layout content using regex for fallback
    """
    parsed_content = {}
    
    if layout_type in ['bullets', 'columns', 'icons', 'cycle', 'arrows', 'timeline', 'pyramid', 'staircase']:
        # Extract DIV elements
        div_pattern = r'<DIV>(.*?)</DIV>'
        divs = re.findall(div_pattern, content, re.DOTALL)
        
        items = []
        for div in divs:
            item = {}
            
            # Extract H3 (heading/title)
            h3_match = re.search(r'<H3>(.*?)</H3>', div, re.DOTALL)
            if h3_match:
                item['heading'] = h3_match.group(1).strip()
                item['title'] = h3_match.group(1).strip()  # For some layouts
            
            # Extract P (description/text)
            p_matches = re.findall(r'<P[^>]*?>(.*?)</P>', div, re.DOTALL)
            if p_matches:
                item['description'] = ' '.join(p_matches).strip()
                item['text'] = ' '.join(p_matches).strip()  # For bullets
            
            # Extract ICON for icons layout
            if layout_type == 'icons':
                icon_match = re.search(r'<ICON[^>]*?query="([^"]*)"', div)
                if icon_match:
                    item['icon'] = icon_match.group(1)
            
            if item:
                items.append(item)
        
        # Map to appropriate content structure
        if layout_type == 'bullets':
            parsed_content['bullets'] = items
        elif layout_type == 'columns':
            parsed_content['columns'] = items
        elif layout_type == 'icons':
            parsed_content['icons'] = items
        else:
            parsed_content['steps'] = items
    
    elif layout_type == 'chart':
        # Extract chart data
        chart_match = re.search(r'<CHART[^>]*?charttype="([^"]*)"', content)
        if chart_match:
            parsed_content['chart_type'] = chart_match.group(1)
        
        # Extract table data
        tr_pattern = r'<TR>(.*?)</TR>'
        trs = re.findall(tr_pattern, content, re.DOTALL)
        
        data = []
        for tr in trs:
            td_pattern = r'<TD[^>]*?type="([^"]*)"[^>]*?><VALUE>(.*?)</VALUE></TD>'
            tds = re.findall(td_pattern, tr)
            
            row_data = {}
            for td_type, value in tds:
                row_data[td_type] = value.strip()
            
            if row_data:
                data.append(row_data)
        
        parsed_content['data'] = data
    
    # Extract title from H1 or H2
    title_match = re.search(r'<H[12]>(.*?)</H[12]>', content, re.DOTALL)
    if title_match:
        parsed_content['title'] = title_match.group(1).strip()
    
    return parsed_content

def parse_layout_content(element):
    """
    Parse different layout types and extract content
    """
    content = {}
    
    # Extract title from H1 or H2
    for title_tag in ['H1', 'H2']:
        title_elem = element.find(title_tag)
        if title_elem is not None and title_elem.text:
            content['title'] = title_elem.text.strip()
            break
    
    if element.tag == 'COLUMNS':
        content['columns'] = []
        for div in element.findall('DIV'):
            column = {}
            h3 = div.find('H3')
            if h3 is not None and h3.text:
                column['heading'] = h3.text.strip()
            
            # Collect all P elements
            p_texts = []
            for p in div.findall('P'):
                if p.text:
                    p_texts.append(p.text.strip())
            column['description'] = ' '.join(p_texts)
            
            if column.get('heading') or column.get('description'):
                content['columns'].append(column)
                
    elif element.tag == 'BULLETS':
        content['bullets'] = []
        for div in element.findall('DIV'):
            bullet = {}
            h3 = div.find('H3')
            if h3 is not None and h3.text:
                bullet['heading'] = h3.text.strip()
            
            # Collect all P elements
            p_texts = []
            for p in div.findall('P'):
                if p.text:
                    p_texts.append(p.text.strip())
            bullet['text'] = ' '.join(p_texts)
            
            if bullet.get('heading') or bullet.get('text'):
                content['bullets'].append(bullet)
                
    elif element.tag == 'ICONS':
        content['icons'] = []
        for div in element.findall('DIV'):
            icon_item = {}
            icon = div.find('ICON')
            h3 = div.find('H3')
            
            if icon is not None:
                icon_item['icon'] = icon.get('query', '')
            if h3 is not None and h3.text:
                icon_item['heading'] = h3.text.strip()
            
            # Collect all P elements
            p_texts = []
            for p in div.findall('P'):
                if p.text:
                    p_texts.append(p.text.strip())
            icon_item['description'] = ' '.join(p_texts)
            
            if icon_item.get('heading') or icon_item.get('description'):
                content['icons'].append(icon_item)
                
    elif element.tag in ['CYCLE', 'ARROWS', 'TIMELINE', 'PYRAMID', 'STAIRCASE']:
        content['steps'] = []
        for div in element.findall('DIV'):
            step = {}
            h3 = div.find('H3')
            if h3 is not None and h3.text:
                step['title'] = h3.text.strip()
            
            # Collect all P elements
            p_texts = []
            for p in div.findall('P'):
                if p.text:
                    p_texts.append(p.text.strip())
            step['description'] = ' '.join(p_texts)
            
            if step.get('title') or step.get('description'):
                content['steps'].append(step)
                
    elif element.tag == 'CHART':
        content['chart_type'] = element.get('charttype', 'vertical-bar')
        content['data'] = []
        table = element.find('TABLE')
        if table is not None:
            for tr in table.findall('TR'):
                row_data = {}
                for td in tr.findall('TD'):
                    td_type = td.get('type', 'data')
                    value_elem = td.find('VALUE')
                    if value_elem is not None and value_elem.text:
                        row_data[td_type] = value_elem.text.strip()
                if row_data:
                    content['data'].append(row_data)
    
    return content

def extract_heading_from_xml(xml_content):
    """
    Extract the main heading from XML content
    """
    try:
        # Try regex first for malformed XML
        h1_match = re.search(r'<H1>(.*?)</H1>', xml_content, re.DOTALL)
        if h1_match:
            return h1_match.group(1).strip()
        
        h2_match = re.search(r'<H2>(.*?)</H2>', xml_content, re.DOTALL)
        if h2_match:
            return h2_match.group(1).strip()
        
        h3_match = re.search(r'<H3>(.*?)</H3>', xml_content, re.DOTALL)
        if h3_match:
            return h3_match.group(1).strip()
        
        # Try XML parsing
        root = ET.fromstring(xml_content)
        
        # Look for H1, H2, H3 tags in order of preference
        for tag in ['H1', 'H2', 'H3']:
            heading = root.find(f'.//{tag}')
            if heading is not None and heading.text:
                return heading.text.strip()
        
        # Look for first meaningful heading in DIV elements
        for div in root.findall('.//DIV'):
            h3 = div.find('H3')
            if h3 is not None and h3.text:
                return h3.text.strip()
        
        return "Untitled Slide"
        
    except Exception as e:
        print(f"Error extracting heading: {e}")
        return "Untitled Slide"

def get_fallback_image_query(content, layout_type, project_title):
    """
    Generate a fallback image query based on slide content
    """
    fallback_queries = {
        'columns': f"comparison infographic {project_title} business presentation",
        'bullets': f"key points checklist {project_title} business meeting",
        'icons': f"modern icons dashboard {project_title} technology",
        'timeline': f"timeline roadmap {project_title} business planning",
        'chart': f"data visualization charts {project_title} analytics",
        'cycle': f"process workflow diagram {project_title} business",
        'arrows': f"process flow arrows {project_title} business strategy",
        'pyramid': f"hierarchy pyramid structure {project_title} organization",
        'staircase': f"progressive steps growth {project_title} business success"
    }
    
    return fallback_queries.get(layout_type, f"professional presentation {project_title}")

def parse_single_slide_xml(xml_content, slide_number, slide_title):
    """
    Parse XML content for a single slide with better error handling
    """
    try:
        # Clean the XML content first
        xml_content = clean_xml_content(xml_content)
        
        # Use the existing parse_xml_presentation but with cleaned content
        slides_data = parse_xml_presentation(xml_content, slide_title)
        
        if slides_data and len(slides_data) > 0:
            slide_data = slides_data[0]  # Get the first (and only) slide
            slide_data["slide_number"] = slide_number  # Update slide number
            return slide_data
        else:
            # Create fallback slide data with bullets layout
            return {
                "slide_number": slide_number,
                "content": {
                    "title": slide_title,
                    "heading": slide_title,
                    "bullets": [
                        {"heading": "Key Point 1", "text": f"First important aspect of {slide_title}"},
                        {"heading": "Key Point 2", "text": f"Second important aspect of {slide_title}"},
                        {"heading": "Key Point 3", "text": f"Third important aspect of {slide_title}"}
                    ]
                },
                "xml_content": f"<SECTION layout='vertical'><BULLETS><BULLET><HEADING>Key Points</HEADING><TEXT>{slide_title}</TEXT></BULLET></BULLETS></SECTION>",
                "layout_type": "bullets",
                "section_layout": "vertical",
                "has_images": False,
                "img_queries": []
            }
    except Exception as e:
        print(f"Error parsing single slide XML: {e}")
        # Return safe fallback
        return {
            "slide_number": slide_number,
            "content": {
                "title": slide_title,
                "heading": slide_title,
                "bullets": [
                    {"text": f"Key information about {slide_title}"},
                    {"text": "Important details and insights"},
                    {"text": "Relevant conclusions and next steps"}
                ]
            },
            "xml_content": f"<SECTION layout='vertical'><TITLE>{slide_title}</TITLE></SECTION>",
            "layout_type": "bullets",
            "section_layout": "vertical",
            "has_images": False,
            "img_queries": []
        }
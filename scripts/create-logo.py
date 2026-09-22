"""Optional design utility: regenerate outlined logos with fontTools (not a site dependency)."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ASSETS = Path(__file__).resolve().parents[1] / 'public' / 'assets'

def lettering(text, filename, size, x, y, fill):
    font = TTFont(ASSETS / filename)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    output = []
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, y)))
        if pen.getCommands():
            output.append(f'<path d="{pen.getCommands()}" fill="{fill}"/>')
        x += glyphs[name].width * scale
    return ''.join(output), x

def icon(ink, paper):
    return f'''<rect x="20" y="40" width="140" height="140" rx="38" fill="{paper}"/>
    <path d="M48 79Q70 72 90 86Q110 72 132 79V129Q110 123 90 138Q70 123 48 129Z" fill="none" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M90 87V137M68 138L62 152L87 141" fill="none" stroke="{ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M132 50Q132 65 117 65Q132 65 132 80Q132 65 147 65Q132 65 132 50Z" fill="{ink}"/>'''

def make_logo(ink, accent):
    brand, end = lettering('Brand', 'dm-serif.ttf', 120, 197, 145, ink)
    story, end = lettering('Story', 'allura.ttf', 173, end + 24, 164, ink)
    sub, _ = lettering('SOCIAL MEDIA STUDIO', 'dm-sans-medium.ttf', 17, 205, 202, ink)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {round(end+30)} 240" role="img" aria-labelledby="title desc"><title id="title">Brand Story</title><desc id="desc">An open book becoming a conversation, paired with editorial and handwritten lettering.</desc>{icon(ink,accent)}{brand}{story}{sub}</svg>'''

(ASSETS / 'brand-story.svg').write_text(make_logo('#3b2924','#f6b59c'))
(ASSETS / 'brand-story-light.svg').write_text(make_logo('#f9f4ee','#8a513b'))
(ASSETS / 'brand-story-mark.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 32 156 156" role="img" aria-label="Brand Story">{icon("#3b2924","#f6b59c")}</svg>')
print('Created three font-independent SVG logos.')

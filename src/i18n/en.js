// English texts. This is the reference locale: every other locale must define the same keys
// (checked by test/i18n.test.js). Placeholders look like {name}.
// Keys ending in ".html" may contain markup and are inserted as HTML; all others are plain text.
// Texts tagged with data-i18n in index.html must stay identical to the values here (also tested).

export default {
  'lang.name': 'English',
  'lang.switch': 'Language',

  'meta.description':
    'Custom picture frames made to the centimetre in Laos. Design your frame online, see it live, and pay when you collect.',

  // Header and intro
  'banner.preview': 'Preview: prices and contact details are placeholders',
  'brand.tagline': 'Framing atelier · {city}',
  'nav.design': 'Design a frame',
  'nav.prices': 'Prices',
  'nav.custom': 'Custom work',
  'intro.title.html': 'Frames made to the <em>centimetre</em>, for the work you care about.',
  'intro.lead':
    'Enter the size of your print, painting or photo, choose the moulding and mat, and see it framed before you order. Pay when you collect it at the workshop.',

  // Preview
  'preview.label': 'Preview of your frame',
  'preview.alt': '{width} by {height} cm artwork in a {color} frame',
  'preview.upload': 'Preview with your image',
  'preview.matchRatio': 'Match image proportions',
  'preview.invalid': 'Enter a size between {min} and {max} cm.',
  'readout.artwork': 'Artwork',
  'readout.opening': 'Opening',
  'readout.outside': 'Outside',
  'readout.size': 'Size',
  'unit.dims': '{w} × {h} cm',

  // Configurator steps
  'size.title': 'Artwork size',
  'size.width': 'Width',
  'size.height': 'Height',
  'size.rotate': '⇄ Rotate',
  'size.rotateLabel': 'Swap width and height',
  'size.hint': 'Measure the visible image, not the paper edge. The mat will overlap it by 3 mm on each side.',
  'moulding.title': 'Moulding',
  'mat.title': 'Mat (passe-partout)',
  'mat.border': '{cm} cm border',
  'glazing.title': 'Glazing',

  // Price block
  'total.label': 'Estimated total',
  'total.included': 'included',
  'total.onQuote': 'On quote',
  'total.oversizeNote': 'This piece is larger than our standard sizes. Send the request and we will quote it individually.',
  'total.invalidNote': 'Enter a size between {min} and {max} cm to see the price.',
  'line.frame': 'Frame, size {size} ({profile} {color})',
  'line.mat': 'Mat, {mat} ({area} m²)',

  // Order form
  'details.title': 'Your details',
  'details.name': 'Name',
  'details.phone': 'Phone or WhatsApp',
  'details.email': 'Email (optional)',
  'details.quantity': 'Quantity',
  'details.drop': 'How will you bring the artwork?',
  'details.notes': 'Notes',
  'details.notesPlaceholder': 'Hanging wire, deadline, anything we should know',
  'details.submit': 'Send order request',
  'details.hint': 'No payment online. We confirm the price and pickup date by message, and you pay when you collect.',
  'drop.workshop': "I'll drop it at the workshop",
  'drop.frameOnly': 'Frame only, no artwork',
  'drop.print': 'Print it for me (ask for a quote)',
  'error.invalidSize': 'Enter a valid artwork size first.',
  'error.missingContact': 'Add your name and a phone or WhatsApp number so we can confirm the order.',

  // Request ready
  'done.title': 'Request ready',
  'done.withWhatsapp': 'Send it to the workshop on WhatsApp, or copy it and send it however you like.',
  'done.copyOnly': 'Copy it and send it to the workshop by WhatsApp or email.',
  'done.copy': 'Copy request',
  'done.whatsapp': 'Send on WhatsApp',
  'done.edit': 'Edit order',
  'done.copied': 'Copied.',
  'done.selected': 'Text selected. Copy it with your keyboard or long-press.',

  // Order summary sent to the workshop
  'summary.title': 'Order request {ref}',
  'summary.artwork': 'Artwork: {w} × {h} cm',
  'summary.moulding': 'Moulding: {color}, {profile} ({width} cm)',
  'summary.mat': 'Mat: {mat}, {margin} cm border → opening {w} × {h} cm',
  'summary.matNone': 'Mat: none → opening {w} × {h} cm',
  'summary.glazing': 'Glazing: {glazing}',
  'summary.quantity': 'Quantity: {qty}',
  'summary.estimate': 'Estimate: {amount}',
  'summary.onQuote': 'on quote (size {size})',
  'summary.drop': 'Artwork drop-off: {drop}',
  'summary.name': 'Name: {name}',
  'summary.phone': 'Phone: {phone}',
  'summary.email': 'Email: {email}',
  'summary.notes': 'Notes: {notes}',

  // How an order works
  'how.title': 'How an order works',
  'how.1.title': 'Design it here',
  'how.1.text': 'Size, moulding, mat and glazing. The price updates as you go.',
  'how.2.title': 'We confirm',
  'how.2.text':
    'We reply within a day by WhatsApp or email with the final price and a pickup date, usually 3 to 5 days later.',
  'how.3.title': 'Collect and pay',
  'how.3.text': 'Bring your artwork when it suits you. Pay by cash or LaoQR when you pick up the finished frame.',

  // Price tables
  'prices.title': 'Prices',
  'prices.frame.title': 'Frame, by size',
  'prices.col.size': 'Size',
  'prices.col.fits': 'Fits up to',
  'prices.col.frame': 'Frame + glass',
  'prices.note': 'Size is measured on the opening, artwork plus mat. Larger pieces are quoted individually.',
  'prices.beyond': 'beyond {w} × {h} cm',
  'prices.mat.title': 'Mat, by surface',
  'prices.col.surface': 'Mat surface',
  'prices.col.roughly': 'Roughly',
  'prices.col.price': 'Price',
  'prices.upTo': 'up to {w} × {h} cm',
  'prices.areaFirst': '≤ {max} m²',
  'prices.areaRange': '{min}–{max} m²',

  // Custom work and contact
  'custom.title': "Something the configurator can't do?",
  'custom.text':
    "Shadow boxes for textiles and objects, floating mounts for Saa paper and canvas, multi-opening mats, or a series of frames for a gallery or hotel. Tell us about the piece and we'll come back with options and a quote.",
  'custom.artists': 'Artists and photographers preparing an exhibition: ask about series pricing.',
  'contact.whatsapp': 'WhatsApp',
  'contact.email': 'Email',
  'contact.workshop': 'Workshop',
  'contact.open': 'Open',
  'footer.meaning.html': 'Khop <span lang="lo" class="lao-inline">ຂອບ</span> means "edge" in Lao.',

  // Catalogue labels: one key per id in src/catalog.js (checked by test/i18n.test.js)
  'catalog.color.teak': 'Natural teak',
  'catalog.color.darkteak': 'Dark teak',
  'catalog.color.rosewood': 'Rosewood',
  'catalog.color.black': 'Matte black',
  'catalog.color.white': 'Chalk white',
  'catalog.color.gold': 'Brushed gold',
  'catalog.profile.fine': 'Fine',
  'catalog.profile.classic': 'Classic',
  'catalog.profile.wide': 'Wide',
  'catalog.mat.none': 'No mat',
  'catalog.mat.white': 'Bright white',
  'catalog.mat.antique': 'Antique white',
  'catalog.mat.saa': 'Saa paper',
  'catalog.mat.charcoal': 'Charcoal',
  'catalog.glazing.glass': 'Clear glass',
  'catalog.glazing.ar': 'Anti-reflective glass',
  'catalog.glazing.none': 'No glazing',
  'catalog.glazingNote.included': 'included',
  'catalog.glazingNote.canvas': 'for canvas',
};

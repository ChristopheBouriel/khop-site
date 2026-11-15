// Business details shown on the site and used to send order requests.
// Every value here is a PLACEHOLDER until validated with Hermann (see docs/HANDOFF.md, "Open questions").

export const BUSINESS = {
  name: 'Khop Framing Atelier',
  city: 'Luang Prabang', // assumption, not confirmed
  address: 'Address to come',
  hours: 'Mon–Sat, 9:00–18:00',
  email: 'hello@khop.la', // domain not registered
  // International format, digits only, no "+" (used to build https://wa.me/<number> links).
  // Leave empty to hide the "Send on WhatsApp" button.
  whatsapp: '',
  whatsappDisplay: '+856 20 XX XXX XXX',
};

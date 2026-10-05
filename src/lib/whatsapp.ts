export const WHATSAPP_NUMBER = '919665238966';

export function whatsappEnquiry(subject = ''): string {
  const clean = subject
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, 120);
  const message = clean
    ? `Hello Shree Vandana Tours & Travels, I’m interested in ${clean}. Could you help me plan my trip?`
    : 'Hello Shree Vandana Tours & Travels, I’d like to plan a trip. Could you help me?';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  destination: string;
  departure: string;
  travellers: string;
  notes: string;
};
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
export function indiaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function validateEnquiry(data: Enquiry, today: string): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (data.name.trim().length < 2 || data.name.length > 100)
    errors.name = 'Enter your name (2–100 characters).';
  if (
    !/^[+\d\s()\-]{7,25}$/.test(data.phone.trim()) ||
    data.phone.replace(/\D/g, '').length < 7
  )
    errors.phone = 'Enter a valid contact number with country code.';
  if (
    data.email &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ||
      data.email.length > 254)
  )
    errors.email = 'Enter a valid email address, or leave this blank.';
  if (!data.destination.trim() || data.destination.length > 120)
    errors.destination = 'Tell us a destination (up to 120 characters).';
  if (
    data.departure &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(data.departure) ||
      !Number.isFinite(Date.parse(data.departure)) ||
      new Date(data.departure).toISOString().slice(0, 10) !== data.departure ||
      data.departure < today)
  )
    errors.departure = 'Choose today or a future travel date.';
  if (
    !/^\d+$/.test(data.travellers) ||
    Number(data.travellers) < 1 ||
    Number(data.travellers) > 100
  )
    errors.travellers =
      'Enter between 1 and 100 travellers. For larger groups, call us.';
  if (data.notes.length > 1000)
    errors.notes = 'Keep your message under 1,000 characters.';
  return errors;
}
export function enquiryMessage(data: Enquiry): string {
  return [
    'Hello Shree Vandana Tours & Travels, I would like to plan a holiday.',
    '',
    `Name: ${data.name.trim()}`,
    `Contact: ${data.phone.trim()}`,
    ...(data.email.trim() ? [`Email: ${data.email.trim()}`] : []),
    `Destination: ${data.destination.trim()}`,
    `Preferred departure: ${data.departure || 'Dates are flexible'}`,
    `Travellers: ${data.travellers}`,
    ...(data.notes.trim() ? [`Preferences: ${data.notes.trim()}`] : []),
  ].join('\n');
}
export function enquiryLinks(data: Enquiry, phone: string, email: string) {
  const message = enquiryMessage(data);
  return {
    whatsapp: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    email: `mailto:${email}?subject=${encodeURIComponent(`Holiday enquiry: ${data.destination.trim()}`)}&body=${encodeURIComponent(message)}`,
  };
}

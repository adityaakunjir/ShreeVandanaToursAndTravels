# Importing the first real packages

Copy `package-input-template.json` to a business-owned input file and replace every null/empty field with approved information. This template deliberately fails publication checks. It contains no invented sellable package.

Run `npm run catalogue:check -- path/to/approved-packages.json`. The command reports field-level problems and exits unsuccessfully for an empty, malformed or incomplete catalogue. Duplicate package IDs/slugs and departure IDs are rejected. An invalid record rejects the whole import rather than silently publishing the remaining records. The checker is read-only: it neither uploads nor publishes the file.

For fixed departures, supply real dated seat allocations and tax-inclusive adult pricing in integer paise (₹1 = 100 paise), the occupancy assumption, deposit, price validity and booking cutoff. The current contract is INR adult pricing only. Child/infant rates, supplements and other currencies need explicit extensions before checkout can support them; do not put their prices into the adult field. Capacity is the company's allocation, not live remaining seats. Live availability must later be calculated transactionally from holds and bookings.

For custom holidays, change `model` to `custom-holiday` and set `departures` to `[]`. These packages stay quote-only. Supplier-confirmed dates/pricing belong in a versioned customer quote, not a guessed public offer.

Add one sequential itinerary record for every day. Describe the accommodation/transport basis, suitability, inclusions/exclusions, policy version, cancellation terms and payment schedule. Approval records the responsible editor and date; text in a file is not authenticated authority. A production admin workflow must enforce roles and approval rights separately. Documents/media provenance remain governed by BUSINESS_CONTENT_REGISTER.md.

Passing content validation does not activate online booking. Required next: approved real records; authenticated import/editor service; durable catalogue/inventory database; safe hold/booking transactions; provider checkout and verified webhooks; customer recovery/refund flows; production tests and deployment. The public site currently contains destination inspiration, not this commercial catalogue.

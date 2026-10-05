import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateCatalogue } from '../src/lib/package-catalogue.ts';
import { indiaToday } from '../src/lib/enquiry.ts';

const file = process.argv[2];
if (!file) {
  console.error(
    'Usage: npm run catalogue:check -- path/to/approved-packages.json',
  );
  process.exitCode = 2;
} else {
  try {
    const result = validateCatalogue(
      JSON.parse(await readFile(resolve(file), 'utf8')),
      indiaToday(),
    );
    if (result.issues.length || !result.packages.length) {
      console.error(
        result.issues.join('\n') ||
          'No approved packages found. The catalogue is not ready to publish.',
      );
      process.exitCode = 1;
    } else
      console.log(
        `${result.packages.length} package record(s) pass content validation. Live availability and booking services still require separate verification.`,
      );
  } catch (error) {
    console.error(`Catalogue could not be checked: ${error.message}`);
    process.exitCode = 1;
  }
}

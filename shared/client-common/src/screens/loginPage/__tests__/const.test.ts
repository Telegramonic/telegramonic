import { COUNTRIES } from '../const';

describe('COUNTRIES', () => {
  it('is a non-empty array', () => {
    expect(COUNTRIES.length).toBeGreaterThan(0);
  });

  it('every entry has name, code, dialCode and flag fields', () => {
    for (const country of COUNTRIES) {
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('dialCode');
      expect(country).toHaveProperty('flag');
    }
  });

  it('all dialCodes start with "+"', () => {
    for (const country of COUNTRIES) {
      expect(country.dialCode).toMatch(/^\+/);
    }
  });

  it('contains India with dialCode "+91"', () => {
    const india = COUNTRIES.find((c) => c.code === 'IN');
    expect(india).toBeDefined();
    expect(india?.dialCode).toBe('+91');
  });

  it('contains United States with dialCode "+1"', () => {
    const us = COUNTRIES.find((c) => c.code === 'US');
    expect(us).toBeDefined();
    expect(us?.dialCode).toBe('+1');
  });

  it('has no duplicate codes', () => {
    const codes = COUNTRIES.map((c) => c.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });
});

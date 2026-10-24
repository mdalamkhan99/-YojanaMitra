/** The tracker contract: verification is determined by the exact Yes cell value only. */
export const trackerMarksVerified = (value: string): boolean => value === 'Yes';

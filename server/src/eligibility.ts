export type EligibilityProfile = { annualIncome?: number | null; category?: string | null; course?: string | null; courseType?: string | null; percentage?: number | null; dob?: string | Date | null; state?: string | null; gender?: string | null; domicile?: boolean | null; disability?: boolean | null };
export type Rules = { incomeLimit?: number; incomeAbove?: number; categories?: string[]; courses?: string[]; courseTypes?: string[]; minMarks?: number; ageMin?: number; ageMax?: number; state?: string; gender?: string; domicile?: boolean; disability?: boolean; manualChecks?: string[] };
export function checkEligibility(profile: EligibilityProfile, rules: Rules) {
  if (Object.keys(rules).length === 0) return { status: 'Maybe' as const, reasons: ['Eligibility rules have not been verified for this record. Check the official portal.'] };
  const reasons: string[] = []; let failed = false; let missing = false;
  const criterion = (value: unknown, label: string, test: (v: any) => boolean) => { if (value === undefined || value === null || value === '') { reasons.push(`${label} is missing from your profile.`); missing = true; } else if (!test(value)) { reasons.push(`${label} does not meet the stated requirement.`); failed = true; } };
  if (rules.incomeLimit !== undefined) criterion(profile.annualIncome, 'Annual family income', (v:number) => v <= rules.incomeLimit!);
  if (rules.incomeAbove !== undefined) criterion(profile.annualIncome, 'Annual family income', (v:number) => v > rules.incomeAbove!);
  if (rules.categories) criterion(profile.category, 'Category', (v:string) => rules.categories!.includes(v));
  if (rules.courses) criterion(profile.course, 'Course', (v:string) => rules.courses!.some(c => v.toLowerCase().includes(c.toLowerCase())));
  if (rules.courseTypes) criterion(profile.courseType, 'Course type', (v:string) => rules.courseTypes!.includes(v));
  if (rules.minMarks !== undefined) criterion(profile.percentage, 'Marks', (v:number) => v >= rules.minMarks!);
  if (rules.state) criterion(profile.state, 'State', (v:string) => v.toLowerCase() === rules.state!.toLowerCase());
  if (rules.gender) criterion(profile.gender, 'Gender', (v:string) => v.toLowerCase() === rules.gender!.toLowerCase());
  if (rules.domicile !== undefined) criterion(profile.domicile, 'Domicile status', (v:boolean) => v === rules.domicile);
  if (rules.disability !== undefined) criterion(profile.disability, 'Disability status', (v:boolean) => v === rules.disability);
  if (rules.ageMin !== undefined || rules.ageMax !== undefined) {
    if (!profile.dob) { reasons.push('Date of birth is missing from your profile.'); missing = true; }
    else { const age = Math.floor((Date.now() - new Date(profile.dob).getTime()) / 31557600000); if ((rules.ageMin !== undefined && age < rules.ageMin) || (rules.ageMax !== undefined && age > rules.ageMax)) { reasons.push('Age does not meet the stated range.'); failed = true; } }
  }
  if (rules.manualChecks?.length) {
    reasons.push(`Check additional official conditions: ${rules.manualChecks.join(' ')}`);
    missing = true;
  }
  return { status: failed ? 'Not eligible' as const : missing ? 'Maybe' as const : 'Eligible' as const, reasons: reasons.length ? reasons : ['Your profile meets the listed criteria. Verify current rules on the official portal.'] };
}

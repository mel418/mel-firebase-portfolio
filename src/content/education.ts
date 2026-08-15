import type { Education } from './types';

/**
 * Coursework list uses the resume's list (newer than the site's, per the
 * approved plan's "remaining assumptions"). Affiliations are preserved
 * verbatim from the site (WiC/ACM/SWE) rather than the resume's shorter
 * "Activities" line (WiC only) — dropping ACM/SWE without confirmation
 * would be an unreviewed content change, not a refactor. Flagged for
 * Melody to confirm; not silently resolved either way.
 */
export const education: Education = {
  school: 'California State University, Long Beach',
  degree: 'B.S. in Computer Science',
  // Standardized on the hero's fuller phrasing — the context panel
  // previously used the slightly different "CSULB CS '25".
  shortLabel: "CSULB CS Grad '25",
  location: 'Long Beach, CA',
  graduated: 'Dec 2025',
  gpa: '3.66',
  coursework: [
    'Machine Learning',
    'Distributed Computing',
    'Algorithms',
    'Database Systems',
    'Operating Systems',
    'Computer Security',
    'Software Engineering',
    'System Programming (C++)',
  ],
  honors: ["President's List (3×)", "Dean's List (2×)"],
  affiliations: ['WiC — Women in Computing', 'ACM', 'SWE — Society of Women Engineers'],
};

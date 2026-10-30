import type { Education } from './types';

/**
 * Everything numeric here is copied from the CSULB unofficial transcript
 * (printed 01/09/2026) — GPA and honors — not rounded or "improved". GPA 3.66 is the combined cumulative GPA (CSULB + transfer
 * credit, 3.664 on the transcript) and matches the resume; the CSULB-only
 * cumulative GPA is 3.634.
 *
 * Affiliations are preserved from the earlier site (WiC/ACM/SWE) even though
 * the resume lists none — flagged for Melody to confirm.
 */
export const education: Education = {
  school: 'California State University, Long Beach',
  degree: 'B.S. in Computer Science',
  shortLabel: "CSULB CS Grad '25",
  location: 'Long Beach, CA',
  graduated: 'Dec 2025',
  gpa: '3.66',
  coursework: [
    'Algorithms',
    'Operating Systems',
    'Database Fundamentals',
    'Computer Security',
    'Networks & Distributed Computing',
    'Software Engineering',
    'Web Programming & Accessibility',
    'Data Visualization',
    'Machine Learning',
    'Senior Project I & II',
  ],
  honors: ["President's List (3×)", "Dean's List (2×)"],
  affiliations: ['WiC — Women in Computing', 'ACM — Association for Computing Machinery', 'SWE — Society of Women Engineers'],
};

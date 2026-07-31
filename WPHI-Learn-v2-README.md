# WPHI Learn v2

This package contains a single-file React prototype for an institutional-style vocational LMS.

## Included in v2

### Student experience
- Personalised dashboard with progress, attendance, timetable, announcements and next actions
- All 17 AHC30722 units grouped by term
- Search and term filtering
- Unit overview, modules, resources, assessment and results tabs
- Module-level completion
- Accessible knowledge quizzes
- Practical evidence portfolio with file metadata and submission history
- Separate learning, knowledge, evidence and competency progress
- Assessment centre, calendar, results, messages and support pages
- Responsive mobile navigation and mobile evidence workflow

### Trainer experience
- Trainer dashboard and workload metrics
- Priority marking queue
- Cohort progress and learner-support indicators
- Submission review workspace
- Criterion-level rubric judgements
- Student feedback and internal assessor notes
- Resubmission and competency decision workflows

### Compliance experience
- Quality and compliance overview
- Assessment mapping matrix
- Audit-history viewer
- Integration-health dashboard
- Assessment version and validation status

### Interface and accessibility
- Responsive desktop, tablet and mobile layouts
- Keyboard-visible focus states
- Semantic fieldsets and legends for quizzes
- Skip link, labelled controls and non-colour status text
- Reduced-motion support
- Consistent institutional visual system

## Prototype persistence

The component stores demo progress in `window.storage` when available and falls back to `localStorage`. Uploaded file binaries are not retained; only file metadata is recorded in the prototype.

## Required production services

This file intentionally does not pretend to provide production security. A real deployment still requires:

- Server-side authentication and role-based permissions
- PostgreSQL or another transactional database
- Secure object storage for evidence files
- Malware scanning and upload validation
- Real student and staff accounts
- Student Management System integration
- Server-generated audit records
- Email and SMS services
- Backups, retention controls and disaster recovery
- Privacy, penetration, accessibility and compliance testing

## Entry component

```jsx
import WPHILearnV2 from "./wphi-learn-v2";

export default function App() {
  return <WPHILearnV2 />;
}
```

import bcrypt from 'bcryptjs';

// Fictional accounts for the hackathon demo only. They never come from browser input.
const demoPasswordHash = bcrypt.hashSync('password', 12);

export const DEMO_USERS = [
  { _id: 'demo-patient-001', name: 'Alex Morgan', email: 'alex@medidesk.health', role: 'Patient', specialty: undefined, isActive: true, password: demoPasswordHash },
  { _id: 'demo-doctor-001', name: 'Dr. Jordan Lee', email: 'doctor@medidesk.health', role: 'Doctor', specialty: 'General medicine', isActive: true, password: demoPasswordHash },
  { _id: 'demo-admin-001', name: 'MediDesk Admin', email: 'admin@medidesk.health', role: 'Admin', specialty: undefined, isActive: true, password: demoPasswordHash }
];

export const findDemoUser = email => DEMO_USERS.find(user => user.email === String(email).toLowerCase());
export const findDemoUserById = id => DEMO_USERS.find(user => user._id === id);

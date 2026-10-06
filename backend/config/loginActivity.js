const events = [
  { email: 'alex@medidesk.health', name: 'Alex Morgan', role: 'Patient', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), ip: 'demo-network' },
  { email: 'doctor@medidesk.health', name: 'Dr. Jordan Lee', role: 'Doctor', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), ip: 'demo-network' },
  { email: 'unknown@example.com', name: 'Unknown account', role: 'Unknown', status: 'Failed', timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(), ip: 'demo-network' }
];

export function recordLoginEvent(event) {
  events.unshift({ ...event, timestamp: new Date().toISOString() });
  if (events.length > 100) events.pop();
}

export function getLoginEvents() {
  return events.slice(0, 50);
}

import bcrypt from 'bcryptjs';
import { UserModel } from './models/user.model.js';
import { VisitorModel } from './models/visitor.model.js';

// Seed demo data on first boot (when DB is empty) so the hiring demo looks alive.
// Default admin login: admin@visitor.app / admin123 (override via DEMO_EMAIL / DEMO_PASSWORD)

const DEMO_EMAIL = process.env.DEMO_EMAIL || 'admin@visitor.app';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'admin123';

const x = (h: number, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

export async function seedDatabase(): Promise<void> {
  const userCount = await UserModel.countDocuments();
  const visitorCount = await VisitorModel.countDocuments();

  if (userCount > 0 || visitorCount > 0) {
    console.log('🍃 Seed skipped — data already present');
    return;
  }

  // --- Admin user ---
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const admin = await UserModel.create({
    name: 'Front Desk',
    email: DEMO_EMAIL,
    passwordHash,
    role: 'admin',
  });

  // --- Hosts (people the visitors are meeting) ---
  const hosts = ['Sarah Chen', 'Marcus Webb', 'Priya Nair', 'Daniel Okafor'];

  // E (expected), I (checked-in), O (checked-out)
  const seed: Array<{
    name: string;
    phone: string;
    company: string;
    personToMeet: string;
    purpose: string;
    status: 'expected' | 'checked-in' | 'checked-out';
    expectedTime?: Date;
    checkInTime?: Date;
    checkOutTime?: Date;
  }> = [
    // Expected (upcoming today)
    { name: 'James Porter', phone: '+1-555-0101', company: 'Aurora Labs', personToMeet: hosts[0], purpose: 'Interview', status: 'expected', expectedTime: x(14, 30) },
    { name: 'Emily Foster', phone: '+1-555-0102', company: 'Brightpath', personToMeet: hosts[1], purpose: 'Client Meeting', status: 'expected', expectedTime: x(15, 0) },
    { name: 'Ravi Kumar', phone: '+1-555-0103', company: 'Crestline Group', personToMeet: hosts[2], purpose: 'Product Demo', status: 'expected', expectedTime: x(16, 0) },
    // Checked-in (in the building now)
    { name: 'Daniel Reyes', phone: '+1-555-0104', company: 'Navan Consulting', personToMeet: hosts[0], purpose: 'Interview', status: 'checked-in', checkInTime: x(9, 15) },
    { name: 'Grace Lambert', phone: '+1-555-0105', company: 'Summit Partners', personToMeet: hosts[3], purpose: 'Vendor Visit', status: 'checked-in', checkInTime: x(10, 5) },
    { name: 'Tom Aldridge', phone: '+1-555-0106', company: 'Redwood Co.', personToMeet: hosts[1], purpose: 'Client Meeting', status: 'checked-in', checkInTime: x(11, 20) },
    // Checked-out (completed log)
    { name: 'Helen Wu', phone: '+1-555-0107', company: 'Bluepeak Media', personToMeet: hosts[2], purpose: 'Interview', status: 'checked-out', checkInTime: x(8, 45), checkOutTime: x(9, 40) },
    { name: 'Omar Farouk', phone: '+1-555-0108', company: 'Zenith Health', personToMeet: hosts[0], purpose: 'Partner Meeting', status: 'checked-out', checkInTime: x(9, 30), checkOutTime: x(10, 45) },
    { name: 'Nina Rossi', phone: '+1-555-0109', company: 'Ferro Autos', personToMeet: hosts[3], purpose: 'Vendor Visit', status: 'checked-out', checkInTime: x(10, 50), checkOutTime: x(12, 0) },
    { name: 'Kofi Mensah', phone: '+1-555-0110', company: 'Tabella Systems', personToMeet: hosts[1], purpose: 'Product Demo', status: 'checked-out', checkInTime: x(11, 0), checkOutTime: x(11, 55) },
  ];

  await VisitorModel.insertMany(
    seed.map((s) => ({ ...s, registeredBy: admin._id }))
  );

  console.log('🌱 Seed complete — created 1 admin + 10 demo visitors');
}
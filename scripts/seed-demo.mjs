/**
 * Demo Seed Script — Free GST Billing Software
 * Seeds: 1 business profile, 5 clients, 8 products, 10 invoices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const DIRS = ['bills', 'clients', 'products', 'profiles', 'expenses', 'purchases', 'receipts'];
for (const d of DIRS) fs.mkdirSync(path.join(DATA_DIR, d), { recursive: true });

function write(dir, id, obj) {
  fs.writeFileSync(path.join(DATA_DIR, dir, id + '.json'), JSON.stringify(obj, null, 2), 'utf-8');
}

// ── 1. Business Profile ──────────────────────────────────────────────────────
write('profiles', 'profile-main', {
  id: 'profile-main',
  businessName: 'DiceCodes Technology Pvt. Ltd.',
  gstin: '27AABCD1234E1Z5',
  pan: 'AABCD1234E',
  address: '42, Sector 18, Gurugram',
  city: 'Gurugram',
  state: 'Haryana',
  pincode: '122015',
  phone: '9876543210',
  email: 'billing@dicecodes.com',
  website: 'https://dicecodes.com',
  bankName: 'HDFC Bank',
  accountNo: '50200012345678',
  ifsc: 'HDFC0001234',
  upiId: 'dicecodes@hdfcbank',
  businessType: 'goods',
  stateCode: '06',
  createdAt: new Date().toISOString(),
});

// ── 2. Clients ────────────────────────────────────────────────────────────────
const clients = [
  { id: 'c1', name: 'Ramesh Traders', gstin: '07AAACR1234F1Z6', phone: '9111111111', email: 'ramesh@traders.in', address: 'Karol Bagh, New Delhi', state: 'Delhi', stateCode: '07', pincode: '110005' },
  { id: 'c2', name: 'Sunita Enterprises', gstin: '29AAACS5678G1Z2', phone: '9222222222', email: 'sunita@enterprises.in', address: 'Indiranagar, Bengaluru', state: 'Karnataka', stateCode: '29', pincode: '560038' },
  { id: 'c3', name: 'Patel & Sons', gstin: '24AAACP9012H1Z8', phone: '9333333333', email: 'patel@sons.in', address: 'Ring Road, Surat', state: 'Gujarat', stateCode: '24', pincode: '395007' },
  { id: 'c4', name: 'Sharma IT Solutions', gstin: '27AAACS3456I1Z4', phone: '9444444444', email: 'sharma@it.in', address: 'Andheri West, Mumbai', state: 'Maharashtra', stateCode: '27', pincode: '400058' },
  { id: 'c5', name: 'Agarwal Distributors', gstin: '08AAAAG7890J1Z0', phone: '9555555555', email: 'agarwal@dist.in', address: 'MI Road, Jaipur', state: 'Rajasthan', stateCode: '08', pincode: '302001' },
];
for (const c of clients) write('clients', c.id, { ...c, createdAt: new Date().toISOString() });

// ── 3. Products ────────────────────────────────────────────────────────────────
const products = [
  { id: 'p1', name: 'Laptop Core i5', hsn: '84713000', unit: 'NOS', price: 45000, gstRate: 18, description: '15.6 inch, 8GB RAM, 512GB SSD' },
  { id: 'p2', name: 'Wireless Mouse', hsn: '84716060', unit: 'NOS', price: 799, gstRate: 18, description: 'USB Wireless 2.4GHz' },
  { id: 'p3', name: 'HDMI Cable 2m', hsn: '85444999', unit: 'NOS', price: 349, gstRate: 18, description: '4K HDMI 2.0' },
  { id: 'p4', name: 'USB Hub 4-Port', hsn: '85176990', unit: 'NOS', price: 599, gstRate: 18, description: 'USB 3.0 Hub' },
  { id: 'p5', name: 'Office Chair', hsn: '94013000', unit: 'NOS', price: 8500, gstRate: 18, description: 'Ergonomic mesh chair' },
  { id: 'p6', name: 'Printer Cartridge', hsn: '84439910', unit: 'NOS', price: 1200, gstRate: 12, description: 'Black Ink Cartridge' },
  { id: 'p7', name: 'A4 Paper Ream', hsn: '48025610', unit: 'PKT', price: 450, gstRate: 12, description: '500 sheets, 75 GSM' },
  { id: 'p8', name: 'Web Development Service', hsn: '998314', unit: 'HRS', price: 2000, gstRate: 18, description: 'Custom web development per hour' },
];
for (const p of products) write('products', p.id, { ...p, createdAt: new Date().toISOString() });

// ── 4. Helper ─────────────────────────────────────────────────────────────────
function makeDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function calcTax(price, qty, gstRate, isSameState) {
  const base = price * qty;
  const taxAmt = base * gstRate / 100;
  const half = taxAmt / 2;
  return {
    taxableAmount: base,
    cgst: isSameState ? half : 0,
    sgst: isSameState ? half : 0,
    igst: isSameState ? 0 : taxAmt,
    total: base + taxAmt,
  };
}

// ── 5. Invoices ────────────────────────────────────────────────────────────────
const invoices = [
  {
    id: 'INV-2024-001', invoiceNumber: 'INV-2024-001', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(60), dueDate: makeDate(30),
    client: clients[0], profileId: 'profile-main',
    items: [
      { product: products[0], qty: 2, price: 45000, gstRate: 18 },
      { product: products[1], qty: 2, price: 799, gstRate: 18 },
    ],
    isSameState: false, status: 'paid',
  },
  {
    id: 'INV-2024-002', invoiceNumber: 'INV-2024-002', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(50), dueDate: makeDate(20),
    client: clients[1], profileId: 'profile-main',
    items: [
      { product: products[4], qty: 5, price: 8500, gstRate: 18 },
      { product: products[3], qty: 5, price: 599, gstRate: 18 },
    ],
    isSameState: false, status: 'paid',
  },
  {
    id: 'INV-2024-003', invoiceNumber: 'INV-2024-003', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(45), dueDate: makeDate(15),
    client: clients[2], profileId: 'profile-main',
    items: [
      { product: products[1], qty: 10, price: 799, gstRate: 18 },
      { product: products[2], qty: 10, price: 349, gstRate: 18 },
      { product: products[6], qty: 20, price: 450, gstRate: 12 },
    ],
    isSameState: false, status: 'paid',
  },
  {
    id: 'INV-2024-004', invoiceNumber: 'INV-2024-004', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(35), dueDate: makeDate(5),
    client: clients[3], profileId: 'profile-main',
    items: [
      { product: products[7], qty: 40, price: 2000, gstRate: 18 },
    ],
    isSameState: true, status: 'paid',
  },
  {
    id: 'INV-2024-005', invoiceNumber: 'INV-2024-005', invoiceType: 'proforma',
    invoiceDate: makeDate(30), dueDate: makeDate(0),
    client: clients[4], profileId: 'profile-main',
    items: [
      { product: products[0], qty: 5, price: 45000, gstRate: 18 },
      { product: products[4], qty: 5, price: 8500, gstRate: 18 },
    ],
    isSameState: false, status: 'unpaid',
  },
  {
    id: 'INV-2024-006', invoiceNumber: 'INV-2024-006', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(25), dueDate: makeDate(5),
    client: clients[0], profileId: 'profile-main',
    items: [
      { product: products[5], qty: 6, price: 1200, gstRate: 12 },
      { product: products[6], qty: 10, price: 450, gstRate: 12 },
    ],
    isSameState: false, status: 'paid',
  },
  {
    id: 'INV-2024-007', invoiceNumber: 'INV-2024-007', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(20), dueDate: makeDate(10),
    client: clients[1], profileId: 'profile-main',
    items: [
      { product: products[7], qty: 20, price: 2000, gstRate: 18 },
      { product: products[2], qty: 5, price: 349, gstRate: 18 },
    ],
    isSameState: false, status: 'unpaid',
  },
  {
    id: 'INV-2024-008', invoiceNumber: 'INV-2024-008', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(15), dueDate: makeDate(15),
    client: clients[2], profileId: 'profile-main',
    items: [
      { product: products[0], qty: 1, price: 45000, gstRate: 18 },
      { product: products[3], qty: 2, price: 599, gstRate: 18 },
      { product: products[1], qty: 1, price: 799, gstRate: 18 },
    ],
    isSameState: false, status: 'unpaid',
  },
  {
    id: 'INV-2024-009', invoiceNumber: 'INV-2024-009', invoiceType: 'credit-note',
    invoiceDate: makeDate(10), dueDate: makeDate(0),
    client: clients[3], profileId: 'profile-main',
    items: [
      { product: products[7], qty: 5, price: 2000, gstRate: 18 },
    ],
    isSameState: true, status: 'paid',
  },
  {
    id: 'INV-2024-010', invoiceNumber: 'INV-2024-010', invoiceType: 'tax-invoice',
    invoiceDate: makeDate(3), dueDate: makeDate(-27),
    client: clients[4], profileId: 'profile-main',
    items: [
      { product: products[0], qty: 3, price: 45000, gstRate: 18 },
      { product: products[1], qty: 3, price: 799, gstRate: 18 },
      { product: products[4], qty: 2, price: 8500, gstRate: 18 },
    ],
    isSameState: false, status: 'unpaid',
  },
];

// Build and write invoice JSON
for (const inv of invoices) {
  const lines = inv.items.map((item, i) => {
    const tax = calcTax(item.price, item.qty, item.gstRate, inv.isSameState);
    return {
      id: `${inv.id}-L${i + 1}`,
      productId: item.product.id,
      name: item.product.name,
      hsn: item.product.hsn,
      unit: item.product.unit,
      qty: item.qty,
      price: item.price,
      gstRate: item.gstRate,
      ...tax,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.taxableAmount, 0);
  const totalCgst = lines.reduce((s, l) => s + l.cgst, 0);
  const totalSgst = lines.reduce((s, l) => s + l.sgst, 0);
  const totalIgst = lines.reduce((s, l) => s + l.igst, 0);
  const grandTotal = lines.reduce((s, l) => s + l.total, 0);

  const bill = {
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    invoiceType: inv.invoiceType,
    invoiceDate: inv.invoiceDate,
    dueDate: inv.dueDate,
    status: inv.status,
    profileId: inv.profileId,
    client: {
      id: inv.client.id,
      name: inv.client.name,
      gstin: inv.client.gstin,
      address: inv.client.address,
      state: inv.client.state,
      stateCode: inv.client.stateCode,
      phone: inv.client.phone,
      email: inv.client.email,
    },
    items: lines,
    subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    grandTotal,
    placeOfSupply: inv.client.stateCode,
    notes: 'Payment due within 30 days. Thank you for your business!',
    terms: 'Goods once sold will not be taken back. Subject to Gurugram jurisdiction.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  write('bills', inv.id, bill);
}

console.log('✅ Demo data seeded successfully!');
console.log(`   📁 Profile : 1`);
console.log(`   👥 Clients : ${clients.length}`);
console.log(`   📦 Products: ${products.length}`);
console.log(`   🧾 Invoices: ${invoices.length} (Tax Invoice, Proforma, Credit Note)`);
console.log('\n🌐 Open http://localhost:5173/ to see the demo data.');


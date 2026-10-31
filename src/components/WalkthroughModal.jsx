/**
 * WalkthroughModal.jsx
 * Full in-app User Guide / Walkthrough modal for Free GST Billing Software.
 * Opens from Settings header. Fully self-contained — no external deps.
 */

import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, ChevronDown, ChevronRight, Search } from 'lucide-react';

// ─── All sections of the walkthrough ────────────────────────────────────────
const SECTIONS = [
  {
    id: 'setup',
    emoji: '🏢',
    title: 'पहली बार Setup — Business Profile',
    content: `जब पहली बार app खोलेंगे तो **Setup Wizard** आएगा। इसमें 3 steps हैं।

**Step 1 — Business Type चुनें:**
• **Retail** — दुकानदार, किराना, electronics
• **Freelancer** — Designer, writer, consultant  
• **Restaurant** — Hotel, café, dhaba
• **Wholesale** — Distributor, supplier
• **Manufacturing** — Factory, production unit
• **Service** — IT firm, agency, doctor

**Step 2 — Business Details भरें:**
• Business Name — जैसे GST certificate पर है
• GSTIN — 15 digit (automatically validate होगा)
• PAN, Address, City, State, Pincode
• Phone, Email, Website

**Step 3 — Bank Details:**
• Bank Name, Account Number, IFSC
• UPI ID — Invoice पर QR code automatically बनेगा
• Logo और Signature image भी upload करें

💡 बाद में बदलना हो → Settings → Company`,
  },
  {
    id: 'dashboard',
    emoji: '📊',
    title: 'Dashboard — एक नज़र में सब कुछ',
    content: `Dashboard पर ये सब एक नज़र में दिखता है:

• **कुल Revenue** — सभी paid invoices का total
• **Tax Collected** — CGST + SGST + IGST total
• **Outstanding** — कितना पैसा आना बाकी है
• **Invoice Count** — कुल invoices

**Dashboard पर और क्या है:**
• Revenue Chart — महीनेवार income graph
• Top Clients — सबसे ज्यादा business देने वाले
• Recent Invoices — आखिरी बनाई गई invoices
• Unpaid Invoices — कितना पैसा collect करना है
• Low Stock Alert — कौन सा product खत्म होने वाला है

💡 Dashboard सिर्फ selected business का data दिखाता है।`,
  },
  {
    id: 'invoice',
    emoji: '🧾',
    title: 'Invoice बनाना — Step by Step',
    content: `**Sidebar → Invoices → + New Invoice**

**1. Invoice Type और Number चुनें**
• Tax Invoice, Proforma, Bill of Supply, Credit Note, Delivery Challan
• Invoice Number automatically आएगा

**2. Client चुनें**
• Search box में नाम type करें
• नया हो तो "Add New Client" से यहीं जोड़ें

**3. Items जोड़ें — हर line के लिए:**
• Product search → HSN, Rate auto-fill
• Qty, Unit (NOS, KG, LTR, etc.)
• Discount — % या ₹ में
• GST Rate — 0%, 5%, 12%, 18%, 28%

**GST Automatic:**
• Same state → CGST + SGST
• Different state → IGST
• SEZ client → IGST (automatic)

**4. Notes और Terms:**
• Notes — client को दिखने वाला
• Private Note — सिर्फ आपको दिखेगा, PDF पर नहीं
• Terms — 13 ready-made templates में से चुनें

**5. Save, Preview, Download, Share**`,
  },
  {
    id: 'invoice-types',
    emoji: '📄',
    title: 'Invoice के 5 Types',
    content: `**1. 🧾 Tax Invoice**
Normal GST sale। CGST/SGST/IGST सब include।
कब: हर normal sale पर

**2. 📋 Proforma Invoice (Estimate/Quotation)**
Order से पहले का estimate। GST calculate होती है।
कब: Client को quote देना हो
→ One-click Convert: Tax Invoice में बदलें जब order confirm हो

**3. 📄 Bill of Supply**
GST-exempt goods/services के लिए। GST नहीं लगती।
कब: Unregistered seller या exempt items

**4. 🔴 Credit Note**
Invoice cancel या return के लिए। Amount GST में minus होती है।
कब: Customer ने माल वापस किया, discount adjust करना हो

**5. 🚚 Delivery Challan**
माल भेजने के लिए, बिना sale के। GST नहीं।
कब: Job work, branch transfer, loan/approval basis`,
  },
  {
    id: 'clients',
    emoji: '👥',
    title: 'Clients — जोड़ना और Manage करना',
    content: `**Sidebar → Clients**

**Client जोड़ना:**
• Name, GSTIN, Phone, Email
• Address, State, Pincode
• SEZ Flag — tick करें अगर SEZ zone में है (auto IGST)

**Client Ledger (क्लिक करें किसी client पर):**
• All Invoices — इस client की सभी invoices
• Outstanding Amount — कितना बकाया है
• Payment History — कब-कब payment आई
• Average Days to Payment — कितने दिन में pay करता है

**Client Analytics:**
• Top Clients by Revenue
• Worst Payers (देर से pay करने वाले)

**Bulk Import:**
CSV से एक साथ कई clients:
Settings → Import → Clients CSV → Template download → Fill → Upload`,
  },
  {
    id: 'products',
    emoji: '📦',
    title: 'Product Catalog',
    content: `**Sidebar → Products**

**Product जोड़ना:**
• Product Name
• HSN Code (goods) या SAC Code (services)
• Default Rate — invoice पर auto-fill होगी
• GST Rate — 0/5/12/18/28%
• Unit — NOS, KG, LTR, MTR, BOX, या custom
• Stock Quantity — opening stock
• Low Stock Alert Level — इससे कम होने पर notification

**फायदा:**
Invoice बनाते वक्त product name type करो → HSN, Rate, GST सब auto-fill

**Bulk Edit:**
कई products की price/GST एक साथ बदलें → Products → Bulk Edit

**Bulk Import:**
CSV से products import करें`,
  },
  {
    id: 'payments',
    emoji: '💰',
    title: 'Payment लेना और Receipt बनाना',
    content: `**Invoice पर Payment Record करना:**
1. Invoices list → Invoice click करें
2. "Record Payment" button
3. भरें: Amount, Payment Mode, Date, Note
4. Save करें

**Payment Modes:**
Cash, UPI, Bank Transfer, NEFT/RTGS, Cheque, Credit Card, etc.

**Auto-Print Receipt:**
Payment save होते ही printable receipt automatically खुलती है:
• Business name और logo
• Receipt number
• Invoice number
• Amount in words (Indian format)
• Running balance (partial payment के लिए)

**Payment History (हर payment पर):**
• 🖨️ Reprint Receipt
• ✏️ Edit Note
• 🗑️ Delete (balance automatic recompute)

**Invoice Status:**
• Unpaid — कोई payment नहीं
• Partial — कुछ payment आई
• Paid — पूरा amount मिल गया
• Overdue — due date निकल गई`,
  },
  {
    id: 'recurring',
    emoji: '🔄',
    title: 'Recurring Invoices — बार-बार वाले',
    content: `**Sidebar → Recurring**

**किसके लिए:**
• Monthly retainer clients (हर महीने same amount)
• Annual maintenance contracts
• Weekly/Quarterly subscriptions

**Setup:**
1. + New Template → पूरी invoice एक बार बनाएँ
2. Frequency चुनें: Weekly / Monthly / Quarterly / Yearly
3. Start Date और End Date (optional) set करें
4. Save करें

अगले period में invoice automatically generate होगी।
बस review करें और send करें — manually बनाने की जरूरत नहीं।`,
  },
  {
    id: 'purchases',
    emoji: '🛒',
    title: 'Purchase Bills — खरीदी का हिसाब',
    content: `**Sidebar → Purchases**

**क्यों record करें:**
• ITC (Input Tax Credit) claim करने के लिए
• Profit & Loss में automatically count होगा
• GSTR-3B में ITC auto-calculate होगी

**Purchase Bill भरना:**
• Vendor Name, GSTIN
• Bill Number, Bill Date
• Items — product, qty, rate, GST
• Payment Status

**Purchase Orders:**
Sidebar → Purchase Orders — vendor को order देने से पहले का document`,
  },
  {
    id: 'expenses',
    emoji: '💸',
    title: 'Expense Tracker — खर्च का हिसाब',
    content: `**Sidebar → Expenses**

**Expense Categories:**
Rent, Salary, Marketing, Travel, Electricity, etc.
Custom categories भी बना सकते हैं।

**Expense Record करना:**
• Amount, Category, Date
• Vendor Name, GSTIN (अगर GST bill है)
• GST Rate — ITC automatically calculate होगी

**ITC का फायदा:**
GST वाले expenses GSTR-3B में automatic ITC में add होते हैं।
मतलब उतना कम tax भरना होगा।`,
  },
  {
    id: 'stock',
    emoji: '📦',
    title: 'Stock / Inventory Management',
    content: `**Sidebar → Inventory**

**Auto Stock Tracking:**
• Invoice save → Stock घटता है automatically
• Invoice delete → Stock बढ़ता है automatically
• Purchase record → Stock बढ़ता है

**Stock Report:**
• हर product की current stock
• Low stock items highlighted in red
• Stock movement history

**Low Stock Alert:**
• Product में Alert Level set करें (जैसे: 10 units)
• Stock 10 से कम होने पर 🔔 Notification Bell में alert आएगा
• Dashboard पर भी warning दिखेगी`,
  },
  {
    id: 'gst',
    emoji: '📋',
    title: 'GST Returns — GSTR-1 और GSTR-3B',
    content: `**Sidebar → GST Returns**

बस invoices enter करते रहो — GST data automatically तैयार होता रहेगा।
Month end पर बस export और upload करो।

**GSTR-1 Filing (Sales Return):**
1. GST Returns → GSTR-1 tab खोलो
2. Data review करो:
   • B2B — GSTIN वाले clients
   • B2C — बिना GSTIN के clients
   • B2C Large — ₹2.5 लाख से ज्यादा interstate
   • HSN Summary, Credit Notes, Document Summary
3. "Download GSTR-1 JSON" click करो
4. gst.gov.in → File Returns → GSTR-1 → Upload JSON ✅

**GSTR-3B Filing (Monthly Summary):**
1. GST Returns → GSTR-3B tab
2. देखो: Output Tax, ITC, Net Tax Payable
3. GST portal पर figures copy करो और file करो

**Filing Checklist:**
• Interactive checklist with deadlines
• Late fee calculator
• NIL Return guide (जिस month sale नहीं)`,
  },
  {
    id: 'gstr2b',
    emoji: '🔍',
    title: 'GSTR-2B Reconciliation',
    content: `**GST Returns → GSTR-2B tab**

**क्या है यह:**
Government की तरफ से जो ITC मिलनी चाहिए vs. आपकी books — दोनों का मिलान।

**कैसे करें:**
1. GST Portal से GSTR-2B JSON download करें
2. App में "Import GSTR-2B" करें
3. App automatically match करेगा:

   ✅ Matched — दोनों जगह same
   ⚠️ Amount Mismatch — entry है पर amount अलग
   📘 Books Only — आपकी books में है, 2B में नहीं
   📄 2B Only — 2B में है, books में नहीं

4. CSV Export → CA को दे सकते हैं`,
  },
  {
    id: 'ewaybill',
    emoji: '🚚',
    title: 'E-Way Bill',
    content: `**कब जरूरी है:**
Goods की value ₹50,000 से ज्यादा और inter-state movement हो।

**कैसे generate करें:**
1. Tax Invoice बनाएँ
2. Invoice → "Download E-Way Bill JSON"
3. https://ewaybillgst.gov.in → Import JSON → Generate ✅

**App automatically:**
• PIN codes address से extract करता है
• Supply type (Outward) set करता है
• NIC format v1.0.1221 में JSON बनाता है`,
  },
  {
    id: 'tds',
    emoji: '📑',
    title: 'TDS / TCS Reports',
    content: `**GST Returns → TDS/TCS tab**

**TDS (Tax Deducted at Source):**
Clients जो आपके payment पर TDS काटते हैं:
• Sections: 194Q, 194C, 194J, 194I, 194H, 194O, 195
• Per-quarter report
• Form 26Q CSV export → CA को दो या खुद file करो

**TCS (Tax Collected at Source):**
आप जो clients से TCS collect करते हैं:
• Section 206C(1H) — ₹50 लाख threshold automatic
• TCS सही base पर (GST including, CBDT Circular 17/2020)
• Form 27EQ CSV export`,
  },
  {
    id: 'reports',
    emoji: '📈',
    title: 'Reports — P&L, Outstanding, Analytics',
    content: `**Sidebar → Reports**

**📊 Profit & Loss Statement:**
• Revenue (GST excluding)
• Expenses (category-wise)
• Net Profit / Loss और Profit Margin %
• Monthly breakdown

**📋 Outstanding & Aging Report:**
• कौन सा client कितना बकाया है
• Days Overdue — कितने दिन से pending
• Age buckets: 0-30, 31-60, 61-90, 90+ days

**👥 Client Analytics:**
• Top Clients by Revenue
• Worst Payers (average days to payment)

**📦 Product Performance:**
• Best Sellers by revenue
• Most Units Sold
• Revenue by product

**🏭 Cost Centre Report:**
Multiple departments का अलग-अलग P&L`,
  },
  {
    id: 'itr',
    emoji: '🏛️',
    title: 'Income Tax (ITR) Computation',
    content: `**Sidebar → Income Tax**

Freelancers और small business owners के लिए।

**क्या-क्या calculate होता है:**

Old vs. New Regime Comparison:
• दोनों में tax side-by-side देखें
• Kaun sa फायदेमंद है automatically बताएगा

**Income Sources:**
• Business income (app की sales से auto-fill)
• Salary income
• Capital Gains (STCG/LTCG — Sec 111A/112A)
• Other sources

**Deductions (Old Regime):**
• 80C — PPF, LIC, ELSS (₹1.5L limit)
• 80D — Medical insurance (senior citizen caps)
• 80G — Donations, HRA, Standard Deduction

**Advance Tax:**
• Section 234B/234C interest — calendar-month accurate
• ITR-4 Sugam field map included`,
  },
  {
    id: 'cashbook',
    emoji: '💵',
    title: 'Cash Book',
    content: `**Sidebar → Cash Book**

Cash में हुए सभी transactions का हिसाब।

**क्या track होता है:**
• Cash receipts (clients से)
• Cash payments (expenses, purchases)
• Opening Balance
• Daily closing balance (automatic)

**फायदा:**
दिन के अंत में cash drawer कितना होना चाहिए — easily verify करें।`,
  },
  {
    id: 'pdf-design',
    emoji: '🎨',
    title: 'PDF Design — Invoice कैसी दिखेगी',
    content: `**Settings → Print & PDF**

**9 One-Click Design Presets:**
• Modern — Indigo, filled headers
• Classic — Monochrome, ALL CAPS
• Corporate — Navy + Gold, premium
• Minimalist — Clean hairlines, whitespace
• Colorful — Warm orange, retail/café
• Compact — Max lines per page
• Enterprise — Blue accent
• IT Services — Deep navy heading
• Retail Brand — Logo-first, HSN column

**Split-View Preview:**
बाईं तरफ settings, दाईं तरफ live preview
हर change instantly दिखेगा!

**70+ Settings:**
• Colors — accent, header, text, divider (हर color)
• Font — Helvetica / Times New Roman / Courier
• Font Size — 80% से 140% slider
• Margins — Top/Bottom/Left/Right in mm
• Language — English / हिंदी / Tamil / Marathi / Bengali
• Watermark — DUPLICATE / DRAFT / custom text
• Barcode + QR code
• UPI QR code
• Multi-copy — Original + Duplicate + Triplicate

**30+ Field Toggles:**
Logo, GSTIN, HSN, Discount, Tax, Bank Details, Signature — सब on/off`,
  },
  {
    id: 'share',
    emoji: '📤',
    title: 'Invoice Share करना',
    content: `**Invoice के अंदर से या list में से share करें:**

**📱 WhatsApp:**
• Desktop WhatsApp या WhatsApp Web — auto-detect
• PDF automatically attach होगी
• Ready-made message

**📧 Email:**
• Default email client खुलेगा
• PDF attached

**⬇️ PDF Download:**
• High quality (3x render scale)
• Multi-page supported
• File size optimize

**📤 Bulk PDF Export:**
1. Date range select करें (From → To)
2. Option 1: सभी → एक PDF में combine
3. Option 2: सभी → अलग-अलग ZIP में
• Progress bar दिखेगा
• Cancel का button भी
• 50+ invoices पर भी tab freeze नहीं होगी

**☁️ Google Drive (Optional):**
PDF download → automatically Drive पर भी upload
Backup → Drive पर भी save`,
  },
  {
    id: 'backup',
    emoji: '💾',
    title: 'Backup और Restore',
    content: `**Settings → Backup & Restore**

**🔄 Automatic Daily Backup:**
• हर रात automatically data/backups/YYYY-MM-DD/ में
• 30 दिन का history
• पुराना automatically delete

**📥 Manual Backup (Granular):**
Checkboxes से choose करें:
✅ Profile, Invoices, Clients, Products
✅ Expenses, Purchases, Recurring
✅ Payment receipts, Terms templates
✅ Settings, Local preferences

**📤 Restore:**
• Import से पहले preview (कितने records)
• Restore से पहले automatic snapshot of current data
• अगर error → automatic rollback (data कभी corrupt नहीं)

**🗑️ Trash Bin:**
Delete की गई invoices 30 दिन Trash में
One-click Restore से वापस लाएँ`,
  },
  {
    id: 'multi-biz',
    emoji: '🏭',
    title: 'Multi-Business Profiles',
    content: `**Settings → Business Profiles → + Add Profile**

**किसके लिए:**
• दो GSTIN हैं (shop + consulting)
• Partner हैं अलग-अलग businesses में
• Family में multiple businesses

**कैसे काम करता है:**
हर profile का अलग:
• Invoices, Dashboard, Expenses, Purchases
• Reports, GST Returns, Income Tax

Shared रहता है:
• Client list (common)

**Header में Business Switcher:**
One-click → सब data तुरंत switch हो जाता है
Dashboard, Reports, GST — सब उस business के अनुसार

**पुराना Data:**
"Unassigned" में रहता है।
Invoice पर "Assign to Business" → Correct business select करें`,
  },
  {
    id: 'shortcuts',
    emoji: '⌨️',
    title: 'Keyboard Shortcuts और Power Features',
    content: `**⌨️ Keyboard Shortcuts:**
• Ctrl + K — Command Palette (spotlight search)
• Ctrl + S — Invoice save
• Esc — Modal बंद करें
• Tab — Next field

**🔍 Ctrl+K Command Palette:**
कहीं भी Ctrl+K दबाएँ:
• Invoice search → directly edit में खुलेगी
• Client search
• Product search
• Settings section में jump

**🔔 Notification Bell:**
• 🔴 Overdue invoices
• 📦 Low stock alerts
• 🗓️ GST filing deadlines
• 🆕 App update available
• Mark all as read — सब clear

**📷 OCR — Camera से Bill Scan:**
Purchase Bills → Scan Bill
HSN, Qty, Rate, Tax% automatically extract होगा
Completely offline — कोई server नहीं

**🌙 Dark Mode:**
Header में 🌙 icon → पूरी app dark theme

**🔒 App Lock:**
Settings → App Lock → PIN set करें
Idle timeout set करें`,
  },
];

// ─── Render markdown-like bold/bullet text ──────────────────────────────────
function RenderContent({ text }) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: 1.75, fontSize: '0.9rem', color: 'var(--text)' }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: '0.5rem' }} />;

        // Bold + content
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} style={{ color: 'var(--primary)' }}>{p.slice(2, -2)}</strong>
            : p
        );

        if (line.startsWith('• ') || line.startsWith('→ ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem', paddingLeft: '0.25rem' }}>
              <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }}>
                {line.startsWith('→') ? '→' : '•'}
              </span>
              <span>{rendered.map((r, j) => typeof r === 'string' ? r.replace(/^[•→] /, '') : r)}</span>
            </div>
          );
        }

        if (line.match(/^\d\./)) {
          return (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0, minWidth: '1.2rem' }}>
                {line.split('.')[0]}.
              </span>
              <span>{rendered.map((r, j) => typeof r === 'string' ? r.replace(/^\d+\.\s*/, '') : r)}</span>
            </div>
          );
        }

        if (line.startsWith('   ')) {
          return (
            <div key={i} style={{ paddingLeft: '1.5rem', marginBottom: '0.15rem', color: 'var(--text-muted)' }}>
              {rendered}
            </div>
          );
        }

        return <div key={i} style={{ marginBottom: '0.25rem' }}>{rendered}</div>;
      })}
    </div>
  );
}

// ─── Single Accordion Section ────────────────────────────────────────────────
function Section({ section, isOpen, onToggle }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: '0.5rem',
      transition: 'box-shadow 0.2s',
      boxShadow: isOpen ? '0 4px 16px rgba(var(--primary-rgb),0.12)' : 'none',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1rem',
          background: isOpen
            ? 'linear-gradient(135deg, rgba(var(--primary-rgb),0.10), var(--card-bg))'
            : 'var(--card-bg)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{section.emoji}</span>
        <span style={{
          flex: 1,
          fontWeight: 600,
          fontSize: '0.9rem',
          color: isOpen ? 'var(--primary)' : 'var(--text)',
        }}>
          {section.title}
        </span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          <ChevronDown size={16} />
        </span>
      </button>

      {isOpen && (
        <div style={{
          padding: '1rem 1.1rem 1.1rem',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <RenderContent text={section.content} />
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function WalkthroughModal({ onClose }) {
  const [openId, setOpenId] = useState(SECTIONS[0].id);
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = search.trim()
    ? SECTIONS.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase())
    )
    : SECTIONS;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .wt-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .wt-modal {
          background: var(--card-bg);
          border-radius: 16px;
          width: 100%; max-width: 680px;
          max-height: 88vh;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35);
          animation: slideUp 0.22s ease;
          border: 1px solid var(--border);
        }
      `}</style>

      <div className="wt-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="wt-modal">

          {/* Header */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.12), var(--card-bg))',
            borderRadius: '16px 16px 0 0',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-darker))',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(var(--primary-rgb),0.4)',
              }}>
                <BookOpen size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  📋 पूरा User Guide
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {SECTIONS.length} features · हर feature की पूरी जानकारी हिंदी में
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '0.4rem', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div style={{ marginTop: '0.85rem', position: 'relative' }}>
              <Search size={14} style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                pointerEvents: 'none',
              }} />
              <input
                ref={searchRef}
                value={search}
                onChange={e => { setSearch(e.target.value); setOpenId(null); }}
                placeholder="Search features... जैसे GST, invoice, backup"
                style={{
                  width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.1rem',
                  border: '1px solid var(--border)', borderRadius: 8,
                  background: 'var(--input-bg, var(--bg-secondary))',
                  color: 'var(--text)', fontSize: '0.85rem',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Sections list — scrollable */}
          <div style={{ overflowY: 'auto', padding: '0.85rem 1rem', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.9rem' }}>
                कोई result नहीं मिला। दूसरा keyword try करें।
              </div>
            ) : (
              filtered.map(section => (
                <Section
                  key={section.id}
                  section={section}
                  isOpen={openId === section.id}
                  onToggle={() => setOpenId(openId === section.id ? null : section.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            borderRadius: '0 0 16px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Press <kbd style={{ padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)', fontSize: '0.7rem' }}>Esc</kbd> to close
            </span>
            <a
              href="https://dicecodes.com/free-gst-software-documentation/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600,
              }}
            >
              📖 Full Online Docs →
            </a>
          </div>

        </div>
      </div>
    </>
  );
}


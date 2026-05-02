import { useState, useRef } from "react";
import { FileText, Download, Plus, Trash2, Calculator, User, Building, Mail, Phone } from "lucide-react";

type LineItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
};

const serviceTypes = [
  "Web Development",
  "Mobile App Development",
  "Desktop Application",
  "UI/UX Design",
  "Cloud Solutions",
  "Data Analytics",
  "Consulting",
  "Maintenance",
  "Other",
];

const platforms = [
  { id: "web", name: "Web (React, Vue, etc.)", multiplier: 1 },
  { id: "android", name: "Android (Kotlin/Java)", multiplier: 1.2 },
  { id: "ios", name: "iOS (Swift)", multiplier: 1.3 },
  { id: "desktop", name: "Desktop (Windows/Mac/Linux)", multiplier: 1.1 },
  { id: "cross", name: "Cross-platform (React Native/Flutter)", multiplier: 1.4 },
];

const featureOptions = [
  { id: "auth", name: "User Authentication", price: 1500 },
  { id: "payments", name: "Payment Integration", price: 2500 },
  { id: "api", name: "REST API Development", price: 3000 },
  { id: "database", name: "Database Design", price: 2000 },
  { id: "admin", name: "Admin Dashboard", price: 3500 },
  { id: "realtime", name: "Real-time Features", price: 4000 },
  { id: "analytics", name: "Analytics Dashboard", price: 2500 },
  { id: "notifications", name: "Push Notifications", price: 1500 },
  { id: "chat", name: "Chat/Messaging", price: 3000 },
  { id: "maps", name: "Maps Integration", price: 1000 },
  { id: "multilang", name: "Multi-language Support", price: 1500 },
  { id: "seo", name: "SEO Optimization", price: 1000 },
];

export default function Invoice() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  // Client Info
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Project Details
  const [serviceType, setServiceType] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [projectDescription, setProjectDescription] = useState("");
  const [basePrice, setBasePrice] = useState(5000);

  // Line Items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "Project Development", quantity: 1, unitPrice: 5000 },
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId]
    );
  };

  // Calculate totals
  const featuresTotal = selectedFeatures.reduce((sum, id) => {
    const feature = featureOptions.find((f) => f.id === id);
    return sum + (feature?.price || 0);
  }, 0);

  const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const subtotal = featuresTotal + lineItemsTotal;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const generateInvoice = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-info h1 { color: #0891b2; font-size: 28px; }
            .company-info p { color: #666; margin-top: 5px; }
            .invoice-details { text-align: right; }
            .invoice-details h2 { font-size: 32px; color: #333; }
            .invoice-details p { color: #666; margin-top: 5px; }
            .client-section { margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .client-section h3 { color: #0891b2; margin-bottom: 10px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #0891b2; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .items-table .number { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.total { font-size: 20px; font-weight: bold; border-top: 2px solid #0891b2; margin-top: 10px; padding-top: 10px; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Invoice Generator
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Generate Your Invoice
            </h1>
            <p className="text-lg text-blue-100">
              Select your requirements and download a professional invoice
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Invoice Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Invoice Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Client Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Company (Pty) Ltd"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="123 Street Name, City, 1234"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="">Select platform</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map((feature) => (
                      <label
                        key={feature.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedFeatures.includes(feature.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the project scope..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Line Items
                </h3>
                <button
                  onClick={addLineItem}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {lineItems.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Description"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      placeholder="R0"
                      className="w-28 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex justify-between items-center">
                <h3 className="text-white font-semibold">Invoice Preview</h3>
                <button
                  onClick={generateInvoice}
                  disabled={!clientName || !clientEmail || !serviceType}
                  className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>

              <div ref={invoiceRef} className="p-8 bg-white">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="company-info">
                    <h1 className="text-2xl font-bold text-cyan-600">TevrocSoft</h1>
                    <p className="text-gray-500 text-sm">Software Development & IT Solutions</p>
                    <p className="text-gray-500 text-sm">South Africa</p>
                  </div>
                  <div className="invoice-details">
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-gray-500">{invoiceNumber}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between mb-8 text-sm">
                  <div>
                    <p className="text-gray-500">Date:</p>
                    <p className="font-medium">{date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date:</p>
                    <p className="font-medium">{dueDate}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Bill To:</p>
                  <p className="font-semibold">{clientName || "Client Name"}</p>
                  {clientCompany && <p className="text-gray-600">{clientCompany}</p>}
                  {clientEmail && <p className="text-gray-600">{clientEmail}</p>}
                  {clientPhone && <p className="text-gray-600">{clientPhone}</p>}
                  {clientAddress && <p className="text-gray-600">{clientAddress}</p>}
                </div>

                {/* Project Info */}
                {(serviceType || selectedPlatform || projectDescription) && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Project:</p>
                    <p className="font-medium">{serviceType}</p>
                    {selectedPlatform && <p className="text-gray-600 text-sm">Platform: {platforms.find(p => p.id === selectedPlatform)?.name}</p>}
                    {projectDescription && <p className="text-gray-600 text-sm mt-1">{projectDescription}</p>}
                  </div>
                )}

                {/* Features */}
                {selectedFeatures.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Features Included:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((id) => {
                        const feature = featureOptions.find(f => f.id === id);
                        return feature ? (
                          <span key={id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {feature.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Items Table */}
                <table className="w-full mb-6">
                  <thead>
                    <tr className="bg-cyan-600 text-white">
                      <th className="text-left p-3 rounded-l-lg">Description</th>
                      <th className="text-center p-3">Qty</th>
                      <th className="text-right p-3">Unit Price</th>
                      <th className="text-right p-3 rounded-r-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-3">{item.description || "—"}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">R{item.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right">R{(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">R{lineItemsTotal.toLocaleString()}</span>
                    </div>
                    {featuresTotal > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Features:</span>
                        <span className="font-medium">R{featuresTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">VAT (15%):</span>
                      <span className="font-medium">R{vat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-cyan-600 mt-2">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-cyan-600">R{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                  <p>Thank you for your business!</p>
                  <p className="mt-1">Payment details will be sent upon invoice confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

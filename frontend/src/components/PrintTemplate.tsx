import React from 'react';

interface PrintTemplateProps {
    type: 'Invoice' | 'Quotation' | 'Bill';
    documentNumber: string;
    date: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
        total: number;
    }>;
    subtotal: number;
    discount: number;
    totalAmount: number;
    notes?: string;
    settings?: Record<string, any>;
    inWords?: string;
}

const PrintTemplate: React.FC<PrintTemplateProps> = ({
    type,
    documentNumber,
    date,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    items,
    subtotal,
    discount,
    totalAmount,
    notes,
    settings,
    inWords
}) => {
    return (
        <div className="print-template-container bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto p-[40px] text-black font-sans text-[12px] leading-relaxed shadow-lg print:shadow-none print:p-0 print:m-0 object-contain relative" id="print-document-content">
            {/* Header */}
            <header className="flex items-start justify-between border-b-2 border-gray-100 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    {settings?.company_logo_url ? (
                        <img src={settings.company_logo_url} alt="Logo" className="w-[80px] h-auto object-contain" />
                    ) : (
                        <div className="w-[80px] h-[80px] bg-[#F5A623] flex items-center justify-center text-white font-bold text-2xl rotate-45 rounded">
                            <div className="-rotate-45">VT</div>
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-black tracking-widest text-[#2B3A55] uppercase" style={{ WebkitTextStroke: '0.5px #2B3A55', color: 'transparent' }}>
                            {settings?.company_name || 'VOLTWAVE TECH'}
                        </h1>
                        <p className="text-xs tracking-[0.2em] text-[#d48e1d] font-bold mt-1 uppercase">Electrical & Electronics</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1 text-[11px]">
                    <h2 className="text-2xl font-bold text-gray-800 uppercase mb-2 border-b-2 border-gray-800 pb-1 inline-block">{type}</h2>
                    <p className="max-w-[200px]">{settings?.business_address || 'Shop no: 14, Star School, Kamarpara, Uttara, Dhaka'}</p>
                    <p><strong>Email:</strong> {settings?.business_email || 'voltwavetech1122@gmail.com'}</p>
                    <p><strong>Phone:</strong> {settings?.business_phone || '01822108496'}</p>
                </div>
            </header>

            {/* Meta Data Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
                <div className="grid grid-cols-[100px_10px_1fr] items-center text-[13px] font-medium">
                    <span className="font-bold text-gray-800">{type} No</span><span>:</span><span>{documentNumber}</span>
                    <span className="font-bold text-gray-800 mt-2">Client</span><span className="mt-2">:</span><span className="mt-2">{clientName}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr] items-center text-[13px] font-medium">
                    <span className="font-bold text-gray-800">Date</span><span>:</span><span>{new Date(date).toLocaleDateString('en-GB')}</span>
                    <span className="font-bold text-gray-800 mt-2">Address</span><span className="mt-2">:</span><span className="mt-2">{clientAddress || '-'}</span>
                    {clientPhone && <><span className="font-bold text-gray-800 mt-2">Phone</span><span className="mt-2">:</span><span className="mt-2">{clientPhone}</span></>}
                </div>
            </div>

            {/* Table */}
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border border-gray-300">
                            <th className="py-3 px-4 text-left border border-gray-300 font-bold w-[40px]">SL.</th>
                            <th className="py-3 px-4 text-left border border-gray-300 font-bold">Description</th>
                            <th className="py-3 px-4 text-center border border-gray-300 font-bold w-[80px]">Qty</th>
                            <th className="py-3 px-4 text-right border border-gray-300 font-bold w-[100px]">Rate</th>
                            <th className="py-3 px-4 text-right border border-gray-300 font-bold w-[120px]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} className="border-b border-l border-r border-gray-300">
                                <td className="py-3 px-4 text-left border-r border-gray-300">{idx + 1}</td>
                                <td className="py-3 px-4 text-left border-r border-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: item.description || '' }} className="prose prose-sm max-w-none text-[12px]" />
                                </td>
                                <td className="py-3 px-4 text-center border-r border-gray-300">{item.quantity}</td>
                                <td className="py-3 px-4 text-right border-r border-gray-300">{item.price.toLocaleString()}/-</td>
                                <td className="py-3 px-4 text-right">{item.total.toLocaleString()}/-</td>
                            </tr>
                        ))}
                        {/* Filler Space - To push totals to bottom if items are few */}
                        {[...Array(Math.max(0, 5 - items.length))].map((_, i) => (
                            <tr key={`fill-${i}`} className="border-l border-r border-gray-300">
                                <td className="py-4 px-4 text-left border-r border-gray-300 text-transparent">-</td>
                                <td className="py-4 px-4 text-left border-r border-gray-300"></td>
                                <td className="py-4 px-4 text-center border-r border-gray-300"></td>
                                <td className="py-4 px-4 text-right border-r border-gray-300"></td>
                                <td className="py-4 px-4 text-right"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="border border-gray-300 border-t-0 flex bg-gray-50/50">
                    <div className="flex-1 py-3 px-4 border-r border-gray-300 font-bold text-[13px] flex items-center">
                        In words: {inWords || '...'}
                    </div>
                    <div className="w-[100px] py-3 px-4 border-r border-gray-300 font-bold text-right flex items-center justify-end bg-gray-50">
                        Total=
                    </div>
                    <div className="w-[120px] py-3 px-4 font-bold text-right bg-gray-50 text-[14px]">
                        {totalAmount.toLocaleString()}/-
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {notes && (
                <div className="mt-8 mb-16">
                    <h4 className="font-bold text-gray-800 mb-2">Terms & Conditions:</h4>
                    <div className="text-[12px] text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: notes }} />
                </div>
            )}

            {/* Footer / Signatures Container */}
            <div className="absolute bottom-12 left-[40px] right-[40px] flex justify-between items-end">
                <div className="text-center pt-4 border-t border-gray-400 min-w-[200px]">
                    <p className="font-bold text-gray-800">Buyer's Signature</p>
                </div>
                <div className="text-center w-[200px] flex flex-col items-center">
                    <div className="h-[60px] w-full flex justify-center items-center relative mb-2">
                        {settings?.signature_image_url ? (
                            <img src={settings.signature_image_url} alt="Signature" className="h-full object-contain" />
                        ) : (
                            <div className="text-blue-900 font-signature text-2xl italic signature-font transform -rotate-12 absolute z-10 opacity-70">Robinn</div>
                        )}
                        <div className="absolute inset-0 bg-[url('https://cdn-icons-png.flaticon.com/512/5770/5770546.png')] bg-no-repeat bg-center opacity-5 bg-contain pointer-events-none" />
                    </div>
                    <div className="border-t border-gray-400 w-full pt-2">
                        <p className="font-bold text-gray-800 uppercase mb-0.5">{settings?.proprietor_name || 'Md. Ariful Huq'}</p>
                        <p className="text-xs text-gray-600">Proprietor</p>
                    </div>
                </div>
            </div>

            {/* Watermark Logo */}
            <div className="absolute inset-0 z-[-1] flex items-center justify-center opacity-[0.03] pointer-events-none">
                <div className="w-[500px] h-[500px] bg-[#F5A623] flex items-center justify-center text-black font-bold text-[180px] rotate-45 rounded-3xl">
                    <div className="-rotate-45">VT</div>
                </div>
            </div>
        </div>
    );
};

export default PrintTemplate;

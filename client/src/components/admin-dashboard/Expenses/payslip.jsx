import React, { useState, useEffect } from 'react';
import { X, Download, Printer } from 'lucide-react';

const PayslipModal = ({ expenseId, onClose }) => {
  const [bankStatement, setBankStatement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBankStatement();
  }, [expenseId]);

  const fetchBankStatement = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://vedic-backend-neon.vercel.app/api/expenses/${expenseId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank statement');
      }

      const data = await response.json();
      if (!data.bank_statement) {
        throw new Error('No bank statement available');
      }

      setBankStatement(data.bank_statement);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!bankStatement) return;

    // Create blob from base64
    const byteCharacters = atob(bankStatement.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bank_statement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!bankStatement) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Bank Statement</title></head>
        <body>
          <embed width="100%" height="100%" src="${bankStatement}" type="application/pdf" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Bank Statement</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : bankStatement ? (
            <embed 
              src={bankStatement} 
              type="application/pdf"
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No bank statement available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
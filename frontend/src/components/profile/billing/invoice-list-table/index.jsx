import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import downloadIcon from '@/../public/images/icons/download.svg';
import checkIcon from '@/../public/images/icons/integrity.png';
import Button from '@/components/button';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { useQuery } from '@tanstack/react-query';

const InvoiceListTable = () => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: invoices = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await get(API_ENDPOINTS.INVOICES, true);
      const data = await response?.data;
      const invoices = data.invoices || [];
      return invoices;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error('Failed to load invoices. Please try again later.');
    }
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(invoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      window.open(invoice.pdf_url, '_blank');
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleDownloadSelected = () => {
    if (selectedInvoices.length === 0) {
      toast.warning('Please select at least one invoice');
      return;
    }

    const selectedInvoiceData = invoices.filter(inv => 
      selectedInvoices.includes(inv.id)
    );

    // Open all invoices - Stripe will auto-trigger downloads
    selectedInvoiceData.forEach(invoice => {
      window.open(invoice.pdf_url, '_blank');
    });

    toast.success(`Downloading ${selectedInvoices.length} invoice(s)...`);
    setSelectedInvoices([]);
  };

  const isAllSelected = invoices.length > 0 && selectedInvoices.length === invoices.length;
  const isInvoiceSelected = (invoiceId) => selectedInvoices.includes(invoiceId);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">Billing History</p>
        <Button 
          type="primary" size="lg" 
          className='px-4 py-3'
          onClick={handleDownloadSelected}
          disabled={isDownloading || selectedInvoices.length === 0}
        >
          <Image
            src={downloadIcon}
            className=''
            alt='download'
            width={15}
            height={15}
          />
          Download
        </Button>
      </div>

      <div className="billing-table">
      <div className="billing-table__header">
        <div className="billing-table__header-cell billing-table__header-cell--checkbox">
          <input 
            type="checkbox" 
            checked={isAllSelected}
            onChange={handleSelectAll}
            disabled={isLoading || invoices.length === 0}
          />
        </div>
        <div className="billing-table__header-cell billing-table__header-cell--invoice">
          Invoice 
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 3L6 9M6 9L9 6M6 9L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="billing-table__header-cell">Amount</div>
        <div className="billing-table__header-cell">Date</div>
        <div className="billing-table__header-cell">Status</div>
        <div className="billing-table__header-cell billing-table__header-cell--download"></div>
      </div>

      <div className="billing-table__body">
        {isLoading && (
          <div className="p-8 text-center text-gray-500">Loading invoices...</div>
        )}
        {!isLoading && isError && (
          <div className="p-8 text-center text-red-500">Failed to load invoices. Please try again later.</div>
        )}
        {!isLoading && !isError && (!invoices || invoices.length === 0) && (
          <div className="p-8 text-center text-gray-500">No invoices found.</div>
        )}
        {!isLoading && !isError && invoices && invoices.length > 0 && (
          invoices.map((invoice) => (
            <div key={invoice.id} className="billing-table__row">
              <div className="billing-table__cell billing-table__cell--checkbox">
                <input 
                  type="checkbox"
                  checked={isInvoiceSelected(invoice.id)}
                  onChange={() => handleSelectInvoice(invoice.id)}
                />
              </div>
              <div className="billing-table__cell billing-table__cell--invoice">
                {/* Invoice #{invoice.id.slice(-8)} */}
                <div>Invoice #{invoice.id.slice(-8)}</div>
                <div className="text-xs text-gray-500">Sub: {invoice.subscription.slice(-8)}</div>
              </div>
              <div className="billing-table__cell">
                USD ${invoice.amount_usd.toFixed(2)}
              </div>
              <div className="billing-table__cell">
                {invoice.date}
              </div>
              <div className="billing-table__cell">
                <span className={`billing-table__badge billing-table__badge--${invoice.status.toLowerCase()}`}>
                  <div className="billing-table__badge-icon button--check button--icon-color">
                    <Image
                      src={checkIcon}
                      alt="download"
                      width={16}
                      height={16}
                      className=""
                    />
                  </div>
                  {invoice.status}
                </span>
              </div>
              <div className="billing-table__cell billing-table__cell--download">
                <button 
                    className="billing-table__download-btn"
                    onClick={() => handleDownloadInvoice(invoice)}
                    title="Download invoice"
                >
                  <Image
                    src={downloadIcon}
                    alt="download"
                    width={16}
                    height={16}
                    className="icon-gray"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
    </>
  );
}

export default InvoiceListTable;
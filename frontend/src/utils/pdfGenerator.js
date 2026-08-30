export const printPage = async (fileName = 'HIPAA_Compliance_Report') => {
  try {
    const originalTitle = document.title;
    document.title = fileName;
    
    if (window.innerWidth < 1200) {
      // For mobile/tablet devices, ensure viewport is properly sized
      const viewport = document.querySelector('meta[name="viewport"]');
      const originalViewport = viewport ? viewport.content : '';
      
      if (viewport) {
        viewport.content = 'width=1200, initial-scale=1.0, user-scalable=yes';
      }
      
      // Force layout recalculation
      document.body.style.minWidth = '1200px';
      document.body.style.transform = 'scale(1)';
      
      // Trigger chart resize
      window.dispatchEvent(new Event('beforeprint'));
      
      // Wait for reflow
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Print
      window.print();
      
      // Restore viewport and body styles
      if (viewport) {
        viewport.content = originalViewport;
      }
      document.body.style.minWidth = '';
      document.body.style.transform = '';
      
      window.dispatchEvent(new Event('afterprint'));
    } else {
      // Desktop printing - standard approach
      window.dispatchEvent(new Event('beforeprint'));
      // await new Promise(resolve => setTimeout(resolve, 100));
      window.print();
      window.dispatchEvent(new Event('afterprint'));
    }
    
    document.title = originalTitle;
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error printing page:', error);
    }
    throw error;
  }
};

export const generateComplianceReportPDF = async () => {
  const fileName = `HIPAA_Compliance_Report_${new Date().toISOString().split('T')[0]}`;
  return printPage(fileName);
};
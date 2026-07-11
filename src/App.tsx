import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useEvents } from './features/events/hooks/useEvents';
import { useBookings } from './features/bookings/hooks/useBookings';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatsGrid } from './features/bookings/components/StatsGrid';
import { BookingFormCard } from './features/bookings/components/BookingFormCard';
import { BookingsListTable } from './features/bookings/components/BookingsListTable';
import { EventsListTable } from './features/events/components/EventsListTable';
import { EventsStatsGrid } from './features/events/components/EventsStatsGrid';
import { useTranslation } from './context/LanguageContext';
import { useEventsFiltered } from './features/events/hooks/useEventsFiltered';
import { apiService } from './services/api';
import './index.css';

type ActiveTab = 'dashboard' | 'events';

function App() {
  const { t, language } = useTranslation();
  const { events, refreshEvents } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const {
    bookings,
    selectedEventId,
    setSelectedEventId,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    addLocalBooking,
  } = useBookings();

  const {
    events: filteredEvents,
    search: eventSearch,
    setSearch: setEventSearch,
    priceType: eventPriceType,
    setPriceType: setEventPriceType,
    status: eventStatus,
    setStatus: setEventStatus,
    startDate: eventStartDate,
    setStartDate: setEventStartDate,
    endDate: eventEndDate,
    setEndDate: setEventEndDate,
    currentPage: eventCurrentPage,
    setCurrentPage: setEventCurrentPage,
    totalPages: eventTotalPages,
    loading: filteredEventsLoading,
  } = useEventsFiltered();

  const [isExporting, setIsExporting] = useState(false);

  const handleBookingCreated = (newBooking: any) => {
    addLocalBooking(newBooking);
    refreshEvents();
    setIsModalOpen(false); 
    toast.success(t('form.success'));
  };

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading(language === 'bn' ? 'পিডিএফ রিপোর্ট তৈরি হচ্ছে...' : 'Generating PDF report...');

    try {
      
      const data = await apiService.getBookings({
        event_id: selectedEventId || undefined,
        status: selectedStatus || undefined,
        search: search || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page: 1,
        limit: 10000, 
      });

      const bookingsToExport = data.items || [];
      if (bookingsToExport.length === 0) {
        toast.error(language === 'bn' ? 'এক্সপোর্ট করার মতো কোনো বুকিং নেই!' : 'No bookings found to export!', { id: toastId });
        setIsExporting(false);
        return;
      }

      
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();

      
      doc.setFontSize(18);
      doc.text('WeNexus Event Booking Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Bookings: ${bookingsToExport.length}`, 14, 34);

      
      const tableColumn = ["Reference ID", "Event Name", "Customer Name", "Customer Email", "Seats", "Status"];
      const tableRows: any[] = [];

      bookingsToExport.forEach((booking: any) => {
        const eventName = events.find(ev => ev.id === booking.eventId)?.name || booking.eventId;
        const bookingData = [
          booking.id,
          eventName,
          booking.customerName,
          booking.customerEmail,
          booking.seats.toString(),
          booking.status
        ];
        tableRows.push(bookingData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [26, 92, 56] }, 
        styles: { fontSize: 9 },
      });

      doc.save(`bookings-report-${Date.now()}.pdf`);
      toast.success(language === 'bn' ? 'পিডিএফ সফলভাবে ডাউনলোড হয়েছে!' : 'PDF downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error(language === 'bn' ? 'পিডিএফ তৈরি করতে ব্যর্থ হয়েছে!' : 'Failed to export PDF!', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="app-layout">
      <Toaster position="top-center" richColors closeButton />

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar
        activeBookingCount={pendingCount}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="page-content animate-fade">
          {activeTab === 'dashboard' && (
            <>
              
              <div className="notice-bar animate-fade" style={{ marginBottom: '16px', marginTop: '0px' }}>
                <div className="notice-badge">
                  <span className="notice-badge-text">
                    {language === 'bn' ? 'বিজ্ঞপ্তি' : 'NOTICE'}
                  </span>
                </div>
                <div className="notice-marquee-container">
                  <div className="notice-marquee-text">
                    {language === 'bn'
                      ? 'বুকিং করার পর কয়েক সেকেন্ড অপেক্ষা করুন। প্রসেসিং সম্পন্ন হলে বুকিং স্ট্যাটাস স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                      : 'Please wait a few seconds after creating a booking. The booking status will update automatically once processing is complete.'}
                  </div>
                </div>
              </div>

              
              <div className="page-header">
                <div>
                  <h1 className="page-title">{t('sidebar.bookings')}</h1>
                  <p className="page-subtitle">{t('dashboard.subtitle')}</p>
                </div>
                <div className="page-header-actions">
                  <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {t('dashboard.addBooking')}
                  </button>
                  <button className="btn btn-outline" onClick={handleExportPDF} disabled={isExporting}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {isExporting ? (language === 'bn' ? 'এক্সপোর্ট হচ্ছে...' : 'Exporting...') : t('dashboard.exportData')}
                  </button>
                </div>
              </div>

              
              <StatsGrid bookings={bookings} events={events} />

              
              <BookingsListTable
                bookings={bookings}
                events={events}
                selectedEventId={selectedEventId}
                setSelectedEventId={setSelectedEventId}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                search={search}
                setSearch={setSearch}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                isLoading={loading}
              />
            </>
          )}

          {activeTab === 'events' && (
            <>
              
              <div className="page-header">
                <div>
                  <h1 className="page-title">{t('events.pageTitle')}</h1>
                  <p className="page-subtitle">{t('events.pageSubtitle')}</p>
                </div>
              </div>

              
              <EventsStatsGrid events={events} />

              
              <EventsListTable
                events={filteredEvents}
                search={eventSearch}
                setSearch={setEventSearch}
                priceType={eventPriceType}
                setPriceType={setEventPriceType}
                status={eventStatus}
                setStatus={setEventStatus}
                startDate={eventStartDate}
                setStartDate={setEventStartDate}
                endDate={eventEndDate}
                setEndDate={setEventEndDate}
                currentPage={eventCurrentPage}
                totalPages={eventTotalPages}
                setCurrentPage={setEventCurrentPage}
                isLoading={filteredEventsLoading}
              />
            </>
          )}
        </div>
      </div>

      
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{t('form.title')}</span>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <BookingFormCard events={events} onBookingCreated={handleBookingCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

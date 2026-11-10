import React from 'react';
import { RouteResQProvider, useRouteResQ } from './context/RouteResQContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SimulationBar } from './components/SimulationBar';
import { OneTapSOSModal } from './components/OneTapSOSModal';
import { VoiceSOSModal } from './components/VoiceSOSModal';
import { ReportAccidentModal } from './components/ReportAccidentModal';
import { AmbulanceDispatchNotification } from './components/AmbulanceDispatchNotification';
import { LiveAmbulanceTrackerWidget } from './components/LiveAmbulanceTrackerWidget';
import IMAGES from './assets/imageAssets';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { LiveOperationsPage } from './pages/LiveOperationsPage';
import { EmergencyIntelligencePage } from './pages/EmergencyIntelligencePage';
import { SmartDispatchPage } from './pages/SmartDispatchPage';
import { RecoveryOfflinePage } from './pages/RecoveryOfflinePage';
import { RemoteGuardianPage } from './pages/RemoteGuardianPage';
import { TransitOptimizationPage } from './pages/TransitOptimizationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useRouteResQ();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'live_ops':
        return <LiveOperationsPage />;
      case 'intelligence':
        return <EmergencyIntelligencePage />;
      case 'dispatch':
        return <SmartDispatchPage />;
      case 'recovery':
        return <RecoveryOfflinePage />;
      case 'remote_guardian':
        return <RemoteGuardianPage />;
      case 'transit':
        return <TransitOptimizationPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB] text-[#192F4D] relative selection:bg-[#2878E8] selection:text-white">
      {/* Atmospheric Shadowy Ambulance Background Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.045] mix-blend-multiply bg-cover bg-center filter grayscale contrast-125 transition-opacity"
        style={{
          backgroundImage: `url(${IMAGES.heroAmbulance})`,
        }}
      />
      {/* Soft Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial from-transparent via-[#F3F6FB]/60 to-[#F3F6FB]" />

      {/* Top Navbar across entire app */}
      <Navbar />

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        <div className="relative z-10 flex-1">
          <LandingPage />
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10">
          {/* 1-Click Incident Scenario Simulation Bar */}
          <SimulationBar />

          {/* Operational Viewport with Navy Sidebar */}
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F3F6FB]/85 backdrop-blur-[2px]">
              <div className="max-w-7xl mx-auto pb-12">
                {renderActiveView()}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Persistent One-Tap Emergency SOS Modal */}
      <OneTapSOSModal />

      {/* Dedicated Multi-Language Voice SOS Modal */}
      <VoiceSOSModal />

      {/* Citizen / Authority Accident Photo Report Modal */}
      <ReportAccidentModal />

      {/* Ambulance Dispatch Notification Banner */}
      <AmbulanceDispatchNotification />

      {/* Live Ambulance Location & Telemetry Tracker Widget */}
      <LiveAmbulanceTrackerWidget />
    </div>
  );
};

export default function App() {
  return (
    <RouteResQProvider>
      <AppContent />
    </RouteResQProvider>
  );
}

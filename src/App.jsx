import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuctionProvider } from './stores/auctionStore';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AuctionGallery from './pages/AuctionGallery';

import AnalyticsEDA from './pages/AnalyticsEDA';
import DataPreview from './pages/DataPreview';
import ProtocolSpecs from './pages/ProtocolSpecs';

export default function App() {
  return (
    <BrowserRouter>
      <AuctionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/gallery" element={<AuctionGallery />} />
            <Route path="/analytics" element={<AnalyticsEDA />} />
            <Route path="/data-preview" element={<DataPreview />} />
            <Route path="/docs" element={<ProtocolSpecs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuctionProvider>
    </BrowserRouter>
  );
}

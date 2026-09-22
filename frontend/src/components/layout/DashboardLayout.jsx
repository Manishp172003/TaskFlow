import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '../common/CommandPalette';
import { cn } from '../../utils/helpers';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('taskflow_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('taskflow_sidebar_collapsed', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-page text-textPrimary flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area - dynamically adjusts padding based on collapse state */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={headerSearch}
          onSearchChange={setHeaderSearch}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto page-enter">
          <Outlet context={{ headerSearch, openCommandPalette: () => setCommandPaletteOpen(true) }} />
        </main>
      </div>

      {/* Global Command Palette Spotlight */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Server, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api');
  const [jwtExpiry, setJwtExpiry] = useState('24');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
          System Settings
        </h1>
        <p className="text-sm text-textSecondary mt-0.5">
          Configure system parameters, API endpoints, and organizational defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend REST API Configuration */}
        <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-textPrimary font-semibold">
            <Server className="w-5 h-5 text-primary" />
            <h3>Spring Boot Backend Connection</h3>
          </div>
          <p className="text-xs text-textSecondary">
            Base URL for all REST endpoints when the Spring Boot backend server is running.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Backend REST API Base URL"
              name="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080/api"
            />

            <Input
              label="JWT Expiration Window (Hours)"
              name="jwtExpiry"
              type="number"
              value={jwtExpiry}
              onChange={(e) => setJwtExpiry(e.target.value)}
            />
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-textPrimary font-semibold">
            <Shield className="w-5 h-5 text-primary" />
            <h3>Role & Permissions Policy</h3>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-0.5 rounded border-borderSubtle text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-textPrimary block">
                  Notify assigned user upon task status changes
                </span>
                <span className="text-xs text-textSecondary">
                  Sends automated notifications whenever task states transition between Pending, In Progress, and Completed.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                className="mt-0.5 rounded border-borderSubtle text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-textPrimary block">
                  Allow team members to claim unassigned tasks
                </span>
                <span className="text-xs text-textSecondary">
                  Users can self-assign tasks from the backlog if enabled.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-status-success font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved
            </span>
          )}
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

import { useSettingsStore } from '../stores/settingsStore';

export const SettingsPage = () => {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const liveValidation = useSettingsStore((s) => s.liveValidation);
  const toggle = useSettingsStore((s) => s.toggle);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <label className="block">
        Theme
        <select className="ml-2 border rounded" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </label>
      <label className="flex gap-2">
        <input type="checkbox" checked={liveValidation} onChange={() => toggle('liveValidation')} />
        Live Validation
      </label>
    </main>
  );
};

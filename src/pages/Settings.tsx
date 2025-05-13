import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/ThemeProvider';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    faceDetection: false,
    dataCollection: true,
    darkMode: false,
    privacyMode: true
  });
  
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // Apply dark mode setting
      if (parsedSettings.darkMode) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [setTheme]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => {
      const newValue = !prev[setting];
      
      // Handle dark mode toggle
      if (setting === 'darkMode') {
        setTheme(newValue ? 'dark' : 'light');
      }
      
      return {
        ...prev,
        [setting]: newValue
      };
    });

    toast({
      title: "Setting Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} has been ${settings[setting] ? 'disabled' : 'enabled'}.`
    });
  };

  const handleExportData = () => {
    // Gather all data from localStorage
    const journalEntries = localStorage.getItem('journal_entries') || '[]';
    const moodHistory = localStorage.getItem('mood_history') || '[]';
    const appSettings = localStorage.getItem('app_settings') || '{}';
    
    // Combine into a single object
    const allData = {
      journal_entries: JSON.parse(journalEntries),
      mood_history: JSON.parse(moodHistory),
      app_settings: JSON.parse(appSettings)
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(allData, null, 2);
    
    // Create a blob and generate download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `mindfulme_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Data Export",
      description: "Your data export has been prepared and downloaded."
    });
  };

  const handleDeleteData = () => {
    // In a real app, this would show a confirmation dialog first
    localStorage.removeItem('journal_entries');
    localStorage.removeItem('mood_history');
    
    // Keep settings but reset to defaults
    const defaultSettings = {
      notifications: true,
      faceDetection: false,
      dataCollection: true, 
      darkMode: false,
      privacyMode: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('app_settings', JSON.stringify(defaultSettings));
    
    // Set theme back to light if dark mode was enabled
    setTheme('light');
    
    toast({
      title: "Data Deleted",
      description: "All your data has been permanently deleted.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your app preferences and privacy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders and updates</p>
              </div>
              <Switch 
                checked={settings.notifications} 
                onCheckedChange={() => handleSettingChange('notifications')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Facial Emotion Detection</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use camera for emotion analysis (processing done on-device)</p>
              </div>
              <Switch 
                checked={settings.faceDetection} 
                onCheckedChange={() => handleSettingChange('faceDetection')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anonymous Data Collection</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Help improve the app by sharing anonymous usage data</p>
              </div>
              <Switch 
                checked={settings.dataCollection} 
                onCheckedChange={() => handleSettingChange('dataCollection')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Privacy Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hide sensitive information when others might see your screen</p>
              </div>
              <Switch 
                checked={settings.privacyMode} 
                onCheckedChange={() => handleSettingChange('privacyMode')}
              />
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="font-medium">Your Data</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={handleExportData}>
                  Export My Data
                </Button>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800 dark:text-red-400" onClick={handleDeleteData}>
                  Delete All My Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
            </div>
            <Switch 
              checked={settings.darkMode} 
              onCheckedChange={() => handleSettingChange('darkMode')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About MindfulMe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <div>
              <p className="font-medium">MindfulMe: Your Pocket Companion for Mental Wellness</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Nurturing Your Mind, One Moment at a Time.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="link" className="p-0 text-mindful-primary">
                Terms of Service
              </Button>
              <span className="mx-2 text-gray-300">|</span>
              <Button variant="link" className="p-0 text-mindful-primary">
                Privacy Policy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

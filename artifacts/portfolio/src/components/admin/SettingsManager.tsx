import React, { useState, useEffect } from 'react';
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey, useRequestUploadUrl } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';

export function SettingsManager() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const requestUrl = useRequestUploadUrl();

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    instagram: '',
    whatsapp: '',
    facebook: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutText: '',
    logoUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone || '',
        email: settings.email || '',
        instagram: settings.instagram || '',
        whatsapp: settings.whatsapp || '',
        facebook: settings.facebook || '',
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        aboutText: settings.aboutText || '',
        logoUrl: settings.logoUrl || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type }
      });
      
      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      
      setFormData(prev => ({ ...prev, logoUrl: objectPath }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      }
    });
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-card rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">Manage your contact details and public content.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6 md:col-span-2 pb-6 border-b border-border/50">
            <h3 className="text-xl font-bold font-serif text-primary">Content</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <input name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" />
              <p className="text-xs text-muted-foreground">The main headline on your homepage. Use "Designer" to add the red highlight effect.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={2} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">About Text</label>
              <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} rows={5} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <h3 className="text-xl font-bold font-serif text-primary">Contact & Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" placeholder="+355 69..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" placeholder="hello@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <input name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp URL</label>
                <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" placeholder="https://wa.me/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook URL</label>
                <input name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2.5 focus:border-primary outline-none transition-colors" placeholder="https://facebook.com/..." />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            {updateSettings.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
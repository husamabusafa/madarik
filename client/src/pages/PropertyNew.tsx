import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useI18n } from '../contexts/I18nContext';
import { CREATE_LISTING } from '../lib/graphql/mutations';

const defaultTranslation = { title: '', description: '', slug: '', displayAddressLine: '', areaName: '' };

const PropertyNew: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useI18n() as any;

  const [form, setForm] = useState({
    addressLine: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    listingType: 'SALE',
    propertyType: 'APARTMENT',
    price: '',
    currency: 'USD',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    areaValue: '',
    areaUnit: 'SQM',
    yearBuilt: '',
    primaryPhotoUrl: '',
    zoomHint: '',
  });

  const [trEN, setTrEN] = useState({ ...defaultTranslation });
  const [trAR, setTrAR] = useState({ ...defaultTranslation });
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'translations' | 'media'>('basic');
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createListing, { loading, error }] = useMutation(CREATE_LISTING, {
    onCompleted: () => {
      navigate('/properties');
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Basic required validation
    if (!form.addressLine || !form.city || !form.country || !form.lat || !form.lng) return;
    if (!trEN.title || !trEN.slug || !trEN.description) return;
    if (!trAR.title || !trAR.slug || !trAR.description) return;

    const toFloat = (v: string) => (v === '' ? null : parseFloat(v));

    await createListing({
      variables: {
        input: {
          addressLine: form.addressLine,
          city: form.city,
          country: form.country,
          lat: form.lat,
          lng: form.lng,
          listingType: form.listingType,
          propertyType: form.propertyType,
          price: form.price === '' ? null : form.price,
          currency: form.currency || null,
          bedrooms: toFloat(form.bedrooms) ?? undefined,
          bathrooms: toFloat(form.bathrooms) ?? undefined,
          parking: toFloat(form.parking) ?? undefined,
          areaValue: form.areaValue === '' ? null : form.areaValue,
          areaUnit: form.areaUnit || null,
          yearBuilt: toFloat(form.yearBuilt) ?? undefined,
          primaryPhotoUrl: form.primaryPhotoUrl || null,
          zoomHint: toFloat(form.zoomHint) ?? undefined,
          translations: [
            {
              locale: 'EN',
              title: trEN.title,
              description: trEN.description,
              slug: trEN.slug,
              displayAddressLine: trEN.displayAddressLine || null,
              areaName: trEN.areaName || null,
            },
            {
              locale: 'AR',
              title: trAR.title,
              description: trAR.description,
              slug: trAR.slug,
              displayAddressLine: trAR.displayAddressLine || null,
              areaName: trAR.areaName || null,
            },
          ],
        },
      },
    });
  };

  // Helpers
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[`~!@#$%^&*()_+\-={}|\[\]\\:";'<>?,./]+/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleEnTitleChange = (v: string) => {
    setTrEN((prev) => {
      const next = { ...prev, title: v };
      if (!prev.slug || prev.slug.trim() === '') next.slug = slugify(v);
      return next;
    });
  };
  const handleArTitleChange = (v: string) => {
    setTrAR((prev) => {
      const next = { ...prev, title: v };
      if (!prev.slug || prev.slug.trim() === '') next.slug = slugify(v);
      return next;
    });
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setForm((p) => ({ ...p, primaryPhotoUrl: url }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{t('properties.addProperty') || 'Add Property'}</h1>
          <p className="mt-2 text-slate-400">{t('properties.addPropertySubtitle') || 'Create a new listing'}</p>
        </div>
        <div>
          <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
            {t('properties.backToList') || 'Back to Properties'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button type="button" onClick={() => setActiveTab('basic')} className={`px-4 py-2 text-sm ${activeTab === 'basic' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'}`}>{t('properties.tab.basic') || 'Basic'}</button>
        <button type="button" onClick={() => setActiveTab('details')} className={`px-4 py-2 text-sm ${activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'}`}>{t('properties.tab.details') || 'Details'}</button>
        <button type="button" onClick={() => setActiveTab('translations')} className={`px-4 py-2 text-sm ${activeTab === 'translations' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'}`}>{t('properties.tab.translations') || 'Translations'}</button>
        <button type="button" onClick={() => setActiveTab('media')} className={`px-4 py-2 text-sm ${activeTab === 'media' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'}`}>{t('properties.tab.media') || 'Media'}</button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {activeTab === 'basic' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">{t('properties.basicInfo') || 'Basic Info'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.addressLine') || 'Address Line'}</label>
              <Input name="addressLine" value={form.addressLine} onChange={onChange} required />
              {submitted && !form.addressLine && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.city') || 'City'}</label>
              <Input name="city" value={form.city} onChange={onChange} required />
              {submitted && !form.city && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.country') || 'Country'}</label>
              <Input name="country" value={form.country} onChange={onChange} required />
              {submitted && !form.country && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('properties.form.latitude') || 'Latitude'}</label>
                <Input name="lat" value={form.lat} onChange={onChange} required />
                {submitted && !form.lat && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('properties.form.longitude') || 'Longitude'}</label>
                <Input name="lng" value={form.lng} onChange={onChange} required />
                {submitted && !form.lng && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.listingType') || 'Listing Type'}</label>
              <select name="listingType" value={form.listingType} onChange={onChange} className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg">
                <option value="SALE">SALE</option>
                <option value="RENT">RENT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.propertyType') || 'Property Type'}</label>
              <select name="propertyType" value={form.propertyType} onChange={onChange} className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg">
                <option>APARTMENT</option>
                <option>HOUSE</option>
                <option>VILLA</option>
                <option>TOWNHOUSE</option>
                <option>COMMERCIAL</option>
                <option>OFFICE</option>
                <option>RETAIL</option>
                <option>INDUSTRIAL</option>
                <option>LAND</option>
                <option>OTHER</option>
              </select>
            </div>
          </div>
        </Card>
        )}

        {activeTab === 'details' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">{t('properties.details') || 'Details'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.price') || 'Price'}</label>
              <Input name="price" value={form.price} onChange={onChange} placeholder="e.g. 250000" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.currency') || 'Currency'}</label>
              <Input name="currency" value={form.currency} onChange={onChange} placeholder="USD" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.yearBuilt') || 'Year Built'}</label>
              <Input name="yearBuilt" value={form.yearBuilt} onChange={onChange} placeholder="e.g. 2008" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.bedrooms') || 'Bedrooms'}</label>
              <Input name="bedrooms" value={form.bedrooms} onChange={onChange} placeholder="e.g. 3" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.bathrooms') || 'Bathrooms'}</label>
              <Input name="bathrooms" value={form.bathrooms} onChange={onChange} placeholder="e.g. 2" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.parking') || 'Parking'}</label>
              <Input name="parking" value={form.parking} onChange={onChange} placeholder="e.g. 1" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.areaValue') || 'Area Value'}</label>
              <Input name="areaValue" value={form.areaValue} onChange={onChange} placeholder="e.g. 120" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.areaUnit') || 'Area Unit'}</label>
              <select name="areaUnit" value={form.areaUnit} onChange={onChange} className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg">
                <option>SQM</option>
                <option>SQFT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.primaryPhotoUrl') || 'Primary Photo URL'}</label>
              <Input name="primaryPhotoUrl" value={form.primaryPhotoUrl} onChange={onChange} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('properties.form.zoomHint') || 'Zoom Hint'}</label>
              <Input name="zoomHint" value={form.zoomHint} onChange={onChange} placeholder="e.g. 14" />
            </div>
          </div>
        </Card>
        )}

        {activeTab === 'translations' && (
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-slate-100">{t('properties.translations') || 'Translations'}</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : ''}`}>
            <div>
              <h3 className="font-medium text-slate-200 mb-3">{t('properties.form.english') || 'English'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.title') || 'Title'}</label>
                  <Input value={trEN.title} onChange={(e) => handleEnTitleChange(e.target.value)} required />
                  {submitted && !trEN.title && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.slug') || 'Slug'}</label>
                  <Input value={trEN.slug} onChange={(e) => setTrEN({ ...trEN, slug: e.target.value })} required />
                  {submitted && !trEN.slug && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.displayAddress') || 'Display Address'}</label>
                  <Input value={trEN.displayAddressLine} onChange={(e) => setTrEN({ ...trEN, displayAddressLine: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.areaName') || 'Area Name'}</label>
                  <Input value={trEN.areaName} onChange={(e) => setTrEN({ ...trEN, areaName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.description') || 'Description'}</label>
                  <textarea className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg" rows={5} value={trEN.description} onChange={(e) => setTrEN({ ...trEN, description: e.target.value })} />
                  {submitted && !trEN.description && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-200 mb-3">{t('properties.form.arabic') || 'Arabic'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.title') || 'Title'}</label>
                  <Input value={trAR.title} onChange={(e) => handleArTitleChange(e.target.value)} required />
                  {submitted && !trAR.title && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.slug') || 'Slug'}</label>
                  <Input value={trAR.slug} onChange={(e) => setTrAR({ ...trAR, slug: e.target.value })} required />
                  {submitted && !trAR.slug && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.displayAddress') || 'Display Address'}</label>
                  <Input value={trAR.displayAddressLine} onChange={(e) => setTrAR({ ...trAR, displayAddressLine: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.areaName') || 'Area Name'}</label>
                  <Input value={trAR.areaName} onChange={(e) => setTrAR({ ...trAR, areaName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('properties.form.description') || 'Description'}</label>
                  <textarea className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg" rows={5} value={trAR.description} onChange={(e) => setTrAR({ ...trAR, description: e.target.value })} />
                  {submitted && !trAR.description && <p className="text-xs text-red-400 mt-1">{t('validation.required') || 'This field is required'}</p>}
                </div>
              </div>
            </div>
          </div>
        </Card>
        )}

        {activeTab === 'media' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">{t('properties.media') || 'Media'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('properties.form.primaryImage') || 'Primary Image'}</label>
              {previewUrl || form.primaryPhotoUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl || form.primaryPhotoUrl} alt="preview" className="w-full h-48 object-cover rounded-lg border border-slate-800" />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => { setPreviewUrl(null); setForm((p)=>({ ...p, primaryPhotoUrl: '' })); }}>
                      {t('properties.form.removeImage') || 'Remove Image'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-700 rounded-lg p-6 text-center">
                  <input id="file-input" type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                  <label htmlFor="file-input" className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 text-slate-100 rounded-lg cursor-pointer hover:bg-slate-700">
                    {t('properties.form.uploadImage') || 'Upload Image'}
                  </label>
                  <p className="text-xs text-slate-500 mt-3">{t('properties.form.orPasteUrl') || 'or paste an image URL'}</p>
                  <div className="mt-2">
                    <Input name="primaryPhotoUrl" value={form.primaryPhotoUrl} onChange={onChange} placeholder="https://..." />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('properties.form.gallery') || 'Gallery (coming soon)'}</label>
              <div className="border border-dashed border-slate-700 rounded-lg p-6 text-slate-500 text-sm">
                {t('properties.form.gallery') || 'Gallery (coming soon)'}
              </div>
            </div>
          </div>
        </Card>
        )}

        {error && (
          <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">{error.message}</div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/properties')}>{t('common.cancel') || 'Cancel'}</Button>
          <Button type="submit" disabled={loading}>{loading ? (t('loading.saving') || 'Saving...') : (t('properties.createProperty') || 'Create Property')}</Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyNew;

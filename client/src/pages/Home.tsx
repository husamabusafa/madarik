import { useI18n } from '../contexts/I18nContext';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('app.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('app.description')}
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Coming Soon
          </h2>
          <p className="text-blue-700">
            The property search and map functionality will be implemented in the next phase.
            Authentication system is now ready!
          </p>
        </div>
      </div>
    </div>
  );
}

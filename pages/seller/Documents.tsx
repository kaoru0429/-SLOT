import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const Documents: React.FC = () => {
  const { t } = useAppContext();
  const [files, setFiles] = useState([
    { name: 'invoice_ORD001.pdf', type: 'Invoice', size: '1.2MB' },
    { name: 'packing_list_ORD001.pdf', type: 'Packing List', size: '856KB' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFiles(prev => [...prev, {
        name: newFile.name,
        type: 'Other',
        size: `${(newFile.size / 1024).toFixed(2)}KB`
      }]);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('documentsTitle')}</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('uploadDocuments')}</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="mb-2 text-gray-500">{t('dragDrop')}</p>
          <label htmlFor="file-upload" className="cursor-pointer bg-dpd-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-dpd-red-dark transition">
            {t('browseFiles')}
          </label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('myDocuments')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('docType')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('filename')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('size')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{file.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dpd-dark-gray">{file.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{file.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <a href="#" className="text-dpd-red hover:text-dpd-red-dark">{t('preview')}</a>
                    <a href="#" className="text-dpd-red hover:text-dpd-red-dark">{t('download')}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('downloadTemplates')}</h2>
        <div className="flex space-x-4">
          <button className="bg-gray-100 text-dpd-dark-gray px-4 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-200 transition">📄 {t('invoiceTemplate')}</button>
          <button className="bg-gray-100 text-dpd-dark-gray px-4 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-200 transition">📄 {t('packingListTemplate')}</button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
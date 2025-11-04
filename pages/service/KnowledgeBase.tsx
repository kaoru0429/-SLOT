import React from 'react';
import { useAppContext } from '../../context/AppContext';

const FAQItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <details className="p-4 rounded-lg bg-gray-50 group">
        <summary className="font-semibold cursor-pointer text-dpd-dark-gray group-open:text-dpd-red">{question}</summary>
        <div className="mt-3 text-dpd-dark-gray prose">
            {children}
        </div>
    </details>
);

const KnowledgeBase: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('kbTitle')}</h1>
            <div className="space-y-4">
                <FAQItem question={t('q1')}>
                    <p>{t('a1')}</p>
                </FAQItem>
                <FAQItem question={t('q2')}>
                    <p>{t('a2')}</p>
                </FAQItem>
                <FAQItem question={t('q3')}>
                    <p>{t('a3')}</p>
                </FAQItem>
                 <FAQItem question={t('q4')}>
                    <p>{t('a4')}</p>
                </FAQItem>
            </div>
        </div>
    );
};

export default KnowledgeBase;
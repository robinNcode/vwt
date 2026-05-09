import { useTranslation } from 'react-i18next'

const Contact = () => {
    const { t } = useTranslation()
    return (
        <div className="container-custom pt-32 pb-20">
            <h1 className="text-4xl font-bold mb-8">{t('nav.contact')}</h1>
            <p className="text-slate-600">Contact form coming soon...</p>
        </div>
    )
}

export default Contact

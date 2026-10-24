import React, { useState } from 'react';
import { CONTACT_CONFIG } from '../formConfig';

/**
 * רישום לניוז (ניוזלטר) בתוך עמוד הניוז — שולח לאותו טופס MailerLite של חלונית הניוזלטר.
 */
const NewsSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fields[name]', name);
      formData.append('fields[email]', email);
      formData.append('ml-submit', '1');
      await fetch(CONTACT_CONFIG.newsletterUrl, { method: 'POST', mode: 'no-cors', body: formData });
      setIsSuccess(true);
      setName('');
      setEmail('');
    } catch (error) {
      console.error(error);
      alert('אירעה תקלה, אנא נסו שוב מאוחר יותר');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="news-signup" className="max-w-[860px] mx-auto bg-white shadow-xl border border-brand-light/40 px-6 py-8 md:px-10 md:py-10 text-center">
      {isSuccess ? (
        <div>
          <h2 className="text-[clamp(24px,3vw,34px)] font-extrabold text-dark-coal">נרשמתם בהצלחה!</h2>
          <p className="text-[clamp(16px,1.6vw,20px)] text-dark-coal/70 mt-2">מעכשיו כל ניוז חדש יגיע ישר אליכם למייל :)</p>
        </div>
      ) : (
        <>
          <h2 className="text-[clamp(24px,3vw,34px)] font-extrabold text-dark-coal">
            רוצים לקבל את הניוז <span className="text-brand-dark">ראשונים?</span>
          </h2>
          <p className="text-[clamp(16px,1.6vw,20px)] text-dark-coal/70 mt-2 mb-6">הירשמו ותקבלו למייל מוצרים חדשים, מבצעי חג והשראה.</p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-4 bg-brand-soft/60 border border-brand-light focus:outline-none focus:border-brand-dark text-right text-base"
            />
            <input
              type="email"
              required
              placeholder="כתובת מייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-4 bg-brand-soft/60 border border-brand-light focus:outline-none focus:border-brand-dark text-right text-base"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-dark-coal text-white font-bold text-lg hover:bg-brand-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'נרשמים...' : 'לרישום לניוז'}
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default NewsSignup;

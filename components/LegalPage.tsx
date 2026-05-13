
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LegalPageProps {
    title: string;
    content: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, content }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${title} | רעות מחמלי - ערך מוסף`;
    }, [title]);

    return (
        <div className="min-h-screen bg-brand-soft font-sans overflow-x-hidden w-full">
            <Navbar />
            
            <main className="pt-32 pb-20 px-[5vw]">
                <div className="max-w-[800px] mx-auto bg-white p-8 md:p-16 shadow-xl border border-brand-light/20 relative">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-brand-dark/10 m-4 pointer-events-none"></div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-dark-coal mb-12 text-center tracking-tight">
                        {title}
                        <div className="w-16 h-1.5 bg-brand-dark mx-auto mt-4"></div>
                    </h1>
                    
                    <div className="prose prose-lg max-w-none text-dark-coal/80 leading-relaxed text-right dir-rtl">
                        {content}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default LegalPage;

export const AccessibilityStatement = () => (
    <LegalPage 
        title="הצהרת נגישות" 
        content={
            <div className="space-y-6 text-right" dir="rtl">
                <p>אנו ברעות מחמלי רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובשיפור חווית הגלישה באתר.</p>
                <p>הושקעו מאמצים ומשאבים רבים בהנגשת האתר, במטרה להקל על השימוש בו עבור אנשים עם מוגבלויות.</p>
                
                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">התאמות הנגישות באתר</h3>
                <ul className="list-disc list-inside space-y-2 pr-4">
                    <li>תאימות לדפדפנים נפוצים.</li>
                    <li>התאמה לשימוש בטלפון סלולרי.</li>
                    <li>ניווט פשוט וברור.</li>
                    <li>תמיכה בתוכנות קורא מסך.</li>
                    <li>שימוש בצבעים עם ניגודיות מתאימה.</li>
                </ul>

                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">פניות בנושאי נגישות</h3>
                <p>אם נתקלתם בקושי בגלישה באתר או שיש לכם הצעה לשיפור, נשמח לשמוע מכם:</p>
                <p>מייל: c0548496967@gmail.com</p>
                <p>טלפון: 053-9660418</p>
            </div>
        } 
    />
);

export const PrivacyPolicy = () => (
    <LegalPage 
        title="מדיניות פרטיות" 
        content={
            <div className="space-y-6 text-right" dir="rtl">
                <p>שלום רב, פרטיות המשתמשים שלנו חשובה לנו מאוד.</p>
                
                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">איזה מידע אנחנו אוספים?</h3>
                <p>אנו אוספים מידע שנמסר על ידיך מרצונך החופשי בעת מילוי טפסים באתר (כגון שם, טלפון ומייל) או הרשמה לניוזלטר.</p>

                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">כיצד אנו משתמשים במידע?</h3>
                <ul className="list-disc list-inside space-y-2 pr-4">
                    <li>למתן שירות ומענה לפניות.</li>
                    <li>לשיפור חווית המשתמש באתר.</li>
                    <li>לשליחת עדכונים והטבות (במידה ואישרת זאת).</li>
                </ul>

                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">אבטחת מידע</h3>
                <p>אנו נוקטים באמצעי זהירות סבירים ומקובלים כדי להגן על המידע האישי שלך.</p>
            </div>
        } 
    />
);

export const TermsOfUse = () => (
    <LegalPage 
        title="תקנון האתר" 
        content={
            <div className="space-y-6 text-right" dir="rtl">
                <p>ברוכים הבאים לאתר של רעות מחמלי - ערך מוסף.</p>
                
                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">תנאי שימוש</h3>
                <p>השימוש באתר כפוף להסכמתך לתנאים המפורטים להלן:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                    <li>התוכן באתר נועד למטרות מידע והזמנת שירותים בלבד.</li>
                    <li>אין להעתיק או לעשות שימוש מסחרי בתכני האתר ללא אישור בכתב.</li>
                    <li>הנהלת האתר שומרת לעצמה את הזכות לעדכן את התקנון מעת לעת.</li>
                </ul>

                <h3 className="text-2xl font-bold text-dark-coal mt-8 mb-4 underline decoration-brand-dark decoration-4 underline-offset-4">אספקה ומשלוחים</h3>
                <p>פרטי המשלוחים והאספקה יתואמו באופן אישי מול כל לקוח בעת ביצוע ההזמנה.</p>
            </div>
        } 
    />
);

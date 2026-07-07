import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useContent, defaultPricing } from '../context/ContentContext';

/**
 * מחשבון תמחור ללקוח - מבוסס על קובץ "תמחור רעות".
 * המחירים נטענים מלוח הבקרה (Sanity) וניתנים לעריכה על ידי רעות.
 * המחיר המוצג הוא להערכה בלבד; הצעת מחיר סופית תינתן על ידי רעות.
 */

type Method = 'xtool' | 'cricut';

// שמות ידידותיים ללקוח - בלי שמות המכונות
const METHOD_LABEL: Record<Method, string> = {
  xtool: 'חריטה',
  cricut: 'חיתוך',
};

// כתובת המייל לפניית לקוח
const CONTACT_EMAIL = 'reut21948@gmail.com';

type WorkType = 'text' | 'image' | 'keyboard';
type Package = 'first' | 'upTo5' | 'large';

const PriceCalculator: React.FC = () => {
  const { content } = useContent();
  const pricing = content.pricing || defaultPricing;
  const MATERIALS = pricing.materials.length ? pricing.materials : defaultPricing.materials;

  const [workType, setWorkType] = useState<WorkType>('text');

  // --- טקסט / מילים ---
  const [method, setMethod] = useState<Method>('xtool'); // חריטה / חיתוך
  const [materialId, setMaterialId] = useState<string>(MATERIALS[0].id);
  const [pkg, setPkg] = useState<Package>('upTo5');
  const [words, setWords] = useState<number>(3);

  // --- תמונה / דמות ---
  const [imageSize, setImageSize] = useState<'6' | '10'>('6');

  // --- כללי ---
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'מחשבון תמחור | רעות מחמלי - ערך מוסף';
  }, []);

  // רק החומרים הרלוונטיים לשיטה שנבחרה (בחיתוך יש פחות חומרים מבחריטה)
  const materialsForMethod = MATERIALS.filter(m => m.method === method);
  const material = materialsForMethod.find(m => m.id === materialId) || materialsForMethod[0];

  // מעבר בין חריטה/חיתוך - בוחר אוטומטית את החומר הראשון הזמין לשיטה.
  // בחיתוך יש רק טקסט (תמונה/דמות ומקלדת קיימים רק בחריטה), לכן חוזרים לטקסט.
  const changeMethod = (m: Method) => {
    setMethod(m);
    const first = MATERIALS.find(mat => mat.method === m);
    if (first) setMaterialId(first.id);
    if (m === 'cricut') setWorkType('text');
  };

  // האם קיימת שיטת חיתוך בכלל (יש חומרים שמתאימים לחיתוך)
  const hasCricut = MATERIALS.some(m => m.method === 'cricut');
  const hasXtool = MATERIALS.some(m => m.method === 'xtool');

  // חישוב מחיר ליחידה בודדת
  const unitPrice = useMemo(() => {
    if (workType === 'keyboard') return pricing.keyboard;
    if (workType === 'image') return imageSize === '6' ? pricing.image6 : pricing.image10;

    // workType === 'text'
    const w = Math.max(1, words);
    switch (pkg) {
      case 'first':
        return material.first;
      case 'large':
        return material.large * w;
      case 'upTo5':
      default:
        return material.upTo5 + Math.max(0, w - 5) * material.extra;
    }
  }, [workType, imageSize, pkg, words, material, pricing]);

  const qty = Math.max(1, quantity);
  const total = unitPrice * qty;
  const isBulk = qty > pricing.bulkThreshold;

  // קישור מייל עם סיכום ההזמנה שהלקוח בחר
  const emailHref = useMemo(() => {
    let details = '';
    if (workType === 'text') {
      const pkgLabel = pkg === 'first' ? 'מילה אחת + אלמנט מתנה' : pkg === 'large' ? 'כתב גדול' : 'עד 5 מילים / לוגו';
      details =
        `סוג עבודה: ${METHOD_LABEL[method]} על טקסט\n` +
        `חומר: ${material.name}\n` +
        `עיצוב: ${pkgLabel}\n` +
        (pkg !== 'first' ? `מספר מילים: ${Math.max(1, words)}\n` : '');
    } else if (workType === 'image') {
      details = `סוג עבודה: חריטת תמונה / דמות (${imageSize === '6' ? 'עד 6 ס"מ' : 'עד 10 ס"מ'})\n`;
    } else {
      details = `סוג עבודה: חריטת מקלדת\n`;
    }
    details += `כמות: ${qty}\n`;
    details += isBulk
      ? `\nמדובר בכמות גדולה — אשמח להצעת מחיר מותאמת אישית.`
      : `\nהערכת מחיר מהמחשבון: ${total.toLocaleString('he-IL')} ₪`;

    const subject = 'פנייה מהמחשבון באתר - הזמנה חדשה';
    const body = `היי רעות,\nהשתמשתי במחשבון באתר וזו ההזמנה שלי:\n\n${details}\n\nנשמח לתאם. תודה!`;
    // חלון כתיבת מייל של Gmail (נפתח בדפדפן) - אמין יותר מ-mailto שדורש תוכנת מייל מותקנת.
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [workType, method, material, pkg, words, imageSize, qty, total, isBulk]);

  return (
    <div className="min-h-screen bg-brand-soft font-sans flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow pt-[18vh] pb-24 px-[5vw] max-w-[900px] mx-auto w-full relative z-20">
        <div className="mb-6">
          <a href="/" className="text-brand-dark hover:text-dark-coal font-medium flex items-center gap-2 transition-colors w-fit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            חזרה לעמוד הראשי
          </a>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[clamp(34px,5vw,56px)] font-extrabold text-dark-coal mb-3">
            מחשבון תמחור
          </h1>
          <div className="w-16 h-1 bg-brand-dark mx-auto mb-4"></div>
          <p className="text-lg text-dark-coal/70 max-w-[620px] mx-auto">
            בחרו את סוג העבודה, החומר וכמות המילים — ותקבלו הערכת מחיר מיידית.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-light/30 p-6 md:p-10 space-y-8">

          {/* שלב 1: חריטה או חיתוך */}
          {hasCricut && hasXtool && (
            <div>
              <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">חריטה או חיתוך?</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'xtool', label: 'חריטה' },
                  { id: 'cricut', label: 'חיתוך' },
                ] as { id: Method; label: string }[]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => changeMethod(opt.id)}
                    className={`py-4 rounded-xl font-bold text-base transition-all duration-300 border-2 ${
                      method === opt.id
                        ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                        : 'bg-brand-soft text-dark-coal border-transparent hover:border-brand-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* שלב 2: מה תרצו לעשות? — תמונה/דמות ומקלדת קיימים רק בחריטה */}
          {method === 'xtool' && (
            <div>
              <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">מה תרצו לעשות?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: 'text', label: 'טקסט / מילים' },
                  { id: 'image', label: 'תמונה / דמות' },
                  { id: 'keyboard', label: 'חריטת מקלדת' },
                ] as { id: WorkType; label: string }[]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setWorkType(opt.id)}
                    className={`py-4 px-3 rounded-xl font-bold text-base transition-all duration-300 border-2 ${
                      workType === opt.id
                        ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                        : 'bg-brand-soft text-dark-coal border-transparent hover:border-brand-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* טקסט / מילים */}
          {workType === 'text' && (
            <>
              {/* חומר - רק החומרים הרלוונטיים לשיטה שנבחרה */}
              <div>
                <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">על איזה חומר?</label>
                <div className="grid grid-cols-3 gap-3">
                  {materialsForMethod.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMaterialId(m.id)}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                        material.id === m.id
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'bg-brand-soft text-dark-coal border-transparent hover:border-brand-light'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* סוג העבודה על הטקסט */}
              <div>
                <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">מה כולל העיצוב?</label>
                <div className="space-y-3">
                  {([
                    { id: 'first', title: 'מילה אחת + אלמנט מתנה', desc: 'מילה בודדת עם אלמנט קטן (עד רוחב 2 ס"מ)' },
                    { id: 'upTo5', title: 'עד 5 מילים / לוגו', desc: 'משפט קצר או לוגו וקטורי, כל מילה נוספת בתוספת תשלום' },
                    { id: 'large', title: 'כתב גדול', desc: 'אותיות גדולות (עד רוחב 10 ס"מ למילה)' },
                  ] as { id: Package; title: string; desc: string }[]).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPkg(opt.id)}
                      className={`w-full text-right p-4 rounded-xl transition-all duration-300 border-2 flex items-center justify-between gap-4 ${
                        pkg === opt.id
                          ? 'bg-brand-soft border-brand-dark shadow-sm'
                          : 'bg-white border-brand-light/40 hover:border-brand-light'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-dark-coal">{opt.title}</div>
                        <div className="text-sm text-dark-coal/60">{opt.desc}</div>
                      </div>
                      <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        pkg === opt.id ? 'border-brand-dark bg-brand-dark' : 'border-brand-light'
                      }`}>
                        {pkg === opt.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* מספר מילים */}
              {pkg !== 'first' && (
                <div>
                  <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">
                    כמה מילים? {pkg === 'upTo5' && <span className="font-normal">(עד 5 מילים במחיר הבסיס)</span>}
                  </label>
                  <NumberStepper value={words} setValue={setWords} min={1} />
                </div>
              )}
            </>
          )}

          {/* שלב 2 - תמונה */}
          {workType === 'image' && (
            <div>
              <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">גודל התמונה / הדמות</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: '6', label: 'עד 6 ס"מ' },
                  { id: '10', label: 'עד 10 ס"מ' },
                ] as { id: '6' | '10'; label: string }[]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setImageSize(opt.id)}
                    className={`py-5 rounded-xl font-bold transition-all duration-300 border-2 ${
                      imageSize === opt.id
                        ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                        : 'bg-brand-soft text-dark-coal border-transparent hover:border-brand-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* שלב 2 - מקלדת */}
          {workType === 'keyboard' && (
            <div className="bg-brand-soft rounded-xl p-5 text-center">
              <p className="text-dark-coal font-medium">חריטת מקלדת מלאה במחיר קבוע. בחרו כמות למטה וקבלו את המחיר.</p>
            </div>
          )}

          {/* כמות */}
          <div>
            <label className="block text-sm font-bold text-dark-coal/60 mb-3 tracking-wide">כמה יחידות?</label>
            <NumberStepper value={quantity} setValue={setQuantity} min={1} />
          </div>

          {/* תוצאה */}
          <div className="bg-dark-coal rounded-2xl p-6 md:p-8 text-white">
            {isBulk ? (
              <div className="text-center">
                <p className="text-lg font-bold mb-1">מעל {pricing.bulkThreshold} יחידות</p>
                <p className="text-white/70 text-sm">
                  להזמנות בכמות גדולה (תבנית חוזרת) מגיעה הצעת מחיר מותאמת אישית — פנו לרעות לקבלת הצעה משתלמת.
                </p>
              </div>
            ) : (
              <div className="flex items-end justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white/60 text-sm mb-1">הערכת מחיר</p>
                  <p className="text-5xl font-extrabold tracking-tight">{total.toLocaleString('he-IL')} <span className="text-2xl">₪</span></p>
                </div>
                {qty > 1 && (
                  <p className="text-white/60 text-sm">
                    {unitPrice.toLocaleString('he-IL')} ₪ ליחידה × {qty}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* הערות */}
          <div className="text-sm text-dark-coal/60 space-y-2 border-t border-brand-light/40 pt-6">
            <p>• המחיר להערכה בלבד. הצעת מחיר סופית תינתן על ידי רעות.</p>
            <p>• התמחור כולל עיצוב בסיסי מתוך דוגמאות קיימות (פונט, גודל ואלמנט). עיצוב מיוחד יתומחר לפי זמן עבודה, {pricing.hourlyRate} ₪ לשעה.</p>
            <p>• המחיר אינו כולל מוצר, ניתן לרכוש מוצר בתוספת עמלת שירות.</p>
            <p>• אין אחריות על המוצר.</p>
            <p>• הגעה בתיאום מראש, איסוף באותו היום.</p>
          </div>

          {/* הצעת מחיר מותאמת אישית לכמויות (מעל 25 יחידות) + כפתור שליחת מייל */}
          <div className="bg-brand-soft rounded-2xl p-6 text-center border border-brand-light/40">
            <p className="font-extrabold text-dark-coal text-lg mb-1">
              מזמינים מעל {pricing.bulkThreshold} יחידות?
            </p>
            <p className="text-sm text-dark-coal/70 mb-5">
              לכמויות גדולות בתבנית חוזרת יש הצעת מחיר מותאמת אישית ומשתלמת. השאירו פרטים ונחזור אליכם.
            </p>
            <a
              href={emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-dark-coal transition-all duration-300 shadow-md"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              קבלת הצעת מחיר מותאמת אישית
            </a>
          </div>
        </div>
      </main>

      <Footer hideContactForm />
    </div>
  );
};

/** בורר כמות עם כפתורי + / - */
const NumberStepper: React.FC<{ value: number; setValue: (n: number) => void; min: number }> = ({ value, setValue, min }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setValue(Math.max(min, value - 1))}
        className="w-12 h-12 rounded-xl bg-brand-soft border-2 border-brand-light/50 text-2xl font-bold text-dark-coal hover:border-brand-dark transition-colors flex items-center justify-center"
        aria-label="הפחתה"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          setValue(isNaN(n) ? min : Math.max(min, n));
        }}
        className="w-20 h-12 text-center text-xl font-bold bg-white border-2 border-brand-light/50 rounded-xl focus:outline-none focus:border-brand-dark"
      />
      <button
        onClick={() => setValue(value + 1)}
        className="w-12 h-12 rounded-xl bg-brand-soft border-2 border-brand-light/50 text-2xl font-bold text-dark-coal hover:border-brand-dark transition-colors flex items-center justify-center"
        aria-label="הוספה"
      >
        +
      </button>
    </div>
  );
};

export default PriceCalculator;

import React from 'react';

/**
 * כפתור קריאה-לפעולה (CTA) שחוזר בכל סשן באתר ומוביל לטופס הפנייה של רעות.
 * variant קובע את הצבע כדי להתאים לרקע הסשן:
 *   'dark'  — כפתור כתום מלא (לרקע בהיר).
 *   'light' — כפתור לבן מלא (לרקע כתום/כהה).
 */
interface SectionCTAProps {
  label?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

const goToForm = () => {
  const el = document.getElementById('contact-form-fields');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    // בעמודים ללא הטופס (למשל המחשבון) — חוזרים לעמוד הבית אל הטופס.
    window.location.href = '/#contact-form-fields';
  }
};

const SectionCTA: React.FC<SectionCTAProps> = ({
  label = 'לפרטים והצעת מחיר אישית',
  variant = 'dark',
  className = '',
}) => {
  const base =
    'group inline-flex items-center gap-2.5 px-9 py-4 rounded-none font-bold text-[clamp(16px,1.6vw,20px)] transition-all duration-300 shadow-lg hover:scale-105 cursor-pointer';
  const styles =
    variant === 'light'
      ? 'bg-white text-[#F0894E] hover:bg-brand-soft'
      : 'bg-brand-dark text-white hover:bg-dark-coal';

  return (
    <div className={`flex justify-center ${className}`}>
      <button type="button" onClick={goToForm} className={`${base} ${styles}`} aria-label={label}>
        {label}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
};

export default SectionCTA;

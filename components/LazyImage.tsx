import React, { useEffect, useRef, useState } from 'react';

/**
 * תמונה שנטענת רק כשהיא מתקרבת לאזור התצוגה (IntersectionObserver).
 * הדפדפן לבדו ("loading=lazy") טוען יותר מדי תמונות מראש, מה שמאט את הטעינה.
 * כאן טוענים רק תמונות שקרובות למסך (rootMargin), כך שהעמוד נטען מהר.
 *
 * חשוב: יש לעטוף ב-container עם גובה/יחס-ממדים קבוע כדי שלא תהיה "קפיצה" בעת הטעינה.
 */

// SVG שקוף וריק - משמש כ-placeholder עד שהתמונה האמיתית נטענת (מונע אייקון "תמונה שבורה").
const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, ...rest }) => {
  const ref = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return <img ref={ref} src={visible ? src : PLACEHOLDER} decoding="async" {...rest} />;
};

export default LazyImage;

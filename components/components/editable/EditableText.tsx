
import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  className = '', 
  tagName = 'span',
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const inputProps = {
      ref: inputRef as any,
      value: currentValue,
      onChange: (e: any) => setCurrentValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `w-full bg-white/90 text-dark-coal p-1 border-2 border-brand-dark rounded-sm focus:outline-none ${className}`,
    };

    return multiline ? (
      <textarea {...inputProps} rows={3} />
    ) : (
      <input {...inputProps} type="text" />
    );
  }

  const Tag = tagName as any;

  return (
    <Tag 
      className={`relative group/editable cursor-text hover:outline hover:outline-2 hover:outline-brand-dark/30 hover:outline-offset-4 transition-all ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="opacity-30 italic">(ריק)</span>}
      <span className="absolute -top-6 right-0 bg-brand-dark text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/editable:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        לחץ לעריכה
      </span>
    </Tag>
  );
};

export default EditableText;

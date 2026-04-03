import React from 'react';

export function TextAreaField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  onPaste,
  onDrop,
  onBeforeInput,
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint ? <p className="text-xs text-gray-500 mb-2 leading-relaxed">{hint}</p> : null}
      <textarea
        rows={rows}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-y"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        onDrop={onDrop}
        onBeforeInput={onBeforeInput}
      />
    </div>
  );
}

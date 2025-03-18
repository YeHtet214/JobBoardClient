import React from 'react';
import { useField } from 'formik';

type TextareaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
} & (
  | { formik: true }
  | {
      formik?: false;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      errors?: Record<string, { message: string }> | undefined;
    }
);

const TextareaField: React.FC<TextareaFieldProps> = (props) => {
  const {
    label,
    name,
    placeholder = '',
    className = '',
    rows = 4,
    disabled = false,
    required = false,
  } = props;

  // Handle both Formik and non-Formik usage
  if ('formik' in props && props.formik) {
    // Formik version
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`mt-1 block w-full px-3 py-2 border ${
            hasError ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
          {...field}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
      </div>
    );
  } else {
    // Non-Formik version
    const { value, onChange, onBlur, errors } = props;
    const hasError = errors && errors[name];

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          disabled={disabled}
          className={`mt-1 block w-full px-3 py-2 border ${
            hasError ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>}
      </div>
    );
  }
};

export default TextareaField;

import React from 'react';
import { useField, useFormikContext } from 'formik';

type InputFieldProps = {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    autoComplete?: string;
    required?: boolean;
} & (
    | { formik: true }
    | {
        formik?: false;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
        errors?: Record<string, { message: string }> | undefined;
      }
);

const InputField: React.FC<InputFieldProps> = (props) => {
    const { 
        label, 
        name, 
        type = 'text', 
        placeholder = '', 
        className = '',
        disabled = false,
        autoComplete,
        required = false
    } = props;

    // Handle both Formik and non-Formik usage
    if ('formik' in props && props.formik) {
        // Check if we're inside a Formik context
        const formik = useFormikContext();
        
        if (formik) {
            // Formik version
            const [field, meta] = useField(name);
            const hasError = meta.touched && meta.error;

            return (
                <div className="mb-4">
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type={type}
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            hasError ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                        {...field}
                    />
                    {hasError && (
                        <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                </div>
            );
        } else {
            // Fallback for when formik context is missing
            console.warn(`InputField with name "${name}" is marked as a Formik field but no Formik context was found.`);
            return (
                <div className="mb-4">
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type={type}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                    />
                </div>
            );
        }
    } else {
        // Non-Formik version
        const { value, onChange, onBlur, errors } = props;
        const hasError = errors && errors[name];

        return (
            <div className="mb-4">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`mt-1 block w-full px-3 py-2 border ${
                        hasError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                />
                {hasError && (
                    <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
                )}
            </div>
        );
    }
};

export default InputField;
import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldWithLabelProps = {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
} & (
  | { formik: true }
  | {
      formik?: false;
      value: string;
      onChange: (value: string) => void;
      onBlur?: () => void;
      errors?: Record<string, { message: string }> | undefined;
    }
);

const SelectFieldWithLabel: React.FC<SelectFieldWithLabelProps> = (props) => {
  const {
    label,
    name,
    options,
    placeholder = 'Select an option',
    className = '',
    disabled = false,
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
          <Label htmlFor={name} className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              formik.setFieldValue(name, value);
            }}
            defaultValue={field.value || ''}
            onOpenChange={() => {
              if (!meta.touched) {
                formik.setFieldTouched(name, true);
              }
            }}
          >
            <SelectTrigger 
              id={name}
              className={`w-full ${hasError ? 'border-red-500' : ''} ${className}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && (
            <p className="mt-1 text-sm text-red-600">{meta.error}</p>
          )}
        </div>
      );
    } else {
      // Fallback for when formik context is missing
      console.warn(`SelectField with name "${name}" is marked as a Formik field but no Formik context was found.`);
      return (
        <div className="mb-4">
          <Label htmlFor={name} className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Select disabled={disabled}>
            <SelectTrigger id={name} className={`w-full ${className}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
  } else {
    // Non-Formik version
    const { value, onChange, onBlur, errors } = props;
    const hasError = errors && errors[name];

    return (
      <div className="mb-4">
        <Label htmlFor={name} className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          disabled={disabled}
          value={value}
          onValueChange={(value) => {
            onChange(value);
            if (onBlur) onBlur();
          }}
        >
          <SelectTrigger 
            id={name}
            className={`w-full ${hasError ? 'border-red-500' : ''} ${className}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
};

export default SelectFieldWithLabel;

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type DatePickerFieldWithLabelProps = {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
} & (
  | { formik: true }
  | {
      formik?: false;
      value: Date | undefined;
      onChange: (date: Date | undefined) => void;
      onBlur?: () => void;
      errors?: Record<string, { message: string }> | undefined;
    }
);

const DatePickerFieldWithLabel: React.FC<DatePickerFieldWithLabelProps> = (props) => {
  const {
    label,
    name,
    placeholder = 'Pick a date',
    className = '',
    disabled = false,
    required = false,
    dateFormat = 'PPP'
  } = props;

  // Handle both Formik and non-Formik usage
  if ('formik' in props && props.formik) {
    // Check if we're inside a Formik context
    const formik = useFormikContext();
    
    if (formik) {
      // Formik version
      const [field, meta] = useField(name);
      const hasError = meta.touched && meta.error;

      // Convert string date to Date object if needed
      const dateValue = field.value ? 
        (field.value instanceof Date ? field.value : new Date(field.value)) : 
        undefined;

      return (
        <div className="mb-4">
          <Label htmlFor={name} className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground",
                  hasError ? "border-red-500" : "",
                  className
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, dateFormat) : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  formik.setFieldValue(name, date);
                  formik.setFieldTouched(name, true);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {hasError && (
            <p className="mt-1 text-sm text-red-600">{meta.error}</p>
          )}
        </div>
      );
    } else {
      // Fallback for when formik context is missing
      console.warn(`DatePickerField with name "${name}" is marked as a Formik field but no Formik context was found.`);
      return (
        <div className="mb-4">
          <Label htmlFor={name} className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  "text-muted-foreground",
                  className
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{placeholder}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" initialFocus />
            </PopoverContent>
          </Popover>
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                hasError ? "border-red-500" : "",
                className
              )}
              disabled={disabled}
              onClick={() => {
                if (onBlur) onBlur();
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, dateFormat) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                if (onBlur) onBlur();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
};

export default DatePickerFieldWithLabel;

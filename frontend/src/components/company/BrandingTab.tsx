import { Field, ErrorMessage, useFormikContext } from 'formik';
import { Image } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { CreateCompanyDto } from '../../types/company.types';

const BrandingTab = () => {
  const { values, errors, touched } = useFormikContext<CreateCompanyDto>();
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="logo" className="mb-2 flex items-center">
          <Image className="h-4 w-4 mr-2" />
          Logo URL
        </Label>
        <Field
          as={Input}
          id="logo"
          name="logo"
          placeholder="https://example.com/your-logo.png"
          className={errors.logo && touched.logo ? "border-red-500" : ""}
        />
        <ErrorMessage
          name="logo"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
        <p className="text-sm text-gray-500 mt-2">
          Please provide a URL to your company logo. For best results, use a square image
          (recommended size: 300x300px).
        </p>
      </div>

      {values.logo && (
        <div className="mt-4">
          <Label className="mb-2">Logo Preview</Label>
          <div className="mt-2 rounded-md overflow-hidden border border-gray-200 w-32 h-32 flex items-center justify-center">
            <img
              src={values.logo}
              alt="Company Logo Preview"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300?text=Invalid+Image';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingTab;

import { Field, ErrorMessage } from 'formik';
import { MapPin, Globe, Calendar, Users } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

// Company size options
const sizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5000+ employees',
];

const CompanyDetailsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="location" className="mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Location*
        </Label>
        <Field
          as={Input}
          id="location"
          name="location"
          placeholder="City, State, Country"
          className={({ form, field }: any) => 
            form.errors.location && form.touched.location ? "border-red-500" : ""
          }
        />
        <ErrorMessage
          name="location"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <Label htmlFor="website" className="mb-2 flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Website
        </Label>
        <Field
          as={Input}
          id="website"
          name="website"
          placeholder="https://yourcompany.com"
          className={({ form, field }: any) => 
            form.errors.website && form.touched.website ? "border-red-500" : ""
          }
        />
        <ErrorMessage
          name="website"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="foundedYear" className="mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Founded Year
          </Label>
          <Field
            as={Input}
            id="foundedYear"
            name="foundedYear"
            type="number"
            placeholder="e.g. 2010"
            className={({ form, field }: any) => 
              form.errors.foundedYear && form.touched.foundedYear ? "border-red-500" : ""
            }
          />
          <ErrorMessage
            name="foundedYear"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div>
          <Label htmlFor="size" className="mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Company Size
          </Label>
          <Field as="select"
            id="size"
            name="size"
            className={({ form, field }: any) => `w-full rounded-md border p-2 ${
              form.errors.size && form.touched.size ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select company size</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Field>
          <ErrorMessage
            name="size"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsTab;

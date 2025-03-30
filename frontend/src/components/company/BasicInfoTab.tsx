import { Field, ErrorMessage } from 'formik';
import { Building, Info, Briefcase } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

// Industry options for dropdown
const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Media',
  'Construction',
  'Transportation',
  'Hospitality',
  'Entertainment',
  'Agriculture',
  'Energy',
  'Telecommunications',
  'Other',
];

const BasicInfoTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="mb-2 flex items-center">
          <Building className="h-4 w-4 mr-2" />
          Company Name*
        </Label>
        <Field
          as={Input}
          id="name"
          name="name"
          placeholder="Enter your company name"
          className={({ form, field }: any) => 
            form.errors.name && form.touched.name ? "border-red-500" : ""
          }
        />
        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description" className="mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Company Description*
        </Label>
        <Field
          as={Textarea}
          id="description"
          name="description"
          placeholder="Describe your company, mission, values, and what makes it unique"
          className={({ form, field }: any) => 
            form.errors.description && form.touched.description ? "border-red-500" : ""
          }
          rows={5}
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <Label htmlFor="industry" className="mb-2 flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          Industry*
        </Label>
        <Field as="select"
          id="industry"
          name="industry"
        >
          <option value="">Select industry</option>
          {industryOptions.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="industry"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;

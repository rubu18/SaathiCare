import { useState, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Added new options for government id types
const govtIdTypes = [
  'Aadhaar Card',
  'PAN Card',
  'Voter ID',
  'Passport',
  'Driving License',
  'Other',
];

interface AddCompanionFormProps {
  onSubmit: (companion: any) => Promise<void>;
  onCancel: () => void;
}

const AddCompanionForm = ({ onSubmit, onCancel }: AddCompanionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    experience: '',
    location: '',
    bio: '',
    price: '',
    languages: [] as string[],
    specialties: [] as string[],
    govt_id_type: '',
    govt_id_number: '',
    govt_id_pdf_url: '', // NEW: URL of uploaded PDF
  });

  const [govtIdPdf, setGovtIdPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLanguages = ['Hindi', 'English', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Punjabi', 'Malayalam', 'Kannada'];
  const availableSpecialties = ['Elderly Care', 'Post-Surgery Support', 'Cardiology Visits', 'Mental Health', "Women's Health", 'Chronic Care', 'Rehabilitation', 'Family Support'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setGovtIdPdf(file);
    } else {
      setGovtIdPdf(null);
      alert('Please upload a PDF file.');
    }
  };

  const uploadPdfToSupabase = async (): Promise<string | null> => {
    // No file selected, skip
    if (!govtIdPdf) return null;
    setUploading(true);
    try {
      const uniqueFilename = `${Date.now()}-${govtIdPdf.name}`;
      const { data, error } = await supabase
        .storage
        .from('companion-govt-ids')
        .upload(uniqueFilename, govtIdPdf);

      if (error) throw error;

      // Get public URL to store
      const { data: publicUrlData } = supabase
        .storage
        .from('companion-govt-ids')
        .getPublicUrl(uniqueFilename);

      return publicUrlData.publicUrl;
    } catch (error) {
      alert('Error uploading PDF: ' + (error as any).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let govt_id_pdf_url = '';
      if (govtIdPdf) {
        const pdfUrl = await uploadPdfToSupabase();
        if (!pdfUrl) {
          setIsSubmitting(false);
          return;
        }
        govt_id_pdf_url = pdfUrl;
      }

      const companionData = {
        name: formData.name,
        age: parseInt(formData.age),
        experience: formData.experience,
        location: formData.location,
        bio: formData.bio || null,
        price: formData.price,
        languages: formData.languages,
        specialties: formData.specialties,
        govt_id_type: formData.govt_id_type,
        govt_id_number: formData.govt_id_number,
        govt_id_pdf_url, // Pass PDF URL forward
      };

      await onSubmit(companionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLanguage = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData({ ...formData, languages: [...formData.languages, language] });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({ ...formData, languages: formData.languages.filter(l => l !== language) });
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialty] });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData({ ...formData, specialties: formData.specialties.filter(s => s !== specialty) });
  };

  return (
    <Card>
      <CardContent className="p-6 bg-medical-blue-50 md:bg-medical-blue-50 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="18"
                max="70"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Experience *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="e.g., 5 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="Enter location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Price per Visit *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="e.g., ₹800/visit"
              />
            </div>
          </div>

          {/* Govt ID Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Government ID Type *
              </label>
              <select
                name="govt_id_type"
                value={formData.govt_id_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 focus:outline-none focus:ring-2 focus:ring-medical-primary"
              >
                <option value="">Select ID type</option>
                {govtIdTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-medical-blue-900 mb-2">
                Government ID Number *
              </label>
              <input
                type="text"
                name="govt_id_number"
                value={formData.govt_id_number}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                placeholder="Enter ID number"
              />
            </div>
          </div>

          {/* Govt ID PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-medical-blue-900 mb-2">
              Government ID PDF (optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-medical-blue-900 border border-gray-300 rounded-lg p-2 bg-white"
            />
            {govtIdPdf && (
              <div className="text-medical-primary text-sm mt-1">Selected file: {govtIdPdf.name}</div>
            )}
            {uploading && (
              <div className="text-medical-primary text-xs mt-1">Uploading...</div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-medical-blue-900 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
              placeholder="Write a brief bio about the companion..."
            />
          </div>
          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-medical-blue-900 mb-2">
              Languages
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.languages.map((language, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeLanguage(language)}>
                  {language} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
              >
                <option value="">Select a language</option>
                {availableLanguages.filter(lang => !formData.languages.includes(lang)).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <Button type="button" onClick={() => addLanguage(newLanguage)} variant="outline">
                Add
              </Button>
            </div>
          </div>
          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-medical-blue-900 mb-2">
              Specialties
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeSpecialty(specialty)}>
                  {specialty} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-medical-blue-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-medical-primary"
              >
                <option value="">Select a specialty</option>
                {availableSpecialties.filter(spec => !formData.specialties.includes(spec)).map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <Button type="button" onClick={() => addSpecialty(newSpecialty)} variant="outline">
                Add
              </Button>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-medical-primary hover:bg-medical-primary-dark text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Companion'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCompanionForm;

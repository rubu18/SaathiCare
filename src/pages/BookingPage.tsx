
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { useCompanions, type Companion } from '@/hooks/useCompanions';
import { useBookings, type BookingData } from '@/hooks/useBookings';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const companionId = searchParams.get('companion');
  const { companions, loading: companionsLoading } = useCompanions();
  const { createBooking, loading: bookingLoading } = useBookings();
  
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    phone: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    hospitalName: '',
    hospitalAddress: '',
    doctorName: '',
    visitType: '',
    specialRequirements: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  // Find the selected companion from the actual data
  useEffect(() => {
    if (companions.length > 0 && companionId) {
      const companion = companions.find(c => c.id === companionId);
      if (companion) {
        setSelectedCompanion(companion);
      }
    } else if (companions.length > 0 && !companionId) {
      // If no companion ID is provided, use the first available companion
      setSelectedCompanion(companions[0]);
    }
  }, [companions, companionId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['patientName', 'phone', 'appointmentDate', 'appointmentTime', 'hospitalName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      // This will be handled by the useBookings hook
      return;
    }

    if (!selectedCompanion) {
      // This will be handled by the useBookings hook
      return;
    }

    // Calculate pricing
    const serviceFee = parseInt(selectedCompanion.price.replace(/[^0-9]/g, '')) || 800;
    const platformFee = 50;
    const totalFee = serviceFee + platformFee;

    // Prepare booking data
    const bookingData: BookingData = {
      companionId: selectedCompanion.id,
      patientName: formData.patientName,
      patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
      phone: formData.phone,
      email: formData.email || undefined,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      hospitalName: formData.hospitalName,
      hospitalAddress: formData.hospitalAddress || undefined,
      doctorName: formData.doctorName || undefined,
      visitType: formData.visitType || undefined,
      specialRequirements: formData.specialRequirements || undefined,
      emergencyContact: formData.emergencyContact || undefined,
      emergencyPhone: formData.emergencyPhone || undefined,
      serviceFee,
      platformFee,
      totalAmount: totalFee
    };

    // Submit booking
    const result = await createBooking(bookingData);
    if (result) {
      setIsSubmitted(true);
      setSubmittedBookingId(result.id);
    }
  };

  // Loading state
  if (companionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-trust-blue-50 to-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading companion information...</p>
          </Card>
        </div>
      </div>
    );
  }

  // No companion found
  if (!selectedCompanion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-trust-blue-50 to-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Companion Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The companion you're looking for is not available or doesn't exist.
            </p>
            <Button onClick={() => window.location.href = '/companions'} className="bg-trust-blue-600 hover:bg-trust-blue-700">
              Browse Companions
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-trust-blue-50 to-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center animate-fade-in">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your companion visit with {selectedCompanion.name} has been successfully booked.
            </p>
            {submittedBookingId && (
              <p className="text-sm text-gray-500 mb-6">
                Booking ID: {submittedBookingId.slice(0, 8)}...
              </p>
            )}
            <div className="bg-trust-blue-50 p-6 rounded-xl mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• You'll receive a confirmation call within 30 minutes</li>
                <li>• Your companion will contact you 24 hours before the visit</li>
                <li>• Emergency support is available 24/7 at +91-XXXX-XXXX</li>
                <li>• You can track your booking status in the Messages section</li>
              </ul>
            </div>
            <Button className="bg-trust-blue-600 hover:bg-trust-blue-700" onClick={() => window.location.href = '/chat'}>
              Go to Messages
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate pricing based on actual companion data
  const serviceFee = parseInt(selectedCompanion.price.replace(/[^0-9]/g, '')) || 800;
  const platformFee = 50;
  const totalFee = serviceFee + platformFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-trust-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Companion Visit
          </h1>
          <p className="text-lg text-gray-600">
            Simple booking process to ensure you get the support you need
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Patient Information */}
              <Card className="p-6 border border-gray-200 shadow-sm animate-fade-in bg-white">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="h-6 w-6 text-trust-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
                      Patient Name *
                    </Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientAge" className="text-sm font-medium text-gray-700">
                      Age
                    </Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => handleInputChange('patientAge', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </Card>

              {/* Appointment Details */}
              <Card className="p-6 border border-gray-200 shadow-sm animate-fade-in bg-white">
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="h-6 w-6 text-trust-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="appointmentDate" className="text-sm font-medium text-gray-700">
                      Appointment Date *
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointmentTime" className="text-sm font-medium text-gray-700">
                      Appointment Time *
                    </Label>
                    <Input
                      id="appointmentTime"
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="visitType" className="text-sm font-medium text-gray-700">
                    Type of Visit
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('visitType', value)}>
                    <SelectTrigger className="mt-1 bg-white text-gray-900">
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="consultation">General Consultation</SelectItem>
                      <SelectItem value="surgery">Surgery/Procedure</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                      <SelectItem value="followup">Follow-up Visit</SelectItem>
                      <SelectItem value="therapy">Therapy Session</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="doctorName" className="text-sm font-medium text-gray-700">
                    Doctor/Specialist Name
                  </Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    className="mt-1 bg-white text-gray-900"
                    placeholder="Dr. Name"
                  />
                </div>
              </Card>

              {/* Hospital Information */}
              <Card className="p-6 border border-gray-200 shadow-sm animate-fade-in bg-white">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-6 w-6 text-trust-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Hospital Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hospitalName" className="text-sm font-medium text-gray-700">
                      Hospital/Clinic Name *
                    </Label>
                    <Input
                      id="hospitalName"
                      value={formData.hospitalName}
                      onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="Hospital or clinic name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hospitalAddress" className="text-sm font-medium text-gray-700">
                      Hospital Address
                    </Label>
                    <Textarea
                      id="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="Complete address with landmarks"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Special Requirements */}
              <Card className="p-6 border border-gray-200 shadow-sm animate-fade-in bg-white">
                <div className="flex items-center space-x-2 mb-6">
                  <Heart className="h-6 w-6 text-trust-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specialRequirements" className="text-sm font-medium text-gray-700">
                      Special Requirements or Notes
                    </Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      className="mt-1 bg-white text-gray-900"
                      placeholder="Any special needs, mobility assistance, language preferences, etc."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="mt-1 bg-white text-gray-900"
                        placeholder="Family member or friend"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700">
                        Emergency Contact Phone
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        className="mt-1 bg-white text-gray-900"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-trust-blue-600 hover:bg-trust-blue-700 text-white px-8 py-3"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Companion Summary - Now using real data */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-gray-200 shadow-sm sticky top-20 animate-fade-in bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Companion</h3>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-trust-blue-100 to-professional-teal-100 flex items-center justify-center border-4 border-trust-blue-100">
                  <User className="h-10 w-10 text-trust-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{selectedCompanion.name}</h4>
                <p className="text-sm text-gray-500">
                  ⭐ {selectedCompanion.rating.toFixed(1)} • {selectedCompanion.experience}
                </p>
                <p className="text-xs text-gray-500 mt-1">{selectedCompanion.location}</p>
              </div>

              {/* Display specialties if available */}
              {selectedCompanion.specialties && selectedCompanion.specialties.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Specialties:</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompanion.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-trust-blue-100 text-trust-blue-700 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Display languages if available */}
              {selectedCompanion.languages && selectedCompanion.languages.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Languages:</h5>
                  <p className="text-sm text-gray-600">{selectedCompanion.languages.join(', ')}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-semibold text-gray-900">₹{serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-semibold text-gray-900">₹{platformFee}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-trust-blue-600">₹{totalFee}</span>
                  </div>
                </div>
              </div>

              <div className="bg-trust-blue-50 p-4 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-2">What's Included:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pre-visit consultation call</li>
                  <li>• Full appointment accompaniment</li>
                  <li>• Notes and summary of visit</li>
                  <li>• Post-visit follow-up</li>
                  <li>• 24/7 emergency support</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

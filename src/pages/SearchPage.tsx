
import { useState } from 'react';
import { Search, Filter, MapPin, Building2, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHospitals, Hospital } from '@/hooks/useHospitals';
import { useHotels, Hotel } from '@/hooks/useHotels';
import HospitalCard from '@/components/HospitalCard';
import HotelCard from '@/components/HotelCard';
import SearchMap from '@/components/SearchMap';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Hospital | Hotel | null>(null);
  const [activeTab, setActiveTab] = useState('hospitals');
  const [showMap, setShowMap] = useState(false);

  const { data: hospitals = [], isLoading: hospitalsLoading } = useHospitals({
    city: selectedCity === 'all' ? '' : selectedCity,
    state: selectedState === 'all' ? '' : selectedState,
    specialty: selectedSpecialty === 'all' ? '' : selectedSpecialty,
    searchTerm,
  });

  const { data: hotels = [], isLoading: hotelsLoading } = useHotels({
    city: selectedCity === 'all' ? '' : selectedCity,
    state: selectedState === 'all' ? '' : selectedState,
    searchTerm,
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const specialties = [
    'Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Emergency Medicine',
    'Pediatrics', 'Gastroenterology', 'Cancer Treatment', 'Radiation Therapy',
    'Surgical Oncology'
  ];

  const majorCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
    'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Chandigarh'
  ];

  const handleLocationSelect = (location: Hospital | Hotel) => {
    setSelectedLocation(location);
    setShowMap(true);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedState('');
    setSelectedSpecialty('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-2 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Find Hospitals & Hotels
            </h1>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search hospitals, hotels, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {majorCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Specialty (Hospitals)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle and Clear Filters */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Button
                variant={showMap ? "outline" : "default"}
                onClick={() => setShowMap(false)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={showMap ? "default" : "outline"}
                onClick={() => setShowMap(true)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Map View
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="lg:col-span-1">
              <SearchMap
                hospitals={hospitals}
                hotels={hotels}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Results Summary */}
            <div className="space-y-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Stethoscope className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{hospitals.length}</div>
                      <div className="text-sm text-gray-600">Hospitals</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{hotels.length}</div>
                      <div className="text-sm text-gray-600">Hotels</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedLocation && (
                <Card className="bg-white border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">Selected Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedLocation.address}, {selectedLocation.city}
                    </p>
                    {selectedLocation.phone && (
                      <p className="text-sm text-gray-600 mt-1">📞 {selectedLocation.phone}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="hospitals" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Hospitals ({hospitals.length})
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Hotels ({hotels.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hospitals" className="mt-0">
              {hospitalsLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading hospitals...</div>
                </div>
              ) : hospitals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">No hospitals found matching your criteria. Try adjusting your filters.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hospitals.map((hospital) => (
                    <HospitalCard
                      key={hospital.id}
                      hospital={hospital}
                      onViewOnMap={handleLocationSelect}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hotels" className="mt-0">
              {hotelsLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading hotels...</div>
                </div>
              ) : hotels.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">No hotels found matching your criteria. Try adjusting your filters.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onViewOnMap={handleLocationSelect}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

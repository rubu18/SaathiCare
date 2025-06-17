
import { useState } from 'react';
import { Star, MapPin, Clock, Shield, Heart, MessageCircle, Calendar, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCompanions } from '@/hooks/useCompanions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompanionsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const { companions, loading } = useCompanions();

  const specialties = [
    'all',
    'Elderly Care',
    'Post-Surgery Support',
    'Chronic Care',
    'Mental Health',
    'Women\'s Health',
    'Cardiology Visits',
    'Rehabilitation',
    'Family Support'
  ];

  const locations = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const priceRanges = ['all', 'Under ₹500', '₹500-₹1000', '₹1000-₹2000', 'Above ₹2000'];

  const filteredCompanions = companions.filter(companion => {
    if (companion.status !== 'Active') return false;
    
    if (selectedSpecialty !== 'all' && !companion.specialties.some(specialty => 
      specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    )) return false;
    
    if (selectedLocation !== 'all' && !companion.location.includes(selectedLocation)) return false;
    
    return true;
  });

  const clearFilters = () => {
    setSelectedSpecialty('all');
    setSelectedLocation('all');
    setSelectedPriceRange('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading companions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-medical-primary to-professional-teal-500 p-3 rounded-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our carefully vetted companions who are ready to support you during your medical visits
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-medical-blue-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-medical-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Companions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range === 'all' ? 'All Price Ranges' : range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-medical-blue-300 text-medical-blue-700 hover:bg-medical-blue-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-medical-primary">{filteredCompanions.length}</span> available companions
          </p>
        </div>

        {/* Companions Grid */}
        {filteredCompanions.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No companions found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={clearFilters} className="bg-medical-primary hover:bg-medical-primary-dark">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanions.map((companion) => (
              <Card key={companion.id} className="bg-white border-medical-blue-100 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="p-6">
                  {/* Companion Image Placeholder */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-medical-blue-100 to-medical-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-2xl font-bold text-medical-blue-600">
                        {companion.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Available
                      </Badge>
                    </div>
                  </div>

                  {/* Companion Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{companion.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">Age {companion.age} • {companion.experience} experience</p>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{companion.rating}</span>
                      <span className="text-sm text-gray-500">({companion.reviews} reviews)</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{companion.location}</span>
                    </div>

                    {/* Bio */}
                    {companion.bio && (
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{companion.bio}</p>
                    )}

                    {/* Specialties */}
                    {companion.specialties.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {companion.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-medical-blue-200 text-medical-blue-700 bg-medical-blue-50">
                              {specialty}
                            </Badge>
                          ))}
                          {companion.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs border-medical-blue-200 text-medical-blue-700 bg-medical-blue-50">
                              +{companion.specialties.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {companion.languages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Languages:</p>
                        <p className="text-sm text-gray-600">{companion.languages.join(', ')}</p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="text-center mb-6">
                      <span className="text-2xl font-bold text-medical-primary">{companion.price}</span>
                      <span className="text-sm text-gray-500 ml-1">per visit</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link to={`/book?companion=${companion.id}`} className="flex-1">
                        <Button className="w-full bg-medical-primary hover:bg-medical-primary-dark text-white font-medium shadow-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Visit
                        </Button>
                      </Link>
                      <Link to={`/chat?companion=${companion.id}`}>
                        <Button variant="outline" size="sm" className="border-medical-blue-300 text-medical-blue-700 hover:bg-medical-blue-50">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Trust Message */}
        <div className="text-center mt-16 p-8 bg-white/80 rounded-2xl border border-medical-blue-100">
          <Shield className="h-12 w-12 text-medical-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Every Companion is Carefully Chosen
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All our companions undergo thorough background checks, health screenings, and empathy training. 
            Your safety and comfort are our highest priorities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanionsPage;

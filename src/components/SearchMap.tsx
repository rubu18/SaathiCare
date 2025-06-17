
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';
import { Hospital } from '@/hooks/useHospitals';
import { Hotel } from '@/hooks/useHotels';

interface SearchMapProps {
  hospitals: Hospital[];
  hotels: Hotel[];
  selectedLocation?: Hospital | Hotel | null;
  onLocationSelect?: (location: Hospital | Hotel) => void;
}

const SearchMap = ({ hospitals, hotels, selectedLocation, onLocationSelect }: SearchMapProps) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi

  useEffect(() => {
    if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
      setMapCenter({
        lat: Number(selectedLocation.latitude),
        lng: Number(selectedLocation.longitude),
      });
    }
  }, [selectedLocation]);

  // For now, we'll show a placeholder map. In a real implementation, you'd integrate with Google Maps or Mapbox
  const allLocations = [...hospitals, ...hotels].filter(
    location => location.latitude && location.longitude
  );

  return (
    <Card className="bg-white border border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Map View</h3>
          <Badge variant="secondary" className="ml-auto">
            {allLocations.length} locations
          </Badge>
        </div>
      </div>
      
      <div className="relative h-96 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h4>
          <p className="text-sm text-gray-600 mb-4">
            Map integration will show {allLocations.length} locations including hospitals and hotels
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>• {hospitals.length} Hospitals</p>
            <p>• {hotels.length} Hotels</p>
            {selectedLocation && (
              <p className="font-medium text-blue-600">
                Selected: {selectedLocation.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Hospitals ({hospitals.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Hotels ({hotels.length})</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SearchMap;

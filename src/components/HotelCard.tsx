
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Bed, Wifi } from 'lucide-react';
import { Hotel } from '@/hooks/useHotels';

interface HotelCardProps {
  hotel: Hotel;
  onViewOnMap?: (hotel: Hotel) => void;
}

const HotelCard = ({ hotel, onViewOnMap }: HotelCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {hotel.name}
          </CardTitle>
          {hotel.star_rating && (
            <div className="flex">
              {renderStars(hotel.star_rating)}
            </div>
          )}
        </div>
        
        {hotel.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-900">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({hotel.total_reviews} reviews)
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700">{hotel.address}, {hotel.city}, {hotel.state}</span>
        </div>

        {hotel.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{hotel.phone}</span>
          </div>
        )}

        {hotel.price_range && (
          <div className="text-sm font-medium text-green-600">
            {hotel.price_range} per night
          </div>
        )}

        {hotel.rooms_available !== null && hotel.total_rooms !== null && (
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {hotel.rooms_available} available of {hotel.total_rooms} rooms
            </span>
          </div>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                  {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{hotel.amenities.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {hotel.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewOnMap?.(hotel)}
          >
            View on Map
          </Button>
          <Button size="sm" className="flex-1">
            Book Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;

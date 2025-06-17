
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Bed, Shield } from 'lucide-react';
import { Hospital } from '@/hooks/useHospitals';

interface HospitalCardProps {
  hospital: Hospital;
  onViewOnMap?: (hospital: Hospital) => void;
}

const HospitalCard = ({ hospital, onViewOnMap }: HospitalCardProps) => {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {hospital.name}
          </CardTitle>
          {hospital.emergency_services && (
            <Badge variant="destructive" className="ml-2">
              <Shield className="h-3 w-3 mr-1" />
              Emergency
            </Badge>
          )}
        </div>
        
        {hospital.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-900">
                {hospital.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({hospital.total_reviews} reviews)
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700">{hospital.address}, {hospital.city}, {hospital.state}</span>
        </div>

        {hospital.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{hospital.phone}</span>
          </div>
        )}

        {hospital.beds_available !== null && hospital.total_beds !== null && (
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {hospital.beds_available} available of {hospital.total_beds} beds
            </span>
          </div>
        )}

        {hospital.specialties && hospital.specialties.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {hospital.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {hospital.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{hospital.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {hospital.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{hospital.description}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewOnMap?.(hospital)}
          >
            View on Map
          </Button>
          <Button size="sm" className="flex-1">
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;


import { Shield, Award, Users, Clock } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: 'Verified Companions',
      description: 'Background checked & certified',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      icon: Award,
      title: 'Licensed Professionals',
      description: 'Trained healthcare support',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      icon: Users,
      title: '500+ Happy Patients',
      description: 'Trusted by families nationwide',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock assistance',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose SaathiCare?</h2>
          <p className="text-gray-600">Your safety and comfort are our top priorities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className={`border rounded-xl p-6 text-center ${badge.color}`}>
              <badge.icon className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">{badge.title}</h3>
              <p className="text-sm opacity-90">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;

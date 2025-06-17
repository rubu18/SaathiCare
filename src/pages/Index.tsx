
import { Link } from 'react-router-dom';
import { Heart, Search, Calendar, MessageCircle, Star, ArrowRight, Shield, Users, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TrustBadges from '@/components/TrustBadges';

const Index = () => {
  const features = [
    {
      icon: Search,
      title: 'Find Healthcare Facilities',
      description: 'Search hospitals and accommodations across India with detailed information and reviews.',
      link: '/search',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      icon: Users,
      title: 'Professional Companions',
      description: 'Connect with verified, compassionate companions for your medical appointments.',
      link: '/companions',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule your companion visits with flexible timing and transparent pricing.',
      link: '/book',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      icon: MessageCircle,
      title: 'Stay Connected',
      description: 'Communicate with your companion and receive updates throughout your visit.',
      link: '/chat',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'SaathiCare made my mother\'s surgery day so much easier. Our companion was professional and caring.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      text: 'Excellent service! The companion helped navigate the hospital and provided emotional support.',
      rating: 5
    },
    {
      name: 'Anjali Patel',
      location: 'Bangalore',
      text: 'Highly recommended. The peace of mind knowing someone trustworthy is with you is invaluable.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-blue-50 via-white to-professional-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-medical-primary to-professional-teal-500 p-4 rounded-2xl shadow-lg">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Trusted Healthcare
              <span className="bg-gradient-to-r from-medical-primary to-professional-teal-500 bg-clip-text text-transparent"> Companion</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Never face medical appointments alone. Connect with verified, compassionate companions 
              who provide professional support during your healthcare journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/companions">
                <Button size="lg" className="bg-medical-primary hover:bg-medical-primary-dark text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Find Your Companion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" size="lg" className="border-medical-primary text-medical-primary hover:bg-medical-blue-50 px-8 py-4 text-lg font-semibold">
                  Search Hospitals
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Verified Companions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span>Licensed Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Healthcare Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From finding the right hospital to booking a companion, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <Card className={`h-full border-2 ${feature.color} hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex justify-center">
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-medical-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Families Nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read what our patients and their families have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-medical-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medical-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-medical-blue-200 mb-8">
            Join thousands of families who trust SaathiCare for their healthcare companion needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-medical-blue-900 hover:bg-medical-blue-50 px-8 py-4 text-lg font-semibold">
                Sign Up Today
              </Button>
            </Link>
            <Link to="/companions">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-medical-blue-900 px-8 py-4 text-lg font-semibold">
                Browse Companions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

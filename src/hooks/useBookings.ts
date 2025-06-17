
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingData {
  companionId: string;
  patientName: string;
  patientAge?: number;
  phone: string;
  email?: string;
  appointmentDate: string;
  appointmentTime: string;
  hospitalName: string;
  hospitalAddress?: string;
  doctorName?: string;
  visitType?: string;
  specialRequirements?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  serviceFee: number;
  platformFee: number;
  totalAmount: number;
}

export interface Booking {
  id: string;
  companion_id: string;
  patient_name: string;
  patient_age?: number;
  phone: string;
  email?: string;
  appointment_date: string;
  appointment_time: string;
  hospital_name: string;
  hospital_address?: string;
  doctor_name?: string;
  visit_type?: string;
  special_requirements?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  status: string;
  total_amount: number;
  service_fee: number;
  platform_fee: number;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (bookingData: BookingData): Promise<Booking | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          companion_id: bookingData.companionId,
          patient_name: bookingData.patientName,
          patient_age: bookingData.patientAge,
          phone: bookingData.phone,
          email: bookingData.email,
          appointment_date: bookingData.appointmentDate,
          appointment_time: bookingData.appointmentTime,
          hospital_name: bookingData.hospitalName,
          hospital_address: bookingData.hospitalAddress,
          doctor_name: bookingData.doctorName,
          visit_type: bookingData.visitType,
          special_requirements: bookingData.specialRequirements,
          emergency_contact: bookingData.emergencyContact,
          emergency_phone: bookingData.emergencyPhone,
          service_fee: Math.round(bookingData.serviceFee * 100), // Convert to cents
          platform_fee: Math.round(bookingData.platformFee * 100), // Convert to cents
          total_amount: Math.round(bookingData.totalAmount * 100), // Convert to cents
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Confirmed! 🎉",
        description: "Your companion visit has been successfully booked. You'll receive a confirmation call within 30 minutes."
      });

      return data as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (): Promise<Booking[]> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    createBooking,
    getBookings,
    loading
  };
};

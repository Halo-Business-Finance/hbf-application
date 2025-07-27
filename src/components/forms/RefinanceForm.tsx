import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RefinanceFormData {
  amount_requested: number;
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  years_in_business: number;
  property_type: string;
  property_value: number;
  existing_loan_amount: number;
  monthly_income: number;
  property_address: string;
}

const RefinanceForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RefinanceFormData>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RefinanceFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your application.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user.id,
          loan_type: 'refinance',
          amount_requested: data.amount_requested,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          business_name: data.business_name,
          business_address: data.business_address,
          business_city: data.business_city,
          business_state: data.business_state,
          business_zip: data.business_zip,
          years_in_business: data.years_in_business,
          loan_details: {
            property_type: data.property_type,
            property_value: data.property_value,
            existing_loan_amount: data.existing_loan_amount,
            monthly_income: data.monthly_income,
            property_address: data.property_address,
          },
          status: 'submitted',
          application_submitted_date: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Application Submitted",
        description: "Your refinance application has been submitted successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Refinance Application</CardTitle>
          <CardDescription>
            Complete this form to apply for a property refinance loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Loan Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_requested">Loan Amount Requested *</Label>
                <Input
                  id="amount_requested"
                  type="number"
                  placeholder="Enter loan amount"
                  {...register('amount_requested', { 
                    required: 'Loan amount is required',
                    min: { value: 1000, message: 'Minimum loan amount is $1,000' }
                  })}
                />
                {errors.amount_requested && (
                  <p className="text-sm text-destructive">{errors.amount_requested.message}</p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  {...register('first_name', { required: 'First name is required' })}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  {...register('last_name', { required: 'Last name is required' })}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register('phone', { required: 'Phone number is required' })}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  placeholder="Enter business name"
                  {...register('business_name', { required: 'Business name is required' })}
                />
                {errors.business_name && (
                  <p className="text-sm text-destructive">{errors.business_name.message}</p>
                )}
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-2">
              <Label htmlFor="business_address">Business Address *</Label>
              <Input
                id="business_address"
                placeholder="Enter business address"
                {...register('business_address', { required: 'Business address is required' })}
              />
              {errors.business_address && (
                <p className="text-sm text-destructive">{errors.business_address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_city">City *</Label>
                <Input
                  id="business_city"
                  placeholder="City"
                  {...register('business_city', { required: 'City is required' })}
                />
                {errors.business_city && (
                  <p className="text-sm text-destructive">{errors.business_city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_state">State *</Label>
                <Input
                  id="business_state"
                  placeholder="State"
                  {...register('business_state', { required: 'State is required' })}
                />
                {errors.business_state && (
                  <p className="text-sm text-destructive">{errors.business_state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_zip">ZIP Code *</Label>
                <Input
                  id="business_zip"
                  placeholder="ZIP Code"
                  {...register('business_zip', { required: 'ZIP code is required' })}
                />
                {errors.business_zip && (
                  <p className="text-sm text-destructive">{errors.business_zip.message}</p>
                )}
              </div>
            </div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type *</Label>
                <Select onValueChange={(value) => setValue('property_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office Building</SelectItem>
                    <SelectItem value="retail">Retail Space</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="multifamily">Multifamily</SelectItem>
                    <SelectItem value="mixed_use">Mixed Use</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_value">Current Property Value *</Label>
                <Input
                  id="property_value"
                  type="number"
                  placeholder="Enter property value"
                  {...register('property_value', { 
                    required: 'Property value is required',
                    min: { value: 1, message: 'Property value must be greater than 0' }
                  })}
                />
                {errors.property_value && (
                  <p className="text-sm text-destructive">{errors.property_value.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="existing_loan_amount">Existing Loan Balance *</Label>
                <Input
                  id="existing_loan_amount"
                  type="number"
                  placeholder="Enter existing loan balance"
                  {...register('existing_loan_amount', { 
                    required: 'Existing loan balance is required',
                    min: { value: 0, message: 'Loan balance cannot be negative' }
                  })}
                />
                {errors.existing_loan_amount && (
                  <p className="text-sm text-destructive">{errors.existing_loan_amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_in_business">Years in Business *</Label>
                <Input
                  id="years_in_business"
                  type="number"
                  placeholder="Years in business"
                  {...register('years_in_business', { 
                    required: 'Years in business is required',
                    min: { value: 0, message: 'Years cannot be negative' }
                  })}
                />
                {errors.years_in_business && (
                  <p className="text-sm text-destructive">{errors.years_in_business.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_income">Monthly Business Income *</Label>
              <Input
                id="monthly_income"
                type="number"
                placeholder="Enter monthly business income"
                {...register('monthly_income', { 
                  required: 'Monthly income is required',
                  min: { value: 0, message: 'Income cannot be negative' }
                })}
              />
              {errors.monthly_income && (
                <p className="text-sm text-destructive">{errors.monthly_income.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_address">Property Address *</Label>
              <Textarea
                id="property_address"
                placeholder="Enter complete property address"
                {...register('property_address', { required: 'Property address is required' })}
              />
              {errors.property_address && (
                <p className="text-sm text-destructive">{errors.property_address.message}</p>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 text-lg"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefinanceForm;
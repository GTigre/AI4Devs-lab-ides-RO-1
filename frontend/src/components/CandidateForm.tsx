import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useToast } from '../hooks/useToast';
import { createCandidate, updateCandidate } from '../store/slices/candidateSlice';
import { Candidate } from '../types/candidate';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select';

const candidateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  education: z.string().min(2, 'Education must be at least 2 characters'),
  experience: z.string().min(2, 'Experience must be at least 2 characters'),
  processStatus: z.enum(['NEW', 'IN_REVIEW', 'DISCARDED', 'FINALIST', 'HIRED']).optional(),
  consentAccepted: z.boolean(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  candidate?: Candidate;
  onSuccess?: () => void;
}

export function CandidateForm({ candidate, onSuccess }: CandidateFormProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: candidate,
  });

  const onSubmit = async (data: CandidateFormData) => {
    try {
      if (candidate) {
        await dispatch(updateCandidate({ id: candidate.id, candidate: data })).unwrap();
        toast({
          title: 'Success',
          description: 'Candidate updated successfully',
        });
      } else {
        await dispatch(createCandidate(data)).unwrap();
        toast({
          title: 'Success',
          description: 'Candidate created successfully',
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          {...register('country')}
          error={errors.country?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register('address')}
          error={errors.address?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          {...register('education')}
          error={errors.education?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          {...register('experience')}
          error={errors.experience?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="processStatus">Process Status</Label>
        <Select
          defaultValue={candidate?.processStatus}
          onValueChange={(value) => register('processStatus').onChange({ target: { value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="DISCARDED">Discarded</SelectItem>
            <SelectItem value="FINALIST">Finalist</SelectItem>
            <SelectItem value="HIRED">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="consentAccepted"
          {...register('consentAccepted')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="consentAccepted">I consent to the processing of my data</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : candidate ? 'Update' : 'Create'}
      </Button>
    </form>
  );
} 
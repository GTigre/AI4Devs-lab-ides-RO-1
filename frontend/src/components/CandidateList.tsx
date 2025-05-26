import { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useToast } from '../hooks/useToast';
import { fetchCandidates, deleteCandidate } from '../store/slices/candidateSlice';
import { Candidate } from '../types/candidate';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import { CandidateForm } from './CandidateForm';
import { RootState } from '../store';

export function CandidateList() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { candidates, loading, error } = useAppSelector((state: RootState) => state.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCandidate(id)).unwrap();
      toast({
        title: 'Success',
        description: 'Candidate deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete candidate',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Candidate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>
            <CandidateForm
              onSuccess={() => {
                setIsDialogOpen(false);
                dispatch(fetchCandidates());
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {candidates.map((candidate: Candidate) => (
          <div
            key={candidate.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <p className="text-gray-600">{candidate.email}</p>
                <p className="text-gray-600">{candidate.phone}</p>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Candidate</DialogTitle>
                    </DialogHeader>
                    <CandidateForm
                      candidate={selectedCandidate}
                      onSuccess={() => {
                        dispatch(fetchCandidates());
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(candidate.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Country:</span> {candidate.country}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {candidate.address}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Education:</span>{' '}
                  {candidate.education}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{' '}
                  {candidate.experience}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <p>
                <span className="font-medium">Status:</span>{' '}
                {candidate.processStatus}
              </p>
              {candidate.cvUrl && (
                <a
                  href={candidate.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View CV
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
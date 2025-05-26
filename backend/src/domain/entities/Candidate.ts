import { ProcessStatus } from '@prisma/client';

export interface CandidateProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  education: string;
  experience: string;
  processStatus?: ProcessStatus;
  cvUrl?: string;
  consentAccepted: boolean;
  consentAcceptedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Candidate {
  private readonly props: CandidateProps;

  constructor(props: CandidateProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get country(): string {
    return this.props.country;
  }

  get address(): string {
    return this.props.address;
  }

  get education(): string {
    return this.props.education;
  }

  get experience(): string {
    return this.props.experience;
  }

  get processStatus(): ProcessStatus {
    return this.props.processStatus || ProcessStatus.NEW;
  }

  get cvUrl(): string | undefined {
    return this.props.cvUrl;
  }

  get consentAccepted(): boolean {
    return this.props.consentAccepted;
  }

  get consentAcceptedAt(): Date | undefined {
    return this.props.consentAcceptedAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public toJSON(): CandidateProps {
    return {
      ...this.props,
    };
  }
} 
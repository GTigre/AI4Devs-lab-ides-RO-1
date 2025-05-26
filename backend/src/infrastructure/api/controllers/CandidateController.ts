import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../../../application/services/CandidateService';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { ProcessStatus } from '@prisma/client';
import { Logger } from '../../logging/Logger';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService(new PrismaCandidateRepository());
  }

  createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.createCandidate(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      next(error);
    }
  };

  getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error('User not authenticated');
      const candidate = await this.candidateService.getCandidateByUserId(req.user.id);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error('User not authenticated');
      const candidate = await this.candidateService.updateCandidateByUserId(req.user.id, req.body);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  listCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.listCandidates();
      res.json(candidates);
    } catch (error) {
      next(error);
    }
  };

  getCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.getCandidate(req.params.id);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.updateCandidate(req.params.id, req.body);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  updateProcessStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (!Object.values(ProcessStatus).includes(status)) {
        throw new Error('Invalid process status');
      }
      const candidate = await this.candidateService.updateProcessStatus(req.params.id, status);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.candidateService.deleteCandidate(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 
import { Router } from 'express';
import { CandidateService } from '../../../application/services/CandidateService';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { FileStorageService } from '../../storage/FileStorageService';
import { upload } from '../middleware/fileUpload';
import { validate, candidateSchema } from '../middleware/validation';
import { Logger } from '../../logging/Logger';
import { CandidateController } from '../controllers/CandidateController';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const candidateService = new CandidateService(new PrismaCandidateRepository());
const fileStorageService = new FileStorageService();
const candidateController = new CandidateController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - country
 *         - address
 *         - education
 *         - experience
 *         - consentAccepted
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         country:
 *           type: string
 *         address:
 *           type: string
 *         education:
 *           type: string
 *         experience:
 *           type: string
 *         processStatus:
 *           type: string
 *           enum: [NEW, IN_REVIEW, DISCARDED, FINALIST, HIRED]
 *         cvUrl:
 *           type: string
 *         consentAccepted:
 *           type: boolean
 *         consentAcceptedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create a new candidate
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post('/', validate(candidateSchema), async (req, res, next) => {
  try {
    const candidate = await candidateService.createCandidate(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     responses:
 *       200:
 *         description: List of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidate'
 */
router.get('/', requireRole([UserRole.RECRUITER]), async (req, res, next) => {
  try {
    const candidates = await candidateService.listCandidates();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Get a candidate by ID
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate found
 *       404:
 *         description: Candidate not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const candidate = await candidateService.getCandidate(req.params.id);
    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/candidates/{id}:
 *   put:
 *     summary: Update a candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       200:
 *         description: Candidate updated successfully
 *       404:
 *         description: Candidate not found
 */
router.put('/:id', validate(candidateSchema), async (req, res, next) => {
  try {
    const candidate = await candidateService.updateCandidate(req.params.id, req.body);
    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/candidates/{id}:
 *   delete:
 *     summary: Delete a candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Candidate deleted successfully
 *       404:
 *         description: Candidate not found
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await candidateService.deleteCandidate(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/candidates/{id}/cv:
 *   post:
 *     summary: Upload a candidate's CV
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploaded successfully
 *       400:
 *         description: Invalid file format or size
 *       404:
 *         description: Candidate not found
 */
router.post('/:id/cv', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileUrl = await fileStorageService.uploadFile(req.file, req.params.id);
    const candidate = await candidateService.updateCandidate(req.params.id, { cvUrl: fileUrl });
    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.use(authenticate);

// Candidate routes
router.get('/me', requireRole([UserRole.CANDIDATE]), candidateController.getMyProfile);
router.put('/me', requireRole([UserRole.CANDIDATE]), candidateController.updateMyProfile);

// Recruiter routes
router.get('/', requireRole([UserRole.RECRUITER]), candidateController.listCandidates);
router.get('/:id', requireRole([UserRole.RECRUITER]), candidateController.getCandidate);
router.put('/:id', requireRole([UserRole.RECRUITER]), candidateController.updateCandidate);
router.put('/:id/status', requireRole([UserRole.RECRUITER]), candidateController.updateProcessStatus);
router.delete('/:id', requireRole([UserRole.RECRUITER]), candidateController.deleteCandidate);

export default router; 
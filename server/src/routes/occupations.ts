/**
 * SkillBridge AI — Public Occupation Routes
 *
 * GET /api/occupations            — list with search/filter/pagination
 * GET /api/occupations/sectors    — available sectors
 * GET /api/occupations/search     — alias for list
 * GET /api/occupations/:id        — occupation detail
 * GET /api/occupations/:id/skills — occupation competencies
 */

import { Router } from "express";
import {
  getOccupations,
  getSectors,
  getOccupationById,
  getOccupationSkills,
} from "../controllers/occupationController";

const router = Router();

// Important: specific paths must be declared BEFORE /:id to avoid conflicts
router.get("/sectors", getSectors);
router.get("/search", getOccupations);    // alias
router.get("/", getOccupations);
router.get("/:id/skills", getOccupationSkills);
router.get("/:id", getOccupationById);

export default router;

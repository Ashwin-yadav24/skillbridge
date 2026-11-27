/**
 * SkillBridge AI — Admin Occupation Routes
 *
 * All routes require authentication + "admin" role.
 *
 * POST   /api/admin/occupations            — create
 * GET    /api/admin/occupations            — list all (incl. inactive)
 * PATCH  /api/admin/occupations/:id        — update
 * DELETE /api/admin/occupations/:id        — deactivate (soft delete)
 * POST   /api/admin/occupations/:id/skills — map skill to occupation
 * POST   /api/admin/occupations/import     — import CSV/JSON/Excel
 * GET    /api/admin/import-history         — import audit log
 * GET    /api/admin/skills                 — list skills
 */

import { Router } from "express";
import { requireAuth } from "../../middleware/clerkAuth";
import { requireRole } from "../../middleware/roleAuth";
import {
  createOccupation,
  updateOccupation,
  deleteOccupation,
  handleImport,
  getImportHistory,
  adminListOccupations,
  listSkills,
  mapSkillToOccupation,
  importUpload,
} from "../../controllers/adminOccupationController";

const router = Router();

// All admin occupation routes require auth + admin role
router.use(requireAuth, requireRole("admin"));

// Order: specific paths first, then parameterised
router.get("/import-history", getImportHistory);
router.get("/skills", listSkills);
router.post("/import", importUpload.single("file"), handleImport);

router.get("/", adminListOccupations);
router.post("/", createOccupation);

router.patch("/:id", updateOccupation);
router.delete("/:id", deleteOccupation);
router.post("/:id/skills", mapSkillToOccupation);

export default router;

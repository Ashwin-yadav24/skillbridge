/**
 * SkillBridge AI — Demo Seed Script
 *
 * Seeds the database with clearly labelled DEMO DATA.
 * Run with: npx tsx src/scripts/seedDemo.ts
 *
 * IMPORTANT:
 * - All seeded records are tagged verificationStatus: "demo"
 * - Source is "SkillBridge Demo Data" — not an official government dataset
 * - QP codes are intentionally omitted from demo records
 * - To clear and re-seed: set FORCE_RESEED=true in env
 */

import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { Sector } from "../models/Sector";
import { Skill } from "../models/Skill";
import { Occupation } from "../models/Occupation";
import { OccupationSkill } from "../models/OccupationSkill";
import demoData from "../data/demo-occupations.json";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env");
  process.exit(1);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeSkillName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

type DemoSkill = {
  name: string;
  category: string;
  mandatory: boolean;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  weight: number;
  description: string;
};

type DemoOccupation = {
  title: string;
  slug: string;
  description: string;
  subSector: string;
  nsqfLevel: number;
  minimumEducation: string;
  qualificationCriteria: string;
  skills: DemoSkill[];
};

type DemoSectorBlock = {
  _demo_notice: string;
  sector: string;
  occupations: DemoOccupation[];
};

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅ Connected to MongoDB");

  const forceReseed = process.env.FORCE_RESEED === "true";
  if (!forceReseed) {
    const existing = await Occupation.countDocuments({ verificationStatus: "demo" });
    if (existing > 0) {
      console.log(
        `ℹ️  Found ${existing} existing demo occupation(s). Skipping seed. Set FORCE_RESEED=true to overwrite.`
      );
      await mongoose.disconnect();
      return;
    }
  } else {
    console.log("⚠️  FORCE_RESEED=true — clearing existing demo records…");
    const demoOccupations = await Occupation.find({ verificationStatus: "demo" }).select("_id").lean();
    const demoIds = demoOccupations.map((o) => o._id);
    await OccupationSkill.deleteMany({ occupationId: { $in: demoIds } });
    await Occupation.deleteMany({ verificationStatus: "demo" });
    await Skill.deleteMany({ verificationStatus: "demo" });
    await Sector.deleteMany({ isActive: true });
    console.log("🗑️  Cleared existing demo records.");
  }

  const demoBlocks = demoData as DemoSectorBlock[];
  let totalOccupations = 0;
  let totalSkills = 0;
  let totalLinks = 0;

  for (const block of demoBlocks) {
    // Upsert sector
    const sectorSlug = slugify(block.sector);
    const sectorDoc = await Sector.findOneAndUpdate(
      { slug: sectorSlug },
      {
        $setOnInsert: {
          name: block.sector,
          slug: sectorSlug,
          description: `${block.sector} sector — DEMO data`,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    for (const occ of block.occupations) {
      // Upsert occupation
      const occDoc = await Occupation.findOneAndUpdate(
        { slug: occ.slug },
        {
          $set: {
            title: occ.title,
            slug: occ.slug,
            description: occ.description,
            sector: sectorDoc._id,
            subSector: occ.subSector,
            nsqfLevel: occ.nsqfLevel,
            minimumEducation: occ.minimumEducation,
            qualificationCriteria: occ.qualificationCriteria,
            verificationStatus: "demo",
            isActive: true,
            sourceInformation: {
              name: "SkillBridge Demo Data",
              url: "https://skillbridge.demo/data",
              identifier: `DEMO-${occ.slug.toUpperCase()}`,
              importedAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      );

      totalOccupations++;

      // Upsert skills and link to occupation
      for (const sk of occ.skills) {
        const normalized = normalizeSkillName(sk.name);

        const skillDoc = await Skill.findOneAndUpdate(
          { normalizedName: normalized },
          {
            $setOnInsert: {
              name: sk.name,
              normalizedName: normalized,
              category: sk.category,
              description: sk.description,
              synonyms: [],
              relatedSkills: [],
              verificationStatus: "demo",
              sourceInformation: {
                name: "SkillBridge Demo Data",
                importedAt: new Date(),
              },
            },
          },
          { upsert: true, new: true }
        );

        totalSkills++;

        // Upsert the junction record
        await OccupationSkill.findOneAndUpdate(
          { occupationId: occDoc._id, skillId: skillDoc._id },
          {
            $set: {
              competencyDescription: sk.description,
              importanceWeight: sk.weight,
              proficiencyExpectation: sk.proficiency,
              mandatory: sk.mandatory,
              sourceReference: "SkillBridge Demo Data",
            },
          },
          { upsert: true }
        );

        totalLinks++;
      }
    }
  }

  console.log(`✅ Seed complete:`);
  console.log(`   Occupations : ${totalOccupations}`);
  console.log(`   Skills      : ${totalSkills}`);
  console.log(`   OccSkill links: ${totalLinks}`);

  await mongoose.disconnect();
  console.log("👋 Disconnected.");
}

main().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});

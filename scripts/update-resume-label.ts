// ============================================================
// One-off data migration: rename the old "Optimize Your Resume"
// label/title to "Fix & Improve My Resume" (and its matching
// description) in existing RebuildPlan.todaysAction and
// .topPriorities JSON, generated before the copy change.
//
// Usage: npx tsx scripts/update-resume-label.ts
// ============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const OLD_TITLE = 'Optimize Your Resume'
const NEW_TITLE = 'Fix & Improve My Resume'
const OLD_DESCRIPTION = 'Run your resume through the AI Resume Intelligence System to identify quick improvements.'
const NEW_DESCRIPTION = "Upload your resume and we'll analyze it, improve it, and help you present your experience in the best possible way."

async function main() {
  const plans = await prisma.rebuildPlan.findMany({
    select: { id: true, todaysAction: true, topPriorities: true },
  })

  let updatedCount = 0

  for (const plan of plans) {
    let changed = false

    const todaysAction = plan.todaysAction as any
    if (todaysAction?.title === OLD_TITLE) {
      todaysAction.title = NEW_TITLE
      changed = true
    }
    if (todaysAction?.description === OLD_DESCRIPTION) {
      todaysAction.description = NEW_DESCRIPTION
      changed = true
    }

    const topPriorities = plan.topPriorities as any[]
    for (const priority of topPriorities ?? []) {
      if (priority?.label === OLD_TITLE) {
        priority.label = NEW_TITLE
        changed = true
      }
    }

    if (!changed) continue

    await prisma.rebuildPlan.update({
      where: { id: plan.id },
      data: { todaysAction, topPriorities },
    })
    updatedCount++
  }

  console.log(`Updated ${updatedCount} of ${plans.length} RebuildPlan records.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

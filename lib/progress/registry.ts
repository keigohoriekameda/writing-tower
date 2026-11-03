import { ProgressSync } from "@/lib/progress/sync"

/**
 * One ProgressSync per signed-in student, shared by every component on the
 * page. Without this each component that calls useProgress() had its own
 * copy: separate cloud reads, and a repeat completion (e.g. the re-review
 * screen) re-sent a Day the cloud already had.
 */
const instances = new Map<string, ProgressSync>()

export function getProgressSync(userId: string, create: () => ProgressSync): ProgressSync {
  let sync = instances.get(userId)
  if (!sync) {
    sync = create()
    instances.set(userId, sync)
  }
  return sync
}

/** Called on sign-out so the next login re-reads the cloud and nothing carries over. */
export function clearProgressSyncs(): void {
  instances.clear()
}

/** Per-student, per-lesson draft kept on this device so a failure or reload never loses the student's English. */
function draftKey(studentId: string, lessonId: string): string {
  return `writing-tower-draft-${studentId}-${lessonId}`
}

export function loadDraft(studentId: string, lessonId: string): string {
  try {
    return localStorage.getItem(draftKey(studentId, lessonId)) ?? ""
  } catch {
    return ""
  }
}

export function saveDraft(studentId: string, lessonId: string, text: string): void {
  try {
    if (text === "") localStorage.removeItem(draftKey(studentId, lessonId))
    else localStorage.setItem(draftKey(studentId, lessonId), text)
  } catch {
    // Storage may be unavailable (private mode); the in-memory text still works.
  }
}

export function clearDraft(studentId: string, lessonId: string): void {
  saveDraft(studentId, lessonId, "")
}

import type { UUID } from "node:crypto";

export interface ResumeReport {
    id: UUID,
    user_id: UUID,
    overall_score: number,
    summary: string,
    report_details: any,
    created_at: Date
}
// types/session.ts
export interface StageData {
    [key: string]: any;
}

export interface SessionStages {
    [key: number]: StageData;
}

export interface Session {
    id: string | null;
    current_stage: number;
    stages: SessionStages;
    created_at?: Date;
    updated_at?: Date;
}

export interface SessionState {
    sessionId: string | null;
    currentStage: number;
    stages: SessionStages;
    loading: boolean;
}

export type StageDirection = 'next' | 'previous';

export interface User {
    id: string;
    name: string;
    email: string;
}


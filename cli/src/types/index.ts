export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  recommendation?: string;
}

export interface ProgressData {
  overall: number;
  phases: PhaseProgress[];
  nextAction?: string;
}

export interface PhaseProgress {
  number: number;
  name: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  features: FeatureProgress[];
}

export interface FeatureProgress {
  number: number;
  name: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

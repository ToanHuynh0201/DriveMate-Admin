export type ExamConfigStatus = 'active' | 'inactive' | 'draft';

export type ExamLicenseClass = 'A1' | 'A2' | 'B1' | 'B2' | 'C';

export interface TopicDistribution {
  bienBao: number;
  luatGT: number;
  kyThuat: number;
  tinhHuong: number;
}

export interface ExamConfig {
  id: string;
  licenseClass: ExamLicenseClass;
  name: string;
  description?: string;
  totalQuestions: number;
  criticalQuestions: number;
  duration: number;
  passingScore: number;
  maxCriticalMistakes: number;
  shuffleQuestions: boolean;
  topicDistribution: TopicDistribution;
  status: ExamConfigStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExamConfigFormData {
  licenseClass: ExamLicenseClass | '';
  name: string;
  description: string;
  totalQuestions: number;
  criticalQuestions: number;
  duration: number;
  passingScore: number;
  maxCriticalMistakes: number;
  shuffleQuestions: boolean | '';
}

export function calcTopicDistribution(total: number): TopicDistribution {
  const bienBao = Math.round(total * 0.27);
  const luatGT = Math.round(total * 0.33);
  const kyThuat = Math.round(total * 0.23);
  const tinhHuong = total - bienBao - luatGT - kyThuat;
  return { bienBao, luatGT, kyThuat, tinhHuong };
}

export const LICENSE_CLASS_CONFIG_DEFAULTS: Record<
  ExamLicenseClass,
  Omit<ExamConfigFormData, 'licenseClass' | 'name' | 'description' | 'shuffleQuestions'>
> = {
  A1: { totalQuestions: 25, criticalQuestions: 5, duration: 19, passingScore: 21, maxCriticalMistakes: 1 },
  A2: { totalQuestions: 25, criticalQuestions: 5, duration: 19, passingScore: 21, maxCriticalMistakes: 1 },
  B1: { totalQuestions: 30, criticalQuestions: 7, duration: 22, passingScore: 27, maxCriticalMistakes: 1 },
  B2: { totalQuestions: 35, criticalQuestions: 8, duration: 25, passingScore: 32, maxCriticalMistakes: 1 },
  C:  { totalQuestions: 40, criticalQuestions: 10, duration: 30, passingScore: 36, maxCriticalMistakes: 1 },
};

export const EXAM_LICENSE_CLASSES: ExamLicenseClass[] = ['A1', 'A2', 'B1', 'B2', 'C'];

export const EXAM_CONFIG_STATUS_LABELS: Record<ExamConfigStatus, string> = {
  active: 'Đang áp dụng',
  inactive: 'Ngừng áp dụng',
  draft: 'Bản nháp',
};

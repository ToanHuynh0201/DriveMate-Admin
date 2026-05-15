import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXAM_CONFIG_STATS, MOCK_EXAM_CONFIGS } from '../../data/examConfigData';
import type { ExamConfig } from '../../types/exam-config.types';
import { EXAM_CONFIG_STATUS_LABELS } from '../../types/exam-config.types';
import './ExamConfigManagementPage.css';

function ExamConfigCard({
  config,
  onEdit,
  onView,
}: {
  config: ExamConfig;
  onEdit: (id: string) => void;
  onView: (config: ExamConfig) => void;
}) {
  return (
    <div className="ec-card">
      <div className="ec-card__top">
        <div className="ec-card__badge">{config.licenseClass}</div>
        <div className="ec-card__info">
          <div className="ec-card__class-name">Hạng {config.licenseClass}</div>
          <span className={`ec-card__status ec-card__status--${config.status}`}>
            {EXAM_CONFIG_STATUS_LABELS[config.status]}
          </span>
        </div>
      </div>

      <div className="ec-card__stats">
        <div className="ec-card__stat-row">
          <span className="ec-card__stat-label">Tổng số câu:</span>
          <span className="ec-card__stat-value">{config.totalQuestions} câu</span>
        </div>
        <div className="ec-card__stat-row">
          <span className="ec-card__stat-label">Câu điểm liệt:</span>
          <span className="ec-card__stat-value ec-card__stat-value--red">{config.criticalQuestions} câu</span>
        </div>
        <div className="ec-card__stat-row">
          <span className="ec-card__stat-label">Thời gian:</span>
          <span className="ec-card__stat-value">{config.duration} phút</span>
        </div>
        <div className="ec-card__stat-row">
          <span className="ec-card__stat-label">Điểm chuẩn:</span>
          <span className="ec-card__stat-value ec-card__stat-value--orange">
            {config.passingScore}/{config.totalQuestions}
          </span>
        </div>
        <div className="ec-card__stat-row">
          <span className="ec-card__stat-label">Sai liệt tối đa:</span>
          <span className="ec-card__stat-value ec-card__stat-value--red">{config.maxCriticalMistakes} câu</span>
        </div>
      </div>

      <div className="ec-card__actions">
        <button className="ec-card__btn-edit" onClick={() => onEdit(config.id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Chỉnh Sửa
        </button>
        <button className="ec-card__btn-view" onClick={() => onView(config)} title="Xem chi tiết">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DetailModal({ config, onClose }: { config: ExamConfig; onClose: () => void }) {
  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ec-modal__header">
          <div className="ec-modal__title-row">
            <div className="ec-modal__badge">{config.licenseClass}</div>
            <div>
              <h2>{config.name}</h2>
              <span className={`ec-card__status ec-card__status--${config.status}`}>
                {EXAM_CONFIG_STATUS_LABELS[config.status]}
              </span>
            </div>
          </div>
          <button className="ec-modal__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {config.description && (
          <p className="ec-modal__desc">{config.description}</p>
        )}

        <div className="ec-modal__section-title">Thông Tin Đề Thi</div>
        <div className="ec-modal__grid">
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Tổng số câu</span>
            <span className="ec-modal__item-value">{config.totalQuestions} câu</span>
          </div>
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Câu điểm liệt</span>
            <span className="ec-modal__item-value ec-modal__item-value--red">{config.criticalQuestions} câu</span>
          </div>
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Thời gian làm bài</span>
            <span className="ec-modal__item-value">{config.duration} phút</span>
          </div>
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Điểm chuẩn</span>
            <span className="ec-modal__item-value ec-modal__item-value--orange">
              {config.passingScore}/{config.totalQuestions}
            </span>
          </div>
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Sai liệt tối đa</span>
            <span className="ec-modal__item-value ec-modal__item-value--red">{config.maxCriticalMistakes} câu</span>
          </div>
          <div className="ec-modal__item">
            <span className="ec-modal__item-label">Xáo trộn câu hỏi</span>
            <span className="ec-modal__item-value">{config.shuffleQuestions ? 'Có' : 'Không'}</span>
          </div>
        </div>

        <div className="ec-modal__section-title">Phân Bố Câu Hỏi Theo Chủ Đề</div>
        <div className="ec-modal__topics">
          <div className="ec-modal__topic-row">
            <span>Biển báo</span>
            <span>{config.topicDistribution.bienBao} câu</span>
          </div>
          <div className="ec-modal__topic-row">
            <span>Luật GT</span>
            <span>{config.topicDistribution.luatGT} câu</span>
          </div>
          <div className="ec-modal__topic-row">
            <span>Kỹ thuật</span>
            <span>{config.topicDistribution.kyThuat} câu</span>
          </div>
          <div className="ec-modal__topic-row">
            <span>Tình huống</span>
            <span>{config.topicDistribution.tinhHuong} câu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamConfigManagementPage() {
  const navigate = useNavigate();
  const [selectedConfig, setSelectedConfig] = useState<ExamConfig | null>(null);

  return (
    <div className="ec-management">
      <div className="ec-management__header">
        <div>
          <h1>Cấu Hình Đề Thi</h1>
          <p>Quản lý cấu hình đề thi theo từng hạng bằng lái</p>
        </div>
        <button className="ec-management__add-btn" onClick={() => navigate('/exam-config/new')}>
          + Thêm Cấu Hình
        </button>
      </div>

      <div className="ec-info-card">
        <div className="ec-info-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
        </div>
        <div>
          <div className="ec-info-card__title">Thông Tin Cấu Hình Đề Thi</div>
          <p className="ec-info-card__desc">
            Mỗi hạng bằng lái có cấu hình đề thi riêng biệt bao gồm: số lượng câu hỏi, số câu liệt, thời gian làm bài, điểm chuẩn và số câu liệt tối đa được sai.
          </p>
        </div>
      </div>

      <div className="ec-cards-grid">
        {MOCK_EXAM_CONFIGS.map((config) => (
          <ExamConfigCard
            key={config.id}
            config={config}
            onEdit={(id) => navigate(`/exam-config/${id}/edit`)}
            onView={setSelectedConfig}
          />
        ))}
      </div>

      <div className="ec-stats-bar">
        <div className="ec-stats-bar__item">
          <div className="ec-stats-bar__icon ec-stats-bar__icon--yellow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="ec-stats-bar__label">Đề thi đã tạo</div>
            <div className="ec-stats-bar__value">{EXAM_CONFIG_STATS.totalExams.toLocaleString('vi-VN')}</div>
          </div>
        </div>
        <div className="ec-stats-bar__item">
          <div className="ec-stats-bar__icon ec-stats-bar__icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
          </div>
          <div>
            <div className="ec-stats-bar__label">Cấu hình đang dùng</div>
            <div className="ec-stats-bar__value">{EXAM_CONFIG_STATS.activeConfigs}</div>
          </div>
        </div>
        <div className="ec-stats-bar__item">
          <div className="ec-stats-bar__icon ec-stats-bar__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <div className="ec-stats-bar__label">Bài thi đã làm</div>
            <div className="ec-stats-bar__value">{EXAM_CONFIG_STATS.totalAttempts.toLocaleString('vi-VN')}</div>
          </div>
        </div>
      </div>

      {selectedConfig && (
        <DetailModal config={selectedConfig} onClose={() => setSelectedConfig(null)} />
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_EXAM_CONFIGS } from '../../data/examConfigData';
import type { ExamConfigFormData } from '../../types/exam-config.types';
import {
  calcTopicDistribution,
  EXAM_LICENSE_CLASSES,
  LICENSE_CLASS_CONFIG_DEFAULTS,
} from '../../types/exam-config.types';
import './AddExamConfigPage.css';

const DEFAULT_FORM: ExamConfigFormData = {
  licenseClass: '',
  name: '',
  description: '',
  totalQuestions: 30,
  criticalQuestions: 7,
  duration: 22,
  passingScore: 27,
  maxCriticalMistakes: 1,
  shuffleQuestions: '',
};

export default function AddExamConfigPage() {
  const { configId } = useParams<{ configId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(configId);

  const [form, setForm] = useState<ExamConfigFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (isEdit && configId) {
      const config = MOCK_EXAM_CONFIGS.find((c) => c.id === configId);
      if (config) {
        setForm({
          licenseClass: config.licenseClass,
          name: config.name,
          description: config.description ?? '',
          totalQuestions: config.totalQuestions,
          criticalQuestions: config.criticalQuestions,
          duration: config.duration,
          passingScore: config.passingScore,
          maxCriticalMistakes: config.maxCriticalMistakes,
          shuffleQuestions: config.shuffleQuestions,
        });
      }
    }
  }, [isEdit, configId]);

  const updateForm = (patch: Partial<ExamConfigFormData>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleLicenseClassChange = (cls: string) => {
    if (cls && cls in LICENSE_CLASS_CONFIG_DEFAULTS) {
      const key = cls as keyof typeof LICENSE_CLASS_CONFIG_DEFAULTS;
      updateForm({ licenseClass: key, ...LICENSE_CLASS_CONFIG_DEFAULTS[key] });
    } else {
      updateForm({ licenseClass: cls as ExamConfigFormData['licenseClass'] });
    }
  };

  const topicDist = useMemo(
    () => calcTopicDistribution(form.totalQuestions),
    [form.totalQuestions],
  );

  const previewClass = form.licenseClass || 'B1';

  const handleSubmit = () => {
    navigate('/exam-config');
  };

  return (
    <div className="add-ec">
      <div className="add-ec__header">
        <div className="add-ec__header-left">
          <button className="add-ec__back" onClick={() => navigate('/exam-config')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h1>{isEdit ? 'Chỉnh Sửa Cấu Hình' : 'Thêm Cấu Hình Mới'}</h1>
            <p>{isEdit ? 'Cập nhật cấu hình đề thi' : 'Tạo cấu hình đề thi mới'}</p>
          </div>
        </div>
      </div>

      <div className="add-ec__body">
        {/* Main form */}
        <div className="add-ec__main">

          {/* Section 1: Thông Tin Cơ Bản */}
          <div className="add-ec__section">
            <div className="add-ec__section-title">Thông Tin Cơ Bản</div>
            <div className="add-ec__form-body">
              <div className="add-ec__form-group">
                <label>
                  Hạng bằng lái <span className="add-ec__required">*</span>
                </label>
                <select
                  value={form.licenseClass}
                  onChange={(e) => handleLicenseClassChange(e.target.value)}
                >
                  <option value="">Chọn hạng bằng</option>
                  {EXAM_LICENSE_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="add-ec__form-group">
                <label>Tên cấu hình</label>
                <input
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="VD: Cấu hình đề thi B1 chuẩn"
                />
              </div>

              <div className="add-ec__form-group">
                <label>Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về cấu hình này..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cấu Hình Câu Hỏi */}
          <div className="add-ec__section">
            <div className="add-ec__section-title">Cấu Hình Câu Hỏi</div>
            <div className="add-ec__form-body">
              <div className="add-ec__form-row">
                <div className="add-ec__form-group">
                  <label>
                    Tổng số câu hỏi <span className="add-ec__required">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.totalQuestions}
                    onChange={(e) => updateForm({ totalQuestions: Number(e.target.value) })}
                  />
                  <span className="add-ec__hint">Số câu hỏi trong 1 đề thi</span>
                </div>
                <div className="add-ec__form-group">
                  <label>
                    Số câu điểm liệt <span className="add-ec__required">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.criticalQuestions}
                    onChange={(e) => updateForm({ criticalQuestions: Number(e.target.value) })}
                  />
                  <span className="add-ec__hint">Câu hỏi điểm liệt trong đề</span>
                </div>
              </div>

              <div className="add-ec__topic-table">
                <div className="add-ec__topic-table-title">Phân Bố Câu Hỏi Theo Chủ Đề</div>
                <div className="add-ec__topic-grid">
                  <div className="add-ec__topic-row">
                    <span>Biển báo:</span>
                    <span>{topicDist.bienBao}</span>
                  </div>
                  <div className="add-ec__topic-row">
                    <span>Luật GT:</span>
                    <span>{topicDist.luatGT}</span>
                  </div>
                  <div className="add-ec__topic-row">
                    <span>Kỹ thuật:</span>
                    <span>{topicDist.kyThuat}</span>
                  </div>
                  <div className="add-ec__topic-row">
                    <span>Tình huống:</span>
                    <span>{topicDist.tinhHuong}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cài Đặt Bài Thi */}
          <div className="add-ec__section">
            <div className="add-ec__section-title">Cài Đặt Bài Thi</div>
            <div className="add-ec__form-body">
              <div className="add-ec__form-row">
                <div className="add-ec__form-group">
                  <label>
                    Thời gian làm bài (phút) <span className="add-ec__required">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.duration}
                    onChange={(e) => updateForm({ duration: Number(e.target.value) })}
                  />
                </div>
                <div className="add-ec__form-group">
                  <label>
                    Điểm chuẩn <span className="add-ec__required">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.passingScore}
                    onChange={(e) => updateForm({ passingScore: Number(e.target.value) })}
                  />
                  <span className="add-ec__hint">Số câu đúng tối thiểu để đạt</span>
                </div>
              </div>

              <div className="add-ec__form-row">
                <div className="add-ec__form-group">
                  <label>
                    Sai liệt tối đa <span className="add-ec__required">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxCriticalMistakes}
                    onChange={(e) => updateForm({ maxCriticalMistakes: Number(e.target.value) })}
                  />
                  <span className="add-ec__hint">Số câu liệt được sai</span>
                </div>
                <div className="add-ec__form-group">
                  <label>Xáo trộn câu hỏi</label>
                  <select
                    value={form.shuffleQuestions === '' ? '' : form.shuffleQuestions ? 'true' : 'false'}
                    onChange={(e) =>
                      updateForm({
                        shuffleQuestions: e.target.value === '' ? '' : e.target.value === 'true',
                      })
                    }
                  >
                    <option value="">Chọn</option>
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
              </div>

              <div className="add-ec__warning">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <strong>Lưu ý quan trọng:</strong>
                  <span> Thí sinh phải đạt điểm chuẩn VÀ không được sai quá số câu liệt cho phép. Sai bất kỳ câu nào vượt quá sẽ bị kết quả "Không đạt" dù đạt điểm chuẩn.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="add-ec__sidebar">
          {/* Preview card */}
          <div className="add-ec__preview-card">
            <div className="add-ec__preview-badge">{previewClass}</div>
            <div className="add-ec__preview-label">Hạng bằng lái</div>

            <div className="add-ec__preview-stats">
              <div className="add-ec__preview-stat">
                <span>Tổng câu hỏi:</span>
                <span>{form.totalQuestions} câu</span>
              </div>
              <div className="add-ec__preview-stat">
                <span>Câu điểm liệt:</span>
                <span className="add-ec__preview-stat--red">{form.criticalQuestions} câu</span>
              </div>
              <div className="add-ec__preview-stat">
                <span>Thời gian:</span>
                <span>{form.duration} phút</span>
              </div>
              <div className="add-ec__preview-stat">
                <span>Điểm chuẩn:</span>
                <span className="add-ec__preview-stat--orange">
                  {form.passingScore}/{form.totalQuestions}
                </span>
              </div>
              <div className="add-ec__preview-stat">
                <span>Sai liệt tối đa:</span>
                <span className="add-ec__preview-stat--red">{form.maxCriticalMistakes} câu</span>
              </div>
            </div>
          </div>

          <button className="add-ec__submit-btn" onClick={handleSubmit}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            {isEdit ? 'Lưu Thay Đổi' : 'Tạo Cấu Hình'}
          </button>
          <button className="add-ec__cancel-btn" onClick={() => navigate('/exam-config')}>
            Hủy
          </button>

          {/* Hướng dẫn */}
          <div className="add-ec__guide">
            <div className="add-ec__guide-title">Hướng Dẫn</div>
            <ul className="add-ec__guide-list">
              <li>Điền đầy đủ các trường bắt buộc (*)</li>
              <li>Tổng phân bố phải bằng tổng số câu hỏi</li>
              <li>Điểm chuẩn phải nhỏ hơn tổng câu</li>
              <li>Thời gian đề xuất: 0.7–1 phút/câu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

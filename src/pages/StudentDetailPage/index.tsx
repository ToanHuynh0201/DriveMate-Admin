import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { analyticsService, examService, identityService, notificationService, userService } from "@/services";
import type { LicenseTier } from "@/types/user-profile.types";
import type { AdminExamSession } from "@/types/exam-session.types";
import { EXAM_SESSION_STATUS_LABELS } from "@/types/exam-session.types";
import type { AcademicWarningSeverity } from "@/types/notification.types";
import { SEVERITY_LABELS } from "@/types/notification.types";
import type { ProgressDashboard } from "@/types/analytics.types";
import Toast from "../../components/ui/Toast";
import {
	STUDENT_ALERT_TEMPLATES,
	STUDENT_RANK_OPTIONS,
	STUDENT_STATUS_LABELS,
	STUDENT_STATUS_TONES,
	studentAvatarColor,
	studentFromProfile,
	studentInitials,
	studentStatus,
} from "../../types/student.types";
import type {
	Student,
	StudentStatus,
} from "../../types/student.types";
import "./StudentDetailPage.css";

type ModalType = "rank" | "alert" | "lock" | null;

function Badge({ status }: { status: StudentStatus }) {
	return (
		<span
			className={`detail-badge detail-badge--${STUDENT_STATUS_TONES[status]}`}>
			{STUDENT_STATUS_LABELS[status]}
		</span>
	);
}

function InlineButton({
	children,
	tone,
	onClick,
	disabled,
}: {
	children: string;
	tone: "yellow" | "green" | "red";
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			className={`detail-action detail-action--${tone}`}
			onClick={onClick}
			disabled={disabled}>
			{children}
		</button>
	);
}

function Modal({
	title,
	children,
	onClose,
	footer,
}: {
	title: string;
	children: React.ReactNode;
	onClose: () => void;
	footer?: React.ReactNode;
}) {
	return (
		<div
			className="detail-modal__backdrop"
			onClick={onClose}>
			<div
				className="detail-modal"
				onClick={(e) => e.stopPropagation()}>
				<div className="detail-modal__title">{title}</div>
				{children}
				{footer}
			</div>
		</div>
	);
}

function ExamSessionTable({ sessions }: { sessions: AdminExamSession[] }) {
	if (sessions.length === 0) {
		return <p style={{ color: "rgba(255,255,255,0.4)", padding: "16px 0" }}>Chưa có lịch sử thi.</p>;
	}
	return (
		<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
			<thead>
				<tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
					<th style={{ padding: "6px 8px" }}>Ngày thi</th>
					<th style={{ padding: "6px 8px" }}>Hạng</th>
					<th style={{ padding: "6px 8px" }}>Điểm</th>
					<th style={{ padding: "6px 8px" }}>Kết quả</th>
					<th style={{ padding: "6px 8px" }}>Trạng thái</th>
				</tr>
			</thead>
			<tbody>
				{sessions.map((s) => (
					<tr key={s.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
						<td style={{ padding: "8px" }}>
							{s.startedAt ? new Date(s.startedAt).toLocaleDateString("vi-VN") : "—"}
						</td>
						<td style={{ padding: "8px" }}>{s.licenseCategory}</td>
						<td style={{ padding: "8px" }}>{s.score ?? "—"}</td>
						<td style={{ padding: "8px" }}>
							{s.isPassed === null ? "—" : s.isPassed ? (
								<span style={{ color: "#4ade80", fontWeight: 600 }}>Đạt</span>
							) : (
								<span style={{ color: "#f87171", fontWeight: 600 }}>
									{s.failedByCritical ? "Trượt (điểm liệt)" : "Trượt"}
								</span>
							)}
						</td>
						<td style={{ padding: "8px", color: "rgba(255,255,255,0.6)" }}>
							{EXAM_SESSION_STATUS_LABELS[s.status]}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default function StudentDetailPage() {
	const navigate = useNavigate();
	const { studentId } = useParams();
	const [student, setStudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [modal, setModal] = useState<ModalType>(null);
	const [rank, setRank] = useState<LicenseTier>("B1");
	const [alertTemplate, setAlertTemplate] = useState(STUDENT_ALERT_TEMPLATES[0]);
	const [alertContent, setAlertContent] = useState("");
	const [alertSeverity, setAlertSeverity] = useState<AcademicWarningSeverity>("MEDIUM");
	const [lockReason, setLockReason] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<"success" | "error">("success");
	const [toastVisible, setToastVisible] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [examSessions, setExamSessions] = useState<AdminExamSession[]>([]);
	const [sessionsLoading, setSessionsLoading] = useState(false);
	const [analytics, setAnalytics] = useState<ProgressDashboard | null>(null);

	useEffect(() => {
		if (!studentId) return;
		setLoading(true);
		userService.getById(studentId).then((res) => {
			if (res.success) {
				setStudent(studentFromProfile(res.data));
			} else {
				setError(res.error);
			}
			setLoading(false);
		});
	}, [studentId]);

	useEffect(() => {
		if (!studentId) return;
		setSessionsLoading(true);
		examService.listSessions({ studentId, size: 20 }).then((res) => {
			if (res.success) setExamSessions(res.data.items);
			setSessionsLoading(false);
		});
		analyticsService.getStudentProgress(studentId).then((res) => {
			if (res.success) setAnalytics(res.data);
		});
	}, [studentId]);

	const showToast = (message: string, type: "success" | "error") => {
		setToastMessage(message);
		setToastType(type);
		setToastVisible(true);
	};

	if (loading) {
		return <div className="detail-empty">Đang tải hồ sơ học viên...</div>;
	}

	if (error || !student) {
		return (
			<div className="detail-empty">
				<h1>{error || "Không tìm thấy hồ sơ học viên"}</h1>
				<button onClick={() => navigate("/students")}>
					← Quay lại danh sách
				</button>
			</div>
		);
	}

	const status = studentStatus(student);

	const openRankModal = () => {
		setRank(student.licenseTier ?? "B1");
		setModal("rank");
	};

	const openAlertModal = () => {
		setAlertTemplate(STUDENT_ALERT_TEMPLATES[0]);
		setAlertContent("");
		setAlertSeverity("MEDIUM");
		setModal("alert");
	};

	const openLockModal = () => {
		setLockReason("");
		setModal("lock");
	};

	const confirmRank = async () => {
		setSubmitting(true);
		const res = await userService.assignLicenseTier(student.id, rank);
		setSubmitting(false);
		if (res.success) {
			setStudent({ ...student, licenseTier: rank });
			showToast(`Đã cập nhật hạng bằng sang ${rank}.`, "success");
			setModal(null);
		} else {
			showToast(`Cập nhật hạng bằng lỗi: ${res.error}`, "error");
		}
	};

	const confirmAlert = async () => {
		if (!alertContent.trim()) {
			showToast("Vui lòng nhập nội dung cảnh báo.", "error");
			return;
		}
		setSubmitting(true);
		const res = await notificationService.sendAcademicWarning({
			studentId: student.id,
			reason: alertTemplate,
			severity: alertSeverity,
			message: alertContent.trim(),
		});
		setSubmitting(false);
		if (res.success) {
			showToast("Đã gửi cảnh báo học tập đến học viên.", "success");
			setModal(null);
		} else {
			showToast(`Gửi cảnh báo lỗi: ${res.error}`, "error");
		}
	};

	const confirmLock = async () => {
		if (!lockReason.trim()) {
			showToast("Vui lòng nhập lý do khóa tài khoản.", "error");
			return;
		}
		setSubmitting(true);
		const res = await identityService.setLock(student.id, true);
		setSubmitting(false);
		if (res.success) {
			setStudent({ ...student, isActive: false });
			showToast("Đã khóa tài khoản học viên.", "success");
			setModal(null);
		} else {
			showToast(`Khóa tài khoản lỗi: ${res.error}`, "error");
		}
	};

	const handleUnlock = async () => {
		if (!window.confirm("Mở khóa tài khoản học viên này?")) return;
		setSubmitting(true);
		const res = await identityService.setLock(student.id, false);
		setSubmitting(false);
		if (res.success) {
			setStudent({ ...student, isActive: true });
			showToast("Đã mở khóa tài khoản.", "success");
		} else {
			showToast(`Mở khóa lỗi: ${res.error}`, "error");
		}
	};

	return (
		<div className="student-detail">
			<Toast
				message={toastMessage}
				type={toastType}
				visible={toastVisible}
				onClose={() => setToastVisible(false)}
			/>

			<div className="student-detail__topbar">
				<button
					className="student-detail__back"
					onClick={() => navigate("/students")}>
					←
				</button>
				<div>
					<h1>Hồ Sơ Học Viên</h1>
					<p>Thông tin chi tiết</p>
				</div>
				<div className="student-detail__actions">
					<InlineButton
						tone="yellow"
						onClick={openRankModal}
						disabled={submitting}>
						Phân Hạng Bằng
					</InlineButton>
					<InlineButton
						tone="green"
						onClick={openAlertModal}
						disabled={submitting}>
						Gửi Cảnh Báo
					</InlineButton>
					{student.isActive ? (
						<InlineButton
							tone="red"
							onClick={openLockModal}
							disabled={submitting}>
							Khóa TK
						</InlineButton>
					) : (
						<InlineButton
							tone="green"
							onClick={handleUnlock}
							disabled={submitting}>
							Mở Khóa
						</InlineButton>
					)}
				</div>
			</div>

			<div className="student-detail__grid">
				<aside className="student-detail__profile card-surface">
					<div
						className="student-detail__avatar"
						style={{ background: studentAvatarColor(student.id) }}>
						{studentInitials(student.fullName)}
					</div>
					<div className="student-detail__name">
						{student.fullName}
					</div>
					<Badge status={status} />
					<div className="student-detail__info">
						<div>✉ {student.email}</div>
						<div>☎ {student.phoneNumber ?? "—"}</div>
						<div>
							📅 Sinh:{" "}
							{student.dateOfBirth
								? new Date(student.dateOfBirth).toLocaleDateString("vi-VN")
								: "—"}
						</div>
						<div>
							🏷 Hạng {student.licenseTier ?? "Chưa phân"}
						</div>
					</div>
					<div className="student-detail__divider" />
					<div className="student-detail__label">Địa chỉ</div>
					<div>{student.address ?? "—"}</div>
					<div className="student-detail__divider" />
					<div className="student-detail__label">Ngày nhập học</div>
					<div>
						{student.enrolledAt
							? new Date(student.enrolledAt).toLocaleDateString("vi-VN")
							: "—"}
					</div>
					{student.notes && (
						<>
							<div className="student-detail__divider" />
							<div className="student-detail__label">Ghi chú</div>
							<div>{student.notes}</div>
						</>
					)}
				</aside>

				<section className="student-detail__content">
					{analytics && (
						<div className="card-surface student-detail__chart-card" style={{ marginBottom: 16 }}>
							<h2>Tiến Độ Học Tập</h2>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
								{[
									{ label: "Hoàn thành khoá học", value: `${analytics.completionPct}%` },
									{ label: "Lượt thi", value: analytics.attemptCount },
									{ label: "Tỉ lệ đỗ", value: `${analytics.passRate}%` },
									{ label: "Điểm trung bình", value: analytics.avgExamScore },
								].map((stat) => (
									<div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
										<div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{stat.label}</div>
										<div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f0" }}>{stat.value}</div>
									</div>
								))}
							</div>
							{analytics.weakTopics.length > 0 && (
								<div style={{ marginTop: 14 }}>
									<div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Topic yếu</div>
									{analytics.weakTopics.map((t) => (
										<div key={t.topicId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
											<span>{t.topicName}</span>
											<span style={{ color: "#f87171" }}>{Math.round(t.accuracyRate * 100)}% chính xác</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}
					<div className="card-surface student-detail__chart-card">
						<h2>Lịch Sử Thi</h2>
						{sessionsLoading ? (
							<p style={{ color: "rgba(255,255,255,0.4)", padding: "16px 0" }}>Đang tải...</p>
						) : (
							<ExamSessionTable sessions={examSessions} />
						)}
					</div>
				</section>
			</div>

			{modal === "rank" && (
				<Modal
					title="Phân hạng bằng lái"
					onClose={() => setModal(null)}
					footer={
						<div className="detail-modal__footer">
							<button onClick={() => setModal(null)}>Hủy</button>
							<button
								className="detail-modal__confirm detail-modal__confirm--yellow"
								onClick={confirmRank}
								disabled={submitting}>
								{submitting ? "Đang lưu..." : "Xác nhận phân hạng"}
							</button>
						</div>
					}>
					<p className="detail-modal__hint">
						Hạng hiện tại:{" "}
						<strong>{student.licenseTier ?? "Chưa phân"}</strong>
					</p>
					<div className="detail-modal__rank-list">
						{STUDENT_RANK_OPTIONS.map((option) => (
							<button
								key={option}
								className={
									option === rank
										? "detail-modal__rank detail-modal__rank--active"
										: "detail-modal__rank"
								}
								onClick={() => setRank(option)}>
								{option}
							</button>
						))}
					</div>
				</Modal>
			)}

			{modal === "alert" && (
				<Modal
					title="Gửi cảnh báo học tập"
					onClose={() => setModal(null)}
					footer={
						<div className="detail-modal__footer">
							<button onClick={() => setModal(null)}>Hủy</button>
							<button
								className="detail-modal__confirm detail-modal__confirm--green"
								onClick={confirmAlert}
								disabled={submitting}>
								{submitting ? "Đang gửi..." : "Gửi cảnh báo"}
							</button>
						</div>
					}>
					<div className="detail-modal__field">
						<label>Lý do cảnh báo</label>
						<div className="detail-modal__template-list">
							{STUDENT_ALERT_TEMPLATES.map((template) => (
								<button
									key={template}
									className={
										template === alertTemplate
											? "detail-modal__template detail-modal__template--active"
											: "detail-modal__template"
									}
									onClick={() => setAlertTemplate(template)}>
									{template}
								</button>
							))}
						</div>
					</div>
					<div className="detail-modal__field">
						<label>Mức độ nghiêm trọng</label>
						<select
							value={alertSeverity}
							onChange={(e) => setAlertSeverity(e.target.value as AcademicWarningSeverity)}
							style={{ width: "100%", padding: "8px 10px", background: "#2a2a2a", color: "#f0f0f0", border: "1px solid #3a3a3a", borderRadius: 8, fontSize: 14 }}
						>
							{(Object.keys(SEVERITY_LABELS) as AcademicWarningSeverity[]).map((s) => (
								<option key={s} value={s}>{SEVERITY_LABELS[s]}</option>
							))}
						</select>
					</div>
					<div className="detail-modal__field">
						<label>Nội dung cảnh báo *</label>
						<textarea
							value={alertContent}
							onChange={(e) => setAlertContent(e.target.value)}
							placeholder="Nhập nội dung cảnh báo cho học viên..."
						/>
					</div>
				</Modal>
			)}

			{modal === "lock" && (
				<Modal
					title="Khóa tài khoản học viên"
					onClose={() => setModal(null)}
					footer={
						<div className="detail-modal__footer">
							<button onClick={() => setModal(null)}>Hủy</button>
							<button
								className="detail-modal__confirm detail-modal__confirm--red"
								onClick={confirmLock}
								disabled={submitting}>
								{submitting ? "Đang khóa..." : "Xác nhận khóa"}
							</button>
						</div>
					}>
					<p className="detail-modal__hint">
						<strong>{student.fullName}</strong> sẽ không thể đăng nhập
						sau khi bị khóa.
					</p>
					<div className="detail-modal__field">
						<label>Lý do khóa *</label>
						<textarea
							value={lockReason}
							onChange={(e) => setLockReason(e.target.value)}
							placeholder="Nhập lý do khóa tài khoản..."
						/>
					</div>
				</Modal>
			)}
		</div>
	);
}

import { useRef, useState } from "react";
import type { DragEvent } from "react";

import {
	ALLOWED_AUDIO_MIMES,
	ALLOWED_DOCUMENT_MIMES,
	ALLOWED_VIDEO_MIMES,
	MAX_FILE_SIZE_BYTES,
	formatFileSize,
	validateFile,
} from "@/constants/media";
import { invalidateMediaUrl } from "@/lib";
import { mediaService } from "@/services/media.service";
import type { MediaReference, UploadResult } from "@/types/media.types";

import "./FileUploader.css";

interface FileUploaderValue extends MediaReference {
	originalName?: string;
	fileSize?: number;
	mimeType?: string;
}

interface FileUploaderProps {
	value: FileUploaderValue | null;
	onChange: (next: (FileUploaderValue & UploadResult) | null) => void;
	disabled?: boolean;
	maxSize?: number;
	accept?: readonly string[];
	label?: string;
}

const DEFAULT_ACCEPT = [
	...ALLOWED_DOCUMENT_MIMES,
	...ALLOWED_VIDEO_MIMES,
	...ALLOWED_AUDIO_MIMES,
] as const;

export function FileUploader({
	value,
	onChange,
	disabled = false,
	maxSize = MAX_FILE_SIZE_BYTES,
	accept = DEFAULT_ACCEPT,
	label = "Chọn tệp",
}: FileUploaderProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dragging, setDragging] = useState(false);

	const handlePickFile = () => {
		if (disabled || uploading) return;
		inputRef.current?.click();
	};

	const handleFiles = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const file = files[0];

		const validationError = validateFile(file, accept, maxSize);
		if (validationError) {
			setError(validationError.message);
			return;
		}

		setError(null);
		setUploading(true);

		const result = await mediaService.uploadViaDirect(file);

		setUploading(false);

		if (!result.success) {
			setError(result.error);
			return;
		}

		invalidateMediaUrl(value?.mediaFileId);
		onChange({
			mediaFileId: result.data.mediaFileId,
			publicUrl: result.data.publicUrl,
			originalName: result.data.originalName,
			mimeType: result.data.mimeType,
			fileSize: result.data.fileSize,
		});
	};

	const handleRemove = () => {
		if (disabled || uploading) return;
		invalidateMediaUrl(value?.mediaFileId);
		onChange(null);
		setError(null);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (disabled || uploading) return;
		setDragging(true);
	};

	const handleDragLeave = () => setDragging(false);

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
		if (disabled || uploading) return;
		void handleFiles(e.dataTransfer.files);
	};

	const acceptAttr = accept.join(",");

	return (
		<div className="file-uploader">
			{!value ? (
				<div
					className={[
						"file-uploader__zone",
						dragging ? "file-uploader__zone--dragging" : "",
						disabled ? "file-uploader__zone--disabled" : "",
					]
						.filter(Boolean)
						.join(" ")}
					onClick={handlePickFile}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					role="button"
					tabIndex={disabled ? -1 : 0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handlePickFile();
						}
					}}
				>
					{uploading ? (
						<div className="file-uploader__placeholder">
							<span className="file-uploader__spinner" />
							<span>Đang tải lên...</span>
						</div>
					) : (
						<div className="file-uploader__placeholder">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
							</svg>
							<span>{label}</span>
							<span className="file-uploader__hint">
								Tối đa {formatFileSize(maxSize)}
							</span>
						</div>
					)}
				</div>
			) : (
				<div className="file-uploader__file">
					<div className="file-uploader__file-icon">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
						</svg>
					</div>
					<div className="file-uploader__file-info">
						<div className="file-uploader__file-name">
							{value.originalName ?? "Tệp đã tải lên"}
						</div>
						{value.fileSize != null && (
							<div className="file-uploader__file-meta">
								{formatFileSize(value.fileSize)}
							</div>
						)}
					</div>
					<div className="file-uploader__actions">
						<button
							type="button"
							className="file-uploader__btn"
							onClick={handlePickFile}
							disabled={disabled || uploading}
						>
							Thay
						</button>
						<button
							type="button"
							className="file-uploader__btn file-uploader__btn--remove"
							onClick={handleRemove}
							disabled={disabled || uploading}
						>
							Xoá
						</button>
					</div>
				</div>
			)}

			<input
				ref={inputRef}
				type="file"
				accept={acceptAttr}
				style={{ display: "none" }}
				disabled={disabled || uploading}
				onChange={(e) => {
					void handleFiles(e.target.files);
					e.target.value = "";
				}}
			/>

			{error && <p className="file-uploader__error">{error}</p>}
		</div>
	);
}

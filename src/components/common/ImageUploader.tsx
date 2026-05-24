import { useRef, useState } from "react";
import type { DragEvent } from "react";

import {
	ALLOWED_IMAGE_MIMES,
	MAX_FILE_SIZE_BYTES,
	formatFileSize,
	validateFile,
} from "@/constants/media";
import { useMediaUrl } from "@/hooks/useMediaUrl";
import { invalidateMediaUrl } from "@/lib";
import { mediaService } from "@/services/media.service";
import type { MediaReference } from "@/types/media.types";

import "./ImageUploader.css";

interface ImageUploaderProps {
	value: MediaReference | null;
	onChange: (next: MediaReference | null) => void;
	disabled?: boolean;
	maxSize?: number;
	accept?: readonly string[];
	helpText?: string;
	shape?: "square" | "circle";
}

export function ImageUploader({
	value,
	onChange,
	disabled = false,
	maxSize = MAX_FILE_SIZE_BYTES,
	accept = ALLOWED_IMAGE_MIMES,
	helpText,
	shape = "square",
}: ImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dragging, setDragging] = useState(false);

	const { url: previewUrl, loading: loadingPreview } = useMediaUrl(
		value?.mediaFileId ?? null,
	);

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
	const hasImage = !!value?.mediaFileId;

	return (
		<div className={`image-uploader image-uploader--${shape}`}>
			<div
				className={[
					"image-uploader__zone",
					dragging ? "image-uploader__zone--dragging" : "",
					hasImage ? "image-uploader__zone--has-image" : "",
					disabled ? "image-uploader__zone--disabled" : "",
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
				{uploading || loadingPreview ? (
					<div className="image-uploader__placeholder">
						<span className="image-uploader__spinner" />
						<span>{uploading ? "Đang tải lên..." : "Đang tải ảnh..."}</span>
					</div>
				) : previewUrl ? (
					<img
						src={previewUrl}
						alt="Preview"
						className="image-uploader__preview"
					/>
				) : (
					<div className="image-uploader__placeholder">
						<svg
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="m21 15-5-5L5 21" />
						</svg>
						<span>Bấm hoặc kéo thả ảnh vào đây</span>
						<span className="image-uploader__hint">
							Tối đa {formatFileSize(maxSize)}
						</span>
					</div>
				)}
			</div>

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

			{(hasImage || error) && !uploading && (
				<div className="image-uploader__actions">
					{hasImage && (
						<button
							type="button"
							className="image-uploader__btn image-uploader__btn--replace"
							onClick={handlePickFile}
							disabled={disabled}
						>
							Thay ảnh
						</button>
					)}
					{hasImage && (
						<button
							type="button"
							className="image-uploader__btn image-uploader__btn--remove"
							onClick={handleRemove}
							disabled={disabled}
						>
							Xoá
						</button>
					)}
				</div>
			)}

			{helpText && !error && (
				<p className="image-uploader__help">{helpText}</p>
			)}
			{error && <p className="image-uploader__error">{error}</p>}
		</div>
	);
}

export type FileStatus = "LINKED" | "UNLINKED";

export type AllowedMimeCategory = "image" | "document" | "video" | "audio";

export interface FileObject {
	id: string;
	storageKey: string;
	originalName: string;
	mimeType: string;
	fileSize: number;
	bucketName: string;
	uploadedById: string;
	isPublic: boolean;
	createdAt: string;
}

export interface UploadInitPayload {
	originalName: string;
	mimeType: string;
	fileSize: number;
}

export interface UploadInitResponse {
	mediaFileId: string;
	uploadUrl: string;
	publicUrl: string;
	expiresAt: string;
}

export interface PresignedDownloadResponse {
	url: string;
	expiresAt: string;
}

export interface MediaFileListParams {
	page?: number;
	size?: number;
	uploadedById?: string;
	mimeType?: string;
}

export interface UploadResult {
	mediaFileId: string;
	publicUrl: string;
	originalName: string;
	mimeType: string;
	fileSize: number;
}

export interface MediaReference {
	mediaFileId: string;
	publicUrl: string;
}

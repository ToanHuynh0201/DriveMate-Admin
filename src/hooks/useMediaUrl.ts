import { useEffect, useState } from "react";

import { getRenderableMediaUrl } from "@/lib";

interface UseMediaUrlResult {
	url: string | null;
	loading: boolean;
	error: string | null;
}

export function useMediaUrl(
	mediaFileId: string | null | undefined,
): UseMediaUrlResult {
	const [url, setUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		if (!mediaFileId) {
			setUrl(null);
			setLoading(false);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		getRenderableMediaUrl(mediaFileId)
			.then((resolved) => {
				if (cancelled) return;
				setUrl(resolved);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Không thể tải tệp.");
				setUrl(null);
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [mediaFileId]);

	return { url, loading, error };
}

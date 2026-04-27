export function formatDate(date: Date) {
	return date.toISOString().split('T')[0];
}

export function formatLongDate(date: Date) {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function getViaLabel(viaUrl?: string, viaTitle?: string) {
	if (viaTitle) return viaTitle;
	if (!viaUrl) return null;
	return new URL(viaUrl).hostname.replace(/^www\./, '');
}

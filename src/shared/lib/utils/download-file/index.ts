import { useApi } from '@/shared/api';
import { showError } from '../notifications';
export default async function (href: string, fileName: string) {
	const api = useApi();
	try {
		const blob = await api.get<Blob>(href, {}, { responseType: 'blob' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch {
		showError('Что-то пошло не так');
	}
}

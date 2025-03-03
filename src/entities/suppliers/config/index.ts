import { generatePassword } from '@/shared/lib/utils/generate';

export interface IListItem {
	supplier_id: number;
	name: string;
	email: string;
	password: string;
	inn: string;
	doc_supplier: string;
	print_torg2: boolean;
	send_emails: string;
}

export interface IItem extends Omit<IListItem, 'supplier_id' | 'send_emails'> {
	send_emails: string[];
}

export function getDefaultForm(): IItem {
	return {
		name: '',
		email: '',
		inn: '',
		password: generatePassword(),
		doc_supplier: '',
		print_torg2: true,
		send_emails: [],
	};
}

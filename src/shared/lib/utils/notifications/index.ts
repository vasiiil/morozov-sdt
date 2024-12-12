import notify from 'devextreme/ui/notify';

const MESSAGE_TYPES = {
	ERROR: 'error',
	INFO: 'info',
	SUCCESS: 'success',
	WARNING: 'warning',
} as const;
type TMessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export function showMessage(message: string, type: TMessageType = MESSAGE_TYPES.INFO, time: number = 3, params = {}) {
	const defaultOptions = {
		message,
		type,
		displayTime: time * 1000,
		width: 'auto',
		maxWidth: 350,
		closeOnClick: true,
		wrapperAttr: { class: 'notification-container' },
	};
	const options = {
		...defaultOptions,
		...params,
	};

	notify(options, {
		position: { bottom: 15, right: 15 },
		direction: 'up-push',
	});
}
export function showAlert(message: string, type: TMessageType) {
	const params = {
		position: 'center',
		minWidth: '30vw',
		maxWidth: '70vw',
		minHeight: '30vh',
		maxHeight: '80vh',
		hideOnOutsideClick: true,
		closeOnClick: false,
	};

	showMessage(message, type, 3600, params);
}
export function showError(message: string, time: number = 5, params = {}) {
	showMessage(message, MESSAGE_TYPES.ERROR, time, params);
}
export function showSuccess(message: string, time: number = 3, params = {}) {
	showMessage(message, MESSAGE_TYPES.SUCCESS, time, params);
}
export function showWarning(message: string, time: number = 5, params = {}) {
	showMessage(message, MESSAGE_TYPES.WARNING, time, params);
}

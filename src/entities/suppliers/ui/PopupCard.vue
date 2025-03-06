<template>
	<dx-popup
		ref="dxPopup"
		:title="`Поставщик ${id ?? ''}`"
		:wrapper-attr="{ class: 'suppliers-popup-card' }"
		width="60vw"
		:height="625"
		max-height="80vh"
		@hidden="onHidden"
		@showing="onShowing"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="resetButtonOptions"
		></dx-toolbar-item>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="saveButtonOptions"
		></dx-toolbar-item>
		<dx-form
			v-model:form-data="form"
			:show-validation-summary="true"
			label-mode="outside"
			label-location="top"
			ref="dxForm"
		>
			<dx-group-item
				caption="Основная информация"
				:col-count="2"
			>
				<dx-simple-item data-field="name">
					<dx-label text="Наименование"></dx-label>
					<dx-required-rule
						message="Наименование обязательно"
					></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item data-field="doc_supplier">
					<dx-label text="Наименование на документах"></dx-label>
					<dx-required-rule
						message="Наименование на документах обязательно"
					></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item data-field="inn">
					<dx-label text="ИНН"></dx-label>
					<dx-required-rule message="ИНН обязателен"></dx-required-rule>
					<dx-string-length-rule
						:min="10"
						:max="12"
						message="ИНН должен быть от 10 до 12 символов"
					></dx-string-length-rule>
					<dx-pattern-rule
						pattern="(\d){10,12}"
						message="ИНН может содержать только цифры"
					></dx-pattern-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="email"
					:editor-options="emailEditorOptions"
				>
					<dx-label text="E-mail"></dx-label>
					<dx-required-rule message="E-mail обязателен"></dx-required-rule>
					<dx-email-rule></dx-email-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="password"
					:editor-options="passwordEditorOptions"
				>
					<dx-label text="Пароль"></dx-label>
					<dx-required-rule message="Пароль обязателен"></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="print_torg2"
					editor-type="dxSwitch"
				>
					<dx-label
						text="Использовать данные поставщика в документах"
					></dx-label>
				</dx-simple-item>
			</dx-group-item>
			<dx-group-item caption="Доп. email для расылки уведомлений">
				<dx-simple-item
					v-for="(emailOptions, index) in sendEmailsOptions"
					:key="`send-email-${index + 1}-${emailOptions.value}`"
					:data-field="`send_emails[${index}]`"
					:editor-options="emailOptions"
				>
					<dx-label :text="`Доп. email ${index + 1}`"></dx-label>
					<dx-email-rule></dx-email-rule>
				</dx-simple-item>
				<dx-button-item
					:button-options="addSendEmailButtonOptions"
					horizontal-alignment="left"
				></dx-button-item>
			</dx-group-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
	DxButtonItem,
	DxEmailRule,
	DxPatternRule,
	DxRequiredRule,
	DxStringLengthRule,
} from 'devextreme-vue/form';
import type { DxTextBoxTypes } from 'devextreme-vue/text-box';
import type { DxButton, DxButtonTypes } from 'devextreme-vue/button';

import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { showSuccess } from '@/shared/lib/utils/notifications';
import { useModel } from '../model';
import { getDefaultForm, type IItem, type IListItem } from '../config';

const emit = defineEmits<{
	(event: 'hidden', afterSave: boolean): void;
}>();
const { items } = defineProps<{
	items: IListItem[];
}>();
const { getItem, saveItem } = useModel();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const formRef = useTemplateRef<InstanceType<typeof DxForm>>('dxForm');

const {
	value: saved,
	setTrue: setSaved,
	setFalse: clearSaved,
} = useBoolean(false);
const id = ref<IListItem['supplier_id'] | undefined>();
const form = ref<IItem>(getDefaultForm());

function show(_id?: IListItem['supplier_id']) {
	id.value = _id;
	clearSaved();
	hidePassword();
	if (id.value) {
		const item = getItem(items, id.value);
		if (item) {
			form.value = item;
		}
	}
	popupRef.value?.instance.show();
}
function onShowing() {
	formRef.value?.instance.getEditor('email')?.option('readOnly', !!id.value);
	formRef.value?.instance.getEditor('inn')?.option('readOnly', !!id.value);
	showHidePassword();
	setResetButtonText();
	resetSendEmailEditorOptions();
}
function onHidden() {
	emit('hidden', saved.value);
	if (saved.value || !!id.value) {
		form.value = getDefaultForm();
	}
	resetForm();
}
defineExpose({ show });
async function resetForm() {
	resetSendEmailEditorOptions();
	await nextTick();
	formRef.value?.instance.reset(form.value);
}

const {
	value: passwordShown,
	toggle: togglePassword,
	setFalse: hidePassword,
} = useBoolean(false);
const passwordEditorOptions: DxTextBoxTypes.Properties = {
	mode: 'password',
	buttons: [
		{
			location: 'after',
			name: 'showHidePasswordButton',
			options: {
				icon: 'eyeopen',
				stylingMode: 'text',
				onClick: () => {
					togglePassword();
					showHidePassword();
				},
			},
		},
	],
};
function showHidePassword() {
	const editor = formRef.value?.instance.getEditor('password');
	if (!editor) {
		togglePassword();
		return;
	}
	if (passwordShown.value) {
		editor.option('mode', 'text');
		editor
			// @ts-expect-error typeof editor = DxTextBox
			.getButton('showHidePasswordButton')
			.option('icon', 'eyeclose');
	} else {
		editor.option('mode', 'password');
		editor
			// @ts-expect-error typeof editor = DxTextBox
			.getButton('showHidePasswordButton')
			.option('icon', 'eyeopen');
	}
}

const emailEditorOptions = { mode: 'email' };
const sendEmailsOptions = ref<DxTextBoxTypes.Properties[]>([]);
const addSendEmailButtonOptions = {
	icon: 'add',
	text: 'Добавить email',
	stylingMode: 'outlined',
	onClick: () => {
		form.value.send_emails.push('');
		resetSendEmailEditorOptions();
	},
};
function resetSendEmailEditorOptions() {
	sendEmailsOptions.value = getSendEmailsOptions(form.value.send_emails);
}
function getSendEmailsOptions(emails: string[]): DxTextBoxTypes.Properties[] {
	const options: DxTextBoxTypes.Properties[] = [];
	for (let i = 0; i < emails.length; i += 1) {
		options.push(generateNewEmailOptions(i, emails[i]));
	}
	return options;
}
function generateNewEmailOptions(
	index: number,
	email: string,
): DxTextBoxTypes.Properties {
	return {
		mode: 'email',
		value: email,
		buttons: [
			{
				name: 'trash',
				location: 'after',
				options: {
					stylingMode: 'text',
					icon: 'trash',
					onClick: () => {
						form.value.send_emails.splice(index, 1);
						resetSendEmailEditorOptions();
					},
				},
			},
		],
	};
}

function close() {
	popupRef.value?.instance.hide();
}

const resetButtonInstance = ref<InstanceType<(typeof DxButton)['instance']>>();
function setResetButtonText() {
	resetButtonInstance.value?.option('text', id.value ? 'Обновить' : 'Сбросить');
}
const resetButtonOptions: DxButtonTypes.Properties = {
	text: 'Сбросить',
	stylingMode: 'outlined',
	onInitialized: (event: DxButtonTypes.InitializedEvent) => {
		if (event.component) {
			resetButtonInstance.value = event.component;
			setResetButtonText();
		}
	},
	onClick: () => {
		const item = id.value ? getItem(items, id.value) : getDefaultForm();
		form.value = item ?? getDefaultForm();
		resetForm();
	},
};
const saveButtonOptions = {
	text: 'Сохранить',
	stylingMode: 'outlined',
	onClick: async () => {
		const validation = formRef.value?.instance.validate();
		if (!validation?.isValid) {
			return;
		}

		const body: Record<string, string | number> = {
			name: form.value.name,
			password: form.value.password,
			doc_supplier: form.value.doc_supplier,
			print_torg2: form.value.print_torg2 ? 1 : 0,
			send_emails: form.value.send_emails.join(','),
		};
		if (!id.value) {
			body.email = form.value.email;
			body.inn = form.value.inn;
		}
		const result = await saveItem(body, id.value);
		if (result) {
			setSaved();
			id.value = result;
			formRef.value?.instance
				.getEditor('email')
				?.option('readOnly', !!id.value);
			formRef.value?.instance.getEditor('inn')?.option('readOnly', !!id.value);
			showSuccess('Сохранено');
			close();
		}
	},
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.suppliers-popup-card {
	.dx-popup-content {
		padding-bottom: 0;
	}
}
</style>

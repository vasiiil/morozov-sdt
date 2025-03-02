<template>
	<dx-popup
		ref="popup"
		:title="`Поставщик ${id ?? ''}`"
		width="60vw"
		height="auto"
		max-height="80vh"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="cancelButtonOptions"
		></dx-toolbar-item>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="saveButtonOptions"
		></dx-toolbar-item>
		<dx-form
			v-model:form-data="form"
			label-mode="outside"
			label-location="top"
		>
			<dx-group-item
				caption="Основная информация"
				:col-count="2"
			>
				<dx-simple-item data-field="name">
					<dx-label text="Наименование"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="doc_supplier">
					<dx-label text="Наименование на документах"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="inn">
					<dx-label text="ИНН"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="email">
					<dx-label text="E-mail"></dx-label>
				</dx-simple-item>
				<dx-simple-item
					data-field="password"
					:editor-options="passwordEditorOptions"
				>
					<dx-label text="Пароль"></dx-label>
				</dx-simple-item>
				<dx-simple-item
					data-field="print_torg2"
					editor-type="dxSwitch"
				>
					<dx-label
						text="Использовать данные поставщика в документах торг-2"
					></dx-label>
				</dx-simple-item>
			</dx-group-item>
			<dx-group-item caption="Доп. email для расылки уведомлений">
				<dx-simple-item
					v-for="(emailOptions, index) in sendEmailsOptions"
					:key="`send-email${index + 1}`"
					:data-field="`send_emails[${index}]`"
					:editor-options="emailOptions"
				>
					<dx-label :text="`Доп. email ${index + 1}`"></dx-label>
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
import { ref, useTemplateRef } from 'vue';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
	DxButtonItem,
} from 'devextreme-vue/form';
import type { DxTextBoxTypes } from 'devextreme-vue/cjs/text-box';

import { useLoader } from '@/shared/lib/use/useLoader';
import { showSuccess } from '@/shared/lib/utils/notifications';
import { useModel } from '../model';
import { getDefaultForm, type IItem, type IListItem } from '../config';

const { startLoading, stopLoading } = useLoader();
const { getItem, saveItem } = useModel();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');

const id = ref<IListItem['supplier_id'] | undefined>();
const form = ref<IItem>(getDefaultForm());

async function show(_id?: IListItem['supplier_id']) {
	id.value = _id;
	if (_id === undefined) {
		form.value = getDefaultForm();
		popupRef.value?.instance.show();
		return;
	}
	startLoading();
	const item = await getItem(_id);
	stopLoading();
	if (!item) {
		return;
	}
	form.value = item;
	popupRef.value?.instance.show();
}
defineExpose({ show });

const passwordEditorOptions: DxTextBoxTypes.Properties = {
	mode: 'password',
	readOnly: true,
};

const sendEmailsOptions = ref(getSendEmailsOptions(form.value.send_emails));
const addSendEmailButtonOptions = {
	icon: 'add',
	text: 'Добавить email',
	stylingMode: 'outlined',
	onClick: () => {
		form.value.send_emails.push('');
		sendEmailsOptions.value = getSendEmailsOptions(form.value.send_emails);
	},
};
function getSendEmailsOptions(emails: string[]) {
	const options = [];
	for (let i = 0; i < emails.length; i += 1) {
		options.push(generateNewEmailOptions(i));
	}
	return options;
}
function generateNewEmailOptions(index: number) {
	return {
		buttons: [
			{
				name: 'trash',
				location: 'after',
				options: {
					stylingMode: 'text',
					icon: 'trash',
					onClick: () => {
						form.value.send_emails.splice(index, 1);
						sendEmailsOptions.value = getSendEmailsOptions(
							form.value.send_emails,
						);
					},
				},
			},
		],
	};
}

function close() {
	popupRef.value?.instance.hide();
}
const cancelButtonOptions = {
	text: 'Отменить',
	stylingMode: 'outlined',
	onClick: () => {
		close();
	},
}
const saveButtonOptions = {
	text: 'Сохранить',
	stylingMode: 'outlined',
	onClick: async () => {
		const body = {
			...form.value,
			print_torg2: form.value.print_torg2 ? 1 : 0,
			send_emails: form.value.send_emails.join(','),
		};
		const result = await saveItem(body, id.value);
		if (result) {
			id.value = result;
			showSuccess('Сохранено');
		}
	},
}
</script>

<style lang="scss" scoped></style>

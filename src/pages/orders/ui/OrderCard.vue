<template>
	<dx-popup ref="popup" title="Создание заказа" width="50vw" max-height="50vh">
		<dx-toolbar-item
			widget="dxButton"
			toolbar="bottom"
			location="after"
			:options="createButtonOptions"
		></dx-toolbar-item>
		<dx-form v-model:form-data="form" :col-count="2">
			<dx-simple-item data-field="executorNumber">
				<dx-label text="Номер исполнителя"></dx-label>
			</dx-simple-item>
			<dx-simple-item data-field="customerNumber" editor-type="dxNumberBox">
				<dx-label text="Номер покупателя"></dx-label>
			</dx-simple-item>
			<dx-simple-item data-field="orderDate" editor-type="dxDateBox">
				<dx-label text="Дата заказа"></dx-label>
			</dx-simple-item>
			<dx-simple-item data-field="deliveryDate" editor-type="dxDateBox">
				<dx-label text="Дата доставки"></dx-label>
			</dx-simple-item>
			<dx-simple-item
				data-field="deliveryType"
				editor-type="dxSelectBox"
				:editor-options="deliveryTypeEditorOptions"
			>
				<dx-label text="Тип доставки"></dx-label>
			</dx-simple-item>
			<dx-simple-item data-field="fio">
				<dx-label text="ФИО"></dx-label>
			</dx-simple-item>
			<dx-simple-item
				data-field="amount"
				editor-type="dxNumberBox"
				:editor-options="amountEditorOptions"
			>
				<dx-label text="Сумма"></dx-label>
			</dx-simple-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import { DxForm, DxLabel, DxSimpleItem } from 'devextreme-vue/form';

import { formatCurrency } from '@/shared/lib/utils/formatters';
import { toFormat } from '@/shared/lib/utils/date';
import { useStore, type IOrderItem } from '../model';
import { generateNumber } from '@/shared/lib/utils/generate';

const emit = defineEmits<{
	(event: 'saved'): void;
}>();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const { orders } = useStore();
function getDefaultForm(): IOrderItem {
	return {
		amount: 0,
		orderDate: new Date(),
		deliveryDate: new Date(),
		deliveryType: '',
		fio: '',
		executorNumber: '',
		customerNumber: null,
	};
}
const form = ref<IOrderItem>(getDefaultForm());

function show() {
	form.value = getDefaultForm();
	popupRef.value.instance.show();
}
defineExpose({ show });

const deliveryTypeEditorOptions = {
	items: ['Post', '5Post', 'Boxberry', 'Avito', 'Courier'],
};
const amountEditorOptions = {
	min: 0,
	format: formatCurrency,
};

const createButtonOptions = {
	text: 'Создать',
	stylingMode: 'outlined',
	onClick: () => {
		// validation
		orders.unshift({
			...form.value,
			orderDate: toFormat(form.value.orderDate),
			deliveryDate: toFormat(form.value.deliveryDate),
			customerNumber: form.value.customerNumber ?? -1,
			id: generateNumber(),
		});
		emit('saved');
		popupRef.value.instance.hide();
	},
};
</script>

<style lang="scss" scoped></style>

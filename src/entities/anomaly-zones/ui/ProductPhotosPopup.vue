<template>
	<dx-popup
		ref="popup"
		:title="title"
		width="1000px"
		height="681px"
	>
		<dx-toolbar-item location="after">
			<base-button
				icon="download"
				styling-mode="text"
				hint="Скачать"
				@click="onDownLoadClick"
			></base-button>
		</dx-toolbar-item>
		<base-button
			icon="chevronnext"
			element-class="nav-button next"
			border-radius="50%"
			@click="onNextClick"
		></base-button>
		<base-button
			icon="chevronprev"
			element-class="nav-button prev"
			border-radius="50%"
			@click="onPrevClick"
		></base-button>
		<dx-multi-view
			:height="600"
			:data-source="photos"
			v-model:selected-index="selectedIndex"
			:loop="true"
			:animation-enabled="true"
		>
			<template #item="{ data: photo }">
				<div class="photo-container">
					<img
						:src="getPhotoUrl(photo)"
						:alt="photo"
					/>
				</div>
			</template>
		</dx-multi-view>
	</dx-popup>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from 'vue';
import { DxPopup, DxMultiView } from 'devextreme-vue';
import { DxToolbarItem } from 'devextreme-vue/popup';
import { BaseButton } from '@/shared/ui';
import downloadFile from '@/shared/lib/utils/download-file';
import { API_HOST, API_URL } from '@/shared/config';
import type { IListItem } from '../config';

const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const selectedIndex = ref(0);
const photos = ref<string[]>([]);
const id = ref<IListItem['anomaly_id'] | null>(null);
const title = computed(
	() => `Фото ${selectedIndex.value + 1} из ${photos.value.length}`,
);
function open(_id: IListItem['anomaly_id'], _photos: string[]) {
	selectedIndex.value = 0;
	photos.value = _photos;
	id.value = _id;
	popupRef.value?.instance.show();
}
defineExpose({ open });

function onNextClick() {
	if (selectedIndex.value === photos.value.length - 1) {
		selectedIndex.value = 0;
		return;
	}
	selectedIndex.value++;
}
function onPrevClick() {
	if (selectedIndex.value === 0) {
		selectedIndex.value = photos.value.length - 1;
		return;
	}
	selectedIndex.value--;
}
function onDownLoadClick() {
	const photo = photos.value[selectedIndex.value];
	downloadFile(getPhotoUrl(photo, false), photo);
}
function getPhotoUrl(photo: string, full: boolean = true) {
	return (full ? `${API_HOST}${API_URL}` : '') + `/anomaly/${id.value}/${photo}`;
}
</script>

<style lang="scss" scoped>
.nav-button {
	position: absolute;
	top: 50%;
	z-index: 1;
	&.next {
		right: 30px;
	}
	&.prev {
		left: 30px;
	}
}

.photo-container {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
	}
}
</style>

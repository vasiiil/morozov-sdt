<template>
	<dx-popup
		ref="popup"
		:title="title"
		width="600px"
		max-height="400px"
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
			:height="300"
			:data-source="photos"
			v-model:selected-index="selectedIndex"
			:loop="true"
			:animation-enabled="true"
		>
			<template #item="{ data: photo }">
				<div class="photo-container">
					<img
						:src="`https://api-k2.zao-sdt.ru/431c125d28fbfa0e97d5f89a12ab3fb5/anomaly/33555/${photo}`"
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

const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const selectedIndex = ref(0);
const photos = ref<string[]>([]);
const title = computed(
	() => `Фото ${selectedIndex.value + 1} из ${photos.value.length}`,
);
function open(_photos: string[]) {
	photos.value = _photos;
	popupRef.value.instance.show();
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
	const href = `https://api-k2.zao-sdt.ru/431c125d28fbfa0e97d5f89a12ab3fb5/anomaly/33555/${photo}`;
	downloadFile(href, photo);
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

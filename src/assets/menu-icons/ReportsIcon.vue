<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 30 30"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_104_1471)">
			<path
				d="M0 30V0H29.3578V16.6667H3.66972V20H12.844V23.3333H3.66972V26.6667H12.844V30H0ZM20.9174 30L15.7798 25.3333L18.3486 23L20.9174 25.3333L27.4312 19.4167L30 21.75L20.9174 30ZM3.66972 13.3333H12.844V10H3.66972V13.3333ZM16.5138 13.3333H25.6881V10H16.5138V13.3333ZM3.66972 6.66667H12.844V3.33333H3.66972V6.66667ZM16.5138 6.66667H25.6881V3.33333H16.5138V6.66667Z"
				fill="white"
				:fill-opacity="fillOpacity"
			/>
		</g>
		<defs>
			<clipPath id="clip0_104_1471">
				<rect
					width="30"
					height="30"
					fill="white"
				/>
			</clipPath>
		</defs>
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const { size = 30, active = false } = defineProps<{
	size: number;
	active: boolean;
}>();
const fillOpacity = computed(() => (active ? 1 : 0.5));
</script>

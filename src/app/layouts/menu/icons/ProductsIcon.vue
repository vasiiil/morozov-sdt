<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 30 30"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_104_1457)">
			<path
				d="M0 30V0H3.33333V2.72727H26.6667V0H30V30H26.6667V27.2727H3.33333V30H0ZM3.33333 13.6364H6.66667V8.18182H16.6667V13.6364H26.6667V5.45455H3.33333V13.6364ZM3.33333 24.5455H13.3333V19.0909H23.3333V24.5455H26.6667V16.3636H3.33333V24.5455ZM10 13.6364H13.3333V10.9091H10V13.6364ZM16.6667 24.5455H20V21.8182H16.6667V24.5455Z"
				fill="white"
				:fill-opacity="fillOpacity"
			/>
		</g>
		<defs>
			<clipPath id="clip0_104_1457">
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

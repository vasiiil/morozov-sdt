<template>
	<template v-if="!menuOpened">
		<template
			v-for="data of menuItems"
			:key="`#menu-title-${data.id}`"
		>
			<dx-tooltip
				:target="`#menu-title-${data.id}`"
				:wrapper-attr="{ class: 'menu-title-tooltip' }"
				show-event="mouseenter"
				hide-event="mouseleave"
				:position="{
					my: 'left',
					at: 'left',
					offset: { x: 47, y: 0 },
				}"
			>
				{{ data.text }}
			</dx-tooltip>
		</template>
	</template>
	<dx-accordion
		:items="menuItems"
		:collapsible="true"
		:multiple="true"
		v-model:selected-items="selectedMenuItems"
		item-title-template="itemTitle"
		@item-title-click="onMenuTitleClick"
	>
		<template #itemTitle="{ data }">
			<div
				@mouseenter="hoverMenuTitle(data.id)"
				@mouseleave="unsetHeveredMenuTitle"
				:id="`menu-title-${data.id}`"
			>
				<div
					class="menu-title"
					:class="{
						active:
							route.name !== 'underConstruction' &&
							(menuItemsPathNames.get(data.id)?.has(route.name as string) ||
								(!!data.pathName && route.name === data.pathName)),
					}"
				>
					<component
						:is="data.icon"
						:size="26"
						:active="
							(route.name !== 'underConstruction' &&
								(menuItemsPathNames.get(data.id)?.has(route.name as string) ||
									(!!data.pathName && route.name === data.pathName))) ||
							hoveredMenuTitle === data.id
						"
					></component>
					<span
						class="text"
						v-show="menuOpened"
					>
						{{ data.text }}
					</span>
					<i
						v-show="menuOpened && !data.disabled && !!data.items"
						class="dx-icon"
						:class="{
							'dx-icon-chevrondown': !selectedMenuIds.has(data.id),
							'dx-icon-chevronup': selectedMenuIds.has(data.id),
						}"
					></i>
				</div>
			</div>
		</template>
		<template #item="{ data }">
			<div
				class="dx-item-content dx-accordion-item-body"
				:class="{ 'empty-item-body': !data.items }"
			>
				<div
					class="menu-second-level"
					v-for="(item, index) of data.items"
					:key="`menu-item-${data.id}-${index}`"
				>
					<div class="connector">
						<div class="top"></div>
						<div class="bottom"></div>
					</div>
					<router-link
						class="text"
						:class="{
							disabled: item.disabled,
							active:
								route.name !== 'underConstruction' &&
								route.name === item.pathName,
						}"
						:to="{ name: item.pathName }"
					>
						{{ item.text }}
					</router-link>
				</div>
			</div>
		</template>
	</dx-accordion>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DxAccordion, DxTooltip } from 'devextreme-vue';
import type { DxAccordionTypes } from 'devextreme-vue/accordion';

interface IMenu {
	id: string;
	icon: unknown;
	text: string;
	pathName?: string;
	disabled?: boolean;
	items?: {
		text: string;
		pathName: string;
		disabled?: boolean;
	}[];
}

const emit = defineEmits<{
	(event: 'open-menu'): void;
}>();
const { menuOpened } = defineProps<{
	menuOpened: boolean;
}>();

const router = useRouter();
const route = useRoute();

const menuItems: IMenu[] = [
	{
		id: 'dashboard',
		icon: defineAsyncComponent(() => import('./icons/DashboardIcon.vue')),
		text: 'Dashboard',
		pathName: 'dashboard',
	},
	{
		id: 'orders',
		icon: defineAsyncComponent(() => import('./icons/OrdersIcon.vue')),
		text: 'Заказы',
		items: [
			{
				text: 'Просмотр заказов',
				pathName: 'ordersPage',
			},
			{
				text: 'Управление возвратами',
				pathName: 'underConstruction',
				disabled: true,
			},
		],
	},
	{
		id: 'waybills',
		icon: defineAsyncComponent(() => import('./icons/WaybillsIcon.vue')),
		text: 'Накладные',
		items: [
			{
				text: 'Просмотр поставок',
				pathName: 'waybillsPage',
			},
			{
				text: 'Поставщики',
				pathName: 'suppliersPage',
			},
			{
				text: 'Управление отгрузками',
				pathName: 'underConstruction',
			},
			{
				text: 'Перемещение товаров (трансфер)',
				pathName: 'underConstruction',
			},
		],
	},
	{
		id: 'products',
		icon: defineAsyncComponent(() => import('./icons/ProductsIcon.vue')),
		text: 'Товары',
		pathName: 'underConstruction',
	},
	{
		id: 'anomalies',
		icon: defineAsyncComponent(() => import('./icons/AnomaliesIcon.vue')),
		text: 'Аномалии',
		pathName: 'anomalyZonesPage',
	},
	{
		id: 'transport-ordering',
		icon: defineAsyncComponent(
			() => import('./icons/TransportOrderingIcon.vue'),
		),
		text: 'Заказ транспорта',
		pathName: 'underConstruction',
	},
	{
		id: 'reports',
		icon: defineAsyncComponent(() => import('./icons/ReportsIcon.vue')),
		text: 'Отчеты',
		pathName: 'underConstruction',
	},
];

const hoveredMenuTitle = ref<string | null>(null);
function hoverMenuTitle(id: string) {
	hoveredMenuTitle.value = id;
}
function unsetHeveredMenuTitle() {
	hoveredMenuTitle.value = null;
}

const selectedMenuItems = ref<IMenu[]>([]);
const selectedMenuIds = computed(
	() => new Set(selectedMenuItems.value.map((item) => item.id)),
);
const menuItemsPathNames = ref<Map<string, Set<string>>>(new Map());
onMounted(() => {
	menuItemsPathNames.value.clear();
	for (const menuItem of menuItems) {
		if (!menuItem.items) {
			continue;
		}
		const pathNames = new Set<string>();
		for (const subItem of menuItem.items) {
			pathNames.add(subItem.pathName);
		}
		menuItemsPathNames.value.set(menuItem.id, pathNames);
	}
});
function onMenuTitleClick(event: DxAccordionTypes.ItemTitleClickEvent<IMenu>) {
	if (event.itemData?.pathName) {
		router.push({ name: event.itemData.pathName });
	} else {
		emit('open-menu');
	}
}
function clearSelectedMenuItems() {
	selectedMenuItems.value = [];
}
defineExpose({ clearSelectedMenuItems });
</script>

<style lang="scss" scoped>
.dx-accordion {
	::v-deep(.dx-accordion-item) {
		color: var(--sdt-c-white-50);
		&:not(:last-child) {
			margin-bottom: 4px;
		}
		& > .dx-accordion-item-title {
			color: var(--sdt-c-white-50);
			background-color: unset;
			min-height: 52px;
			&:hover,
			&:has(.menu-title.active) {
				color: var(--sdt-c-white);
				background-color: var(--sdt-c-calestical-blue);
			}
		}
		&.dx-state-disabled > .dx-accordion-item-title {
			color: var(--sdt-c-white-10);
		}
	}
	.dx-accordion-item-title::before {
		display: none;
	}
	.dx-accordion-item-body {
		padding-right: 0;
		padding-bottom: 0;
		&.empty-item-body {
			padding: 0;
		}
	}

	.menu-title {
		width: 100%;
		display: grid;
		gap: 12px;
		grid-template-columns: 20px 1fr 20px;
		align-items: center;

		.dx-icon {
			font-size: 26px;
		}
	}

	.menu-second-level {
		display: grid;
		grid-template-columns: 26px 1fr;
		margin-bottom: 4px;
		&:last-child {
			margin-bottom: 0;
			.connector .bottom {
				border-left: unset;
			}
		}
		.connector {
			display: grid;
			grid-auto-rows: 50%;
			grid-auto-columns: 100%;
			width: 26px;
			div {
				margin-left: 50%;
				width: 50%;
				border-left: 2px solid var(--sdt-c-calestical-blue-dark);
				grid-column: 1 / 1;
				&.top {
					border-bottom: 2px solid var(--sdt-c-calestical-blue-dark);
					border-bottom-left-radius: 8px;
					grid-row: 1 / 2;
				}
				&.bottom {
					grid-row: 1 / 4;
				}
			}
		}
		.text {
			padding: 8px 12px;
			cursor: pointer;
			color: var(--sdt-c-white-50);
			text-decoration: none;
			&:not(.disabled) {
				&:hover,
				&.active {
					color: var(--sdt-c-white);
					background-color: var(--sdt-c-calestical-blue);
					border-radius: 4px;
				}
			}
			&.disabled {
				color: var(--sdt-c-white-10);
				pointer-events: none;
			}
		}
	}
}
</style>

<style lang="scss">
.menu-title-tooltip {
	.dx-overlay-content {
		&,
		.dx-popover-arrow::after {
			background-color: var(--sdt-c-calestical-blue);
		}

		.dx-popup-content {
			color: var(--sdt-c-white);
			padding: 10px 12px;
		}
	}
}
</style>

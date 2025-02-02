<template>
	<div class="layout">
		<div
			class="layout-menu"
			:class="{ opened: menuOpened }"
		>
			<base-button
				:element-attr="{ class: 'toggle-menu-button' }"
				:icon="menuOpened ? 'chevronleft' : 'chevronright'"
				@click="onToggleMenuClick"
			/>
			<dx-accordion
				:items="menuItems"
				:collapsible="true"
				:multiple="true"
				v-model:selected-items="selectedMenuItems"
				item-title-template="itemTitle"
				@item-title-click="onMenuTitleClick"
			>
				<template #itemTitle="{ data }">
					<div>
						<div
							class="menu-title"
							:class="{
								active:
									route.name !== 'underConstruction' &&
									menuItemsPathNames.get(data.id)?.has(route.name as string),
							}"
						>
							<i
								class="dx-icon"
								:class="`dx-icon-${data.icon}`"
							></i>
							<span
								class="text"
								v-show="menuOpened"
							>
								{{ data.text }}
							</span>
							<i
								v-show="menuOpened && !data.disabled"
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
								active: route.name === item.pathName,
							}"
							:to="{ name: item.pathName }"
						>
							{{ item.text }}
						</router-link>
					</div>
				</template>
			</dx-accordion>
		</div>
		<div class="layout-page">
			<div class="layout-page-header max-content-width">
				<div class="layout-page-header-section start">
					<div class="logo">
						<img
							src="/static/HeaderLogo.svg"
							alt="Логотип"
						/>
					</div>
					<div class="support texts">
						<div class="text">Поддержка</div>
						<div class="text">8 800 123 45 67</div>
					</div>
				</div>
				<div class="layout-page-header-section end">
					<div class="customer texts">
						<div class="text name">Иванов И. И.</div>
						<dx-select-box
							:items="companies"
							:value="companies[0]"
						/>
					</div>
					<div class="logout-button">
						<base-button
							text="Выйти"
							icon="login"
							styling-mode="outlined"
							@click="onLogoutClick"
						/>
					</div>
				</div>
			</div>
			<div class="layout-page-content max-content-width">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { DxSelectBox, DxAccordion } from 'devextreme-vue';

import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { BaseButton } from '@/shared/ui';

interface IMenu {
	id: string;
	icon: string;
	text: string;
	disabled?: boolean;
	items?: {
		text: string;
		pathName: string;
		disabled?: boolean;
	}[];
}
function onLogoutClick() {}
const companies = ['ООО "Рога"', 'ООО "Копыта"'];

const route = useRoute();
const {
	value: menuOpened,
	setTrue: openMenu,
	toggle: toggleMenu,
} = useBoolean();
function onToggleMenuClick() {
	toggleMenu();
	if (!menuOpened.value) {
		selectedMenuItems.value = [];
	}
}

const menuItems: IMenu[] = [
	{
		id: 'home',
		icon: 'home',
		text: 'Dashboard',
		items: [
			{
				text: 'Test',
				pathName: 'underConstruction',
				disabled: true,
			},
			{
				text: 'Test 2',
				pathName: 'underConstruction',
			},
		],
	},
	{
		id: 'orders',
		icon: 'ordersbox',
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
			{
				text: 'Аномалии',
				pathName: 'anomalyZonesPage',
			},
		],
	},
	{
		id: 'waybills',
		icon: 'print',
		text: 'Накладные',
		disabled: true,
	},
];
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
function onMenuTitleClick() {
	openMenu();
}
</script>

<style lang="scss" scoped>
$header-height: 90px;
$menu-width: 100px;
$menu-width-opened: 240px;
$max-content-width: 1530px;
$gap: 30px;
.layout {
	width: 100%;
	height: 100%;
	display: flex;

	&-menu {
		width: $menu-width;
		background-color: var(--sdt-c-primary);
		padding: 140px 25px 25px 25px;
		position: relative;

		&.opened {
			width: $menu-width-opened;
		}

		::v-deep(.toggle-menu-button) {
			background-color: var(--sdt-c-primary);
			border: 1px solid var(--sdt-c-black-soft);
			position: absolute;
			right: -14px;
			top: 34px;
			min-width: 28px;
			width: 28px;
			height: 28px;
			.dx-button-content {
				padding: 4px;
				.dx-icon {
					font-size: 14px;
					color: var(--sdt-c-white);
				}
			}
		}

		::v-deep(.dx-accordion) {
			.dx-accordion-item {
				color: var(--sdt-c-white-50);
				& > .dx-accordion-item-title {
					color: var(--sdt-c-white-50);
					background-color: unset;
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
			}

			.menu-title {
				width: 100%;
				display: grid;
				gap: 12px;
				grid-template-columns: 20px 1fr 20px;

				.dx-icon {
					font-size: 26px;
				}
			}

			.menu-second-level {
				display: grid;
				grid-template-columns: 26px 1fr;
				&:last-child .connector .bottom {
					border-left: unset;
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
							grid-row: 1 / 3;
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
	}

	&-page {
		width: calc(100% - $menu-width);
		padding: 0 30px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.max-content-width {
			width: 100%;
			max-width: $max-content-width;
		}

		&-header {
			padding: 10px 0;
			width: 100%;
			height: $header-height;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #476981;
			margin-bottom: $gap;

			.logo {
				> img {
					height: 100%;
				}
			}

			.texts {
				align-self: center;
			}

			.text {
				font-size: 24px;
				font-weight: 700;

				.name {
					font-size: 28px;
				}
			}

			&-section {
				display: flex;
				gap: 20px;
				&.start {
					gap: 30px;
				}

				.logout-button {
					width: 70px;
					height: 70px;
					::v-deep(.dx-button) {
						width: 100%;
						height: 100%;
						.dx-button-content {
							display: flex;
							flex-direction: column;
							padding: 0;
							.dx-icon {
								width: 50px;
								height: 40px;
								font-size: 50px;
								margin: 0;
							}
							.dx-button-text {
								font-size: 18px;
							}
						}
					}
				}
			}
		}

		&-content {
			height: calc(100% - $header-height - $gap);
			width: 100%;
			overflow: hidden;
		}
	}
}
</style>

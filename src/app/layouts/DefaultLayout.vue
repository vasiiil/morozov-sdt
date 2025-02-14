<template>
	<div class="layout">
		<div
			class="layout-menu"
			:class="{ opened: menuOpened }"
		>
			<base-button
				element-class="toggle-menu-button"
				:icon="menuOpened ? 'chevronleft' : 'chevronright'"
				@click="onToggleMenuClick"
			></base-button>
			<dx-scroll-view
				height="100%"
				show-scrollbar="never"
				:use-native="false"
			>
				<menu-compoenent
					:menu-opened="menuOpened"
					@open-menu="openMenu"
					ref="menu-component"
				></menu-compoenent>
			</dx-scroll-view>
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
						></dx-select-box>
					</div>
					<div class="logout-button">
						<base-button
							text="Выйти"
							icon="login"
							styling-mode="outlined"
							@click="onLogoutClick"
						></base-button>
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
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxSelectBox, DxScrollView } from 'devextreme-vue';

import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { BaseButton } from '@/shared/ui';
import MenuCompoenent from './menu';

const menuRef =
	useTemplateRef<ComponentExposed<typeof MenuCompoenent>>('menu-component');
function onLogoutClick() {}
const companies = ['ООО "Рога"', 'ООО "Копыта"'];

const {
	value: menuOpened,
	setTrue: openMenu,
	toggle: toggleMenu,
} = useBoolean();
function onToggleMenuClick() {
	toggleMenu();
	if (!menuOpened.value) {
		menuRef.value?.clearSelectedMenuItems();
	}
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

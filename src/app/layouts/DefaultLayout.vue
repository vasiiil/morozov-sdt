<template>
	<div class="layout">
		<div class="layout-header">
			<dx-toolbar :element-attr="{ class: 'layout-header-toolbar' }">
				<dx-toolbar-item location="before">
					<i class="dx-icon dx-icon-menu"></i>
				</dx-toolbar-item>
				<dx-toolbar-item location="before">
					<div class="title">SDT <span class="text-smaller">ООО СОЛФЕРИНО (WMS СДТ К2)</span></div>
				</dx-toolbar-item>
				<dx-toolbar-item location="after">
					<i class="dx-icon dx-icon-help"></i>
				</dx-toolbar-item>
				<dx-toolbar-item location="after">
					<i class="dx-icon dx-icon-bell"></i>
				</dx-toolbar-item>
				<dx-toolbar-item location="after">
					<i class="dx-icon dx-icon-user"></i>
				</dx-toolbar-item>
				<dx-toolbar-item location="after">
					<i class="dx-icon dx-icon-smalliconslayout"></i>
				</dx-toolbar-item>
			</dx-toolbar>
		</div>
		<div class="layout-menu"></div>
		<div class="layout-content">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DxToolbar, DxItem as DxToolbarItem } from 'devextreme-vue/toolbar';
</script>

<style lang="scss" scoped>
$header-height: 36px;
$menu-width: 40px;
.layout {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: $menu-width calc(100% - $menu-width);
	grid-template-rows: $header-height calc(100% - $header-height);
	grid-template-areas:
		'header header'
		'menu content';

	&-header {
		grid-area: header;

		&-toolbar {
			background-color: var(--sdt-c-black);
			border: none;
			border-radius: 0;
			padding-left: 0;
			color: var(--sdt-c-white);

			.title {
				display: flex;
				gap: 5px;
				align-items: center;
				font-size: 16px;

				.text-smaller {
					font-size: 0.8em;
				}
			}

			.dx-icon-menu {
				width: $menu-width;
				text-align: center;
			}

			.icons-container {
				display: flex;
				gap: 1rem;
			}
		}
	}
	&-menu {
		grid-area: menu;
		border-right: 1px solid var(--color-border);
	}
	&-content {
		width: 100%;
		height: 100%;
		padding: 12px 8px;
		grid-area: content;
		overflow: hidden;
	}
}
</style>

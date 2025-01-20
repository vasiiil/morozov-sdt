<template>
	<div class="layout">
		<div class="layout-menu"></div>
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
						<div class="text">ООО «Рога и копыта»</div>
					</div>
					<div class="logout-button">
						<dx-button
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
import { DxButton } from 'devextreme-vue';
function onLogoutClick() {}
</script>

<style lang="scss" scoped>
$header-height: 130px;
$menu-width: 100px;
$max-content-width: 1530px;
$gap: 30px;
.layout {
	width: 100%;
	height: 100%;
	display: flex;

	&-menu {
		width: $menu-width;
		background-color: var(--sdt-primary);
	}

	&-page {
		width: calc(100% - $menu-width);
		padding: 0 30px;

		.max-content-width {
			width: 100%;
			max-width: $max-content-width;
		}

		&-header {
			padding: 20px 0;
			color: var(--sdt-primary);

			width: 100%;
			height: $header-height;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #476981;
			margin-bottom: $gap;

			.texts {
				align-self: center;
			}

			.text {
				font-size: 24px;
				font-weight: 700;
			}

			&-section {
				display: flex;
				gap: 20px;
				&.start {
					gap: 30px;
				}

				.logout-button {
					width: 90px;
					height: 90px;
					::v-deep(.dx-button) {
						width: 100%;
						height: 100%;
						.dx-button-content {
							display: flex;
							flex-direction: column;
							padding: 0;
							.dx-icon {
								width: 80px;
								height: 60px;
								font-size: 65px;
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

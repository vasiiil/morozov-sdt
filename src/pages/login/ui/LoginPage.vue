<template>
	<div class="page-container">
		<div class="login-card">
			<div class="row toolbar">
				<login-icon></login-icon>
				<span>Войти</span>
			</div>
			<div class="row">
				<dx-text-box
					placeholder="Логин"
					:height="44"
					:element-attr="{ class: 'login-textbox' }"
				></dx-text-box>
			</div>
			<div class="row">
				<dx-text-box
					placeholder="Пароль"
					:height="44"
					:element-attr="{ class: 'password-textbox' }"
				></dx-text-box>
			</div>
			<div class="row remember">
				<dx-check-box
					:icon-size="20"
					text="Не запоминать"
				></dx-check-box>
			</div>
			<div class="row">
				<base-button
					text="Войти"
					styling-mode="outlined"
					width="100%"
					height="45px"
				></base-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { DxTextBox, DxCheckBox } from 'devextreme-vue';
import LoginIcon from './icons/LoginIcon.vue';
import { BaseButton } from '@/shared/ui';
</script>

<style lang="scss" scoped>
.page-container {
	width: 100%;
	height: 100%;
	background-image: url(./icons/bg-image.png);
	display: flex;
	justify-content: center;
	align-items: center;

	.login-card {
		width: 360px;
		height: 320px;
		padding: 20px;
		border-radius: 10px;
		background-color: white;
		display: flex;
		flex-direction: column;
		gap: 20px;

		.row {
			height: 44px;
			width: 100%;

			&.toolbar {
				display: flex;
				gap: 10px;
				align-items: center;
				padding: 10px 0;
				font-size: 24px;
			}

			.dx-textbox {
				border-color: var(--color-input-background);
				&,
				&.dx-state-readonly {
					background-color: var(--color-input-background);
					box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.25);
				}
				&.dx-state-focused {
					&::before {
						border-bottom: 1px solid var(--color-border-focused);
					}
				}

				&.login-textbox {
					::v-deep(.dx-texteditor-input-container) {
						&:before {
							background-image: url('./icons/icon-person.svg');
						}
					}
				}
				&.password-textbox {
					::v-deep(.dx-texteditor-input-container) {
						&:before {
							background-image: url('./icons/icon-key.svg');
						}
					}
				}

				::v-deep(.dx-texteditor-container) {
					.dx-placeholder {
						font-size: 24px;
						margin-left: 35px;
					}
					.dx-texteditor-input-container {
						background-color: var(--color-input-background);
						padding: 7px 5px;
						&:before {
							display: inline-flex;
							content: '';
							background-size: 30px 30px;
							background-repeat: no-repeat;
							height: 30px;
							width: 45px;
							align-self: center;
						}
						input {
							padding-left: 0;
							font-size: 24px;
						}
					}
				}
			}

			&.remember {
				height: 22px;
				display: flex;
				justify-content: center;

				.dx-checkbox {
					height: 22px;
					font-size: 18px;
				}
			}

			::v-deep(.dx-button-text) {
				font-size: 26px;
			}
		}
	}
}
</style>

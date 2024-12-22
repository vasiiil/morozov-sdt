<template>
	<div class="orders-page">
		<h2 class="page-title orders-page-title">Orders Page</h2>
		<div class="orders-page-data-table">
			<data-grid></data-grid>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DataGrid } from './';
</script>

<style lang="scss" scoped>
.orders-page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px calc(100% - 40px);
	&-toolbar {
		.start-icons-container {
			display: flex;
			gap: 8px;
		}
	}

	&-data-table {
		overflow: hidden;
	}
}
</style>

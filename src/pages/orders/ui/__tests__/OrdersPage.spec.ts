import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import OrdersPage from '../OrdersPage.vue';

describe('OrdersPage', () => {
	it('renders properly', () => {
		const wrapper = mount(OrdersPage);
		expect(wrapper.text()).toContain('Orders Page');
	});
});

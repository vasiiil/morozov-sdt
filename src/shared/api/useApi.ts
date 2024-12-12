import type { AxiosRequestConfig } from 'axios';
import { traceOnCatch } from '../lib/utils/errors';
import instance from './instance';

interface IUseApi {
	get: <T = unknown>(
		url: string,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	post: <T = unknown>(
		url: string,
		body: Record<string, unknown>,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	put: <T = unknown>(
		url: string,
		body: Record<string, unknown>,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	delete: <T = unknown>(
		url: string,
		body: Record<string, unknown>,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig,
	) => Promise<T>;
}

export function useApi(): IUseApi {
	async function _request<T>(config: AxiosRequestConfig): Promise<T> {
		try {
			const { data } = await instance<T>(config);
			return data;
		} catch (error: unknown) {
			traceOnCatch(`useApi ${config.method}`, error);
			throw error;
		}
	}

	async function _get<T = unknown>(
		url: string,
		params: Record<string, unknown> = {},
		config: AxiosRequestConfig = {},
	): Promise<T> {
		return await _request({
			method: 'GET',
			url,
			params,
			...config,
		});
	}

	async function _post<T = unknown>(
		url: string,
		body: Record<string, unknown> = {},
		params: Record<string, unknown> = {},
		config: AxiosRequestConfig = {},
	): Promise<T> {
		return await _request({
			method: 'POST',
			url,
			data: body,
			params,
			...config,
		});
	}

	async function _put<T = unknown>(
		url: string,
		body: Record<string, unknown> = {},
		params: Record<string, unknown> = {},
		config: AxiosRequestConfig = {},
	): Promise<T> {
		return await _request({
			method: 'PUT',
			url,
			data: body,
			params,
			...config,
		});
	}

	async function _delete<T = unknown>(
		url: string,
		body: Record<string, unknown> = {},
		params: Record<string, unknown> = {},
		config: AxiosRequestConfig = {},
	): Promise<T> {
		return await _request({
			method: 'DELETE',
			url,
			data: body,
			params,
			...config,
		});
	}

	return {
		get: _get,
		post: _post,
		put: _put,
		delete: _delete,
	};
}

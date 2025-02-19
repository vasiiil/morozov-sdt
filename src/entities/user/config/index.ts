export interface IProfile {
	id: string;
	name: string;
	level_access: string;
}
export interface IUser {
	user_name: string;
	profiles: IProfile[];
	active_profile: string;
}
export interface IAuthResponse {
	user_name: string;
	auth: {
		[id: string]: {
			name: string;
			level_access: string;
		};
	}[];
	active_profile: string;
}

import { SettingCodes } from '../../src/core/setting_codes';

describe('SettingCodes', () => {
	it('should have the correct values', () => {
		expect(SettingCodes.defaultOrgaForUserRegister).toBe(0);
		expect(SettingCodes.defaultRoleForUserRegister).toBe(1);
		expect(SettingCodes.defaultFlow).toBe(2);
		expect(SettingCodes.orgaForAnonymousUser).toBe(3);
	});
});
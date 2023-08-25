import { SettingDataSource } from '../../data/datasources/setting_data_source';
import { SettingModel } from '../../data/models/setting_model';
import { Setting } from '../../domain/entities/setting';
import { SettingCodes } from '../../core/setting_codes';
import { data_insert01 } from './load_data_01';
import { data_insert02 } from './load_data_02';

const superSettingId_defaultOrgaForUserRegister = '0000C001-0000-0000-0999-000000000FFF';
const superSettingId_defaultRoleForUserRegister = '0000C002-0000-0000-0999-000000000FFF';
const superSettingId_defaultFlow = '0000C003-0000-0000-0999-000000000FFF';
const superSettingId_orgaForAnonymousUser = '0000C004-0000-0000-0999-000000000FFF';
const adminSettingId_defaultRoleForUserRegister = '0000C005-0000-0000-0999-000000000FFF';
const adminSettingId_defaultFlow = '0000C006-0000-0000-0999-000000000FFF';
const adminOrgaId = data_insert01.orgas[1].id;

const value_orgaForAnonymousUser = data_insert01.orgas[1].id;
const value_defaultFlow = data_insert02.flows[0].id;
const value_defaultRoleForUserRegister = data_insert01.roles[3].name; //user
const value_defaultOrgaForUserRegister = data_insert01.orgas[1].id;

export const checkData03 = async (settingSource: SettingDataSource) => {

	///buscar si existe stage cada uno
	//stages
	data_insert03.settings.forEach(async setting => {
		const result = await settingSource.getById(setting.id);
		if(result.currentItemCount < 1)
		{
			await settingSource.add(new SettingModel(setting.id, setting.code, setting.value, setting.builtIn, setting.orgaId));
		}
	});
};

export const data_insert03 = {
	settings:[
     {_id: superSettingId_orgaForAnonymousUser, id: superSettingId_orgaForAnonymousUser, code: SettingCodes[SettingCodes.orgaForAnonymousUser], created: new Date(), builtIn: true, value: value_orgaForAnonymousUser} as Setting,
     {_id: superSettingId_defaultOrgaForUserRegister, id: superSettingId_defaultOrgaForUserRegister, code: SettingCodes[SettingCodes.defaultOrgaForUserRegister], created: new Date(), builtIn: true, value: value_defaultOrgaForUserRegister} as Setting, 
     {_id: superSettingId_defaultRoleForUserRegister, id: superSettingId_defaultRoleForUserRegister, code: SettingCodes[SettingCodes.defaultRoleForUserRegister], created: new Date(), builtIn: true, value: value_defaultRoleForUserRegister} as Setting, 
     {_id: superSettingId_defaultFlow, id: superSettingId_defaultFlow, code: SettingCodes[SettingCodes.defaultFlow], created: new Date(), builtIn: true, value: value_defaultFlow} as Setting, 
     {_id: adminSettingId_defaultRoleForUserRegister, id: adminSettingId_defaultRoleForUserRegister, code: SettingCodes[SettingCodes.defaultRoleForUserRegister], created: new Date(), builtIn: true, value: value_defaultRoleForUserRegister, orgaId:adminOrgaId} as Setting, 
     {_id: adminSettingId_defaultFlow, id: adminSettingId_defaultFlow, code: SettingCodes[SettingCodes.defaultFlow], created: new Date(), builtIn: true, value: value_defaultFlow, orgaId:adminOrgaId} as Setting]
};
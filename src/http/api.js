/* 
 * 接口统一集成模块
 */
import * as company from './modules/company'
import * as companyMember from './modules/companyMember'
import * as companyPay from './modules/companyPay'
import * as companyUser from './modules/companyUser'
import * as led from './modules/led'
import * as login from './modules/login'
import * as outfall from './modules/outfall'
import * as platformAddress from './modules/platformAddress'
import * as pollutant from './modules/pollutant'
import * as user from './modules/user'
import * as dept from './modules/dept'
import * as role from './modules/role'
import * as menu from './modules/menu'
import * as dictionary from './modules/dictionary'
import * as config from './modules/config'
import * as log from './modules/log'
import * as loginlog from './modules/loginlog'
import * as earlyWarning from './modules/earlyWarning'


// 默认全部导出
export default {
    company,
    companyMember,
    companyPay,
    companyUser,
    led,
    login,
    outfall,
    platformAddress,
    pollutant,
    user,
    dept,
    role,
    menu,
    dictionary,
    config,
    log,
    loginlog,
    earlyWarning
}
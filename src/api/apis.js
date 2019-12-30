import {createApi} from './axios';
import create from "../views/staff/create";



//账户
export const login = createApi();
export const changepassword = createApi();
export const logout = createApi();
export const getgzhconfig = createApi();
export const updategzhconfig = createApi();
export const gettkconfig = createApi();
export const settkconfig = createApi();
export const getcheckinlist = createApi();
export const getuserlist = createApi();
export const getorderlist = createApi();
export const getwithdrawlist = createApi();
export const changewithdrawstatus = createApi();
export const getUserMoneyLogList = createApi();
export const registerAgent = createApi();
export const getMsgList = createApi();
export const addFanliRate = createApi();
export const deleteFanliRate = createApi();
export const getFanliRateList = createApi();
export const updateFanliRate = createApi();
export const updateAgent = createApi();
export const getAgent = createApi();

export const changeUserMoney = createApi();


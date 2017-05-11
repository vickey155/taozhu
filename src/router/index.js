import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Login from '@/views/Login/Login';
import Signup from '@/views/Login/Signup';
import FogetPassword from '@/views/Login/FogetPassword'
import SignupInfo from '@/views/Login/SignupInfo'
import ChkMail from '@/views/Login/ChkMail'
import Team from '@/views/Login/Team'


//个人资料
import USER from '@/views/User/Index'
import PersonalInformation from '@/views/User/PersonalInformation'
import UserList from '@/views/User/UserList'
import PendingAudit from '@/views/User/PendingAudit'


//其他菜单
import StrategySys from '@/views/ohter/StrategySys'
import SaleSys from '@/views/ohter/SaleSys'
import MarketSys from '@/views/ohter/MarketSys'
import OperateSys from '@/views/ohter/OperateSys'
import pmSys from '@/views/ohter/pmSys'
import RDSys from '@/views/ohter/RDSys'
import eamSys from '@/views/ohter/eamSys'
import fccSys from '@/views/ohter/fccSys'
import epSys from '@/views/ohter/epSys'
import mdSys from '@/views/ohter/mdSys'


//
import HCM from '@/views/Hcm/Index'

//工作台
import {workTable} from './workTable'
import {hcm} from './hcm'



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      meta:{
        auth: true //
      },
      children: [
        {
          path: '/',
          redirect: { name: 'CurrentOrg' }
        },
        {
          path: 'user',
          component: USER,
          children: [
            {
              path: '/',
              component: PersonalInformation,
            },
            {
              path: 'personalinformation',
              name: 'user',
              component: PersonalInformation,
            },
            {
              path: 'userlist',
              name: 'userlist',
              component: UserList,
            },
            {
              path: 'pendingaudit',
              name: 'pendingaudit',
              component: PendingAudit,
            },
          ]
        },
        hcm,
        workTable,
        //其他菜单部门
        {
          path: 'StrategySys',
          component: StrategySys,
        },
        {
          path: 'MarketSys',
          component: MarketSys,
        },
        {
          path: 'SaleSys',
          component: SaleSys,
        },
        {
          path: 'OperateSys',
          component: OperateSys,
        },
        {
          path: 'pmSys',
          component: pmSys,
        },
        {
          path: 'RDSys',
          component: RDSys,
        },
        {
          path: 'eamSys',
          component: eamSys,
        },
        {
          path: 'fccSys',
          component: fccSys,
        },
        {
          path: 'epSys',
          component: epSys,
        },
        {
          path: 'mdSys',
          component: mdSys,
        },
      ]
    },
    {
      path: '/team',
      name: 'team',
      meta:{
        auth: true //
      },
      component: Team,
    },
    {
      path: '/login',
      name: 'login',
      meta:{
        enter: true //
      },
      component: Login,
    },
    {
      path: '/signup',
      name: 'signup',
      meta:{
        enter: true //
      },
      component: Signup,
    },
    {
      path: '/signupinfo',
      name: 'signupinfo',
      component: SignupInfo,
      meta:{
        signupinfo: true //
      },
    },
    {
      path: '/fogetpassword',
      name: 'fogetpassword',
      meta:{
        enter: true //
      },
      component: FogetPassword,
    },
    {
      path: '/chkmail',
      name: 'chkmail',
      component: ChkMail,
    },
    {
      path: '*',
      redirect: '/home'
    },
  ],
});

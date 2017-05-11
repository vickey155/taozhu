/**
 * Created by Administrator on 2017/4/19 0019.
 */

import index from '@/views/leaveDay/index';
import PersonLeaveDay from '@/views/leaveDay/personLeave/personLeaveDay';
import LeaderLeaveDay from '@/views/leaveDay/leaderLeave/leaderLeaveDay';



export const workTable = {
  path: '/workTable',
  meta:{
    auth: true //登陆进入的权限  enter 登陆后不能进入的权限
  },
  component: index,
  children:[
    {
      path: '/',
      component: PersonLeaveDay,
    },
    {
      path: 'leaveDayPerson',
      name: 'leaveDayPerson',
      meta:{
        auth: true
      },
      component: PersonLeaveDay,
    },
    {
      path: 'leaveDayLeader',
     // name: 'leaveDayLeader',
      meta:{
        auth: true
      },
      component: LeaderLeaveDay,
    }
  ]
}

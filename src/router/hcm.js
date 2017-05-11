/**
 * Created by Administrator on 2017/4/19 0019.
 */

import HCM from '@/views/Hcm/Index'
import CurrentOrg from '@/views/Hcm/CurrentOrg'//组织架构主版本
import PostSetting from '@/views/Hcm/PostSetting'//岗位设置
import PersonnelFiles from '@/views/Hcm/PersonnelFiles'//人事管理
import StaffLeaveDay from '@/views/leaveDay/staffLeave/staffLeaveDay'; //考勤管理


export const hcm ={
  path: 'hcm',
  component: HCM,
  children: [
    {
      path: '/',
      component: CurrentOrg,
    },
    {
      path: 'currentorg',
      name: 'CurrentOrg',
      component: CurrentOrg,
    },
    {
      path: 'postsetting',
      name: 'PostSetting',
      component: PostSetting,
    },
    {
      path: 'personnelfiles',
      name: 'PersonnelFiles',
      component: PersonnelFiles,
    },
    {
      path: 'leaveDayStaff',
      name: 'leaveDayStaff',
      component: StaffLeaveDay,
    }
  ]
}
/**
 * Created by Administrator on 2017/5/2 0002.
 */

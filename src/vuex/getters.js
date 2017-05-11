export const userInfo = state => {
  const userInfo = state.auth;
  return userInfo
};
export const userTenantId = state => {
  let userTenantId={};
  userTenantId.userId= state.auth.userid;
  userTenantId.tenantId= state.tenant.tenantid;
  return userTenantId
}

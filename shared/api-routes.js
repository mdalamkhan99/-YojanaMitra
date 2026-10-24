export const API = {
  prefix:'/api',
  health:'/api/health',
  auth:{csrf:'/api/auth/csrf',register:'/api/auth/register',login:'/api/auth/login',logout:'/api/auth/logout',me:'/api/auth/me',password:'/api/auth/password',account:'/api/auth/account'},
  profile:'/api/profile', schemes:'/api/schemes', applications:'/api/applications', documents:'/api/documents', bookmarks:'/api/bookmarks',
  chat:{sessions:'/api/chat/sessions',session:(id)=>`/api/chat/sessions/${id}`},
  ai:{chat:'/api/ai/chat',health:'/api/ai/health',transcribe:'/api/ai/transcribe'}, jobs:'/api/jobs', adminJobs:'/api/admin/jobs', adminSchemes:'/api/admin/schemes'
};
export const APP_ROUTES={home:'/',schemes:'/schemes',jobs:'/jobs',tracker:'/applications',profile:'/profile',documents:'/documents',assistant:'/chat',admin:'/admin'};
export const API_ROUTE_LIST=[['GET',API.health],['GET',API.auth.csrf],['POST',API.auth.register],['POST',API.auth.login],['POST',API.auth.logout],['GET',API.auth.me],['PATCH',API.auth.password],['DELETE',API.auth.account],['GET',API.profile],['PUT',API.profile],['GET',API.schemes],['GET',API.jobs],['GET',`${API.jobs}/:id/eligibility`],['GET',API.applications],['POST',API.applications],['DELETE',`${API.applications}/:id`],['GET',API.documents],['PUT',API.documents],['POST',`${API.bookmarks}/:schemeId`],['POST',API.ai.chat],['GET',API.ai.health],['POST',API.ai.transcribe],['GET',API.chat.sessions],['POST',API.chat.sessions],['GET',`${API.chat.sessions}/:id`],['PATCH',`${API.chat.sessions}/:id`],['DELETE',`${API.chat.sessions}/:id`],['GET',API.adminSchemes],['POST',API.adminSchemes],['PATCH',`${API.adminSchemes}/:id`],['GET',API.adminJobs],['POST',API.adminJobs],['PATCH',`${API.adminJobs}/:id`],['POST',`${API.jobs}/:id/bookmark`],['POST',`${API.jobs}/:id/track`]];

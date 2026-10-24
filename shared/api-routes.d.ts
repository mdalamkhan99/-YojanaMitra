export declare const API: {
  prefix:string; health: string; auth: { csrf:string; register:string; login:string; logout:string; me:string; password:string; account:string };
  profile:string; schemes:string; applications:string; documents:string; bookmarks:string;
  chat:{sessions:string;session:(id:string)=>string};
  ai:{chat:string;health:string;transcribe:string}; jobs:string; adminJobs:string; adminSchemes:string;
};
export declare const APP_ROUTES: { home:string; schemes:string; jobs:string; tracker:string; profile:string; documents:string; assistant:string; admin:string };
export declare const API_ROUTE_LIST: readonly (readonly [string,string])[];

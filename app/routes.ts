import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    // Handle favicon requests
    route('favicon.ico', 'routes/favicon.ico.tsx'),
    
    layout('routes/admin/AdminLayout.tsx',
        [
            route('dashboard', 'routes/admin/Dashboard.tsx'),
            route('all-users', 'routes/admin/AllUsers.tsx'),
           
        ]
     )
] satisfies RouteConfig;
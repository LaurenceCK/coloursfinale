import { Routes } from '@angular/router';

import { CompanyComponent } from './company.component';
import { JoinEnterpriseComponent } from './join-enterprise/join-enterprise.component';
import { CreateEnterpriseComponent } from './create-enterprise/create-enterprise.component';
import { EnterpriseProfileComponent } from './enterprise-profile/enterprise-profile.component';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { SetupComponent } from './setup/setup.component';
import { CreateComponent } from './create/create.component';

export const CompanyRoutes: Routes = [{
    path: '',
    children: [{
        path: 'enterprises/company-register',
        component: CompanyComponent
    },{
        path: 'enterprises/enterprise-view',
        component: EnterpriseViewComponent
    },{
        path: 'enterprises/create',
        component: CreateComponent
    },{
        path: 'enterprises/join-enterprise',
        component: JoinEnterpriseComponent
    },{
        path: 'enterprises/:id',
        component: EnterpriseProfileComponent
    },{
        path: 'enterprises/create-enterprise',
        component: CreateEnterpriseComponent
    },{
        path: 'enterprises/setup',
        component: SetupComponent
    }]
}];
// enterprise - view
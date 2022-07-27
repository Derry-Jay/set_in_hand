import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from 'src/pages/home/home';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
//   {
//     path: 'assignlocation',
//     loadChildren: () => import('../../assignlocation/assignlocation.module').then(m => m.AssignlocationPageModule)
// }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

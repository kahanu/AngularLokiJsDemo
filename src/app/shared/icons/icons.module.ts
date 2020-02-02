import { NgModule } from '@angular/core';
import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faUser,
  faInfo,
  faTools,
  faQuestion,
  faCaretLeft,
  faCaretRight,
  faTachometerAlt,
  faSignOutAlt,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [],
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class IconsModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(
      faHome,
      faUser,
      faInfo,
      faTools,
      faQuestion,
      faCaretLeft,
      faCaretRight,
      faTachometerAlt,
      faSignOutAlt,
      faShoppingCart
    );
  }
}

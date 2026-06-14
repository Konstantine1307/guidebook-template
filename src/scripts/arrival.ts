import '../scripts/layout';
import { renderCheckIn, renderDirections, renderFoodShopping } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderDirections() + renderCheckIn() + renderFoodShopping();

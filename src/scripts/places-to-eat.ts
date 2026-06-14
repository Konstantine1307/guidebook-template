import '../scripts/layout';
import { renderRestaurants } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderRestaurants();

import '../scripts/layout';
import { renderAttractions } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderAttractions();

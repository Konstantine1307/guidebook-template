import '../scripts/layout';
import { renderBeaches } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderBeaches();

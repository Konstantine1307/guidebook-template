import '../scripts/layout';
import { renderHouseManual } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderHouseManual();

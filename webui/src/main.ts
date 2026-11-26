import './styles/global.css';

// Register all stable Material Web components
import '@material/web/all.js';

// Register Material Web Labs components used across the dashboard
import '@material/web/labs/badge/badge.js';
import '@material/web/labs/card/elevated-card.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';
import '@material/web/labs/navigationdrawer/navigation-drawer-modal.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';

// Initialize reactive store (also initializes MonetThemeEngine)
import { telemetryStore } from './state/store';

// Register app shell and pages
import './components/app-shell';
import './pages/home/home-page';
import './pages/context-page';
import './pages/steps-page';
import './pages/models-page';
import './pages/global-trends-page';
import './pages/recent-sessions-page';
import './pages/settings-page';

telemetryStore.start();

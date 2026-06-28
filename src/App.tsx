import { GameContainer } from './components/GameContainer';
import { MobilePortfolio } from './components/MobilePortfolio';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <ErrorBoundary>
      {isMobile ? <MobilePortfolio /> : <GameContainer />}
    </ErrorBoundary>
  );
}

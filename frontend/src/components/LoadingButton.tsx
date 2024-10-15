import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const LoadingButton = () => {
  return (
    <Button disabled aria-busy="true" aria-label="Loading, please wait">
      <Loader2 className="mr-2 h-4 w-4 animate-spin">Loading</Loader2>
    </Button>
  );
};
export default LoadingButton;

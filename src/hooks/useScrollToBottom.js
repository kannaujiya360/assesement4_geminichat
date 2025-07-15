
import { useEffect } from 'react';

export default function useScrollToBottom(ref, deps = []) {
  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, deps);
}

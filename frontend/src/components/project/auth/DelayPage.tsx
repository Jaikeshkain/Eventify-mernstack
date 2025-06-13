import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

const DelayedPage = ({ delay, children }:{delay:number,children:any}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady) {
    return (
      <LoadingSpinner/>
    );
  }

  return <>{children}</>;
};

export default DelayedPage;

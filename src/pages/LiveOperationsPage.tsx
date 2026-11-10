import React from 'react';
import { LeafletCityMap } from '../components/LeafletCityMap';

export const LiveOperationsPage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col space-y-3">
      {/* Main Map Viewport with all floating controls */}
      <div className="flex-1 w-full min-h-[640px] md:min-h-[720px]">
        <LeafletCityMap />
      </div>
    </div>
  );
};

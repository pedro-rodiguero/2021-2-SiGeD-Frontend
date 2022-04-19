import React, { useState, useEffect } from 'react';
import { useProfileUser } from '../../Context';
import { AllDemandsReport } from '../../Utils/reports/printDemandReport';
import { Button } from './Style';

export default function ReportModal({ allDemands, filterSector, filterCategory }) {
  const { user, startModal } = useProfileUser();
  const [currentDemands, setCurrentDemands] = useState(allDemands);
  const [currentSector, setCurrentSector] = useState('Todos');

  useEffect(() => {
    console.log(filterCategory);
  }, []);

  const handleChangeSector = (e) => {
    setCurrentSector(String(e.target.value));
  };

  useEffect(() => {
    console.log('current sector', currentSector);
    if (currentSector !== 'Todos') {
      const demandsFiltered = allDemands.filter((demand) => (
        demand.sectorHistory[demand.sectorHistory.length - 1].sectorID === currentSector
      ));
      setCurrentDemands(demandsFiltered);
      return;
    }
    setCurrentDemands(allDemands);
  }, [currentSector]);

  return (
    <div>
      <h1>Esse é o modal</h1>
      <div>
        <select onChange={handleChangeSector}>
          {
            filterSector.map((sector) => (
              <option key={sector.name} value={sector._id}>
                {sector.name}
              </option>
            ))
          }
        </select>
      </div>
      <Button onClick={() => AllDemandsReport(currentDemands, user, startModal)}>
        Baixar relatório
      </Button>
    </div>
  );
}

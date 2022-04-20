import React, { useState, useEffect } from 'react';
import { FaTruckLoading } from 'react-icons/fa';
import { useProfileUser } from '../../Context';
import { AllDemandsReport } from '../../Utils/reports/printDemandReport';
import { Button } from './Style';

export default function ReportModal({ allDemands, filterSector, filterCategory }) {
  const { user, startModal } = useProfileUser();
  const [currentDemands, setCurrentDemands] = useState(allDemands);
  const [currentSector, setCurrentSector] = useState(filterSector[0]._id);
  const [currentCategory, setCurrentCategory] = useState('Todas');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [demandStatus, setDemandStatus] = useState('Ativas');

  useEffect(() => {
    console.log(filterCategory);
  }, []);

  const handleChangeSector = (e) => {
    setCurrentSector(String(e.target.value));
  };

  const handleChangeCategory = (e) => {
    setCurrentCategory(e.target.value);
  };
  const handleChangeStatus = (e) => {
    setDemandStatus(e.target.value);
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await AllDemandsReport(currentDemands, user, startModal);
      setIsGeneratingPdf(false);
    } catch (error) {
      console.log('erro');
      setIsGeneratingPdf(false);
    }
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

  useEffect(() => {
    if (currentCategory !== 'Todas') {
      const demandsFiltered = allDemands.filter((category) => (
        category.categoryID.some((el) => el.name === currentCategory)
      ));
      setCurrentDemands(demandsFiltered);
      return;
    }
    setCurrentDemands(allDemands);
  }, [currentCategory]);

  useEffect(() => {
    const flag = demandStatus === 'Ativas';
    const demandsFiltered = allDemands.filter((demand) => (
      demand.open === flag
    ));
    setCurrentDemands(demandsFiltered);
  }, [demandStatus]);

  return (
    <div>
      <h2>Selecione os filtros para gerar o relatório</h2>
      <div style={{
        display: 'flex',
        marginTop: '15px',
      }}>
        Status:
        <select style={{ marginLeft: '5px', width: '30%' }} onChange={handleChangeStatus}>
          <option value="Ativas" selected>Ativas</option>
          <option value="Inativas">Inativas</option>
        </select>
      </div>
      <div style={{
        display: 'flex',
        marginTop: '15px',
      }}>
        Setor:
        <select style={{ marginLeft: '5px', width: '30%' }} value={currentSector} onChange={handleChangeSector}>
          {
            filterSector.map((sector) => (
              <option key={sector.name} value={sector._id}>
                {sector.name}
              </option>
            ))
          }
        </select>
      </div>
      <div style={{
        display: 'flex',
        marginTop: '15px',
      }}>
        Categoria:
        <select style={{ marginLeft: '5px', width: '30%' }} onChange={handleChangeCategory}>
          {
            filterCategory.map((category) => (
              <option key={category.name || category} value={category.name || category}>
                {category.name || category}
              </option>
            ))
          }
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0px' }}>
        <Button onClick={() => handleGeneratePdf()}>
          Baixar relatório
        </Button>
      </div>
      {
        isGeneratingPdf
        && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '5px',
          }}>
            <FaTruckLoading />
            Gerando pdf...
          </div>
        )
      }
    </div>
  );
}

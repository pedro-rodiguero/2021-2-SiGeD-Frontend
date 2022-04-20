import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FaTruckLoading } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [initialDate, setInitialDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
  const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD'));

  const handleChangeSector = (e) => {
    setCurrentSector(String(e.target.value));
  };

  const handleChangeCategory = (e) => {
    setCurrentCategory(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setDemandStatus(e.target.value);
  };

  const handleChangeInitialDate = (e) => {
    setInitialDate(moment(e.target.value).format('YYYY-MM-DD'));
  };

  const handleChangeFinalDate = (e) => {
    setFinalDate(moment(e.target.value).format('YYYY-MM-DD'));
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await AllDemandsReport(currentDemands, user, startModal);
      setIsGeneratingPdf(false);
    } catch (error) {
      toast.error('Houve um problema ao gerar o pdf 😬');
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    const flag = demandStatus === 'Ativas';
    const demandsFiltered = allDemands.filter((demand) => (
      (demand.sectorHistory[demand.sectorHistory.length - 1].sectorID === currentSector)
      && (moment(demand.createdAt).format('YYYY-MM-DD') >= moment(initialDate).format('YYYY-MM-DD')
      && moment(demand.createdAt).format('YYYY-MM-DD') <= moment(finalDate).format('YYYY-MM-DD'))
      && (demand.open === flag)
      && (demand.categoryID.some((el) => currentCategory === 'Todas' || el.name === currentCategory))
    ));
    setCurrentDemands(demandsFiltered);
  }, [initialDate, finalDate, demandStatus, currentCategory, currentSector]);

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
      <div style={{
        display: 'flex',
        marginTop: '15px',
        alignItems: 'center',
      }}>
        Data inicial:
        <input
          type="date"
          id="initialDate"
          name="initialDate"
          value={initialDate}
          style={{ margin: '0px 5px' }}
          min={moment().subtract(365, 'days').format('YYYY-MM-DD')}
          max={moment().format('YYYY-MM-DD')}
          onChange={handleChangeInitialDate} />
        Data final:
        <input
          type="date"
          id="finalDate"
          name="finalDate"
          min={moment().subtract(365, 'days').format('YYYY-MM-DD')}
          max={moment().format('YYYY-MM-DD')}
          value={finalDate}
          style={{ margin: '0px 5px' }}
          onChange={handleChangeFinalDate} />
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
      <ToastContainer />
    </div>
  );
}

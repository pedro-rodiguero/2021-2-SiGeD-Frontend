import { useParams } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment-timezone';
import { useProfileUser } from '../../Context';
import { getDemandData } from '../../Services/Axios/demandsServices';
import { getClientData, getClientFeatures } from '../../Services/Axios/clientServices';

const splitFeatures = (featuresList) => {
  let features = '';

  for (let i = 0; i < featuresList.length; i += 1) {
    if (i + 1 === featuresList.length) features += featuresList[i].name;
    else {
      features += featuresList[i].name;
      features += ', ';
    }
  }
  return features;
};

const DemandReport = async () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { id } = useParams();
  const { user, startModal } = useProfileUser();
  const date = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY');
  const demandData = await getDemandData(id, startModal);
  console.log(demandData.clientID);
  const clientData = await getClientData(demandData.clientID, startModal)
    .then((response) => response.data);
  console.log(clientData);
  const clientsFeatures = await getClientFeatures(clientData.features)
    .then((response) => response.data);
  const document = {
    content: [
      { text: 'Divisão de Proteção à Saúde do Servidor', style: 'header' },
      { text: 'DPSS', style: 'header' },
      { text: '\n\nRelatório de Prontuário', style: 'title' },
      { text: `\n\nUsuário: ${user.name}  Data: ${date}`, style: 'title' },
      { text: `\nDemanda: ${demandData.name}`, style: 'title' },
      { text: `\nProcessos: ${demandData.process}`, style: 'title' },
      { text: `\nCliente: ${clientData.name}`, style: 'title' },
      { text: `\nCaracterísticas do Cliente: ${splitFeatures(clientsFeatures)}`, style: 'title' },
    ],
  };
  const docDefinitions = {
    pageSize: 'A4',
    pageMargins: [15, 50, 15, 40],
    content: [document.content],
  };
  pdfMake.createPdf(docDefinitions).print();
};

export default DemandReport;

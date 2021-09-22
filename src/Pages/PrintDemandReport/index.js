/* eslint-disable */
import { useParams } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment-timezone';
import { useProfileUser } from '../../Context';
import { getDemandData } from '../../Services/Axios/demandsServices';
import { getClientData, getClientFeatures } from '../../Services/Axios/clientServices';
import { getSectors } from '../../Services/Axios/sectorServices';

const splitList = (myList) => {
  let string = '';

  for (let i = 0; i < myList.length; i += 1) {
    if (i + 1 === myList.length) string += myList[i].name;
    else {
      string += myList[i].name;
      string += ', ';
    }
  }
  return string;
};

const updatesList = (updates) => {
  let new_list = [['Data', 'Atualização']];

  updates.map((update) => {
    let list = [moment.parseZone(update.createdAt).local(true).format('DD/MM/YYYY')];

    if (update.type === "sector") {
      list.push(`seção: ${update.sectorName}`)
    }
    else
      list.push(`${update.important ? '*' : ''} ${update.description}`)

    new_list.push(list);

  });
  return new_list;
};

const DemandReport = async () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { id } = useParams();
  const { user, startModal } = useProfileUser();
  const date = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY');
  const demandData = await getDemandData(id, startModal);
  const clientData = await getClientData(demandData.clientID, startModal)
    .then((response) => response.data);
  const clientsFeatures = await getClientFeatures(clientData.features)
    .then((response) => response.data);
  const sectors = await getSectors(startModal)
    .then((response) => response.data);
  demandData.updateList.map((element) => {
    element.type = "update";
  });
  demandData.sectorHistory.map((element) => {
    element.type = "sector";
    for(let i = 0; i < sectors.length; i += 1) {
      if (sectors[i]._id === element.sectorID) 
        element.sectorName = sectors[i].name;
    }
  });
  console.log(demandData);
  var updates = demandData.sectorHistory.concat(demandData.updateList)
  updates.sort((a, b) => {
    if (a.createdAt < b.createdAt)
      return 1;
    return -1;
  });
  const document = {
    content: [
      { text: 'Divisão de Proteção à Saúde do Servidor', style: 'header' },
      { text: 'DPSS', style: 'header' },
      { text: '\nRelatório de Atendimento', style: 'title' },
      { text: `Usuário: ${user.name}  Data: ${date}`, style: 'title' },
      { text: `Demanda: ${demandData.name}`, style: 'title' },
      { text: `Categorias: ${splitList(demandData.categoryID)}`, style: 'title' },
      { text: `Processos: ${demandData.process}`, style: 'title' },
      { text: `Cliente: ${clientData.name}`, style: 'title' },
      { text: `Características do Cliente: ${clientsFeatures.length == 0? '~Não possui' : splitList(clientsFeatures)}`, style: 'title' },
      '\n\nTabela de atualizações',
      {
        style: 'tableExample',
        table: {
          body: updatesList(updates),
        }
      },
    ],
  };
  const docDefinitions = {
    pageSize: 'A4',
    pageMargins: [15, 50, 15, 40],
    content: [document.content],
  };
  pdfMake.createPdf(docDefinitions).open();

  return (null);
};

export default DemandReport;

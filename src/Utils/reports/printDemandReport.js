import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment-timezone';
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
  const newList = [
    [
      { text: 'Data', style: 'tableTitle' },
      { text: 'Atualização', style: 'tableTitle' },
    ],
  ];
  updates.map((update) => {
    const list = [{ text: `${moment.parseZone(update.createdAt).local(true).format('DD/MM/YYYY')}\n ${moment.parseZone(update.createdAt).local(true).format('HH:mm')}`, style: 'tableLeftInfo' }];
    if (update.type === 'sector') {
      list.push({ text: `Encaminhado para o setor: ${update.sectorName}`, style: 'sessionStyle' });
    } else if (update.type === 'update') {
      list.push({ text: [{ text: update.important ? '*' : '  ', style: 'important' }, `(${update.userName}): ${update.description}`] });
    }

    newList.push(list);

    return null;
  });
  return newList;
};
const DemandReport = async (id, user, startModal) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const date = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY');
  const demandData = await getDemandData(id, startModal);
  const clientData = await getClientData(demandData.clientID, startModal)
    .then((response) => response.data);
  const clientsFeatures = await getClientFeatures(clientData.features)
    .then((response) => response.data);
  const sectors = await getSectors(startModal)
    .then((response) => response.data);
  const updates = [];
  demandData.updateList.map((element) => {
    const typeField = element;
    typeField.type = 'update';

    if (user.role === 'admin' || !element.visibilityRestriction) {
      updates.push(element);
    } else if (element.visibilityRestriction && element.userSector === user.sector) {
      updates.push(element);
    }

    return null;
  });
  demandData.sectorHistory.map((element) => {
    const typeField = element;
    typeField.type = 'sector';
    for (let i = 0; i < sectors.length; i += 1) {
      if (sectors[i]._id === element.sectorID) {
        typeField.sectorName = sectors[i].name;
        break;
      }
    }
    updates.push(element);

    return null;
  });
  updates.sort((a, b) => {
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return -1;
  });
  const document = {
    content: [
      { text: 'Divisão de Proteção à Saúde do Servidor - DPSS', style: 'header' },
      { text: '\nRelatório de Atendimento', style: 'subTitle' },
      { text: '\nInformações da demanda\n\n', style: 'subTitleLeft' },
      { columns: [{ text: [{ text: 'Usuário:  ', style: 'title' }, { text: `${user.name}`, style: 'leftAlign' }] }, { text: `Data: ${date}`, style: 'dateStyle' }] },
      { text: [{ text: 'Demanda:  ', style: 'title' }, `${demandData.name}`] },
      { text: [{ text: 'Categorias:  ', style: 'title' }, `${splitList(demandData.categoryID)}`] },
      { text: [{ text: 'Processos:  ', style: 'title' }, `${demandData.process}`] },
      { text: [{ text: 'Cliente:  ', style: 'title' }, `${clientData.name}`] },
      { text: [{ text: 'Características do cliente:  ', style: 'title' }, `${clientsFeatures.length === 0 ? '~Não possui' : splitList(clientsFeatures)}`] },
      { text: '\nTabela de atualizações\n\n', style: 'subTitleLeft' },
      {
        style: 'tableExample',
        table: {
          body: updatesList(updates),
        },
      },
    ],
    styles: {
      header: {
        fontSize: 30,
        bold: true,
        alignment: 'center',
      },
      subTitle: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        decoration: 'underline',
      },
      subTitleLeft: {
        fontSize: 16,
        bold: true,
        alignment: 'left',
      },
      sessionStyle: {
        background: '#ccc',
      },
      tableTitle: {
        bold: true,
        alignment: 'center',
      },
      tableLeftInfo: {
        alignment: 'center',
      },
      dateStyle: {
        alignment: 'right',
      },
      leftAlign: {
        alignment: 'left',
      },
      title: {
        bold: true,
      },
      important: {
        color: '#FF0000',
      },
    },
    defaultStyle: {
      alignment: 'justify',
    },

  };
  const docDefinitions = {
    pageSize: 'A4',
    pageMargins: 40,
    content: [document.content],
    styles: document.styles,
    defaultStyle: document.defaultStyle,
  };

  pdfMake.createPdf(docDefinitions).print();

  return (null);
};

export default DemandReport;

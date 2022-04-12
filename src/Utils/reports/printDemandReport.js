import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment-timezone';
import { getDemandData } from '../../Services/Axios/demandsServices';
import { getClientData, getClientFeatures } from '../../Services/Axios/clientServices';
import { getSectors } from '../../Services/Axios/sectorServices';
import { getUser } from '../../Services/Axios/userServices';

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
      { text: 'Data', style: 'tableTitle', colSpan: 1 },
      { text: 'Atualização', style: 'tableTitle', colSpan: 1 },
    ],
  ];
  updates.map((update) => {
    const list = [{ text: `${moment.parseZone(update.createdAt).local(true).format('DD/MM/YYYY')} - ${moment.parseZone(update.createdAt).local(true).format('HH:mm')}`, style: 'tableLeftInfo', colSpan: 1 }];
    if (update.type === 'sector') {
      list.push({ text: `Encaminhado para o setor: ${update.sectorName}`, style: 'sessionStyle', colSpan: 1 });
    } else if (update.type === 'update') {
      list.push({ text: [{ text: update.important ? '*' : '  ', style: 'important' }, `(${update.userName}): ${update.description}`], colSpan: 1 });
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

const AllDemandsReport = async (demandsList, users, startModal) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  console.log('users', users);
  console.log('demandsList', demandsList);
  console.log('startmodal', startModal);
  const date = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY');
  console.log('date', date);
  const arrayDeTest = await Promise.all(demandsList.map(async (demand) => {
    const demandData = await getDemandData(demand._id, startModal);
    const clientData = await getClientData(demandData.clientID, startModal)
      .then((response) => response.data);
    const userData = await getUser(`users/${demandData.userID}`, startModal)
      .then((response) => response.data);
    const clientsFeatures = await getClientFeatures(clientData.features)
      .then((response) => response.data);
    const sectors = await getSectors(startModal)
      .then((response) => response.data);
    const updates = [];
    demandData.updateList.map((element) => {
      const typeField = element;
      typeField.type = 'update';

      if (users.role === 'admin' || !element.visibilityRestriction) {
        updates.push(element);
      } else if (element.visibilityRestriction && element.usersSector === users.sector) {
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

    return [
      await demandData, await clientData, await clientsFeatures,
      await sectors, await demandData, await updates,
      await userData,
    ];
  }));

  console.log(arrayDeTest);

  const document = {
    content: [
      { text: 'Divisão de Proteção à Saúde do Servidor - DPSS', style: 'header' },
      { text: '\nRelatório de Demandas\n\n', style: 'subTitle' },
      { columns: [{ text: [{ text: 'Usuário:  ', style: 'title' }, { text: `${users.name}`, style: 'leftAlign' }] }, { text: `Data: ${date}`, style: 'dateStyle' }] },
      arrayDeTest.map((el) => (
        [
          { text: '\n\n' },
          { text: [{ text: `Demanda: ${el[0].name}`, style: 'demandTitle' }] },
          {
            table: {
              widths: ['*', '*'],
              body: [
                [{ text: [{ text: 'Status:  ', style: 'title' }, `${el[0].open ? 'Aberta' : 'Concluída'}`], colSpan: 2 }, {}],
                [{ text: [{ text: 'Usuário:  ', style: 'title' }, ` ${el[6]?.name}`], colSpan: 2 }, {}],
                [{ text: [{ text: 'Categorias:  ', style: 'title' }, `${splitList(el[0].categoryID)}`], colSpan: 2 }, {}],
                [{ text: [{ text: 'Processos:  ', style: 'title' }, `${el[0].process}`], colSpan: 2 }, {}],
                [{ colSpan: 1, text: [{ text: 'Cliente: ', style: 'title' }, `${el[1].name}`] },
                  { colSpan: 1, text: [{ text: 'Característica: ', style: 'title' }, `${el[2].length === 0 ? '~Não possui' : splitList(el[2])}`] }],
                [{ text: 'Atualizações', style: 'subTitleLeft', colSpan: 2 }, {}],
                ...updatesList(el[5]),
              ],
            },
          },
        ]
      )),
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
        fontSize: 14,
        bold: true,
        alignment: 'center',
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
      demandTitle: {
        fontSize: 16,
        marginTop: 30,
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

export { DemandReport, AllDemandsReport };

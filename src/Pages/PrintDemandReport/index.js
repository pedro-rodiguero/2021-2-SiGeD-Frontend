import { useParams } from 'react-router-dom';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment-timezone';
import { useProfileUser } from '../../Context';
import { getDemandData } from '../../Services/Axios/demandsServices';

const DemandReport = async () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { id } = useParams();
  const { user, startModal } = useProfileUser();
  const date = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY');
  const demandData = await getDemandData(id, startModal);
  const document = {
    content: [
      { text: 'Divisão de Proteção à Saúde do Servidor', style: 'header' },
      { text: 'DPSS', style: 'header' },
      { text: '\n\nRelatório de Prontuário', style: 'title' },
      { text: `\n\nUsuário: ${user.name}  Data: ${date}`, style: 'title' },
      { text: `\nDemanda: ${demandData.name}`, style: 'title' },
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

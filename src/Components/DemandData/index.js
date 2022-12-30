import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { FaPrint } from 'react-icons/fa';
import {
  DemandCard, DemandTitle, ClientName, SectorName, ProcessNumber,
  DemandCreatedAt, CategoryField, CategoryName, Icon, Button,
} from './Style';
import colors from '../../Constants/colors';
import { DemandReport } from '../../Utils/reports/printDemandReport';
import { useProfileUser } from '../../Context';

const DemandData = ({ demand, sectors }) => {
  const { user, startModal } = useProfileUser();
  const sectorName = sectors?.filter((sectorByID) => (sectorByID._id
    === demand.sectorHistory.at(-1).sectorID));

  const renderDemandCategories = () => (demand.categoryID?.map((category) => (
    <CategoryName color={category.color}>{category.name}</CategoryName>
  )));

  const styles = {
    demandCard: {
      textDecorationLine: 'none',
      color: colors.text,
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'none',
      fontWeight: 'bold',
    },
    divStyle: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };

  return (
    <DemandCard
      as={Link}
      to={`/visualizar/${demand._id}`}
      style={styles.demandCard}
    >
      <Button onClick={() => DemandReport(demand._id, user, startModal)}>
        <Icon color="#000">
          <FaPrint />
        </Icon>
      </Button>

      <DemandTitle>
        {demand.name}
      </DemandTitle>
      <ClientName>
        Cliente:
        <Link
          to={`/perfil/${demand.clientID}`}
          id={demand.clientID}
          style={styles.link}
        >
          {` ${demand.clientName}`}
        </Link>
      </ClientName>
      <SectorName>
        Setor:
        {` ${sectorName[0]?.name}`}
      </SectorName>
      <SectorName>
        Responsável:
        {` ${demand.sectorHistory.at(-1).responsibleUserName || 'Não atribuído'}`}
      </SectorName>
      <div style={styles.divStyle}>
        <ProcessNumber>
          Nº de Processos:
          {'\t'}
          {demand.process.filter((p) => p !== '').length}
        </ProcessNumber>
        <DemandCreatedAt>
          {moment.parseZone(demand.createdAt).local(true).format('DD/MM/YYYY')}
        </DemandCreatedAt>
      </div>
      <CategoryField>
        {renderDemandCategories()}
      </CategoryField>
    </DemandCard>
  );
};

export default DemandData;

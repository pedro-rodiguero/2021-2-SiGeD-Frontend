import { FaSistrix } from 'react-icons/fa';
import { AiFillFastBackward, AiFillFastForward } from 'react-icons/ai';
import {
  Main,
  Container,
  Title, Search,
  ContentBox, Header, List, ButtonDiv, DropDiv, PageDiv, PageButton,
  PageSpan,
} from './Style';
import SearchInput from '../SearchInput';
import RedirectListButton from '../RedirectButton';

const GenericListScreen = ({
  ButtonTitle, ButtonFunction, PageTitle, children, setWord, SearchWord, ListType,
  redirectTo, clientList, page, more, less,

}) => (
  <Main>
    <Container>
      <Title>{PageTitle}</Title>
      <Header>
        <DropDiv width="475px">
          <Search>
            <SearchInput
              type="text"
              icon={<FaSistrix />}
              value={SearchWord}
              setWord={(value) => setWord(value)}
            />
          </Search>
          {children[1]}
          {clientList && children[2]}
        </DropDiv>
        <ButtonDiv>
          {page >= 0
          && (
          <PageDiv>
            {page !== 0 && (
            <PageButton onClick={less}>
              <AiFillFastBackward />
            </PageButton>
            )}
            <PageSpan>{page}</PageSpan>
            <PageButton onClick={more}>
              <AiFillFastForward />
            </PageButton>
          </PageDiv>
          )}
          <RedirectListButton
            title={ButtonTitle}
            redirectTo={redirectTo}
            click={ButtonFunction} />
        </ButtonDiv>
      </Header>

      <ContentBox>
        {children[0]}
        <List>
          {ListType}
        </List>
      </ContentBox>
    </Container>
  </Main>
);

export default GenericListScreen;

import { TitleBoxContainer } from '@components';
import { HeroSection } from './components';

const LandingPage = () => {
  return (
    <TitleBoxContainer
      title={'Telegramonic | Projects'}
      icon="app"
      display="flex"
      flexDir="column"
      rowGap={10}
      height={'100vh'}
    >
      <HeroSection />
    </TitleBoxContainer>
  );
};

export default LandingPage;

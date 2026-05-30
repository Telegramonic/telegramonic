import { TitleBoxContainer } from '@components';
import {
  HeroSection,
  FeaturesSection,
} from './components';

const LandingPage = () => {
  return (
    <TitleBoxContainer
      title={'Telegramonic | Projects'}
      icon="app"
      display="flex"
      flexDir="column"
      width="100%"
    >
      <HeroSection />
      <FeaturesSection />
    </TitleBoxContainer>
  );
};

export default LandingPage;

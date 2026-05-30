import { TitleBoxContainer } from '@components';
import {
  HeroSection,
  BentoPreview,
  FeaturesSection,
  StatsSection,
  CTASection,
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
      <BentoPreview />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </TitleBoxContainer>
  );
};

export default LandingPage;

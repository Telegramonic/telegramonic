import { IconHc } from '@assets';

export const NAVIGATION_BAR_ = 2;

export const NAVIGATION_LINKS: {
  name: string;
  link: string;
  icon: IconHc;
}[] = [
  {
    name: 'Home',
    link: '/',
    icon: IconHc.HOME,
  },
  {
    name: 'Coding projects',
    link: '/coding-projects',
    icon: IconHc.CODE,
  },
  {
    name: 'College projects',
    link: '/college-projects',
    icon: IconHc.COLLEGE,
  },
  {
    name: 'AI projects',
    link: '/ai-projects',
    icon: IconHc.ROBOT,
  },
  {
    name: 'More',
    link: '/all-projects',
    icon: IconHc.DOWN_ARROW,
  },
];

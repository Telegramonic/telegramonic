import { renderWithProviders } from '@testUtils';
import { ModalID } from '@uiStore';
import ModalComponent from '../Modal';

describe('Modal', () => {
  it('should render correctly', () => {
    const { container } = renderWithProviders(
      <ModalComponent
        isOpen={true}
        modalID={ModalID.SEARCH}
        onModalClose={() => {}}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with different modalID', () => {
    const { container } = renderWithProviders(
      <ModalComponent
        isOpen={true}
        modalID={ModalID.NONE}
        onModalClose={() => {}}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});

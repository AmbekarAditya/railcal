import { Platform } from 'react-native';
import EndDutyModalMobile from './EndDutyModalMobile';
import Duty from '../duty/Duty';

interface EndDutyModalProps {
  duty: Duty;
  updateDutyDetails: (updatedDuty: Duty) => void;
  closeModal: () => void;
}

const EndDutyModal: React.FC<EndDutyModalProps> = (props) => {
  const isWeb = Platform.OS === 'web';

  const renderModal = async () => {
    if (isWeb) {
      const { default: EndDutyModalWeb } = await import('./EndDutyModalWeb');
      return <EndDutyModalWeb {...props} />;
    } else {
      return <EndDutyModalMobile {...props} />;
    }
  };

  return (
    <>
      {renderModal()}
    </>
  );
};

export default EndDutyModal;

import { useLanguageContext } from '../../../context/LanguageContext/LanguageContextProvider';
import SourceCode from '../TextualMode/SourceCode/SourceCode';

export default function Sematics() {
  const { semantics, setSemantics } = useLanguageContext();

  return (
    <div>
      <SourceCode code={semantics} dispatcher={setSemantics} />
    </div>
  );
}

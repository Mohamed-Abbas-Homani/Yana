import { useNotesDisplayStore } from "../../services/note";

const Flag = ({
  label,
  handleSearch,
}: {
  label: string;
  handleSearch: () => void;
}) => {
  const { toggleFilter, filters } = useNotesDisplayStore();
  return (
    <div
      className={`flag ${filters.includes(label) ? "enabled" : "disabled"}`}
      onClick={() => {
        toggleFilter(label);
        handleSearch();
      }}
    >
      {label}
    </div>
  );
};

export default Flag;

import "flag-icons/css/flag-icons.min.css";

function CountryFlag({
  code,
  name,
  showName = true,
}: {
  code: string;
  name: string;
  showName?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {showName && <span>{name}</span>}
      <span className={`fi fi-${code.toLowerCase()}`}></span>
    </div>
  );
}
export default CountryFlag;

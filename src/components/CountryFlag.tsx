import "flag-icons/css/flag-icons.min.css";

function CountryFlag({ code, name }: { code: string; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <span>{name}</span>
      <span className={`fi fi-${code.toLowerCase()}`}></span>
    </div>
  );
}
export default CountryFlag;

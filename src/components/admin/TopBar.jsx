export default function TopBar({ text }) {
  return (
    <div className="flex bg-lime-500 px-6 py-3 rounded-md">
      <span className="font-bold">{text}</span>
    </div>
  );
}

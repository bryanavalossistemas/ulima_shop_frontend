export default function HeadingBar({ text }) {
  return (
    <div className="flex items-center border-[1px] border-slate-300 h-[52px] px-[22px] text-2xl font-bold bg-slate-300 rounded-md">
      {text}
    </div>
  );
}

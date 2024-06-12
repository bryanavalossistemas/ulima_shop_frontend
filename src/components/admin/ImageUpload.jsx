export default function ImageUpload({ preview, onSelectFile }) {
  return (
    <div className="basis-1/3 flex flex-col gap-y-5">
      <img
        className="object-cover h-[334px] rounded-md border"
        src={preview ? preview : "/placeholder.jpg"}
        alt="imagen"
      />
      <div className="flex justify-center">
        <label
          className="text-base font-medium py-2 px-6 rounded-md bg-lime-500 cursor-pointer"
          htmlFor="image"
        >
          Agregar Imagen
        </label>
        <input
          className="hidden"
          type="file"
          id="image"
          onChange={onSelectFile}
        />
      </div>
    </div>
  );
}

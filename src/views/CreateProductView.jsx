import SideBar from "@/components/admin/SideBar";
import ImageUpload from "@/components/admin/ImageUpload";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateProductView() {
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [series, setSeries] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [stock, setStock] = useState("");
  const [selectedSerie, setSelectedSerie] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (selectedSerie <= 0) {
        toast.error("Debe seleccionar una serie");
        return;
      }
      if (type <= 0) {
        toast.error("Debe seleccionar un tipo");
        return;
      }
      if (!preview) {
        toast.error("Debe seleccionar una imagen");
        return;
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("cloud_name", "bryanavalossistemas");
      formData.append("upload_preset", "iouhxpsu");

      const responseCloudinary = await fetch(
        "https://api.cloudinary.com/v1_1/bryanavalossistemas/upload",
        { method: "POST", body: formData }
      );
      const imageData = await responseCloudinary.json();
      const image = imageData.url;

      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          feature,
          brand,
          active: true,
          type,
          price: Number(price),
          stock: Number(stock),
          serieId: Number(selectedSerie),
          image,
        }),
      });

      if (response.ok) {
        toast.success("Producto creado correctamente");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error("Error al crear el producto");
    }
  }

  async function fetchSeries() {
    try {
      const response = await fetch("http://localhost:4000/api/series");
      const series = await response.json();
      setSeries(series);
    } catch (error) {
      toast.error("Error al obtener las series");
    }
  }

  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <main className="p-10">
      <form className="flex gap-x-8" onSubmit={handleSubmit}>
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-6">
          <TopBar text="Agregar Producto" />
          <div className="flex gap-x-6">
            <ImageUpload preview={preview} onSelectFile={onSelectFile} />
            <div className="basis-2/3 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Nombre:</Label>
                <Input
                  className="h-9"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="description">Descripción:</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></Textarea>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="feature">Características:</Label>
                <Textarea
                  id="feature"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  required
                ></Textarea>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="brand">Marca:</Label>
                    <Input
                      className="h-9"
                      type="text"
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="serie">Serie:</Label>
                    <Select
                      value={selectedSerie}
                      onValueChange={(e) => setSelectedSerie(e)}
                    >
                      <SelectTrigger className="w-[185px] h-9">
                        <SelectValue placeholder="Seleccione serie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Series</SelectLabel>
                          {series.map((serie) => (
                            <SelectItem
                              key={serie.id}
                              value={serie.id.toString()}
                            >
                              {serie.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="price">Precio:</Label>
                    <div className="flex items-center gap-x-3">
                      <span className="font-bold">S/</span>
                      <Input
                        className="h-9"
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min={1}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="type">Tipo:</Label>
                    <Select onValueChange={(e) => setType(e)}>
                      <SelectTrigger className="w-[185px] h-9">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos</SelectLabel>
                          <SelectItem value="mas vendidos">
                            Más vendidos
                          </SelectItem>
                          <SelectItem value="nuevos">Nuevos</SelectItem>
                          <SelectItem value="ofertas">Ofertas</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="name">Stock:</Label>
                    <Input
                      className="h-9"
                      type="number"
                      id="stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min={1}
                    />
                  </div>
                  <div className="invisible">
                    <div className="flex items-center gap-x-3">
                      <span>S/</span>
                      <Input />
                    </div>
                  </div>
                </div>
                <div className="flex"></div>
              </div>
              <div className="flex justify-end">
                <Button className="px-12 py-6" type="submit">
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

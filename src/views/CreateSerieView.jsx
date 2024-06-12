import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import ImageUpload from "@/components/admin/ImageUpload";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateSerieView() {
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [open, setOpen] = useState(false);

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
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("cloud_name", "bryanavalossistemas");
      formData.append("upload_preset", "iouhxpsu");
      if (!preview) {
        toast.error("Debe seleccionar una imagen");
        return;
      }
      const responseCloudinary = await fetch(
        "https://api.cloudinary.com/v1_1/bryanavalossistemas/upload",
        { method: "POST", body: formData }
      );
      const imageData = await responseCloudinary.json();
      const image = imageData.url;

      const response = await fetch("http://localhost:4000/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          image,
        }),
      });

      const createdSerie = await response.json();

      const updatedProducts = selectedProducts.map((selectedProduct) => {
        fetch(
          `http://localhost:4000/api/products/${selectedProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...selectedProduct,
              serieId: createdSerie.id,
            }),
          }
        );
      });

      await Promise.all([updatedProducts]);

      navigate("/admin/series");
      toast.success("Serie creada correctamente");
    } catch (error) {
      toast.error("Error al crear la serie");
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:4000/api/products");
      const products = await response.json();
      setProducts(products);
      setProductsFiltered(products);
    } catch (error) {
      toast.error("Error al obtener productos");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="p-10">
      <form className="flex gap-x-8" onSubmit={handleSubmit}>
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-6">
          <TopBar text="Agregar Serie" />
          <div className="flex gap-x-6">
            <ImageUpload preview={preview} onSelectFile={onSelectFile} />
            <div className="basis-2/3 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Nombre</Label>
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
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></Textarea>
              </div>
              <div className="flex flex-col">
                <div className="bg-lime-500 py-2 px-4 flex items-center justify-between">
                  <span className="font-medium">Productos en la serie</span>
                  <Button
                    className="px-3 py-1.5 h-auto"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  </Button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="min-w-[80vw] h-[60vh] flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Agregar producto</DialogTitle>
                        <DialogDescription>
                          Agregue productos aquí. Haga clic en agregar cuando
                          haya terminado.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-x-4">
                        <Input
                          type="search"
                          placeholder="Buscar por descripcion o ID"
                          onChange={(e) => {
                            setProductsFiltered(
                              e.target.value === ""
                                ? products
                                : products.filter((product) => {
                                    if (
                                      product.idProduct
                                        .toString()
                                        .includes(e.target.value) ||
                                      product.description.includes(
                                        e.target.value
                                      )
                                    ) {
                                      return product;
                                    }
                                  })
                            );
                          }}
                        />
                      </div>
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Descripción</TableHead>
                              <TableHead className="text-right">
                                Acción
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productsFiltered.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell className="text-right">
                                  <button
                                    className="underline"
                                    onClick={() => {
                                      setSelectedProducts([
                                        ...selectedProducts,
                                        product,
                                      ]);
                                      setProducts(
                                        products.filter(
                                          (productClick) =>
                                            productClick.id !==
                                            product.id
                                        )
                                      );
                                      setProductsFiltered(
                                        products.filter(
                                          (productClick) =>
                                            productClick.id !==
                                            product.id
                                        )
                                      );
                                    }}
                                  >
                                    Agregar
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-white py-2 px-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((selectedProduct) => (
                        <TableRow key={selectedProduct.id}>
                          <TableCell>{selectedProduct.id}</TableCell>
                          <TableCell>{selectedProduct.description}</TableCell>
                          <TableCell className="text-right">
                            <button
                              className="underline"
                              onClick={() => {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (selectedProductClick) =>
                                      selectedProductClick.id !==
                                      selectedProduct.id
                                  )
                                );
                                setProducts([...products, selectedProduct]);
                                setProductsFiltered([
                                  ...products,
                                  selectedProduct,
                                ]);
                              }}
                            >
                              Remover
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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

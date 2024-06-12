import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import { Link } from "react-router-dom";
import { formatCurrencyPeru } from "@/helpers";
import { useEffect, useState } from "react";

export default function ProductsView() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: "Detalle",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "serie",
      header: "Serie",
      cell: ({ row }) => <span>{row.getValue("serie")}</span>,
    },
    {
      accessorKey: "price",
      header: () => {
        return <span className="flex justify-end">Precio</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-end">
          {formatCurrencyPeru(Number(row.getValue("price")))}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Registro",
      cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
    },
    {
      accessorKey: "stock",
      header: () => {
        return <span className="flex justify-center">Stock</span>;
      },
      cell: ({ row }) => (
        <span className="flex w-full justify-center">
          {row.getValue("stock")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <span>{row.getValue("status")}</span>,
    },
    {
      accessorKey: "serieId",
      id: "serieId",
      header: () => {
        return (
          <span className="flex w-full h-full items-center justify-end">
            Acciones
          </span>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-1">
            <Link
              className="flex w-full justify-end underline"
              to={`/admin/update_product?id=${row.getValue("id")}`}
            >
              Ver
            </Link>
            <span>|</span>
            <button
              className="underline"
              onClick={async () => {
                const response = await fetch(
                  `http://localhost:4000/api/products/${row.getValue("id")}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      active:
                        row.getValue("status") === "Activo" ? false : true,
                    }),
                  }
                );
                if (response.ok) {
                  navigate(0);
                }
              }}
            >
              {row.getValue("status") === "Activo" ? "Desactivar" : "Activar"}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter,
    },
  });

  async function fetchProducts() {
    const response = await fetch("http://localhost:4000/api/products");
    const products = await response.json();

    setData(
      products.map((product) => {
        return {
          id: product.id.toString(),
          name: product.name,
          serie: product.serie.name,
          serieId: product.serie.id.toString(),
          price: product.price.toString(),
          createdAt: new Date(product.createdAt).toLocaleString(),
          stock: product.stock.toString(),
          status: product.active ? "Activo" : "No Activo",
        };
      })
    );
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBar text="Productos" />
          <Input
            type="search"
            placeholder="Buscar por nombre, descripción o ID"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <div className="w-full flex flex-col gap-y-3">
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No hay resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

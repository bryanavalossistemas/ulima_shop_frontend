import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { useEffect, useState } from "react";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Descripcion",
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creacion",
    cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
  },
  {
    accessorKey: "productsLength",
    header: () => {
      return <span className="flex justify-center">Nro. Productos</span>;
    },
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.getValue("productsLength")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => {
      return (
        <span className="flex w-full h-full items-center justify-end">
          Acciones
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          className="flex w-full justify-end underline"
          to={`/admin/update_serie?id=${row.getValue("id")}`}
        >
          Ver
        </Link>
      );
    },
  },
];

export default function SeriesView() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

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

  useEffect(() => {
    fetchSeries();
  }, []);

  async function fetchSeries() {
    const response = await fetch("http://localhost:4000/api/series");
    const series = await response.json();

    setData(
      series.map((serie) => {
        return {
          ...serie,
          id: serie.id.toString(),
          createdAt: new Date(serie.createdAt).toLocaleString(),
          productsLength: serie.products.length.toString(),
        };
      })
    );
  }

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBar text="Series" />
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

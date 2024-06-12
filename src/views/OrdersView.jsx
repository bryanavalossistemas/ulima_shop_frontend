import { useEffect, useState } from "react";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrencyPeru } from "@/helpers";
import { Input } from "@/components/ui/input";

export default function OrdersView() {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 3 });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "userName",
      header: "Usuario",
      cell: ({ row }) => <span>{row.getValue("userName")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Orden",
      cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
    },
    {
      accessorKey: "total",
      header: () => {
        return <span className="flex justify-end">Total</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-end">
          {formatCurrencyPeru(Number(row.getValue("total")))}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => <span>{row.getValue("email")}</span>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <span>{row.getValue("status")}</span>,
    },
    {
      id: "action",
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
              to={`/user/detail_order?id=${row.getValue("id")}`}
            >
              Ver
            </Link>
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

  async function fetchOrders() {
    const response = await fetch("http://localhost:4000/api/orders");
    const orders = await response.json();
    setUser(orders);
    setData(
      orders.map((order) => {
        return {
          id: order.id,
          userName: order.user.firstName + " " + order.user.lastName,
          createdAt: new Date(order.createdAt).toLocaleString(),
          total: order.detailsOrder.reduce(
            (total, detailOrder) =>
              total + detailOrder.product.price * detailOrder.quantity,
            0
          ),
          email: order.user.email,
          status: order.status,
        };
      })
    );
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBar text="Órdenes" />
          <Input
            type="search"
            placeholder="Buscar por nombre, apellido o Nro de Orden"
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

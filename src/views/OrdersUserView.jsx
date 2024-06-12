import SideBar from "@/components/shop/SideBar";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { formatCurrency } from "@/helpers";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export default function OrdersUserView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
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
      accessorKey: "quantity",
      header: "Cantidad",
      cell: ({ row }) => <span>{row.getValue("quantity")}</span>,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Registro",
      cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
    },
    {
      accessorKey: "total",
      header: () => {
        return <span className="flex justify-end">Precio</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-end">
          {formatCurrencyPeru(Number(row.getValue("total")))}
        </span>
      ),
    },
    {
      accessorKey: "firstDirection",
      header: "Direccion 1",
      cell: ({ row }) => <span>{row.getValue("firstDirection")}</span>,
    },
    {
      accessorKey: "district",
      header: "Distrito",
      cell: ({ row }) => <span>{row.getValue("district")}</span>,
    },
    {
      accessorKey: "city",
      header: "Ciudad",
      cell: ({ row }) => <span>{row.getValue("city")}</span>,
    },
    {
      accessorKey: "country",
      header: "Pais",
      cell: ({ row }) => <span>{row.getValue("country")}</span>,
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

  function verifySession() {
    if (!currentUser) {
      navigate("/auth/login");
    }
  }

  async function fetchOrdersByUserId() {
    try {
      const response = await fetch(
        `http://localhost:4000/api/orders/user/${currentUser.id}`
      );
      const orders = await response.json();
      const data = orders.map((order) => {
        return {
          ...order,
          quantity: order.detailsOrder.reduce(
            (total, detailOrder) => total + detailOrder.quantity,
            0
          ),
          name: order.detailsOrder[0].product.name,
          createdAt: new Date(order.createdAt).toLocaleString(),
          total: order.detailsOrder.reduce(
            (total, detailOrder) =>
              total + detailOrder.product.price * detailOrder.quantity,
            0
          ),
        };
      });
      setData(data);
    } catch (error) {
      toast.error("Error al obtener productos");
    }
  }

  useEffect(() => {
    verifySession();
    fetchOrdersByUserId();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col">
          <div className="flex flex-col gap-y-3">
            <div>
              <TopBar text="Órdenes Recientes" />
              {table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="flex gap-x-[10px] bg-white h-[114px] justify-between px-[33px]"
                >
                  <div className="mt-5">
                    <p>
                      Orden x {row.getValue("quantity")} items (
                      {row.getValue("name")})
                    </p>
                    <p>
                      Fecha: {row.getValue("createdAt")} - Total:{" "}
                      {formatCurrency(row.getValue("total"))}
                    </p>
                    <p>
                      Enviado a: {row.getValue("firstDirection")},{" "}
                      {row.getValue("district")}, {row.getValue("city")},{" "}
                      {row.getValue("country")}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-[153px] h-[23px]">
                      Orden Nro. {row.getValue("id")}
                    </p>
                    <Link to={`/user/detail_order?id=${row.getValue("id")}`}>
                      Ver detalle
                    </Link>
                  </div>
                </div>
              ))}
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

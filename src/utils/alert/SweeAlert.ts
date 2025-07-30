import Swal from "sweetalert2";
import {type SweetAlertIcon } from "sweetalert2";
import "./alert.css";

export const handleAlert = (
  icon: SweetAlertIcon = "info",
  title: string = "Your work has been saved"
) => {
  Swal.fire({
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 2000,
  });
};

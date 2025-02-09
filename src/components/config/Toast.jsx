import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function Toast(message,type) {
    toastr.options = {
        closeButton: true,
        debug: false,
        progressBar: true,
        positionClass: "toast-top-right",
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2500",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };
    if(type === 0){
        return toastr.error(message,"Gagal !")
    }
    if(type === 1){
        return toastr.success(message,"Berhasil !")
    }
}
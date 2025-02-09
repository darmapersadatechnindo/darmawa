export default function Badge({children,type,handleClick}) {
    let classname
    switch(type){
        case "primary":
            classname = "flex space-x-2 items-centerbg-green-100 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-md cursor-pointer"
            break;
        case "danger":
            classname = "flex space-x-2 items-centerbg-green-100 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-md cursor-pointer"
            break;
        case "success":
            classname = "flex space-x-2 items-centerbg-green-100 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-md cursor-pointer"
            break;
        case "warning":
            classname = "flex space-x-2 items-centerbg-green-100 bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-md cursor-pointer"
    }
    return(
        <span className={classname} onClick={handleClick}>
            {children}
        </span>
    )    
}
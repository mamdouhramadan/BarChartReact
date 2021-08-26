import M from "materialize-css";

const InitCollape = (elementClass) => {
    const elems = document.querySelectorAll(elementClass);
    M.Collapsible.init(elems);
}



export default InitCollape


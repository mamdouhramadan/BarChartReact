import M from "materialize-css";

const InitModal = (elementClass) => {
    var elems = document.querySelectorAll(elementClass);
    M.Modal.init(elems);
}
export default InitModal

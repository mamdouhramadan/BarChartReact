import M from "materialize-css";

const InitToolTip = (elementClass) => {
    var elems = document.querySelectorAll(elementClass);
    M.Tooltip.init(elems);
}

export default InitToolTip


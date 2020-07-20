export async function getClientes(){
    const response = await fetch("http://www.mocky.io/v2/598b16291100004705515ec5");
    const result = await response.json();
    return result;
}

export async function getVendas(){
    const response = await fetch("http://www.mocky.io/v2/598b16861100004905515ec7");
    const result = await response.json();
    return result;
}
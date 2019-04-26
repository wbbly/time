export function getParametersString(name, arr) {
    let pharam = [];
    for (let i = 0; i < arr.length; i++) {
        pharam.push(`${name}[]=${arr[i]}`);
    }

    return pharam.join('&');
}

export function saveFile(url) {
    const a = document.createElement('a');
    a.setAttribute('id', 'file-report-button');

    document.body.appendChild(a);
    a.href = url;
    a.click();
    window.URL.revokeObjectURL(url);

    setTimeout(() => {
        a.remove();
    }, 200);
}
